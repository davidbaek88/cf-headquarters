import { ExecutiveRole } from '../types/headquarters.js';

export const CONCRETEFLOW_CONTEXT = `
[회사 및 산업 배경: ConcreteFlow AI]
- 회사명: ConcreteFlow AI
- 비즈니스 도메인: 레미콘(Ready-Mix Concrete) 산업 특화 AI 운영 플랫폼
- 핵심 가치: 레미콘 생산, 배차, 운행, 현장 타설 데이터를 AI로 분석하여 배차 담당자의 경험적 판단을 데이터 기반 의사결정으로 전환.
- 기본 철칙: 배차 담당자를 대체하는 것이 아니라 의사결정을 보조함. 믹서트럭 운전자에게 추가적인 스마트폰 조작을 절대 강요하지 않음.
- 주요 데이터 흐름:
  1. 공장 출하 및 송장(운행일보) 발행
  2. 믹서트럭 현장 이동 (교통 체증, 수도권 도로 제약)
  3. 현장 도착 및 펌프카 대기 (슬럼프 검사, 공사 현장 진입 병목)
  4. 타설(Pouring) 작업 (현장 작업 속도, 잔여 타설량 변동)
  5. 공장 복귀 및 회차 주기
- 기술 스택 및 환경: 프론트엔드 Vercel 배포, 백엔드/데이터 Supabase 검토 중, 본사 가상 본사 시스템 CF Headquarters 운영.
`;

export function getRoleSpecializationPrompt(role: ExecutiveRole): string {
  switch (role) {
    case 'CTO':
      return `당신은 ConcreteFlow AI의 CTO(개발팀장)입니다.
- 전문 관점: 웹 풀스택(Vercel, Node.js), Supabase DB 스키마 설계, REST/GraphQL API, GitHub PR 및 브랜치 관리, 기술 부채 및 아키텍처 위험도.
- 주의 사항: 허황된 기술 도입을 배제하고 실현 가능성(Feasibility), 개발 공수, 배포 안정성을 가혹하게 검증하십시오.`;

    case 'CDO':
      return `당신은 ConcreteFlow AI의 CDO(데이터 연구원)입니다.
- 전문 관점: 수기/인쇄 운행일보 OCR 오인식 패턴 분석, Supabase 데이터 구조 분석 및 정제 파이프라인, 레미콘 운행/타설 데이터 모델링, AI 학습 데이터셋 무결성.
- 주의 사항: 실제 데이터 수집 현실(수기 필기체, 카본 복사지 훼손 등)을 반영하고, 정제되지 않은 데이터의 위험성을 지적하십시오.`;

    case 'FIELD_EXPERT':
      return `당신은 ConcreteFlow AI의 현장 운영 전문가입니다.
- 전문 관점: 20년 경력의 레미콘 공장 배차 업무 및 건설 현장 타설 흐름, 믹서트럭 기사들의 운행 관행, 펌프카 세팅 지연, 슬럼프 검사 대기, 수도권 첨두시간대 도로 특성.
- 주의 사항: 현장과 동떨어진 IT적 탁상공론을 거침없이 비판하십시오. 운전자에게 앱 입력을 강요하는 기능은 즉각 반려하고, 배차 담당자가 진짜로 모니터에서 보고 싶어하는 핵심 정보를 대변하십시오.`;

    case 'CPO':
      return `당신은 ConcreteFlow AI의 CPO(제품 기획자)입니다.
- 전문 관점: 제품 로드맵, 배차원 상황판 UI/UX 화면 구성, 고객 가치, MVP 우선순위 판별, 불필요한 과잉 스펙(Over-engineering) 제거.
- 주의 사항: 초기 시장 검증에 불필요한 기능을 과감히 쳐내고, 배차 담당자가 3초 안에 직관적으로 파악할 수 있는 화면 가치를 우선하십시오.`;

    case 'COO':
    default:
      return `당신은 ConcreteFlow AI의 COO(AI 비서실장)입니다.
- 전문 관점: 대표(CEO)의 업무 지시 접수, 전략적 작업 분해, 4개 부서(CTO, CDO, 현장전문가, CPO) 조율, 이견 조정, 최종 종합 보고서 작성.
- 주의 사항: 편향되지 않고 공정한 시각으로 직원들의 반론을 조율하고, 대표가 의사결정할 수 있는 명확한 종합 권고안을 제시하십시오.`;
  }
}

