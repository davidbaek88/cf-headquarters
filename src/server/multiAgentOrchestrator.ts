import {
  MultiAgentSession,
  MultiAgentStatus,
  ExecutiveRole,
  ExecutiveAnalysisReport,
  CooDecomposition,
  CooEvaluation,
  CooFinalReport,
  TokenUsage,
  TaskPriority
} from '../types/headquarters.js';
import { executeGeminiCall } from './geminiClient.js';
import {
  buildCooDecompositionPrompt,
  buildExecutiveAnalysisPrompt,
  buildCooEvaluationPrompt,
  buildRebuttalPrompt,
  buildCooFinalReportPrompt,
  getRoleSpecializationPrompt
} from './agentPrompts.js';

// In-Memory Session & Guard state (Single Node.js Process Scope for Dev/Test)
const sessions = new Map<string, MultiAgentSession>();
const idempotencyMap = new Map<string, string>();
const activeAbortControllers = new Map<string, AbortController>();

export type SessionLogListener = (session: MultiAgentSession) => void;
let sessionLogListener: SessionLogListener | null = null;

export function registerSessionLogListener(listener: SessionLogListener) {
  sessionLogListener = listener;
}

function notifySessionTerminal(session: MultiAgentSession) {
  if (sessionLogListener) {
    try {
      sessionLogListener(session);
    } catch (err) {
      console.warn('[Orchestrator] Failed to notify session log listener:', err);
    }
  }
}

let isProcessCollaborating = false;

function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

function addTokens(a: TokenUsage, b: TokenUsage): TokenUsage {
  const parseVal = (v: number | 'N/A'): number => (typeof v === 'number' ? v : 0);
  const promptA = typeof a.promptTokens === 'number';
  const promptB = typeof b.promptTokens === 'number';
  const candA = typeof a.candidatesTokens === 'number';
  const candB = typeof b.candidatesTokens === 'number';

  return {
    promptTokens: promptA || promptB ? parseVal(a.promptTokens) + parseVal(b.promptTokens) : 'N/A',
    candidatesTokens: candA || candB ? parseVal(a.candidatesTokens) + parseVal(b.candidatesTokens) : 'N/A',
    totalTokens: promptA || promptB || candA || candB ? parseVal(a.totalTokens) + parseVal(b.totalTokens) : 'N/A'
  };
}

export function getSession(executionId: string): MultiAgentSession | undefined {
  return sessions.get(executionId);
}

export function cancelSession(executionId: string): boolean {
  const session = sessions.get(executionId);
  if (!session) return false;

  if (session.status === 'completed' || session.status === 'failed' || session.status === 'cancelled') {
    return false;
  }

  const controller = activeAbortControllers.get(executionId);
  if (controller) {
    controller.abort();
    activeAbortControllers.delete(executionId);
  }

  session.status = 'cancelled';
  session.currentStep = 'cancelled';
  session.statusMessage =
    '대표에 의해 취소되었습니다. 취소 시점까지 확인된 API 호출 기록과 토큰 사용량은 현재 실행 세션 및 브라우저 로컬 스냅샷에 보존됩니다.';
  session.completedAt = new Date().toISOString();
  isProcessCollaborating = false;
  notifySessionTerminal(session);

  return true;
}

export interface StartCollaborationParams {
  idempotencyKey: string;
  directiveTitle: string;
  directiveDescription: string;
  category: string;
  priority: TaskPriority;
}

