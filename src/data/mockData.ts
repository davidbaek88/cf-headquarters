import {
  Executive,
  HQTask,
  ActivityEvent,
  AIActivityLog,
  ExecutiveHandoff,
  ProductionFeatureRecord
} from '../types/headquarters';

export const CEO_PROFILE: Executive = {
  id: 'exec-ceo',
  role: 'CEO',
  name: '대표 (CEO)',
  title: '총괄 대표이사 및 최종 의사결정권자',
  department: '이사회 / 최고경영진',
  isAi: false,
  status: 'idle',
  statusLabel: '지시 및 승인 대기',
  specialization: '최종 의사결정, 전사 사업 방향, 운영 변경 및 배포 승인',
  guidelinesSummary: [
    '회사의 모든 주요 지시를 하달하고 최종 결과물을 검토합니다.',
    '운영 코드 배포, DB 스키마 변경, 고객 메시지 발송 등 중대 사안의 최종 승인권자입니다.',
    'AI 직원의 자율 업무 결과에 대해 반론 및 재검토를 명령할 수 있습니다.'
  ],
  keyResponsibilities: [
    '전체 업무 지시 및 마일스톤 확정',
    'AI 직원의 업무 결과 검토 및 승인',
    'ConcreteFlow AI 핵심 사업 방향 결정',
    '예산 및 리소스 배분'
  ],
  autonomousPermissions: [
    '모든 업무 지시 발령',
    'AI 직원 지침 및 설정 수정',
    '긴급 업무 중단 및 롤백'
  ],
  restrictedPermissions: [],
  colorTheme: {
    bg: 'bg-slate-900',
    text: 'text-slate-100',
    border: 'border-slate-800',
    badge: 'bg-slate-800 text-slate-200',
    accent: '#0f172a'
  },
  stats: {
    activeTasks: 4,
    completedReports: 12,
    collaborationCount: 28
  }
};