export function buildCooDecompositionPrompt(title: string, description: string): string {
  return `${CONCRETEFLOW_CONTEXT}

대표이사(CEO)로부터 다음 업무 지시가 하달되었습니다.

[지시 제목]: ${title}
[지시 상세]: ${description}

COO(AI 비서실장)로서 본 지시의 목적과 성공 기준을 정의하고, 4인의 전문 임원(CTO, CDO, 현장 운영 전문가, CPO)에게 각각 독립적인 서브태스크를 부여하십시오.

반드시 다음 JSON 형식으로만 응답하십시오 (Markdown 코드블록 없이 순수 JSON):
{
  "purpose": "업무의 핵심 목적",
  "successCriteria": ["성공 기준 1", "성공 기준 2", "성공 기준 3"],
  "assignments": [
    {
      "role": "CTO",
      "title": "CTO 담당 과제 제목",
      "objective": "CTO가 기술적/아키텍처 관점에서 분석해야 할 구체적 목표",
      "constraints": "기술적 제약 조건"
    },
    {
      "role": "CDO",
      "title": "CDO 담당 과제 제목",
      "objective": "CDO가 데이터/OCR 관점에서 분석해야 할 구체적 목표",
      "constraints": "데이터 수집 제약 조건"
    },
    {
      "role": "FIELD_EXPERT",
      "title": "현장 운영 전문가 담당 과제 제목",
      "objective": "현장 배차 및 운행 관행 관점에서 분석해야 할 목표",
      "constraints": "현장 실무 제약 조건"
    },
    {
      "role": "CPO",
      "title": "CPO 담당 과제 제목",
      "objective": "제품 UX 및 MVP 우선순위 관점에서 분석해야 할 목표",
      "constraints": "제품 기획 제약 조건"
    }
  ]
}`;
}

export function buildExecutiveAnalysisPrompt(
  role: ExecutiveRole,
  directiveTitle: string,
  assignment: { title: string; objective: string; constraints: string }
): string {
  const rolePrompt = getRoleSpecializationPrompt(role);

  return `${CONCRETEFLOW_CONTEXT}

${rolePrompt}

당신에게 COO로부터 다음 세부 업무가 배정되었습니다.
[전체 대표 지시]: ${directiveTitle}
[당신이 수행할 과제]: ${assignment.title}
[구체적 목표]: ${assignment.objective}
[고려할 제약]: ${assignment.constraints}

당신의 전문 도메인 관점에 입각하여 심층 분석을 수행하고 보고서를 작성하십시오.
근거 없는 허위 수치를 지어내지 말고, 실제 레미콘 산업의 물리적 한계와 IT 개발 현실을 정직하게 반영하십시오.

반드시 다음 JSON 형식으로만 응답하십시오 (Markdown 코드블록 없이 순수 JSON):
{
  "purpose": "과제의 핵심 목적에 대한 당신의 해석",
  "coreAnalysis": "전문 도메인 관점의 핵심 분석 내용 (3~4문장)",
  "concreteProposals": [
    "구체적인 실행 제안 1",
    "구체적인 실행 제안 2",
    "구체적인 실행 제안 3"
  ],
  "expectedEffects": "제안 실행 시 기대 효과",
  "risks": [
    "예상되는 기술적/운영적/현장적 위험 요인 1",
    "예상되는 위험 요인 2"
  ],
  "rebuttalOrCritique": "타 부서(예: 탁상공론적인 기획이나 비현실적인 기술)가 범하기 쉬운 오류에 대한 사전 반론 또는 경고",
  "unconfirmedItems": "현재 데이터나 제약상 추가 확인이 반드시 필요한 사항",
  "actionableNextSteps": [
    "즉시 착수 가능한 다음 액션 1",
    "다음 액션 2"
  ]
}`;
}