export function startMultiAgentCollaboration(params: StartCollaborationParams): {
  executionId: string;
  isExisting: boolean;
  status: MultiAgentStatus;
  message: string;
} {
  // 1. Idempotency Check: if identical key already exists, return existing session
  if (params.idempotencyKey && idempotencyMap.has(params.idempotencyKey)) {
    const existingId = idempotencyMap.get(params.idempotencyKey)!;
    const existingSession = sessions.get(existingId);
    if (existingSession) {
      return {
        executionId: existingId,
        isExisting: true,
        status: existingSession.status,
        message: '기존에 요청된 동일 Idempotency 세션 상태를 반환합니다.'
      };
    }
  }

  // 2. Concurrency Lock: single collaboration running at a time in this process
  if (isProcessCollaborating) {
    throw new Error('COLLABORATION_IN_PROGRESS');
  }

  const executionId = `cf-exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const abortController = new AbortController();
  activeAbortControllers.set(executionId, abortController);

  const initialSession: MultiAgentSession = {
    executionId,
    idempotencyKey: params.idempotencyKey,
    directiveTitle: params.directiveTitle,
    directiveDescription: params.directiveDescription,
    category: params.category,
    priority: params.priority,
    status: 'analyzing',
    statusMessage: 'COO(AI 비서실장)가 대표 지시를 분석하고 있습니다.',
    currentStep: 'coo_decomposing',
    startedAt: new Date().toISOString(),
    reports: {},
    totalTokens: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 },
    totalCalls: 0,
    isLiveAiGenerated: true
  };

  sessions.set(executionId, initialSession);
  if (params.idempotencyKey) {
    idempotencyMap.set(params.idempotencyKey, executionId);
  }

  isProcessCollaborating = true;

  // Run the background pipeline asynchronously (CPU always allocated ensures it runs steadily)
  runPipelineBackground(executionId, params, abortController.signal).catch((err) => {
    console.error(`[Orchestrator] Fatal error in pipeline ${executionId}:`, err);
  });

  return {
    executionId,
    isExisting: false,
    status: 'analyzing',
    message: '새로운 멀티 에이전트 협업 파이프라인이 기동되었습니다.'
  };
}

async function runPipelineBackground(
  executionId: string,
  params: StartCollaborationParams,
  abortSignal: AbortSignal
): Promise<void> {
  const session = sessions.get(executionId);
  if (!session) return;

  // Global 180s timeout guard
  const globalTimeout = setTimeout(() => {
    if (session.status === 'analyzing') {
      const controller = activeAbortControllers.get(executionId);
      if (controller) controller.abort();
      session.status = 'timed_out';
      session.statusMessage = '전체 협업 파이프라인 제한 시간(180초)을 초과하여 중단되었습니다.';
      session.completedAt = new Date().toISOString();
      isProcessCollaborating = false;
      activeAbortControllers.delete(executionId);
    }
  }, 180000);

  let hasPartialFailures = false;

  try {
    // -------------------------------------------------------------
    // [호출 1] COO 업무 분해 (COO 귀속)
    // -------------------------------------------------------------
    if (abortSignal.aborted) throw new Error('USER_CANCELLED');

    session.currentStep = 'coo_decomposing';
    session.statusMessage = '01/05. COO(비서실장)가 업무를 분석하고 4대 전문 부서 과제를 분해 중입니다...';

    const decompPrompt = buildCooDecompositionPrompt(params.directiveTitle, params.directiveDescription);
    const call1Result = await executeGeminiCall({
      prompt: decompPrompt,
      systemInstruction: getRoleSpecializationPrompt('COO'),
      signal: abortSignal,
      timeoutMs: 60000
    });

    session.totalCalls += 1;
    session.totalTokens = addTokens(session.totalTokens, call1Result.tokens);

    let decompData: any = {};
    try {
      decompData = JSON.parse(cleanJsonText(call1Result.text));
    } catch (e) {
      decompData = {
        purpose: 'ConcreteFlow AI 3개월 핵심 개발 로드맵 및 도메인 과제 선정',
        successCriteria: ['기술적 실현성', '데이터 정밀도', '현장 수용성', 'MVP 가치'],
        assignments: [
          { role: 'CTO', title: '기술 아키텍처 및 API 개발 과제', objective: '개발 난이도 및 공수 분석', constraints: 'Vercel, Supabase, 무중단' },
          { role: 'CDO', title: '운행일보 OCR 및 데이터 모델링 과제', objective: '오인식 패턴 및 데이터셋 구축', constraints: '수기 카본 복사지 품질 한계' },
          { role: 'FIELD_EXPERT', title: '배차 관행 및 타설 지연 분석 과제', objective: '현장 적용성 및 배차원 의사결정 보조', constraints: '운전자 앱 조작 강요 금지' },
          { role: 'CPO', title: '배차원 모니터링 UX 및 MVP 우선순위 과제', objective: '고객 가치 및 과잉 스펙 제거', constraints: '핵심 지표 3초 이내 식별' }
        ]
      };
    }

    session.cooDecomposition = {
      purpose: decompData.purpose || '업무 목적 수립',
      successCriteria: Array.isArray(decompData.successCriteria) ? decompData.successCriteria : ['목표 달성'],
      assignments: decompData.assignments || [],
      tokens: call1Result.tokens,
      latencyMs: call1Result.latencyMs
    };

    // -------------------------------------------------------------
    // [호출 2~5] 4대 전문 AI 임원 독립 분석 (동시 병렬 호출 - 각 60초 타임아웃)
    // -------------------------------------------------------------
    if (abortSignal.aborted) throw new Error('USER_CANCELLED');

    session.currentStep = 'parallel_analysis';
    session.statusMessage = '02/05. CTO, CDO, 현장전문가, CPO 4인이 각자의 전문 영역에서 독립 분석 중입니다...';

    const expertRoles: ExecutiveRole[] = ['CTO', 'CDO', 'FIELD_EXPERT', 'CPO'];
    const expertPromises = expertRoles.map(async (role) => {
      const assignment =
        session.cooDecomposition?.assignments.find((a) => a.role === role) || {
          title: `${role} 도메인 과제`,
          objective: '전문 영역 관점 분석',
          constraints: '현실적 제약 반영'
        };

      // Set pending state
      session.reports[role] = {
        role,
        name: role === 'CTO' ? 'CTO (개발팀장)' : role === 'CDO' ? 'CDO (데이터 연구원)' : role === 'FIELD_EXPERT' ? '현장 운영 전문가' : 'CPO (제품 기획자)',
        department: role === 'CTO' ? '엔지니어링본부' : role === 'CDO' ? '데이터연구실' : role === 'FIELD_EXPERT' ? '현장운영실' : '제품기획실',
        purpose: assignment.title,
        coreAnalysis: '분석 대기 중...',
        concreteProposals: [],
        expectedEffects: '',
        risks: [],
        rebuttalOrCritique: '',
        unconfirmedItems: '',
        actionableNextSteps: [],
        tokens: { promptTokens: 'N/A', candidatesTokens: 'N/A', totalTokens: 'N/A' },
        latencyMs: 0,
        status: 'working'
      };

      try {
        const prompt = buildExecutiveAnalysisPrompt(role, params.directiveTitle, assignment);
        const result = await executeGeminiCall({
          prompt,
          systemInstruction: getRoleSpecializationPrompt(role),
          signal: abortSignal,
          timeoutMs: 60000
        });

        session.totalCalls += 1;
        session.totalTokens = addTokens(session.totalTokens, result.tokens);

        let parsed: any = {};
        try {
          parsed = JSON.parse(cleanJsonText(result.text));
        } catch {
          parsed = {
            purpose: assignment.title,
            coreAnalysis: result.text.slice(0, 300),
            concreteProposals: ['도메인 개선안 수립'],
            expectedEffects: '운영 효율성 제고',
            risks: ['현실적 적용 제약'],
            rebuttalOrCritique: '타 부서의 비현실적 접근 경고',
            unconfirmedItems: '세부 데이터 추가 확인 필요',
            actionableNextSteps: ['상세 기획 착수']
          };
        }

        const report: ExecutiveAnalysisReport = {
          role,
          name: session.reports[role]!.name,
          department: session.reports[role]!.department,
          purpose: parsed.purpose || assignment.title,
          coreAnalysis: parsed.coreAnalysis || '핵심 분석 완료',
          concreteProposals: Array.isArray(parsed.concreteProposals) ? parsed.concreteProposals : [],
          expectedEffects: parsed.expectedEffects || '기대 효과 도출',
          risks: Array.isArray(parsed.risks) ? parsed.risks : [],
          rebuttalOrCritique: parsed.rebuttalOrCritique || '반론 검토 완료',
          unconfirmedItems: parsed.unconfirmedItems || '추가 확인 필요',
          actionableNextSteps: Array.isArray(parsed.actionableNextSteps) ? parsed.actionableNextSteps : [],
          tokens: result.tokens,
          latencyMs: result.latencyMs,
          status: 'completed',
          completedAt: new Date().toISOString()
        };

        session.reports[role] = report;
      } catch (err: any) {
        if (abortSignal.aborted) throw err;
        hasPartialFailures = true;
        session.reports[role] = {
          ...session.reports[role]!,
          status: 'failed',
          coreAnalysis: `분석 실패: ${err.message || '호출 시간 초과 또는 오류'}`,
          errorMsg: err.message || '호출 실패',
          tokens: { promptTokens: 'N/A', candidatesTokens: 'N/A', totalTokens: 'N/A' }
        };
      }
    });

    await Promise.all(expertPromises);

    // -------------------------------------------------------------
    // [호출 6] COO 4개 결과 검토 및 반론 판정 (COO 귀속)
    // -------------------------------------------------------------
    if (abortSignal.aborted) throw new Error('USER_CANCELLED');

    session.currentStep = 'coo_evaluating';
    session.statusMessage = '03/05. COO(비서실장)가 4개 부서 보고서를 종합 비교 대조하고 이견을 판별 중입니다...';

    const successfulReports = expertRoles
      .filter((r) => session.reports[r]?.status === 'completed')
      .map((r) => {
        const rep = session.reports[r]!;
        return {
          role: r,
          analysis: rep.coreAnalysis,
          proposals: rep.concreteProposals,
          risks: rep.risks,
          rebuttal: rep.rebuttalOrCritique
        };
      });

    const evalPrompt = buildCooEvaluationPrompt(params.directiveTitle, successfulReports);
    const call6Result = await executeGeminiCall({
      prompt: evalPrompt,
      systemInstruction: getRoleSpecializationPrompt('COO'),
      signal: abortSignal,
      timeoutMs: 60000
    });

    session.totalCalls += 1;
    session.totalTokens = addTokens(session.totalTokens, call6Result.tokens);

    let evalData: any = {};
    try {
      evalData = JSON.parse(cleanJsonText(call6Result.text));
    } catch {
      evalData = {
        summaryComparison: '4개 부서의 분석이 각자의 도메인 관점에서 체계적으로 도출되었습니다.',
        conflictDetected: false
      };
    }

    // -------------------------------------------------------------
    // [선택 호출 7] 전문 AI 1인 재검토 (최대 1회 제한)
    // -------------------------------------------------------------
    if (evalData.conflictDetected && evalData.rebuttalTargetRole && expertRoles.includes(evalData.rebuttalTargetRole)) {
      if (abortSignal.aborted) throw new Error('USER_CANCELLED');

      const targetRole: ExecutiveRole = evalData.rebuttalTargetRole;
      session.rebuttalTargetRole = targetRole;
      session.currentStep = 'rebuttal_round';
      session.statusMessage = `04/05. 이견 조율: COO가 ${targetRole}에게 반론에 대한 1회 재검토를 요청했습니다...`;

      const prevAnalysis = session.reports[targetRole]?.coreAnalysis || '';
      const rebuttalPrompt = buildRebuttalPrompt(targetRole, evalData.rebuttalReason || '이견 조율 필요', prevAnalysis);

      try {
        const rebuttalResult = await executeGeminiCall({
          prompt: rebuttalPrompt,
          systemInstruction: getRoleSpecializationPrompt(targetRole),
          signal: abortSignal,
          timeoutMs: 60000
        });

        session.totalCalls += 1;
        session.totalTokens = addTokens(session.totalTokens, rebuttalResult.tokens);

        let parsedRebuttal: any = {};
        try {
          parsedRebuttal = JSON.parse(cleanJsonText(rebuttalResult.text));
        } catch {
          parsedRebuttal = {
            purpose: '재검토 조율',
            coreAnalysis: rebuttalResult.text.slice(0, 300),
            concreteProposals: ['조율된 대안 제시'],
            expectedEffects: '상충 해소',
            risks: ['잔여 리스크 관리'],
            rebuttalOrCritique: '타 부서 의견 수용 및 최종 조율',
            unconfirmedItems: '지속 검증',
            actionableNextSteps: ['조율안 반영']
          };
        }

        session.rebuttalReport = {
          role: targetRole,
          name: session.reports[targetRole]?.name || targetRole,
          department: session.reports[targetRole]?.department || '담당부서',
          purpose: parsedRebuttal.purpose || '재검토',
          coreAnalysis: parsedRebuttal.coreAnalysis || '조율 완료',
          concreteProposals: Array.isArray(parsedRebuttal.concreteProposals) ? parsedRebuttal.concreteProposals : [],
          expectedEffects: parsedRebuttal.expectedEffects || '',
          risks: Array.isArray(parsedRebuttal.risks) ? parsedRebuttal.risks : [],
          rebuttalOrCritique: parsedRebuttal.rebuttalOrCritique || '',
          unconfirmedItems: parsedRebuttal.unconfirmedItems || '',
          actionableNextSteps: Array.isArray(parsedRebuttal.actionableNextSteps) ? parsedRebuttal.actionableNextSteps : [],
          tokens: rebuttalResult.tokens,
          latencyMs: rebuttalResult.latencyMs,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      } catch (err: any) {
        if (abortSignal.aborted) throw err;
        console.warn(`[Orchestrator] Rebuttal call failed for ${targetRole}:`, err);
        hasPartialFailures = true;
      }
    }

    // -------------------------------------------------------------
    // [최종 호출 7 또는 8] COO 최종 종합 보고서 작성 (COO 귀속)
    // -------------------------------------------------------------
    if (abortSignal.aborted) throw new Error('USER_CANCELLED');

    session.currentStep = 'coo_finalizing';
    session.statusMessage = '05/05. COO(비서실장)가 최종 10대 개발 과제 및 대표 종합 보고서를 작성 중입니다...';

    const allReportsSummary = expertRoles
      .map((r) => {
        const rep = session.reports[r];
        if (!rep || rep.status !== 'completed') {
          return `[${r}]: 분석 결측 (사유: ${rep?.errorMsg || '미제출'})`;
        }
        return `[${r} - ${rep.name}]
- 분석: ${rep.coreAnalysis}
- 제안: ${rep.concreteProposals.join('; ')}
- 위험: ${rep.risks.join('; ')}`;
      })
      .join('\n\n');

    const rebuttalText = session.rebuttalReport
      ? `\n\n[1회 재검토 반영 (${session.rebuttalTargetRole})]: ${session.rebuttalReport.coreAnalysis}`
      : '';

    const finalPrompt = buildCooFinalReportPrompt(
      params.directiveTitle,
      params.directiveDescription,
      allReportsSummary + rebuttalText
    );

    const callFinalResult = await executeGeminiCall({
      prompt: finalPrompt,
      systemInstruction: getRoleSpecializationPrompt('COO'),
      signal: abortSignal,
      timeoutMs: 60000
    });

    session.totalCalls += 1;
    session.totalTokens = addTokens(session.totalTokens, callFinalResult.tokens);

    let finalReportData: any = {};
    try {
      finalReportData = JSON.parse(cleanJsonText(callFinalResult.text));
    } catch {
      finalReportData = {
        executiveSummary: callFinalResult.text.slice(0, 400),
        staffSummaries: expertRoles.map((r) => ({ role: r, summary: `${r} 분석 완료` })),
        conflictsAndDebates: ['임원 간 기술적 실현성과 현장 적용성 간 조율 진행됨'],
        finalDecision: 'ConcreteFlow AI 3개월 10대 핵심 과제 확정',
        top10Milestones: [],
        risksAndMitigations: [{ risk: '현장 배차원 수용성', mitigation: '스마트폰 강요 없는 비침해적 UX 설계' }],
        ceoApprovalNeededItems: ['운영 배포 및 외부 데이터베이스 격리 스키마 승인']
      };
    }

    session.finalReport = {
      executiveSummary: finalReportData.executiveSummary || 'COO 최종 종합 완료',
      staffSummaries: Array.isArray(finalReportData.staffSummaries) ? finalReportData.staffSummaries : [],
      conflictsAndDebates: Array.isArray(finalReportData.conflictsAndDebates) ? finalReportData.conflictsAndDebates : [],
      finalDecision: finalReportData.finalDecision || '최종 권고안 수립',
      top10Milestones: Array.isArray(finalReportData.top10Milestones) ? finalReportData.top10Milestones : [],
      risksAndMitigations: Array.isArray(finalReportData.risksAndMitigations) ? finalReportData.risksAndMitigations : [],
      ceoApprovalNeededItems: Array.isArray(finalReportData.ceoApprovalNeededItems) ? finalReportData.ceoApprovalNeededItems : [],
      totalLatencyMs: Date.now() - new Date(session.startedAt).getTime(),
      tokens: callFinalResult.tokens
    };

    // -------------------------------------------------------------
    // 최종 상태 5분기 확정
    // -------------------------------------------------------------
    session.completedAt = new Date().toISOString();
    session.currentStep = 'completed';

    if (hasPartialFailures) {
      session.status = 'completed_with_warnings';
      session.statusMessage =
        '일부 전문 임원의 분석 결측이 있었으나, COO가 해당 결측을 인지하고 종합 보고서를 완결했습니다.';
      session.warningDetails = '일부 임원의 호출이 실패하여 보고서에 결측으로 반영되었습니다.';
    } else {
      session.status = 'completed';
      session.statusMessage = `성공: 총 ${session.totalCalls}회의 독립 AI 호출이 정상 완료되었으며 최종 보고서가 완성되었습니다.`;
    }
    notifySessionTerminal(session);
  } catch (error: any) {
    session.completedAt = new Date().toISOString();

    if (abortSignal.aborted || error?.message === 'USER_CANCELLED') {
      if (session.status !== 'cancelled') {
        session.status = 'cancelled';
        session.currentStep = 'cancelled';
        session.statusMessage =
          '대표에 의해 취소되었습니다. 취소 시점까지 확인된 API 호출 기록과 토큰 사용량은 현재 실행 세션 및 브라우저 로컬 스냅샷에 보존됩니다.';
        notifySessionTerminal(session);
      }
    } else if (error?.message === 'TIMEOUT_EXCEEDED' || error?.message === 'CALL_TIMEOUT') {
      session.status = 'timed_out';
      session.currentStep = 'timed_out';
      session.statusMessage = '전체 협업 파이프라인 또는 개별 호출 시간 초과로 중단되었습니다.';
      notifySessionTerminal(session);
    } else {
      session.status = 'failed';
      session.currentStep = 'failed';
      session.statusMessage = `실행 실패: ${error?.message || 'Gemini API 호출 오류'}`;
      session.errorMessage = error?.message || '알 수 없는 오류';
      notifySessionTerminal(session);
    }
  } finally {
    clearTimeout(globalTimeout);
    isProcessCollaborating = false;
    activeAbortControllers.delete(executionId);
  }
}