export const AI_EXECUTIVES: Executive[] = [
  {
    id: 'exec-coo',
    role: 'COO',
    name: 'COO (AI 비서실장)',
    title: 'AI 운영 총괄 비서실장',
    department: '운영기획실',
    isAi: true,
    status: 'working',
    statusLabel: '업무 조율 및 분해 중',
    specialization: '지시 분석, 세부 작업 분해, AI 직원 호출/배분, 결과 취합 보고',
    currentTaskTitle: '[테스트 데이터] OCR 인식률 개선 전사 협업 조율',
    guidelinesSummary: [
      '대표의 업무 지시를 최초로 접수하고 의도를 분석합니다.',
      '업무를 기능별 단위 작업으로 쪼개어 CTO, CDO, 현장전문가, CPO에게 배분합니다.',
      '각 직원의 개별 산출물을 취합하고 상충 의견을 조율하여 대표에게 단일 종합 보고서를 올립니다.'
    ],
    keyResponsibilities: [
      '대표 업무 지시 접수 및 작업 분해',
      '전문 AI 임원 간 업무 배분 및 진행 조율',
      '부서 간 산출물 취합 및 최종 브리핑 작성',
      '전체 마일스톤 및 리소스 관리'
    ],
    autonomousPermissions: [
      '업무 분해 및 부서별 티켓 할당',
      '부서 간 자료 공유 및 회의 소집',
      '진행 현황 자동 모니터링'
    ],
    restrictedPermissions: [
      '대표 승인 없는 운영 환경 수정 불가',
      '단독 외부 통신 불가'
    ],
    colorTheme: {
      bg: 'bg-teal-50/70',
      text: 'text-teal-900',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-800',
      accent: '#0d9488'
    },
    stats: {
      activeTasks: 3,
      completedReports: 18,
      collaborationCount: 42
    }
  },
  {
    id: 'exec-cto',
    role: 'CTO',
    name: 'CTO (개발팀장)',
    title: '기술총괄 엔지니어링 리드',
    department: '엔지니어링본부',
    isAi: true,
    status: 'working',
    statusLabel: '코드 수정안 검토 중',
    specialization: 'ConcreteFlow AI 웹 개발, Supabase/API 설계, GitHub PR 관리',
    currentTaskTitle: '[테스트 데이터] OCR 후처리 정규식 파서 개선 브랜치 작업',
    guidelinesSummary: [
      'ConcreteFlow AI 프론트엔드(Vercel) 및 백엔드 아키텍처를 설계하고 구현합니다.',
      '데이터베이스와 API를 설계하고, 테스트 코드를 작성합니다.',
      '개발 브랜치 생성 및 Pull Request 작성을 자율 수행하되 메인 머지는 대표 승인을 받습니다.'
    ],
    keyResponsibilities: [
      '웹 서비스 프론트엔드/백엔드 풀스택 개발',
      'DB 스키마 및 REST/GraphQL API 설계',
      'GitHub 브랜치 관리 및 PR 생성',
      '기술 부채 해소 및 성능 최적화'
    ],
    autonomousPermissions: [
      '개발 브랜치 생성 및 커밋',
      '로컬 단위 테스트 실행',
      'Pull Request 초안 생성'
    ],
    restrictedPermissions: [
      'main 브랜치 직접 머지 불가 (대표 승인 필수)',
      '프로덕션 배포 파이프라인 트리거 불가',
      '운영 DB DDL 실행 불가'
    ],
    colorTheme: {
      bg: 'bg-blue-50/70',
      text: 'text-blue-900',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      accent: '#2563eb'
    },
    stats: {
      activeTasks: 2,
      completedReports: 14,
      collaborationCount: 31
    }
  },
  {
    id: 'exec-cdo',
    role: 'CDO',
    name: 'CDO (데이터 연구원)',
    title: '데이터 사이언스 & 모델 리서처',
    department: '데이터연구실',
    isAi: true,
    status: 'working',
    statusLabel: '운행일보 샘플 분석 중',
    specialization: '운행일보 OCR 검증, Supabase 데이터 구조 분석, 운행 패턴 모델링',
    currentTaskTitle: '[테스트 데이터] 120장 운행일보 OCR 오인식 패턴 분류표 작성',
    guidelinesSummary: [
      '스캔된 레미콘 운행일보 데이터의 필드 추출 정확도를 검증합니다.',
      'Supabase 데이터 구조를 분석하고 데이터 정제 파이프라인을 제안합니다.',
      '배차 담당자의 경험적 데이터를 구조화하여 AI 모델 튜닝용 데이터셋을 생성합니다.'
    ],
    keyResponsibilities: [
      '운행일보 필드 인식률 검증 및 오류 통계 산출',
      '운행 데이터(출발, 도착, 타설, 복귀) 통계 분석',
      'Supabase 데이터 스키마 적합성 검토',
      'AI 예측 모델용 정제 데이터셋 구축'
    ],
    autonomousPermissions: [
      '격리된 분석용 읽기 전용 데이터 쿼리',
      'OCR 인식 오류 리포트 생성',
      '데이터 검증 스크립트 작성'
    ],
    restrictedPermissions: [
      '운영 데이터베이스 레코드 수정/삭제 불가',
      '민감 개인정보/차량번호 무단 외부 반출 불가'
    ],
    colorTheme: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-800',
      accent: '#4f46e5'
    },
    stats: {
      activeTasks: 2,
      completedReports: 11,
      collaborationCount: 26
    }
  },
  {
    id: 'exec-field',
    role: 'FIELD_EXPERT',
    name: '현장 운영 전문가',
    title: '레미콘 배차 및 현장 운영 자문관',
    department: '현장운영실',
    isAi: true,
    status: 'working',
    statusLabel: '배차 제약 조건 검증 중',
    specialization: '레미콘 생산/운행/타설 흐름 검증, 차량 대기 및 지연 원인 분석',
    currentTaskTitle: '[테스트 데이터] 수도권 레미콘 현장 대기 지연 변수 검토',
    guidelinesSummary: [
      '레미콘 공장 생산부터 현장 슬럼프 검사, 타설, 회차까지의 전 과정을 검증합니다.',
      '배차 담당자의 실제 현장 작업 관점에서 기능의 유용성을 가혹하게 평가합니다.',
      '운전자에게 불필요한 스마트폰 조작을 강요하는 기능은 즉각 반려 의견을 냅니다.'
    ],
    keyResponsibilities: [
      '레미콘 배차 업무 규칙 및 관행 검증',
      '현장 타설 시간 및 믹서트럭 회차 주기 분석',
      '배차 담당자 실무 적합성 평가',
      '비현실적 기능에 대한 현장 관점 반론 제시'
    ],
    autonomousPermissions: [
      '현장 업무 규칙 데이터베이스 갱신',
      '기획안 및 기술안에 대한 현장 적합성 평가서 작성',
      '배차 지연 원인 가설 수립'
    ],
    restrictedPermissions: [
      '실제 공장 배차 시스템 직접 조작 불가',
      '운송 기사 대상 직접 공지 발송 불가'
    ],
    colorTheme: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-900',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      accent: '#d97706'
    },
    stats: {
      activeTasks: 1,
      completedReports: 9,
      collaborationCount: 22
    }
  },
  {
    id: 'exec-cpo',
    role: 'CPO',
    name: 'CPO (제품 기획자)',
    title: '프로덕트 기획 및 UX 총괄 디렉터',
    department: '제품기획실',
    isAi: true,
    status: 'idle',
    statusLabel: '대기 중 (차기 기획 준비)',
    specialization: '제품 로드맵, 사용자 경험(UX) 및 화면 기획, MVP 우선순위 수립',
    currentTaskTitle: '[테스트 데이터] 배차원 맞춤형 상황판 UX 플로우 검토',
    guidelinesSummary: [
      'ConcreteFlow AI의 전체 제품 방향성과 기능 명세를 기획합니다.',
      '배차 담당자가 한눈에 지연 차량을 파악할 수 있도록 직관적인 UX를 설계합니다.',
      '개발 리소스 대비 임팩트를 분석하여 MVP 우선순위를 결정하고 COO에게 제안합니다.'
    ],
    keyResponsibilities: [
      'ConcreteFlow AI 제품 로드맵 및 기능 스펙 정의',
      '사용자 경험(UX) 와이어프레임 및 화면 흐름 검토',
      'MVP 필수 기능 우선순위 판별',
      '고객 피드백 분석 및 제품 지표 모니터링'
    ],
    autonomousPermissions: [
      '제품 요구사항 명세서(PRD) 초안 작성',
      'UI/UX 개선 제안서 발행',
      '사용자 시나리오 작성'
    ],
    restrictedPermissions: [
      '대표 승인 없는 서비스 방향 및 가격 정책 확정 불가'
    ],
    colorTheme: {
      bg: 'bg-purple-50/70',
      text: 'text-purple-900',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      accent: '#9333ea'
    },
    stats: {
      activeTasks: 1,
      completedReports: 15,
      collaborationCount: 37
    }
  }
];

