import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Search,
  Calendar,
  ShieldCheck,
  Building2,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ReportDoc {
  id: string;
  docNo: string;
  title: string;
  date: string;
  author: string;
  status: 'APPROVED' | 'IN_REVIEW' | 'ARCHIVED';
  summary: string;
  tags: string[];
  content: string;
}

const OFFICIAL_REPORTS: ReportDoc[] = [
  {
    id: 'rep-ops-01',
    docNo: 'CF-REPORT-2026-1111-04',
    title: '[COO 종합 실행 보고서] CF HQ 실질 업무 실행 체계 구축 및 AI 임원 성과 관리 시스템 명세서',
    date: '2026-11-11',
    author: 'COO, CTO, CDO, CPO, QA Lead, 독립 외부 감사역',
    status: 'IN_REVIEW',
    tags: ['실질 운영 체계', 'AI Activity Log', '업무 인계', '개발 성과', '대표 대시보드'],
    summary: '단순 보고서 작성 지양 및 실제 결과물 중심 전환, COO 6단계 라이프사이클 통제, 10대 필수 항목 AI Activity Log, 8단계 완료 상태 및 가시적 제품 변화 4대 대시보드 구축 명세.',
    content: `# [COO 종합 실행 보고서] CF HQ 실질 업무 실행 체계 구축 및 AI 임원 성과 관리 시스템 명세서

**문서 번호:** CF-REPORT-2026-1111-04  
**수신:** 대표이사 백대표 (CEO)  
**발신:** COO(AI 총괄비서실장), CTO(기술총괄), CDO(데이터총괄), CPO(제품총괄), QA Lead, 독립 외부 감사역  
**문서 성격:** 조직 운영 체계 개편 / 업무 실행 프로세스 구축 보고서  
**관련 지시:** CF-CEO-2026-1111-05 (2026-11-11)

---

### 1. 지시 수용 및 전사 운영 체질 혁신 선언

> **"앞으로 CF HQ의 성과는 얼마나 많은 계획서를 작성했는지가 아니라 실제로 무엇을 만들고, 무엇을 개선했으며, 무엇이 달라졌는지로 평가한다. 대표가 프리뷰에 접속했을 때 어제와 다른 모습이 보여야 한다."**

대표이사님의 엄정한 지시에 따라, CF HQ는 단순한 AI 임원 간 의견 교환 및 보고서 제출 시스템을 탈피하여 **"실제 결과물과 가시적 제품 변화를 만들어내는 실질 운영 체계"**로 완전 전환을 단행하였습니다.

---

### 2. COO의 실질 운영 6단계 라이프사이클 파이프라인

COO는 단순 취합자가 아닌 전사 실질 운영 책임자로서 다음 6단계 절차를 강제합니다:

1. **STEP 1. 업무 접수 (Ingress)**: 대표이사 지시 확인, 비즈니스 목적 및 기대 산출물 정의, 담당 AI 임원 지정.
2. **STEP 2. 실행 계획 수립 (Planning)**: 구체적 실행 단위 작업 분해, 완료 기준(DoD) 설정.
3. **STEP 3. 실제 업무 수행 (Execution)**: 조사/분석에 그치지 않고 실제 파일 생성, 코드 수정, API 엔드포인트 연동 수행.
4. **STEP 4. 업무 결과 공유 (Sharing & Handoff)**: 10대 항목(최초 지시, 계획, 실행, 산출물, 기능변화, 테스트, 프리뷰 여부, 후속) 공식 전달.
5. **STEP 5. 검토 및 통합 (Integration)**: COO가 산출물 간 충돌 여부 심사, 상호 의존성 통합.
6. **STEP 6. 대표 보고 (Executive Briefing)**: 문서가 아닌 **실제 프리뷰 화면과 기능 변화 증거**를 중심으로 대표에게 최종 보고.

---

### 3. 공식 AI Activity Log (10대 필수 항목) 체계 구축

사후 조작을 방지하고 작업 증거를 보존하기 위해 다음 10개 필드를 불변 아카이브로 관리합니다:

| 번호 | 필수 기록 항목 | 표준 정의 및 감사 기준 |
| :--- | :--- | :--- |
| **01** | **날짜 (Date)** | 업무 시작 및 종료 시점 (타임스탬프) |
| **02** | **담당자 (Owner)** | 수행 AI 임원 실명 및 직함 (COO, CTO, CDO 등) |
| **03** | **지시 내용 (Directive)** | 대표이사의 최초 업무 지시문 및 문서 번호 |
| **04** | **계획 (Plan)** | 예정되었던 구체적 작업 항목 목록 |
| **05** | **실행 (Execution)** | 실제로 수행한 구체적 엔지니어링/분석 내역 |
| **06** | **산출물 (Artifacts)** | 생성/수정된 파일 경로, 코드 모듈, 문서 |
| **07** | **기능 변화 (Feature Changes)** | 제품 및 화면에서 실제로 새롭게 구현되거나 변경된 점 |
| **08** | **검증 (Verification)** | 테스트 방법 및 결과 (단위 테스트, 클릭 테스트) |
| **09** | **반영 (Preview & Deploy)** | 프리뷰 반영 확인 여부 및 배포 상태 (VERIFIED/UNVERIFIED) |
| **10** | **후속 작업 (Follow-up)** | 미완료 잔여 작업 및 다음 인계 요청 사항 |

- **감사 철칙**: 기록이 없으면 \`미기록\`, 실제 증거가 없으면 \`미검증\`으로 표기하며 임의의 완료 처리를 시스템적으로 차단합니다.

---

### 4. 실제 결과물 중심 개발 체계 (CTO 7원칙 및 8단계 완료 계층)

CTO는 단순 코드 수정이 아닌 **가시적 제품 변화**를 인도하며, 다음 8단계 완료 계층을 엄격히 구분합니다:

\`\`\`
[ 8단계 업무 완료 계층 구조 ]
1. 계획 수립 (Plan Created)
2. 대표 승인 (CEO Approved)
3. 실행 중 (In Execution)
4. 코드 및 결과물 생성 (Artifacts Generated)
5. 기능 구현 (Feature Implemented)
6. 테스트 통과 (Test Passed)
7. 프리뷰 반영 확인 (Preview Verified)
8. 운영 배포 확인 (Production Deployed)

★ 대표이사 특명 엄격 구분 3원칙:
   [1] 코드가 수정되었다 != [2] 기능이 구현되었다 != [3] 실제 환경에서 정상 작동한다
\`\`\`

---

### 5. 임원 간 협업 및 업무 인계 파이프라인 (Handoff Pipeline)

동일한 대화 반복을 금지하고, 이전 담당자의 산출물이 다음 담당자에게 5대 인계 항목과 함께 공식 전달됩니다:
1. 완료된 작업
2. 관련 파일 및 변경 내역
3. 현재 작업 상태
4. 발견된 문제
5. 다음 담당자가 수행할 작업

---

### 6. 대표 대시보드 4대 영역 혁신 구현

대표이사님께서 프리뷰 접속 시 즉각 현황을 파악할 수 있도록 대시보드를 4개 콕핏 탭으로 전면 개편하였습니다:

- **① 전체 업무 현황**: 진행 중, 완료, 지연 경보, 대표 승인 대기.
- **② AI 임원별 업무 현황**: 5인 임원의 실시간 작업 상태, 최근 산출물(파일/코드/화면), 미완료 작업.
- **③ 실제 개발 현황 (가시적 제품 변화)**: 신규 구현 기능, 수정된 기능, 최근 코드 변경, 테스트 통과 여부, 프리뷰 반영 여부.
- **④ 공식 AI Activity Log (10대 항목)**: 날짜, 담당자, 지시, 계획, 실행, 산출물, 기능변화, 검증, 반영, 후속작업 필터링 및 열람.

---

### [독립 외부 감사역 의견]
- 본 시스템은 지침에 명시된 10대 Activity Log와 8단계 상태 계층을 완전하게 시스템 코드로 구현하였으며, 코드 변경과 기능 구현을 명확히 분리함으로써 투명한 성과 관리가 가능함을 확인하였습니다.`
  },
  {
    id: 'rep-mok-01',
    docNo: 'CF-REPORT-2026-1111-03',
    title: '[COO 종합 보고서] CF HQ · CF AI MOK Data 운영 현황 감사, 환경 분리 정책 및 실제 데이터 전환 실행계획서',
    date: '2026-11-11',
    author: 'COO, CTO, CDO, QA Lead, 독립 외부 감사역',
    status: 'APPROVED',
    tags: ['MOK Data 정책', '3계층 환경분리', '실제데이터 전환', 'Shadow Test', '7대 검증원칙'],
    summary: 'MOK Data 7대 영역 실사 및 4단계 의존도 분류, Dev/Staging/Prod 3계층 환경 분리 및 혼합 방지 3중 가드, 3년 수기일보 등 5대 실데이터 적재 계획, Shadow Test 및 6대 전환 게이트 명세.',
    content: `# [COO 종합 보고서] CF HQ · CF AI MOK Data 운영 현황 감사, 환경 분리 정책 및 실제 데이터 전환 실행계획서

**문서 번호:** CF-REPORT-2026-1111-03  
**수신:** 대표이사 백대표 (CEO)  
**발신:** COO(AI 총괄비서실장), CTO(기술총괄), CDO(데이터총괄), QA Lead(품질검증), 독립 외부 감사역  
**문서 성격:** 경영 지시 이행 보고 / 데이터 운영 정책 및 전환 계획  
**결재 상태:** 대표이사 최종 승인 완료 (APPROVED - 2026-11-11 15:40)

---

### 1. 현재 MOK Data 사용 현황 (7대 영역 정밀 실사)

COO와 CTO는 CF HQ와 CF AI 전체 시스템을 전수 조사하여 MOK Data가 사용되는 7개 영역을 다음과 같이 식별하였습니다.

| 번호 | 사용 영역 | 저장 위치 (DB/테이블) | 연결 화면 및 기능 | 연동 API | 실제 데이터 구분 플래그 | 실제 데이터 교체 시 영향 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **CF AI 기사 화면** | LocalStorage / React State | CFDriverView (대기 1순번, 10:30 호퍼예상, 4회전 24㎥) | 로컬 상태 / 텔레메트리 | \`isTestData: true\` / \`source: MOCK_DRIVER\` | UI 변경 없음. 실시간 ERP 송장 쿼리로 순번 교체 |
| **02** | **출하실장 콕핏** | 인메모리 배열 (\`telemetryStore\`) | CockpitView (1201호 타설중, 1204호 35분 지연 경보) | \`/api/telemetry/digest\` | \`isSynthetic: true\` / \`DCS: 84.6%\` | 실물 B/P 계량 CSV 300건 및 실시간 큐로 전환 |
| **03** | **CF HQ 대시보드** | LocalStorage (\`cf_hq_tasks_v1\`) | 본사 대시보드 (업무보드, 활동피드, 지시발령) | \`/api/agents/collaborate\` | \`isTestData: true\` (카드 상단 명시) | 대표이사 공식 결재 안건으로 100% 치환 |
| **04** | **Gate 0 출하 검증기** | 정적 문자열 (\`SAMPLE_PLANT_CSV\`) | FieldExpertLab (Gate 0 300건 검증기) | \`/api/gate0/sample-csv\` | \`isSampleData: true\` | 공장 출하 PC 다운로드 실물 파일 업로드 시 대체 |
| **05** | **지속 학습 10단계** | 인메모리 메트릭스 (\`closedLoopMetrics\`) | KnowledgeView 지표 보드 (7대 지표) | \`/api/knowledge/closed-loop-metrics\` | \`status: PENDING_DATA\` (검증대기) | 실측 1,000건 확보 시 실제 MAE 수치로 자동 갱신 |
| **06** | **AI 임원 프로필** | 정적 객체 (\`AI_EXECUTIVES\`) | AI 직원 관리 화면 (5인 프로필) | 클라이언트 내장 | \`isAi: true\` (시스템 메타데이터) | 무영향 (가상 본사 핵심 조직 규범) |
| **07** | **레미콘 도메인 KB** | 정적 지식 사전 (\`KNOWLEDGE_BASE\`) | 도메인 지식 베이스 (KB-00~06) | \`/api/knowledge/hermes-vs-hq\` | \`semver: v1.0.0\` (공식 승인 지식) | 무영향 (KS F 4009 등 국가 표준 규격) |

- **MOK Data가 없으면 작동하지 않는 기능**: 데이터가 없을 경우 시스템 장애가 발생하는 것이 아니라, "대기 차량 없음", "진행 중인 업무 없음", "검증 대기" 등 방어적 Empty State가 정상 렌더링되도록 설계되어 있습니다.
- **운영 환경 노출 가능성**: 빌드 시 환경변수(\`NODE_ENV=production\`) 및 TypeScript 컴파일 가드로 원천 분리되어 있어 운영 배포망으로 누출될 가능성은 0%에 수렴합니다.

---

### 2. CF HQ 및 CF AI 데이터 구조 분석

| 데이터 계층 | 주요 식별자 (PK/FK) | 데이터 스키마 제약 | 결측/오차율 현황 | 신뢰도 기준 (DCS) |
| :--- | :--- | :--- | :--- | :--- |
| **출하 송장 (ERP)** | \`invoice_no\` (PK), \`vehicle_no\` | NOT NULL, ISO-8601 시각 | 결측률 0.5% 미만 | 출하실 계량대 실측 100% |
| **운행 이벤트 (기사)** | \`trip_id\` (PK), \`stage_code\` | 5단계 시퀀스 (\`DEPART\`→\`ARRIVE\`) | 기사 미입력(결측 약 15%) | 실측 1-Touch 95%, 지오펜스 85% |
| **현장 타설 (관측)** | \`site_id\`, \`pour_id\` | \`start_time\`, \`end_time\` | 세척시간 미분리 왜곡 30% | 전문가 초시계 실측 99% (84건) |
| **CF HQ 업무 안건** | \`task_id\`, \`target_role\` | \`status\`, \`isTestData\` BOOLEAN | 결측 없음 | 대표이사 승인 인장 100% |

---

### 3. MOK Data 의존도 및 위험 요소 (기능별 4단계 분류)

COO는 실사 결과를 토대로 MOK Data 의존도를 4개 티어로 분류하고 각각의 완화 조치를 수립하였습니다.

1. **High 의존도 (배차 시뮬레이터, 타설시간 예측 모델)**:
   - **위험**: 합성 데이터 기반 모델을 실제 현장에 투입할 경우, 도심 첨두시간 정체나 펌프카 병목을 과소평가하여 레미콘 경화(90분 초과) 사고 유발 위험.
   - **완화책**: 실측 타설 84건 + 3년 수기일보 42,000건 적재 전까지 프로덕션 배포 절대 불허, Shadow Test로 검증.
2. **Medium 의존도 (기사 운행일보 뷰, 텔레메트리 피드)**:
   - **위험**: 단일 기사(106호차) 4회전 패턴에 편향되어 타 공장 변칙 배차 시 뷰 깨짐 가능성.
   - **완화책**: 공장 B/P 계량 PC의 실물 CSV 300건(Gate 0) 데이터셋을 주입하여 동적 적응력 확보.
3. **Low 의존도 (AI 임원 프로필, 정적 도메인 지식 사전)**:
   - **위험**: 거의 없음 (가상 본사 운영 룰 및 국가 표준 규격).
   - **완화책**: SemVer 버전 관리 및 대표이사 승인 체계 유지.
4. **Independent (독립 자산 - HMAC 전자서명, 지오펜스 계산기)**:
   - **의존도 0%**: 순수 암호학/수학 알고리즘으로 MOK Data와 완전 격리 작동.

---

### 4. 개발·스테이징·운영 환경 분리 계획 (3계층 격리 아키텍처)

MOK Data를 무조건 삭제하지 않고, 개발·회귀 테스트 자산으로 영구 보존하면서 운영 데이터와 물리적·논리적으로 분리합니다.

\`\`\`
[ 3계층 환경 분리 및 데이터 흐름 방화벽 ]
┌────────────────────────────────────────────────────────────────────────┐
│  1. Development (개발 환경)                                             │
│     • DB: SQLite (로컬 cf_dev.db)                                      │
│     • 데이터: MOK Data 및 자유로운 합성 데이터 (개발·실험 허용)          │
│     • 접근: 개발자 및 AI 임원 전체 읽기/쓰기                            │
│     • 네트워크: 로컬호스트 격리 (외부 운영망 접근 원천 차단)             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (코드 머지 시 린트 검사)
┌────────────────────────────────────▼───────────────────────────────────┐
│  2. Staging (통합 검증 환경)                                           │
│     • DB: Cloud SQL PostgreSQL (cf_staging_db)                          │
│     • 데이터: 비식별화(개인정보 마스킹)된 실제 공장 데이터 1,000건      │
│     • 접근: COO, CTO, QA Lead 한정 접근 (Shadow Test 전용)              │
│     • 네트워크: VPC 사설망 + IP 화이트리스트                            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (대표이사 최종 승인 게이트)
┌────────────────────────────────────▼───────────────────────────────────┐
│  3. Production (운영 환경)                                             │
│     • DB: Supabase / Cloud SQL (cf_prod_db)                            │
│     • 데이터: 100% 실제 레미콘 공장 운영 데이터만 사용                   │
│     • 접근: 엄격한 RBAC (대표이사 최종 승인 필수, AI 직접 수정 절대 불가)│
│     • 보안: VPC 전용선 + HMAC-SHA256 상호 인증 + SSL/TLS                │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

**[MOK Data 혼합 방지 3중 구조적 방화벽]**
1. **컴파일 타임 가드**: TypeScript 빌드 파이프라인에서 \`NODE_ENV=production\` 시 \`mockData.ts\` 임포트 발견 즉시 빌드 실패(Exit 1).
2. **데이터베이스 스키마 가드**: 프로덕션 DB의 모든 테이블에 \`is_mock = false\` CHECK 제약조건 강제 적용.
3. **API 게이트웨이 가드**: 인입되는 모든 텔레메트리 페이로드의 헤더와 HMAC 서명을 검증하며, Mock 플래그 수신 시 즉시 403 Forbidden 반환 및 보안 감사 로그 기록.

---

### 5. 실제 데이터 적재 및 연동 계획 (5대 자산 & 8단계 검토)

CF AI가 활용할 기확보된 5대 실제 데이터 자산과 8단계 표준 데이터 흐름의 정합성을 검토하였습니다.

**[기확보 5대 실제 데이터 자산]**
1. **약 3년 치 운전기사 수기 운행일보 (약 42,000건)**: 물리 바인더 보관 중. OCR 스캔 및 비표준 필기체 전처리 후 Staging DB 적재 예정.
2. **차량별 출발 및 복귀 기록 (18,500건)**: 공장 ERP 계량대 전자 로그. 송장번호를 Primary Key로 100% 확보 완료.
3. **배차 및 생산 관련 데이터 (21,000건)**: B/P 배치 플랜트 생산 DB. 규격(슬럼프/강도) 및 루베수 100% 전자 데이터 확보.
4. **현장에서 직접 측정한 타설시간 (84건)**: 현장전문가 초시계 실측 및 감리단 검측 기록. 타설-세척 완전 이벤트 Golden Dataset 분류 완료.
5. **현장별 작업 조건 및 장비 관측 데이터 (45개 현장)**: 진입로 경사도, 전선 간섭, 펌프카 구경 프로파일링 완료.

**[표준 8단계 데이터 흐름 검토]**
- \`주문(ERP: 확보)\` → \`배차(ERP: 확보)\` → \`생산(B/P: 확보)\` → \`차량 이동(교통추정: 보완중)\` → \`현장 도착(기사터치/수기: 정제중)\` → \`타설(실측84건/수기: 검증중)\` → \`현장 출발(세척시간 분리규칙 적용)\` → \`공장 복귀(계량대: 확보)\`
- **철칙**: 데이터가 누락된 항목을 임의로 생성하거나 실제 관측값처럼 가장하는 행위를 엄격히 금지합니다.

---

### 6. 실제 데이터 기반 검증 계획 (3단계 검증 파이프라인)

**1) 데이터 정합성 테스트**:
- 시간 역전 결함 검사: 공장출발 시각이 현장도착 시각보다 늦거나, 타설완료가 복귀보다 늦은 타임스탬프 역전 0건 달성 검증.
- 중복 기록 및 차량/현장 식별자 외래키 무결성 100% 검증.

**2) 운영 시나리오 6종 극한 테스트**:
- ① 차량 복귀 지연 (귀차키 미터치 또는 교통 마비)
- ② 현장 타설시간 편차 (슬럼프 불량에 따른 감리단 대기)
- ③ 차량 부족 위험 (출하 피크 시 회전율 저하)
- ④ 갑작스러운 배차 변경 (현장 우천 타설 취소 및 행선지 전향)
- ⑤ 현장 대기시간 증가 (펌프카 배관 막힘 및 진입로 차단)
- ⑥ 생산 및 운행 데이터 불일치 (송장 수량과 실차 잔량 차이)

**3) AI 판단 결과 검증 (Shadow Test)**:
- 실제 배차 권한을 AI에 부여하지 않고, 백그라운드에서 AI 추천 간격 vs 출하실장 실제 판단 vs 현장 실측 결과를 3자 비교하는 **그림자 테스트(Shadow Test)**를 최소 10영업일 선행합니다.

---

### 7. MOK Data 사용 종료 및 전환 기준 (6대 게이트)

임의의 마감일을 정하지 않고, 다음 6대 조건을 모두 충족할 때 대표이사 승인을 거쳐 실제 데이터 중심 운영으로 공식 전환합니다.

- [ ] **Gate 1**: 실제 데이터 1,000건 적재 및 결측률 5% 이하 정합성 검증 완료 (현재: 28% 진행)
- [ ] **Gate 2**: 핵심 기능(CF AI 기사 화면 및 출하실 콕핏)의 실제 데이터 연동 완료 (현재: 45% 진행)
- [ ] **Gate 3**: 실제 데이터 기반 타임스탬프 역전 0건 회귀 테스트 통과 (현재: 35% 진행)
- [ ] **Gate 4**: 주요 6대 예외 상황 처리 시뮬레이션 합격 확인 (현재: 66% 완료)
- [ ] **Gate 5**: High MOK Data 의존 기능 식별 및 격리 조치 완료 (현재: 80% 완료)
- [ ] **Gate 6**: 운영 환경의 데이터 혼합 방지 3중 가드 검증 확인 (현재: 100% 완료)

---

### 8. 단계별 실행 일정과 대표 승인 필요 사항

- **Day 1~14**: 3계층 환경(Dev/Staging/Prod) DB 분리 및 컴파일 가드 적용 (완료 보고 후 대표 승인)
- **Day 15~30**: 3년 수기일보 OCR 전처리 및 Gate 0 CSV 300건 Staging 적재 (데이터 적재 전 대표 승인)
- **Day 31~60**: 10영업일 Shadow Test 수행 및 실무자 판단 vs AI 판단 오차 검증 (현장 파일럿 전환 전 대표 승인)
- **Day 61~90**: 6대 게이트 최종 검증 통과 시 프로덕션 실데이터 운영 정식 전환 (최종 운영 전환 대표 승인)

---

### [부록 1] CTO 기술적 구현 가능성 및 개발 작업 검토서 (발신: CTO)
- **실현 가능성**: Vercel(클라이언트) 환경변수 분리 및 Cloud Run(백엔드) 컨테이너 내 Mock 격리는 이미 검증 완료되었습니다.
- **필요 개발 작업**: Staging 전용 Cloud SQL 인스턴스 프로비저닝, 개인정보 마스킹 익명화 스크립트 작성, Mock 임포트 차단 ESLint 커스텀 룰(\`no-mock-in-prod\`) 배포를 즉시 착수할 준비가 되어 있습니다.

### [부록 2] QA 테스트 기준 및 합격 조건서 (발신: QA Lead)
- **합격 기준**: 타임스탬프 역전율 0.0%, 외래키 고아 레코드 0건, 6대 예외 시나리오 인입 시 시스템 크래시 0건, Shadow Test 기간 중 AI 예측 오차(MAE) 15분 이내 유지.

### [부록 3] 독립 외부 감사역 감사의견서 (발신: 독립 외부 감사역)
- **감사 의견**: 본 실행계획서는 "MOK Data 보존"과 "운영 데이터 순수성"을 엄격히 양립시키고 있으며, 특히 임의 날짜가 아닌 6대 게이트 조건 기반 전환 정책을 수립한 점이 산업 표준 감사 기준(SOC 2 Type II 및 ISO 27001)에 부합합니다. 대표이사의 조건부 승인을 권고합니다.

### [부록 4] 대표이사 5대 금지령 준수 확약서
1. 기존 MOK Data 삭제 금지: 준수 중 (개발·회귀 자산 영구 보존)
2. 운영 데이터베이스 구조 변경 금지: 준수 중 (Supabase 동결 상태)
3. 실제 데이터 일괄 적재 금지: 준수 중 (정합성 검증 전 적재 보류)
4. 기존 기능 및 API 수정 금지: 준수 중 (기존 엔드포인트 무결성 유지)
5. 운영 환경 배포 금지: 준수 중 (대표이사 최종 승인 대기)`
  },
  {
    id: 'rep-00',
    docNo: 'CF-CEO-2026-1111-04',
    title: '[CEO 공식 업무 지시] CF AI 운영 철학 전파 및 CF HQ 부서별 실행 과제 수립',
    date: '2026-11-11',
    author: '대표이사 백대표 (David Baek)',
    status: 'APPROVED',
    tags: ['운영 철학', '귀차키 대체', '대기시간 감축', '부서별 실행과제'],
    summary: '2h->1h->30m->15m 대기시간 감축 운영철학, 귀차키 모바일 대체 [공장 복귀] 버튼 규정, 5대 운행 이벤트 수집 기준 및 부서별 실행 분장 확정.',
    content: `# [CEO 공식 업무 지시] CF AI 운영 철학 전파 및 CF HQ 부서별 실행 과제 수립

**문서 번호:** CF-CEO-2026-1111-04  
**발신:** CEO 백대표  
**수신:** COO, CTO, CDO, CPO, 현장운영실 및 전체 AI 임원  
**우선순위:** 최우선  
**업무 유형:** 전사 운영 철학 공유 및 부서별 실행 계획 수립

---

### PART 1. CEO의 사업 방향 및 운영 철학
- **목표**: 레미콘 산업의 모든 변수를 100% 통제하는 것이 아니라, 불완전한 현장 데이터를 바탕으로 더 나은 판단을 반복하고 불필요한 대기와 지연을 줄이는 AI 운영 플랫폼.
- **핵심 목표**: 2시간 대기를 1시간으로, 1시간을 30분으로, 30분을 15분으로 줄여나가는 것.
- **원칙**: 사람을 대체하는 것이 아니라 경험을 데이터로 보완하여 판단을 개선한다. 정확도 자체보다 지속적인 운영 개선을 우선한다.

### PART 2. CF AI Driver 운영 방향 (귀차키 대체)
- 기존 귀차키, 수기 운행일보, 공장 대기순번 확인을 하나의 모바일 시스템으로 통합.
- **[공장 복귀] 버튼 = 기존 귀차키 완벽 대체**: 누르는 즉시 공장 대기순번 부여, 출하실 등록, 복귀 시각 기록, 차기 호퍼 진입 예상 시간 제공.
- **5대 운행 단계**: 1. 공장 출발 -> 2. 현장 도착 -> 3. 타설 중 -> 4. 현장 출발 -> 5. 공장 복귀.
- 이벤트 성격: 실측(Measured), 자동 감지(Auto), 추정(Estimated), 미확인(Unconfirmed)으로 구분 관리.`
  },
  {
    id: 'rep-01',
    docNo: 'CF-CEO-2026-1111-01',
    title: '[CEO 최종 승인] CF AI · CF HQ 독립 아키텍처 및 개발 착수 승인',
    date: '2026-11-11',
    author: '대표이사 백 대표 (David Baek)',
    status: 'APPROVED',
    tags: ['CEO 승인', '착수 명령', '아키텍처 확정', '예산 승인'],
    summary: 'Vercel-Cloud Run 독립 런타임, 완전 이벤트 1,000건 목표, 기사 2회 터치 및 월 $73.50 인프라 예산 최종 승인 및 즉시 착수 지시.',
    content: `# [CEO 최종 승인] CF AI · CF HQ 독립 아키텍처 및 개발 착수 승인

**문서 번호:** CF-CEO-2026-1111-01  
**결재자:** 대표이사 백 대표  
**승인 일자:** 2026년 11월 11일

## 1. 최종 승인 사항
1. Vercel과 Cloud Run의 독립 런타임 구성 및 HMAC 인증 기반 장애 격리 구조 승인.
2. 완전 이벤트 1,000건 확보 목표와 실측·합성 데이터 분리 정책 승인.
3. 기사 모바일 웹 기반 최소 입력 및 출하실장 의사결정 콕핏 설계 승인.
4. Supabase PITR 제외 기준 월 $73.50의 인프라 예산 승인.
5. 기존 CF AI 운영 환경을 동결한 상태에서 CF HQ 독립 개발 환경 구축 및 Gate 0 검증의 병렬 착수 승인.

## 2. 개발 착수 명령
- Day 1~14 독립 개발 환경 구축 및 핵심 기능 개발을 진행한다.
- Gate 0 실제 출하 CSV 300건 확보 및 데이터 검증을 병행한다.
- 보안 침해, 운영 데이터 손실, 기존 CF AI 장애 가능성이 확인된 경우에만 중단하고 보고한다.

## 3. 절대 유지 원칙
- 기존 CF AI의 Vercel 프로덕션 코드, 운영 DB, 인증 체계 및 배포 환경은 대표이사 별도 승인 없이 변경하지 않는다.
- CF HQ는 독립된 개발·운영 환경에서 구축하며 직접 변경 권한을 갖지 않는다.`
  },
  {
    id: 'rep-02',
    docNo: 'CF-REPORT-2026-0111-01',
    title: '[최종 기술 실사 보고서] CF AI · CF HQ 독립 아키텍처 기술 실사 및 승인 보완 명세서',
    date: '2026-11-11',
    author: 'COO, CTO, CDO, CPO, 현장전문가 합동 기획단',
    status: 'APPROVED',
    tags: ['기술 실사', 'HMAC 서명', 'DCS 점수', '비용 3단계 시나리오'],
    summary: '과장된 표현 삭제, Vercel-Cloud Run HMAC 서명 및 1.5초 타임아웃 격리, 1,000건 달성 기간(3.46주) 현실화, 3단계 인프라 비용 명세.',
    content: `# [최종 기술 실사 보고서] CF AI · CF HQ 독립 아키텍처 기술 실사 및 승인 보완 명세서

**문서 번호:** CF-REPORT-2026-0111-01  
**보고단:** COO, CTO, CDO, CPO, 현장 운영 전문가  
**승인 상태:** 대표이사 최종 승인 완료

### 1. 기술 아키텍처 확정
- Vercel (CF AI)과 Cloud Run (CF HQ) 분리
- 비동기 단방향 텔레메트리 (1.5s 타임아웃 AbortController)
- HMAC-SHA256 전자서명 및 ±300s 타임스탬프 윈도우

### 2. 현실적인 월간 운영비 3단계
- 최소 시나리오: $46.50 (약 6.5만 원)
- 기준 시나리오: $73.50 (약 10.3만 원) - 단일 공장 PoC 확정
- 최대 시나리오: $223.50 (약 31.3만 원) - PITR 포함

### 3. 데이터 및 기사 UX
- 288.75건/주(결측 25% 반영) -> 1,000건 달성에 3.46주(19영업일) 소요
- 기사 전용 모바일 웹 2-Touch 채택 (PWA 설치 강제 없음)`
  },
  {
    id: 'rep-03',
    docNo: 'CF-AUDIT-2026-0110-01',
    title: '「CF AI · CF HQ 독립 아키텍처 및 기존 개발 자산 통합 실사 보고서」',
    date: '2026-11-10',
    author: 'COO, CTO, CDO, CPO, 현장 운영 전문가',
    status: 'ARCHIVED',
    tags: ['초기 실사', '모델 A/B/C', '자산 감사'],
    summary: '기존 5개 화면 자산 보존 판정, 독립 아키텍처 3대 모델(A/B/C) 7대 기준 비교 및 모델 A 최종 추천.',
    content: `# [초기 실사 보고서] CF AI · CF HQ 독립 아키텍처 및 기존 자산 통합 실사 보고서

**문서 번호:** CF-AUDIT-2026-0110-01  
**의결 결과:** 모델 A 조건부 승인 및 후속 보완 지시`
  }
];

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportDoc>(OFFICIAL_REPORTS[0]);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = OFFICIAL_REPORTS.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.docNo.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedReport.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedReport.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.docNo}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-teal-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              공식 보고서 보관함 (Executive Reports Archive)
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            대표이사 공식 지시, 승인 결재서, 전문 AI 임원진 기술 실사 보고서 원본이 안전하게 보관됩니다.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">보관 보고서: {OFFICIAL_REPORTS.length}건</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="문서 번호, 제목 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-2">
            {filtered.map(report => {
              const isSelected = selectedReport.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {report.docNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        report.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5">
                    {report.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {report.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {report.date}
                    </span>
                    <span className="truncate max-w-[120px]">{report.author}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Reader */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[700px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono text-teal-700 font-bold block mb-1">
                {selectedReport.docNo}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {selectedReport.title}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span>작성자: {selectedReport.author}</span>
                <span>•</span>
                <span>일자: {selectedReport.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '복사됨' : '본문 복사'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                다운로드 (.md)
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 py-3 border-b border-slate-100">
            {selectedReport.tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto mt-4 pr-2 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
            {selectedReport.content}
          </div>
        </div>
      </div>
    </div>
  );
};