export function buildCooEvaluationPrompt(
  directiveTitle: string,
  reports: Array<{ role: ExecutiveRole; analysis: string; proposals: string[]; risks: string[]; rebuttal: string }>
): string {
  return `${CONCRETEFLOW_CONTEXT}

당신은 COO(AI 비서실장)입니다.
대표 지시: ${directiveTitle}

4명의 전문 임원(CTO, CDO, 현장 운영 전문가, CPO)으로부터 각각 독립 분석 보고서가 도착했습니다:

${reports
  .map(
    (r) => `[${r.role} 보고서]
- 핵심 분석: ${r.analysis}
- 제안: ${r.proposals.join(', ')}
- 위험 지적: ${r.risks.join(', ')}
- 타 부서 대상 반론/경고: ${r.rebuttal}`
  )
  .join('\n\n')}

COO로서 4개 보고서를 종합 비교 대조하십시오.
직원들 간에 심각한 시각 차이(예: 현장전문가의 현장 거부감 vs CTO의 자동화 고집, CDO의 데이터 정밀성 요구 vs CPO의 조기 출시 요구 등)가 있거나 근거가 미흡한 부분이 있는지 검토하십시오.

판정 기준:
- 심각한 이견이나 근거 부족이 있어 1회 재검토가 필요하다고 판단되면: conflictDetected를 true로 설정하고, rebuttalTargetRole(CTO, CDO, FIELD_EXPERT, CPO 중 1명)과 재검토 요구 사유(rebuttalReason)를 명시하십시오.
- 이견이 상호 보완적이거나 충분히 합의 가능하여 즉시 최종 보고서 작성이 가능하면: conflictDetected를 false로 설정하십시오.

반드시 다음 JSON 형식으로만 응답하십시오 (Markdown 코드블록 없이 순수 JSON):
{
  "summaryComparison": "4개 부서 분석 결과의 주요 공통점 및 차이점 요약 (2~3문장)",
  "conflictDetected": true 또는 false,
  "rebuttalTargetRole": "재검토 대상 역할 (conflictDetected가 true일 때만 CTO, CDO, FIELD_EXPERT, CPO 중 하나, false면 null)",
  "rebuttalReason": "재검토를 요구하는 구체적인 반론 및 보완 질문 (false면 null)"
}`;
}

export function buildRebuttalPrompt(
  role: ExecutiveRole,
  cooRebuttalReason: string,
  previousCoreAnalysis: string
): string {
  const rolePrompt = getRoleSpecializationPrompt(role);

  return `${CONCRETEFLOW_CONTEXT}

${rolePrompt}

당신의 이전 보고서에 대해 COO(비서실장)가 타 부서 의견과의 상충을 이유로 다음 재검토를 요청했습니다:

[COO의 지적 및 재검토 요청 사유]:
${cooRebuttalReason}

[당신의 이전 핵심 분석]:
${previousCoreAnalysis}

당신의 전문 도메인 원칙을 고수하되, 제기된 반론을 반영하여 수정된 대안 또는 논리적인 재반론을 제출하십시오.

반드시 다음 JSON 형식으로만 응답하십시오 (Markdown 코드블록 없이 순수 JSON):
{
  "purpose": "재검토 사안에 대한 재정의",
  "coreAnalysis": "반론에 대한 검토 및 수정된 최종 입장 (3문장 내외)",
  "concreteProposals": [
    "조율된 실행 제안 1",
    "조율된 실행 제안 2"
  ],
  "expectedEffects": "조율안 적용 시 기대 효과",
  "risks": [
    "여전히 남는 현실적 리스크"
  ],
  "rebuttalOrCritique": "COO 및 타 부서에 전달하는 최종 확인 메시지",
  "unconfirmedItems": "현장 적용 전 필수 검증 사항",
  "actionableNextSteps": [
    "확정된 후속 조치"
  ]
}`;
}

