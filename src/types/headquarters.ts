export type ExecutiveRole = 'CEO' | 'COO' | 'CTO' | 'CDO' | 'FIELD_EXPERT' | 'CPO';

export type ExecutiveStatus = 'idle' | 'analyzing' | 'working' | 'under_review' | 'completed';

export interface Executive {
  id: string;
  role: ExecutiveRole;
  name: string;
  title: string;
  department: string;
  isAi: boolean;
  status: ExecutiveStatus;
  statusLabel: string;
  specialization: string;
  currentTaskTitle?: string;
  guidelinesSummary: string[];
  keyResponsibilities: string[];
  autonomousPermissions: string[];
  restrictedPermissions: string[];
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    accent: string;
  };
  stats: {
    activeTasks: number;
    completedReports: number;
    collaborationCount: number;
  };
}

export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export type TaskStatus =
  | 'queued'             // 접수 대기
  | 'coo_dispatching'   // COO 분석 및 작업 분해 중
  | 'in_progress'       // 부서별 실무 진행 중
  | 'cross_review'      // 교차 검토 및 반론 단계
  | 'awaiting_approval' // 대표 승인 대기
  | 'revision_requested'// 대표 반려 및 재검토 요청
  | 'completed';        // 완료

export interface SubTask {
  id: string;
  assignedTo: ExecutiveRole;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  resultSummary?: string;
  // 향후 2단계 AI 멀티 에이전트 실행 및 Supabase 연동을 위한 확장 필드
  detailedReport?: string;
  rebuttal?: string;
  codeSnippet?: string;
  tokensUsed?: number;
  executedAt?: string;
}

export interface HQTask {
  id: string;
  title: string;
  description: string;
  originator: string; // "CEO (대표)"
  targetExecutive: ExecutiveRole; // usually COO
  priority: TaskPriority;
  status: TaskStatus;
  statusLabel: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  isTestData: boolean; // 명확한 테스트 데이터 구분 플래그
  subTasks: SubTask[];
  category: 'OCR' | 'DISPATCH' | 'SYSTEM' | 'FIELD' | 'PRODUCT';
  notes?: string;
  // 향후 2단계 종합 보고서 및 대표 승인 감사를 위한 확장 필드
  finalReport?: string;
  approvalComment?: string;
  approvedAt?: string;
  approvedBy?: string;
  isLiveAiGenerated?: boolean;
  session?: MultiAgentSession;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actorRole: ExecutiveRole;
  actorName: string;
  action: string;
  target: string;
  badgeType: 'info' | 'success' | 'warning' | 'alert';
  isTestData: boolean;
}

export type NavTab =
  | 'dashboard'
  | 'executives'
  | 'directives'
  | 'departments'
  | 'task_status'
  | 'reports'
  | 'knowledge'
  | 'approvals'
  | 'system';

// -------------------------------------------------------------
// Phase 2: AI Multi-Agent Collaboration Interfaces
// -------------------------------------------------------------

export type MultiAgentStatus =
  | 'idle'
  | 'analyzing'
  | 'completed'
  | 'completed_with_warnings'
  | 'timed_out'
  | 'failed'
  | 'cancelled';

export interface TokenUsage {
  promptTokens: number | 'N/A';
  candidatesTokens: number | 'N/A';
  totalTokens: number | 'N/A';
}

export interface ExecutiveAnalysisReport {
  role: ExecutiveRole;
  name: string;
  department: string;
  purpose: string;
  coreAnalysis: string;
  concreteProposals: string[];
  expectedEffects: string;
  risks: string[];
  rebuttalOrCritique: string;
  unconfirmedItems: string;
  actionableNextSteps: string[];
  tokens: TokenUsage;
  latencyMs: number;
  status: 'pending' | 'working' | 'completed' | 'failed';
  errorMsg?: string;
  completedAt?: string;
}

export interface CooDecomposition {
  purpose: string;
  successCriteria: string[];
  assignments: Array<{
    role: ExecutiveRole;
    title: string;
    objective: string;
    constraints: string;
  }>;
  tokens: TokenUsage;
  latencyMs: number;
}

export interface CooEvaluation {
  summaryComparison: string;
  conflictDetected: boolean;
  rebuttalTargetRole?: ExecutiveRole;
  rebuttalReason?: string;
  tokens: TokenUsage;
  latencyMs: number;
}

export interface MilestoneItem {
  rank: number;
  title: string;
  leadRole: ExecutiveRole;
  objective: string;
  expectedOutput: string;
  timelineWeeks: string;
  riskMitigation: string;
}