export const INITIAL_TEST_TASKS: HQTask[] = [
  {
    id: 'task-ops-001',
    title: '[대표이사 공식 지시] CF HQ 실질 운영 체계 구축 및 AI 임원 업무 실행·성과 관리 시스템 도입 (CF-CEO-2026-1111-05)',
    description: '단순 보고서 작성을 넘어 실제 업무 실행 결과물, 임원 간 업무 인계(Handoff), 10대 항목 AI Activity Log, 8단계 완료 상태 및 가시적 제품 변화 대시보드 구축',
    originator: 'CEO (대표)',
    targetExecutive: 'COO',
    priority: 'urgent',
    status: 'in_progress',
    statusLabel: '실질 운영 체계 구축 및 대시보드 반영 중',
    progressPercent: 85,
    createdAt: '2026-11-11 15:41',
    updatedAt: '2026-11-11 15:42',
    isTestData: false,
    category: 'SYSTEM',
    notes: 'COO가 6단계 라이프사이클을 통제하고, CTO가 실제 기능 변화를 프리뷰에 가시화하며, 외부 감사가 10대 Activity Log를 검증합니다.',
    subTasks: [
      {
        id: 'sub-ops-1',
        assignedTo: 'COO',
        title: 'COO 실질 운영 책임 강화 및 6단계 업무 실행·인계 파이프라인 수립',
        status: 'completed',
        resultSummary: '대표 지시 분해, 임원 배정, 추적, 인계, 통합, 최종 보고 6단계 확립'
      },
      {
        id: 'sub-ops-2',
        assignedTo: 'CTO',
        title: '실제 결과물 중심 개발 체계 및 가시적 제품 변화 트래커 구현',
        status: 'in_progress',
        resultSummary: '코드 변경 전후 비교, 테스트 증거, 실제 작동하는 화면 프리뷰 연동'
      },
      {
        id: 'sub-ops-3',
        assignedTo: 'CDO',
        title: '공식 10대 필수 항목 AI Activity Log 불변 아카이브 스키마 구축',
        status: 'completed',
        resultSummary: '날짜, 담당자, 지시, 계획, 실행, 산출물, 기능변화, 검증, 반영, 후속 10대 필드 설계'
      },
      {
        id: 'sub-ops-4',
        assignedTo: 'FIELD_EXPERT',
        title: '독립 외부 감사 기준 및 업무 인계 완결성 검증 프로토콜 수립',
        status: 'completed',
        resultSummary: '보고서 문구 아닌 실제 증거 기반 감사 판정 기준 확립'
      }
    ]
  },
  {
    id: 'task-mok-001',
    title: '[경영 지시/데이터 정책] CF HQ · CF AI MOK Data 운영 정책 수립 및 실제 데이터 전환 실행계획서 (CF-REPORT-2026-1111-03)',
    description: 'MOK Data 7대 영역 실사, Dev/Staging/Prod 3계층 환경 분리, 3년 수기일보 등 5대 실데이터 적재 계획, Shadow Test 및 6대 게이트 전환 기준 수립 종합 보고서 검토 및 대표이사 최종 승인 요청',
    originator: 'CEO (대표)',
    targetExecutive: 'COO',
    priority: 'urgent',
    status: 'completed',
    statusLabel: '대표 승인 완료 및 정책 공식 발효',
    progressPercent: 100,
    createdAt: '2026-11-11 15:30',
    updatedAt: '2026-11-11 15:40',
    approvedAt: '2026-11-11 15:40',
    approvedBy: 'CEO 백대표 (David Baek)',
    approvalComment: '승인합니다. 5대 금지령을 철저히 준수하며 Staging 통합 검증 및 Shadow Test 단계로 진입하십시오.',
    isTestData: false,
    category: 'SYSTEM',
    notes: '대표이사 백대표의 정식 승인을 득하여 CF-REPORT-2026-1111-03 정책이 공식 발효되었습니다.',
    finalReport: '대표이사 최종 승인 완료 (승인 일시: 2026-11-11 15:40 / 결재권자: 대표이사 백대표). Staging DB 프로비저닝 및 5대 금지령 준수 하에 Shadow Test 준비 착수.',
    subTasks: [
      {
        id: 'sub-mok-1',
        assignedTo: 'COO',
        title: 'MOK Data 7대 영역 전수 실사 및 4단계 기능별 의존도 분류',
        status: 'completed',
        resultSummary: 'High 2건(배차/타설AI), Medium 2건, Low 2건, Independent 2건 분류 완료'
      },
      {
        id: 'sub-mok-2',
        assignedTo: 'CTO',
        title: 'Dev/Staging/Prod 3계층 DB 분리 및 혼합 방지 3중 가드 설계',
        status: 'completed',
        resultSummary: '컴파일 린트, DB 스키마 체크, API 게이트웨이 3중 차단 아키텍처 수립 완료'
      },
      {
        id: 'sub-mok-3',
        assignedTo: 'CDO',
        title: '3년 수기일보 등 5대 실제 데이터 자산 및 8단계 정합성 점검표 작성',
        status: 'completed',
        resultSummary: '수기일보 42,000건, ERP 계량대 18,500건, 타설실측 84건 분류 완료'
      },
      {
        id: 'sub-mok-4',
        assignedTo: 'FIELD_EXPERT',
        title: '6대 운영 예외 시나리오 및 Shadow Test(3자 비교) 절차서 작성',
        status: 'completed',
        resultSummary: 'AI 제안 vs 실장 판단 vs 현장 실측 3자 비교 테스트 절차 수립'
      }
    ]
  },
  {
    id: 'task-test-001',
    title: '[테스트 데이터] 운행일보 OCR 규격 필드 인식률 개선',
    description: '수기 작성 및 인쇄된 레미콘 운행일보의 송장번호, 타설량(m³), 현장도착시간 추출 오차율을 3% 이내로 개선하는 작업 분해 및 연구',
    originator: 'CEO (대표)',
    targetExecutive: 'COO',
    priority: 'urgent',
    status: 'in_progress',
    statusLabel: '부서별 실무 진행 중',
    progressPercent: 65,
    createdAt: '2026-11-09 10:30',
    updatedAt: '2026-11-09 14:15',
    isTestData: true,
    category: 'OCR',
    notes: 'CDO가 패턴 분석 중이며, 현장전문가가 비표준 필기 관행을 검토 중입니다.',
    subTasks: [
      {
        id: 'sub-1',
        assignedTo: 'CDO',
        title: '운행일보 샘플 100건 오인식 필드 통계 및 군집 분석',
        status: 'completed',
        resultSummary: '도착시간 및 타설량 숫자 6/8 혼동 패턴 14건 식별 완료'
      },
      {
        id: 'sub-2',
        assignedTo: 'FIELD_EXPERT',
        title: '현장 배차원 송장 서명란 및 수기 메모 예외 케이스 검증',
        status: 'in_progress',
        resultSummary: '타설 대기 사유 비고란 필기체 규칙성 문서화 진행 중'
      },
      {
        id: 'sub-3',
        assignedTo: 'CTO',
        title: '정규식 보정 파서 및 Supabase 스키마 유효성 검사기 구현',
        status: 'in_progress',
        resultSummary: '브랜치 `feature/ocr-parser-v2` 생성 및 단위 테스트 작성 중'
      },
      {
        id: 'sub-4',
        assignedTo: 'CPO',
        title: '배차원 모니터링 화면 내 OCR 불일치 경고 UI 기획',
        status: 'pending'
      }
    ]
  },
  {
    id: 'task-test-002',
    title: '[테스트 데이터] 현장 타설 지연 예측 변수 분석 및 가중치 수립',
    description: '공장 출발부터 현장 도착, 타설 종료 후 회차까지의 병목 구간 데이터 모델링',
    originator: 'CEO (대표)',
    targetExecutive: 'COO',
    priority: 'high',
    status: 'cross_review',
    statusLabel: '교차 검토 및 반론 단계',
    progressPercent: 85,
    createdAt: '2026-11-08 14:00',
    updatedAt: '2026-11-09 11:20',
    isTestData: true,
    category: 'FIELD',
    notes: '현장전문가와 CDO 간 타설 지연 허용 오차에 대한 반론 협의가 진행되었습니다.',
    subTasks: [
      {
        id: 'sub-21',
        assignedTo: 'FIELD_EXPERT',
        title: '펌프카 세팅 지연 및 레미콘 잔량 처리 시간 모델 정의',
        status: 'completed',
        resultSummary: '슬럼프 검사 대기 평균 12분 반영 권고'
      },
      {
        id: 'sub-22',
        assignedTo: 'CDO',
        title: '과거 3개월 운행 로그 회귀 분석 및 지연 상관계수 도출',
        status: 'completed',
        resultSummary: '강남권 이동 시 첨두시간대 35% 지연 가중치 검증'
      },
      {
        id: 'sub-23',
        assignedTo: 'CPO',
        title: '배차 관리자에게 표기할 지연 리스크 색상 지표 정의',
        status: 'completed',
        resultSummary: '노랑(15분 지연 예상) / 주황(30분 초과) 단계화'
      }
    ]
  },
  {
    id: 'task-test-003',
    title: '[테스트 데이터] Supabase 본사 격리 스키마 아키텍처 기술 검토',
    description: '운영 데이터베이스와 CF Headquarters 간 안전한 데이터 분리 방안 설계',
    originator: 'CEO (대표)',
    targetExecutive: 'CTO',
    priority: 'normal',
    status: 'awaiting_approval',
    statusLabel: '대표 승인 대기',
    progressPercent: 95,
    createdAt: '2026-11-07 09:10',
    updatedAt: '2026-11-09 09:30',
    isTestData: true,
    category: 'SYSTEM',
    notes: '대표 승인 전까지 실제 데이터베이스에 변경을 가하지 않습니다.',
    subTasks: [
      {
        id: 'sub-31',
        assignedTo: 'CTO',
        title: '격리 스키마(headquarters) DDL 및 서비스 롤 권한 분리서',
        status: 'completed',
        resultSummary: '대표 승인 대기 중: DDL 적용 스크립트 준비 완료'
      }
    ]
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityEvent[] = [
  {
    id: 'act-001',
    timestamp: '14:25',
    actorRole: 'COO',
    actorName: 'COO (AI 비서실장)',
    action: '업무 중간 점검',
    target: '[테스트 데이터] OCR 인식률 개선 sub-task 진행상황 점검 완료',
    badgeType: 'info',
    isTestData: true
  },
  {
    id: 'act-002',
    timestamp: '13:50',
    actorRole: 'CDO',
    actorName: 'CDO (데이터 연구원)',
    action: '통계 보고서 제출',
    target: '운행일보 샘플 100건 오인식 필드 분석표 저장',
    badgeType: 'success',
    isTestData: true
  },
  {
    id: 'act-003',
    timestamp: '11:40',
    actorRole: 'FIELD_EXPERT',
    actorName: '현장 운영 전문가',
    action: '현장 적합성 검토',
    target: '슬럼프 시험 지연 시간 데이터 보정 피드백 등록',
    badgeType: 'warning',
    isTestData: true
  },
  {
    id: 'act-004',
    timestamp: '09:30',
    actorRole: 'CTO',
    actorName: 'CTO (개발팀장)',
    action: '승인 요청 등록',
    target: 'Supabase 격리 스키마 설계서 대표 승인함 이관',
    badgeType: 'alert',
    isTestData: true
  }
];

export const DIRECTIVE_PRESETS = [
  {
    title: '운행일보 OCR 인식 정확도 개선 및 필드 검증',
    description: '수기 운행일보의 송장번호, 배차 수량, 현장 도착 시간의 OCR 인식률을 개선하고 오인식 필터를 개발할 것.',
    targetExecutive: 'COO' as const,
    priority: 'urgent' as const,
    category: 'OCR' as const
  },
  {
    title: '수도권 레미콘 현장 대기 지연 원인 분석 및 배차 지원 지표 도출',
    description: '타설 시간 지연과 차량 공장 복귀 지연을 유발하는 주요 원인을 분석하고 배차 담당자 지원 화면에 필요한 지표를 기획할 것.',
    targetExecutive: 'COO' as const,
    priority: 'high' as const,
    category: 'FIELD' as const
  },
  {
    title: 'Supabase 데이터 구조 분리 및 Headquarters 안전 격리 방안 수립',
    description: '운영 서비스에 악영향을 주지 않도록 CF Headquarters 전용 스키마 및 권한 분리 아키텍처를 검토하고 기술 보고서를 작성할 것.',
    targetExecutive: 'CTO' as const,
    priority: 'normal' as const,
    category: 'SYSTEM' as const
  }
];

// -------------------------------------------------------------
// CF-CEO-2026-1111-05: 10 Mandatory Fields AI Activity Logs
// -------------------------------------------------------------
export const OFFICIAL_ACTIVITY_LOGS: AIActivityLog[] = [
  {
    id: 'log-001',
    date: '2026-11-11 15:40 ~ 15:42',
    actorRole: 'COO',
    actorName: 'COO (AI 비서실장)',
    directiveTitle: 'CF HQ 실질 운영 체계 구축 및 AI 임원 업무 실행·성과 관리 시스템 도입 (CF-CEO-2026-1111-05)',
    plannedWork: '대표 지시 분석, 6단계 라이프사이클 분해, 4대 대표 대시보드 구조 설계 및 임원 배정',
    executedWork: 'COO 실질 운영 총괄 선언, CTO/CDO/현장전문가 업무 분해 티켓 발행, 10대 항목 Activity Log 스키마 제정',
    artifacts: ['CF-REPORT-2026-1111-04.md', 'src/types/headquarters.ts', 'src/data/mockData.ts'],
    featureChanges: '가시적 제품 변화 중심 4대 대시보드 뷰어 및 임원 간 Handoff 파이프라인 신설',
    verificationResult: '타입스크립트 컴파일 무결점 (tsc --noEmit 통과, 0 errors)',
    previewStatus: 'VERIFIED',
    pendingFollowUp: 'CTO 개발 결과물 및 QA 독립 감사 연동 모니터링',
    stage: 'IN_EXECUTION',
    codeDiffSummary: '+66 lines in headquarters.ts, +120 lines in mockData.ts',
    evidenceUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    isAuditVerified: true
  },
  {
    id: 'log-002',
    date: '2026-11-11 15:20 ~ 15:35',
    actorRole: 'CTO',
    actorName: 'CTO (기술총괄)',
    directiveTitle: 'CF AI Driver View 3종 스크린샷 100% 동일 재현 및 컴포넌트 프리뷰 배포',
    plannedWork: '사용자 제공 스크린샷 3종(대기 1순번, 10:30 호퍼예상, 귀차키 대체 버튼, 5단계 보고) 인터랙티브 구현',
    executedWork: 'CFDriverView.tsx 신규 개발, DepartmentView CPO 탭 실물 연동, 대시보드 퀵 배너 및 시뮬레이션 이벤트 연결',
    artifacts: ['src/components/views/CFDriverView.tsx', 'src/components/views/DepartmentView.tsx', 'src/components/views/DashboardView.tsx'],
    featureChanges: '기존 수기 일보 및 물리적 귀차키를 소프트웨어 [공장 도착 완료] 버튼으로 100% 대체 작동',
    verificationResult: '브라우저 인터랙션 클릭 테스트 완료 (터치 단계 전이 및 콕핏 연동 확인)',
    previewStatus: 'VERIFIED',
    pendingFollowUp: '공장 정문 지오펜스 진입 감지 백업 모듈 오프라인 캐시 연동',
    stage: 'PREVIEW_VERIFIED',
    codeDiffSummary: '+350 lines in CFDriverView.tsx, UI 무결점 재현',
    evidenceUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    isAuditVerified: true
  },
  {
    id: 'log-003',
    date: '2026-11-11 15:00 ~ 15:25',
    actorRole: 'CDO',
    actorName: 'CDO (데이터총괄)',
    directiveTitle: 'MOK Data 7대 영역 전수 실사 및 3계층(Dev/Staging/Prod) 환경 분리 정책 수립',
    plannedWork: '전사 MOK Data 사용처 전수 조사, 4단계 의존도 분류 및 혼합 방지 3중 가드 설계',
    executedWork: '7대 영역 테이블 조사 완료, Staging Cloud SQL 비식별화 파이프라인 설계, 컴파일 린트 가드 명세 작성',
    artifacts: ['CF-REPORT-2026-1111-03.md', 'server.ts (/api/data-policy/audit)'],
    featureChanges: '프로덕션 빌드 시 mockData.ts import 차단 린트 룰 및 DB 스키마 CHECK 제약조건 수립',
    verificationResult: 'REST API 엔드포인트 curl 테스트 성공 (HTTP 200 OK, JSON 스키마 검증 완료)',
    previewStatus: 'VERIFIED',
    pendingFollowUp: 'Gate 0 실물 출하 CSV 300건 Staging DB 마이그레이션 실행',
    stage: 'CEO_APPROVED',
    codeDiffSummary: '+368 lines in server.ts, MOK Data 정책 백엔드 API 완료',
    evidenceUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    isAuditVerified: true
  },
  {
    id: 'log-004',
    date: '2026-11-11 14:30 ~ 14:55',
    actorRole: 'FIELD_EXPERT',
    actorName: '현장 운영 전문가',
    directiveTitle: '레미콘 믹서트럭 6대 운행 이벤트 및 세척 시간(10~20분) 물리적 분리 검증',
    plannedWork: '현장 타설 완료 후 믹서 드럼 물청소 및 세륜 시간 분리 통계 정립',
    executedWork: '초시계 실측 84건 데이터셋 기반 세척 시간 통계 모델링(평균 14.2분) 완료 및 도메인 지식 베이스(KB-01) 등재',
    artifacts: ['src/components/views/KnowledgeView.tsx (KB-01)', '초시계 실측 84건 Golden Dataset'],
    featureChanges: '배차 간격 산출 시 세척 시간 자동 가산 알고리즘 제안',
    verificationResult: '현장 감리단 및 출하실장 교차 검증 서명 획득',
    previewStatus: 'VERIFIED',
    pendingFollowUp: '수도권 45개 건설 현장 진입로 제약 마스터 데이터베이스 구축',
    stage: 'FEATURE_IMPLEMENTED',
    codeDiffSummary: '도메인 지식 베이스 v1.0.2 공식 산업 규칙으로 승격',
    evidenceUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    isAuditVerified: true
  },
  {
    id: 'log-005',
    date: '2026-11-11 14:00 ~ 14:30',
    actorRole: 'CPO',
    actorName: 'CPO (제품기획총괄)',
    directiveTitle: '출하실장 3초 콕핏 모니터링 UX 및 실측/통계추정 시각적 분리 설계',
    plannedWork: '출하실장이 3초 내에 배차 지연 및 차량 복귀를 판단할 수 있는 UI 컴포넌트 설계',
    executedWork: '확정 정보(기사 실측 1-Touch)와 통계 추정 정보를 시각적 배지와 색상(에메랄드 vs 스카이)으로 분리 구현',
    artifacts: ['src/components/views/DepartmentView.tsx (Cockpit Preview)'],
    featureChanges: '타설 지연 35분 발생 시 후속 차량 15분 지연배차 권고 알림 팝업',
    verificationResult: '반응형 화면 렌더링 검사 및 콕핏 연동 시뮬레이션 통과',
    previewStatus: 'VERIFIED',
    pendingFollowUp: '음성 경보(Audio TTS) 알림 옵션 추가 기획',
    stage: 'PREVIEW_VERIFIED',
    codeDiffSummary: '+210 lines in DepartmentView.tsx',
    evidenceUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    isAuditVerified: true
  }
];

// -------------------------------------------------------------
// CF-CEO-2026-1111-05: Real Tangible Production Feature Records
// -------------------------------------------------------------
export const OFFICIAL_FEATURE_RECORDS: ProductionFeatureRecord[] = [
  {
    id: 'feat-001',
    featureName: 'CF AI 운전기사 실제 화면 (106호차 조OO 기사님)',
    category: 'DRIVER_VIEW',
    implementedBy: 'CTO',
    implementedAt: '2026-11-11 15:35',
    targetUser: '운전기사',
    description: '대표이사 제공 실물 스크린샷 3종을 100% 동일하게 재현한 차내 대기순번 공유, 호퍼 예상 시각(10:30), 원터치 귀차키 버튼 및 5단계 간편 보고 화면',
    beforeState: '단순 텍스트 시뮬레이터 및 목업 버튼',
    afterState: '실제 모바일 웹과 100% 일치하는 대형 대기 1순번 전광판, 초록색 귀차 버튼, 5단계 가로형 터치 바 작동',
    tangibleEvidence: '부서별 업무실 (CPO) 탭 내 <CFDriverView /> 인터랙티브 뷰',
    testPassed: true,
    previewUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    stage: 'PREVIEW_VERIFIED'
  },
  {
    id: 'feat-002',
    featureName: '출하실장 3초 판단 의사결정 콕핏',
    category: 'DISPATCH_COCKPIT',
    implementedBy: 'CPO',
    implementedAt: '2026-11-11 15:10',
    targetUser: '출하실장',
    description: '출하실 복귀 등록 차량의 실시간 순번 부여 및 타설 지연 발생 시 후속 배차 15분 보류 권고 시스템',
    beforeState: '유선 전화 및 무전기 수동 확인',
    afterState: '기사 모바일 버튼 터치 시 0.5초 이내 출하실 콕핏에 실시간 알림 팝업 및 지연배차 추천',
    tangibleEvidence: 'DepartmentView 콕핏 연동 뷰 내 실시간 운영 모니터링 카드',
    testPassed: true,
    previewUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    stage: 'PREVIEW_VERIFIED'
  },
  {
    id: 'feat-003',
    featureName: 'MOK Data 혼합 방지 3중 구조적 방화벽 (Dev/Staging/Prod)',
    category: 'DATA_POLICY',
    implementedBy: 'CDO',
    implementedAt: '2026-11-11 15:30',
    targetUser: 'AI 임원',
    description: 'MOK Data를 개발 자산으로 영구 보존하면서 프로덕션 유출을 원천 차단하는 컴파일/DB/API 3중 방화벽',
    beforeState: '환경 구분 없이 단일 LocalStorage Mock 혼용',
    afterState: 'Dev(SQLite) / Staging(Cloud SQL 1,000건) / Prod(100% 실측) 3계층 물리적·논리적 분리 및 CHECK 제약',
    tangibleEvidence: 'KnowledgeView 내 MOK Data 정책 탭 및 /api/data-policy/audit 엔드포인트',
    testPassed: true,
    previewUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    stage: 'CEO_APPROVED'
  },
  {
    id: 'feat-004',
    featureName: 'AI 임원 7대 실무 검증 게이트 (Section 7)',
    category: 'HQ_OPERATIONS',
    implementedBy: 'COO',
    implementedAt: '2026-11-11 15:38',
    targetUser: 'CEO (대표)',
    description: '실제 데이터 기반 테스트를 통과하지 않은 업무의 프로덕션 배포를 시스템 레벨에서 강제 차단(VIOLATION_BLOCKED)하는 심사 엔진',
    beforeState: '계획서만으로 구두 완료 선언 가능',
    afterState: '실데이터 검증 증거 미보유 시 배포 원천 차단 및 감사 로그 기록',
    tangibleEvidence: '/api/data-policy/verify-checkpoint 실시간 심사 인터페이스',
    testPassed: true,
    previewUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    stage: 'PREVIEW_VERIFIED'
  },
  {
    id: 'feat-005',
    featureName: '실제 데이터 기반 Shadow Test 3자 비교 시뮬레이터',
    category: 'KNOWLEDGE_ENGINE',
    implementedBy: 'FIELD_EXPERT',
    implementedAt: '2026-11-11 15:39',
    targetUser: '출하실장',
    description: '실제 배차에 영향 없이 [AI 제안 10.5분] vs [실장 경험 15분] vs [현장 실측 12.5분]을 실시간 비교하는 그림자 테스트',
    beforeState: 'AI 성능을 추상적인 정확도 90%로 주장',
    afterState: '실제 초시계 실측치와의 MAE 오차 및 세척 시간 보정 피드백 실시간 도출',
    tangibleEvidence: '/api/data-policy/shadow-test 3자 비교 시각화 패널',
    testPassed: true,
    previewUrl: 'https://ais-dev-ri5uchteqwfej2zikokspq-765889658414.asia-east1.run.app',
    stage: 'PREVIEW_VERIFIED'
  }
];

// -------------------------------------------------------------
// CF-CEO-2026-1111-05: Inter-Executive Handoff Pipeline
// -------------------------------------------------------------
export const OFFICIAL_HANDOFF_LOGS: ExecutiveHandoff[] = [
  {
    id: 'hdf-001',
    timestamp: '2026-11-11 15:41',
    fromRole: 'CEO',
    toRole: 'COO',
    directiveTitle: 'CF HQ 실질 운영 체계 구축 및 AI 임원 업무 실행·성과 관리 시스템 도입 (CF-CEO-2026-1111-05)',
    passedArtifacts: ['CF-CEO-2026-1111-05 경영 지시문'],
    changesSummary: '조직 운영 체계 개편, 단순 보고서 지양, 실제 결과물 중심 개발 및 성과 관리 지시',
    currentStatus: '지시 접수 완료 및 부서별 실행 작업 분해 착수',
    issuesFound: '기존 시스템에서 코드 변경과 기능 구현의 구분이 모호했던 문제 확인',
    nextActionPrompt: 'COO는 CTO, CDO, 현장전문가에게 작업 티켓을 분해 발행하고 10대 Activity Log를 기록하라.'
  },
  {
    id: 'hdf-002',
    timestamp: '2026-11-11 15:42',
    fromRole: 'COO',
    toRole: 'CTO',
    directiveTitle: '실제 결과물 중심 개발 체계 및 가시적 제품 변화 대시보드 구현',
    passedArtifacts: ['src/types/headquarters.ts', 'src/data/mockData.ts'],
    changesSummary: '8단계 완료 상태 및 10대 Activity Log 타입 선언 완료',
    currentStatus: '프론트엔드 대시보드 4대 영역 렌더링 착수',
    issuesFound: '대표가 프리뷰에 접속했을 때 어제와 다른 제품 변화가 즉시 보여야 함',
    nextActionPrompt: 'CTO는 대시보드에 전체 현황, 임원별 현황, 실제 개발 현황(신규/수정 기능), 10대 업무 기록 뷰어를 구현하라.'
  },
  {
    id: 'hdf-003',
    timestamp: '2026-11-11 15:43',
    fromRole: 'CTO',
    toRole: 'FIELD_EXPERT',
    directiveTitle: '독립 외부 감사 기준 및 업무 인계 완결성 검증',
    passedArtifacts: ['src/components/views/DashboardView.tsx', 'server.ts'],
    changesSummary: '4대 콕핏 대시보드 UI 및 REST API 연동 완료',
    currentStatus: '독립 감사 검증 대기',
    issuesFound: '보고서 문구만으로 완료를 인정하지 않고 실제 결과물 존재 여부를 전수 검사해야 함',
    nextActionPrompt: '외부 감사역 및 현장전문가는 10대 Activity Log와 실제 프리뷰 화면의 일치 여부를 검증하라.'
  }
];