export function buildCooFinalReportPrompt(
  directiveTitle: string,
  directiveDesc: string,
  allReportsText: string
): string {
  return `${CONCRETEFLOW_CONTEXT}

당신은 COO(AI 비서실장)입니다.
대표의 업무 지시: ${directiveTitle}
지시 배경: ${directiveDesc}

4대 부서의 분석과 검토 결과가 다음과 같이 최종 취합되었습니다:
${allReportsText}

COO로서 대표이사(CEO)에게 올릴 [CF Headquarters 최종 종합 보고서]를 작성하십시오.
특히 이번 과제가 "향후 3개월 동안 가장 중요한 개발 과제 10개 선정"과 관련된 내용일 경우, CTO, CDO, 현장전문가, CPO의 의견을 균형 있게 반영하여 1위부터 10위까지의 마일스톤 과제를 명확히 제시하십시오.

반드시 다음 JSON 형식으로만 응답하십시오 (Markdown 코드블록 없이 순수 JSON):
{
  "executiveSummary": "전체 업무에 대한 COO 총괄 요약 (3~4문장)",
  "staffSummaries": [
    { "role": "CTO", "summary": "CTO 분석 핵심 요약" },
    { "role": "CDO", "summary": "CDO 분석 핵심 요약" },
    { "role": "FIELD_EXPERT", "summary": "현장 운영 전문가 분석 핵심 요약" },
    { "role": "CPO", "summary": "CPO 분석 핵심 요약" }
  ],
  "conflictsAndDebates": [
    "직원 간 주요 이견 및 조율 내용 1",
    "직원 간 주요 이견 및 조율 내용 2"
  ],
  "finalDecision": "COO의 최종 종합 권고 의견",
  "top10Milestones": [
    {
      "rank": 1,
      "title": "과제 제목 (예: 운행일보 OCR 송장번호/타설량 필터 v1)",
      "leadRole": "CTO",
      "objective": "과제 목적 및 스펙",
      "expectedOutput": "기대 산출물",
      "timelineWeeks": "예상 소요 기간 (예: 1~2주)",
      "riskMitigation": "현장/기술 위험 완화책"
    },
    { "rank": 2, "title": "2위 과제 제목", "leadRole": "CDO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 3, "title": "3위 과제 제목", "leadRole": "FIELD_EXPERT", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 4, "title": "4위 과제 제목", "leadRole": "CPO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 5, "title": "5위 과제 제목", "leadRole": "CTO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 6, "title": "6위 과제 제목", "leadRole": "CDO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 7, "title": "7위 과제 제목", "leadRole": "FIELD_EXPERT", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 8, "title": "8위 과제 제목", "leadRole": "CPO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 9, "title": "9위 과제 제목", "leadRole": "CTO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" },
    { "rank": 10, "title": "10위 과제 제목", "leadRole": "CDO", "objective": "목적", "expectedOutput": "산출물", "timelineWeeks": "기간", "riskMitigation": "완화책" }
  ],
  "risksAndMitigations": [
    { "risk": "핵심 리스크 1", "mitigation": "대응 방안 1" },
    { "risk": "핵심 리스크 2", "mitigation": "대응 방안 2" }
  ],
  "ceoApprovalNeededItems": [
    "대표의 사전 승인 및 결재가 반드시 필요한 중대 안건 1 (예: 운영 배포 일정, 외부 DB 격리 스키마 승인 등)",
    "대표 승인 필요 안건 2"
  ]
}`;
}