export interface CooFinalReport {
  executiveSummary: string;
  staffSummaries: Array<{
    role: ExecutiveRole;
    summary: string;
  }>;
  conflictsAndDebates: string[];
  finalDecision: string;
  top10Milestones: MilestoneItem[];
  risksAndMitigations: Array<{
    risk: string;
    mitigation: string;
  }>;
  ceoApprovalNeededItems: string[];
  totalLatencyMs: number;
  tokens: TokenUsage;
}

export interface MultiAgentSession {
  executionId: string;
  idempotencyKey: string;
  directiveTitle: string;
  directiveDescription: string;
  category: string;
  priority: TaskPriority;
  status: MultiAgentStatus;
  statusMessage: string;
  currentStep:
    | 'queued'
    | 'coo_decomposing'
    | 'parallel_analysis'
    | 'coo_evaluating'
    | 'rebuttal_round'
    | 'coo_finalizing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'timed_out';
  startedAt: string;
  completedAt?: string;
  cooDecomposition?: CooDecomposition;
  reports: Partial<Record<ExecutiveRole, ExecutiveAnalysisReport>>;
  rebuttalTargetRole?: ExecutiveRole;
  rebuttalReport?: ExecutiveAnalysisReport;
  finalReport?: CooFinalReport;
  totalTokens: TokenUsage;
  totalCalls: number;
  isLiveAiGenerated: boolean;
  errorMessage?: string;
  warningDetails?: string;
}

// -------------------------------------------------------------
// CF-CEO-2026-1111-05: Operational Execution & AI Activity Logs
// -------------------------------------------------------------

export type ExecutionLifecycleStage =
  | 'PLAN_CREATED'          // 1. 계획 수립
  | 'CEO_APPROVED'          // 2. 대표 승인
  | 'IN_EXECUTION'          // 3. 실행 중
  | 'CODE_GENERATED'         // 4. 코드 및 결과물 생성
  | 'FEATURE_IMPLEMENTED'    // 5. 기능 구현
  | 'TEST_PASSED'           // 6. 테스트 통과
  | 'PREVIEW_VERIFIED'      // 7. 프리뷰 반영 확인
  | 'PRODUCTION_DEPLOYED';   // 8. 운영 배포 확인

export interface AIActivityLog {
  id: string;
  date: string;               // 1. 날짜 (시작 및 종료)
  actorRole: ExecutiveRole;    // 2. 담당자 역할
  actorName: string;           // 2. 담당자 실명/직함
  directiveTitle: string;      // 3. 지시 내용 (최초 업무 지시)
  plannedWork: string;         // 4. 계획 (예정된 작업)
  executedWork: string;        // 5. 실행 (실제 수행한 작업)
  artifacts: string[];         // 6. 산출물 (파일, 코드, 문서, 화면)
  featureChanges: string;      // 7. 기능 변화 (구현 및 수정된 기능)
  verificationResult: string;  // 8. 검증 (테스트 방법과 결과)
  previewStatus: 'VERIFIED' | 'UNVERIFIED' | 'NOT_APPLICABLE'; // 9. 반영 (프리뷰 및 배포 여부)
  pendingFollowUp: string;     // 10. 후속 작업 (미완료 및 다음 업무)
  stage: ExecutionLifecycleStage;
  codeDiffSummary?: string;
  evidenceUrl?: string;
  isAuditVerified: boolean;
  dataOrigin?: 'MOK_SEED' | 'REAL_AI' | 'TEST_SIMULATION';
}

export interface ExecutiveHandoff {
  id: string;
  timestamp: string;
  fromRole: ExecutiveRole;
  toRole: ExecutiveRole;
  directiveTitle: string;
  passedArtifacts: string[];
  changesSummary: string;
  currentStatus: string;
  issuesFound: string;
  nextActionPrompt: string;
  dataOrigin?: 'MOK_SEED' | 'REAL_AI' | 'TEST_SIMULATION';
}

export interface ProductionFeatureRecord {
  id: string;
  featureName: string;
  category: 'DRIVER_VIEW' | 'DISPATCH_COCKPIT' | 'SECURITY_HMAC' | 'KNOWLEDGE_ENGINE' | 'DATA_POLICY' | 'HQ_OPERATIONS';
  implementedBy: ExecutiveRole;
  implementedAt: string;
  targetUser: '운전기사' | '출하실장' | 'AI 임원' | 'CEO (대표)';
  description: string;
  beforeState: string;
  afterState: string;
  tangibleEvidence: string;
  testPassed: boolean;
  previewUrl: string;
  stage: ExecutionLifecycleStage;
}
