import React, { useState, useEffect } from 'react';
import {
  FolderArchive,
  BookOpen,
  Truck,
  ShieldCheck,
  Clock,
  Layers,
  FileText,
  Search,
  ExternalLink,
  GitBranch,
  RefreshCw,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  Lock,
  Plus,
  ShieldAlert,
  Scale,
  ListFilter,
  CheckSquare,
  XCircle
} from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'kb-00',
    category: 'CEO 운영 철학',
    title: '불완전한 현장 데이터 속에서 더 나은 판단을 반복하는 AI (CF-CEO-2026-1111-04)',
    summary: '2시간 대기를 1시간으로, 30분으로, 15분으로 줄이는 점진적 개선과 귀차키 모바일 대체 철학.',
    content: `### 1. ConcreteFlow AI의 궁극적 목표
- 100% 완벽한 예측을 주장하지 않습니다.
- 불완전하고 다양한 변수가 존재하는 실제 현장 데이터를 바탕으로 더 나은 판단을 반복하고, 불필요한 대기와 지연을 지속적으로 줄여나가는 AI 운영 플랫폼입니다.
- **핵심 목표**: 2시간 대기를 1시간으로, 1시간을 30분으로, 30분을 15분으로 줄여나가는 것.

### 2. 사람을 대체하지 않고 판단을 개선한다
- 출하실장의 경험을 데이터로 보완하여 배차 부담을 덜어줍니다.
- 정확도 수치 자체가 최종 목적이 아니며, 실제 현장 운영 개선 효과가 핵심입니다.

### 3. 귀차키의 모바일 대체: [공장 복귀] 버튼
- 기존 믹서트럭 기사들이 출하실에 차량 복귀를 알리기 위해 꽂던 '귀차키'를 스마트폰 [공장 복귀] 버튼 1터치로 대체합니다.
- 복귀 즉시 대기순번 자동 부여, 출하실 콕핏 등록, 차기 호퍼 진입 예상 시각 제공.`
  },
  {
    id: 'kb-01',
    category: '운행 이벤트',
    title: '6대 핵심 운행 이벤트 정의 및 세척 시간(10~20분) 물리적 특성',
    summary: '타설 완료와 현장 출발 사이의 호스 물청소 및 믹서 세륜 작업 시간 분리 규정.',
    content: `### 1. 6대 운행 이벤트 표준 명세
- **① 공장 출발 (Plant Departure)**: 출하 계량대 통과 및 종이 송장 자동 발행 시각 (ERP 자동).
- **② 현장 도착 (Site Arrival)**: 건설 현장 게이트 진입 후 안전 정차 시 기사 1차 터치.
- **③ 타설 시작 (Pouring Start)**: 펌프카 호퍼에 슈트 정렬 후 레버 가동 직전 (통계 추정).
- **④ 타설 완료 (Pouring End)**: 믹서트럭 드럼 내부 잔류 콘크리트 완전 배출 직후 기사 2차 터치.
- **⑤ 현장 출발 (Site Departure)**: 슈트 물청소 및 바퀴 세륜 완료 후 도로 진입 전 정차 시각.
- **⑥ 공장 복귀 (Plant Return)**: 레미콘 공장 정문 통과 (지오펜스 또는 차기 송장 연동).

### 2. 세척 시간(Washout Interval) 분리의 중요성
- 타설 완료 직후 레미콘 차량은 바로 출발할 수 없습니다.
- 드럼 내벽과 호퍼에 남은 잔류 콘크리트가 굳지 않도록 현장 전용 세척장에서 물청소(호스 세척)를 진행해야 합니다.
- 또한 현장 출구 세륜기(Wheel Washer)를 통과하여 도로에 흙탕물이 묻어나가지 않도록 조치해야 합니다.
- 이 과정에 **통상 10~20분의 불가피한 지연**이 발생하므로, 이를 '현장 타설 시간'이나 '순수 도로 주행 시간'에 합산하면 데이터가 심각하게 왜곡됩니다.`
  },
  {
    id: 'kb-02',
    category: '믹서트럭 제원',
    title: '레미콘 믹서트럭 표준 제원 및 콘크리트 화학적 특성',
    summary: '6㎥(루베) 정량, 슬럼프(15~21cm) 잔여시간 90분 초과 시 경화 위험성.',
    content: `### 1. 믹서트럭 용량 및 규격
- 대한민국 표준 믹서트럭 용량: **6.0㎥ (루베)**
- 콘크리트 비중: 약 2.3~2.4 ton/㎥ (6㎥ 만차 시 화물 중량 약 14톤)
- 총중량(차량 포함): 약 26~28톤

### 2. 콘크리트 슬럼프 및 90분 골든타임
- **슬럼프(Slump)**: 반죽의 질기(유동성). 통상 15cm, 18cm, 21cm 적용.
- **90분 원칙 (KS F 4009)**:
  - 레미콘은 배합(B/P 생산) 후 **최대 90분 이내**에 타설을 완료해야 합니다.
  - 90분을 초과하면 수화 반응으로 인해 굳기 시작하며, 강도가 급격히 저하되어 감리단이 타설을 불허(현장 회차)합니다.
  - CF AI의 출하실장 콕핏은 **출하 70분 경과 시점부터 주황색/빨간색 경보**를 발령합니다.`
  },
  {
    id: 'kb-03',
    category: '법적 요건',
    title: '운전기사 위치정보 수집 및 개인정보보호법 가이드라인',
    summary: '상시 GPS 추적 배제 및 버튼 클릭 시점(Point-in-Time) 단발성 좌표 수집의 법적 적합성.',
    content: `### 1. 위치정보사업자 규제 회피 방안
- 24시간 실시간 백그라운드 GPS 위치 추적은 운송차주회의 극심한 반발과 함께 방송통신위원회 '위치정보사업자' 신고 및 까다로운 개인정보 암호화 규제를 받습니다.
- CF AI는 **'버튼을 누르는 바로 그 시점(Point-in-Time)'에만 단발성으로 위도/경도를 조회**하여 반경 500m 이내 현장 여부만 검증합니다.
- 따라서 불필요한 개인 감시 소지를 원천 차단하고 기사 동의 획득률을 극대화할 수 있습니다.

### 2. 필수 동의 항목
- 목적: 레미콘 현장 도착 및 타설 완료 타임스탬프 검증
- 수집 항목: 차량번호, 버튼 조작 시각, 조작 시점의 단발성 GPS 좌표
- 보유 기간: 실증 기간 종료 및 월말 정산 대조 완료 즉시 폐기`
  }
];

export const KnowledgeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SEPARATION' | 'CLOSED_LOOP' | 'MOK_POLICY' | 'ARTICLES' | 'MIGRATION'>('MOK_POLICY');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle>(KNOWLEDGE_BASE[0]);
  const [search, setSearch] = useState('');

  // API State
  const [closedLoopData, setClosedLoopData] = useState<any>(null);
  const [closedLoopError, setClosedLoopError] = useState<string | null>(null);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteMsg, setPromoteMsg] = useState('');

  // MOK Data Policy State
  const [dataPolicyAudit, setDataPolicyAudit] = useState<any>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [activePolicySubTab, setActivePolicySubTab] = useState<'INVENTORY' | 'ENVIRONMENTS' | 'REAL_DATA' | 'VERIFICATION' | 'SHADOW_TEST' | 'GATES'>('INVENTORY');
  
  // Section 7: AI Executive Verification Checkpoint Test State
  const [selectedExecRole, setSelectedExecRole] = useState<'COO' | 'CTO' | 'CDO' | 'CPO' | 'FIELD_EXPERT' | 'QA'>('CTO');
  const [taskTitleInput, setTaskTitleInput] = useState('Staging Cloud SQL DB 프로비저닝 및 개인정보 마스킹 파이프라인');
  const [checkMokTested, setCheckMokTested] = useState(true);
  const [checkRealTested, setCheckRealTested] = useState(false);
  const [checkCodeChanged, setCheckCodeChanged] = useState(true);
  const [checkFeatureImpl, setCheckFeatureImpl] = useState(true);
  const [checkTestPassed, setCheckTestPassed] = useState(true);
  const [checkPreviewVerified, setCheckPreviewVerified] = useState(true);
  const [checkProdDeployed, setCheckProdDeployed] = useState(false);
  const [checkpointResult, setCheckpointResult] = useState<any>(null);
  const [isEvaluatingCheck, setIsEvaluatingCheck] = useState(false);

  // Shadow Test State
  const [shadowIntervalInput, setShadowIntervalInput] = useState(12);
  const [shadowTestResult, setShadowTestResult] = useState<any>(null);
  const [isShadowRunning, setIsShadowRunning] = useState(false);

  // Schema Export Preview state (external AI agents not connected in Phase 1)
  const [migrationEngine, setMigrationEngine] = useState<'CLAUDE_35' | 'GPT_4O' | 'GEMINI_FLASH'>('CLAUDE_35');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationOutput, setMigrationOutput] = useState<string | null>(null);

  const fetchClosedLoop = async () => {
    setClosedLoopError(null);
    try {
      const res = await fetch('/api/knowledge/closed-loop-metrics');
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setClosedLoopData(data);
    } catch (err: any) {
      setClosedLoopData(null);
      setClosedLoopError(`지속 학습 API(/api/knowledge/closed-loop-metrics) 조회 실패: ${err?.message || '연결 오류'}`);
    }
  };

  const fetchDataPolicyAudit = async () => {
    setAuditError(null);
    try {
      const res = await fetch('/api/data-policy/audit');
      const data = await res.json();
      if (!res.ok || !data.ok || !data.data) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setDataPolicyAudit(data.data);
    } catch (err: any) {
      setDataPolicyAudit(null);
      setAuditError(`MOK 정책 감사 API(/api/data-policy/audit) 조회 실패: ${err?.message || '연결 오류'}`);
    }
  };

  useEffect(() => {
    fetchClosedLoop();
    fetchDataPolicyAudit();
  }, []);

  const handleEvaluateCheckpoint = async () => {
    setIsEvaluatingCheck(true);
    try {
      const res = await fetch('/api/data-policy/verify-checkpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedExecRole,
          taskTitle: taskTitleInput,
          checkpoints: {
            mokDataTested: checkMokTested,
            realDataTested: checkRealTested,
            codeChanged: checkCodeChanged,
            featureImplemented: checkFeatureImpl,
            testPassed: checkTestPassed,
            previewVerified: checkPreviewVerified,
            productionDeployed: checkProdDeployed
          }
        })
      });
      const data = await res.json();
      setCheckpointResult(data);
    } catch (e: any) {
      console.warn('Checkpoint evaluation failed', e);
    } finally {
      setIsEvaluatingCheck(false);
    }
  };

  const handleRunShadowTest = async () => {
    setIsShadowRunning(true);
    try {
      const res = await fetch('/api/data-policy/shadow-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: 'SHADOW-EXP-01',
          plantId: 'PLANT-SEOUL-01',
          vehicleNo: '서울82사1204',
          siteName: '강남구 대치동 은마 B동',
          baseInterval: shadowIntervalInput
        })
      });
      const data = await res.json();
      setShadowTestResult(data);
    } catch (e: any) {
      console.warn('Shadow test failed', e);
    } finally {
      setIsShadowRunning(false);
    }
  };

  const handlePromoteRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) return;
    setIsPromoting(true);
    setPromoteMsg('');
    try {
      const res = await fetch('/api/knowledge/promote-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newRuleTitle.trim(), approvedBy: '대표이사 백 대표' })
      });
      const data = await res.json();
      if (data.ok) {
        setPromoteMsg(`성공: [${data.rule.semver}] 공식 산업 지식 승격 완료`);
        setNewRuleTitle('');
        fetchClosedLoop();
      }
    } catch (e: any) {
      setPromoteMsg(`실패: ${e.message}`);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleRunMigrationTest = () => {
    setIsMigrating(true);
    setMigrationOutput(null);
    const sampleExport = {
      previewType: 'SCHEMA_EXPORT_PREVIEW_ONLY',
      externalAgentConnected: false,
      exportedAt: new Date().toISOString(),
      targetSchemaProfile: migrationEngine,
      cfHqVersion: closedLoopData?.version || 'API_UNAVAILABLE',
      verifiedKnowledgeRulesCount: Array.isArray(closedLoopData?.rules) ? closedLoopData.rules.length : 0,
      industryRules: closedLoopData?.rules || [],
      note: '1단계에서는 Hermes/Claude/GPT 외부 에이전트 실제 교체·연동을 수행하지 않습니다. 본 출력은 현재 인메모리 지식 규칙의 JSON 내보내기 구조 미리보기입니다.'
    };
    setMigrationOutput(JSON.stringify(sampleExport, null, 2));
    setIsMigrating(false);
  };

  const filtered = KNOWLEDGE_BASE.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.summary.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderArchive className="w-5 h-5 text-teal-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              지속 학습 및 공식 산업 지식 플랫폼 (Continuous Learning & Knowledge)
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            CEO 지시(CF-CEO-2026-1111-03) 반영: Hermes 에이전트 경험과 CF HQ 공식 산업 지식의 완전 분리 및 폐쇄형 성능 개선 체계.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
            지식 버전: {closedLoopData?.version || '미조회'}
          </span>
        </div>
      </div>

      {(closedLoopError || auditError) && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2">
          {closedLoopError && (
            <div className="flex items-center justify-between gap-3 font-semibold">
              <span>{closedLoopError} (MOK 데이터로 대체하지 않음)</span>
              <button
                onClick={fetchClosedLoop}
                className="px-2.5 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
              >
                재조회
              </button>
            </div>
          )}
          {auditError && (
            <div className="flex items-center justify-between gap-3 font-semibold">
              <span>{auditError} (MOK 데이터로 대체하지 않음)</span>
              <button
                onClick={fetchDataPolicyAudit}
                className="px-2.5 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
              >
                재조회
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {[
          { id: 'MOK_POLICY' as const, label: 'MOK Data 정책 및 3계층 환경 분리 (Dev/Staging/Prod)', icon: Layers },
          { id: 'SEPARATION' as const, label: '요구사항 ① Hermes 메모리 vs CF HQ 지식 분리', icon: GitBranch },
          { id: 'CLOSED_LOOP' as const, label: '요구사항 ② 10단계 폐쇄형 성능 개선 측정', icon: TrendingUp },
          { id: 'MIGRATION' as const, label: '에이전트 교체 마이그레이션 검증', icon: Cpu },
          { id: 'ARTICLES' as const, label: '공식 레미콘 도메인 지식 베이스', icon: BookOpen }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Tab 0: MOK Data Policy & Tri-Environment Separation */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'MOK_POLICY' && (
        <div className="space-y-6">
          {/* CEO Policy Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 border border-indigo-500/30 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>CF HQ · CF AI MOK Data 운영 정책 및 실제 데이터 전환 체계</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-mono">
                      CF-REPORT-2026-1111-03
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    "보여지는 완성도보다 실제 작동하는 신뢰성을 우선한다" — MOK Data 무조건 폐기 금지, 3계층 환경 분리 및 6대 게이트 전환.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  5대 금지령 준수 중 (COMPLIANT)
                </span>
              </div>
            </div>

            {/* 5 CEO Prohibition Status */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-700/60 text-[11px]">
              {dataPolicyAudit?.ceoProhibitions?.map((p: any, i: number) => (
                <div key={i} className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/80 space-y-0.5">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="truncate">{p.rule}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{p.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 overflow-x-auto">
            {[
              { id: 'INVENTORY' as const, label: '1. MOK Data 7대 영역 실사 & 의존도', icon: Database },
              { id: 'ENVIRONMENTS' as const, label: '2. Dev/Staging/Prod 3계층 & 3중 가드', icon: Layers },
              { id: 'REAL_DATA' as const, label: '3. 5대 실데이터 자산 & 8단계 흐름', icon: FileText },
              { id: 'VERIFICATION' as const, label: '4. 7대 실무 검증 기록기 (Section 7)', icon: CheckSquare },
              { id: 'SHADOW_TEST' as const, label: '5. Shadow Test (3자 비교)', icon: Scale },
              { id: 'GATES' as const, label: '6. 6대 전환 게이트 현황', icon: TrendingUp }
            ].map(sub => {
              const isSubActive = activePolicySubTab === sub.id;
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActivePolicySubTab(sub.id as any)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-teal-600" />
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Sub-Tab 1: Inventory & Dependency Classification */}
          {activePolicySubTab === 'INVENTORY' && (
            <div className="space-y-6">
              {/* 7 Core Areas Table */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-teal-600" />
                    CF HQ & CF AI MOK Data 전수 실사 현황 (7대 영역)
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                    전수 조사 완료 (7/7)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">사용 영역</th>
                        <th className="py-2.5 px-3">저장 위치 (DB/테이블)</th>
                        <th className="py-2.5 px-3">연결 화면 및 기능</th>
                        <th className="py-2.5 px-3">구분 플래그</th>
                        <th className="py-2.5 px-3">실제 데이터 교체 시 영향</th>
                        <th className="py-2.5 px-3">운영 누출 위험</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {dataPolicyAudit?.inventory?.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">{item.area}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{item.storageLocation}</td>
                          <td className="py-3 px-3 text-slate-800">{item.connectedUi}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 font-semibold">
                              {item.separationFlag}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">{item.replacementImpact}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.productionLeakRisk.includes('없음') || item.productionLeakRisk.includes('낮음') || item.productionLeakRisk.includes('차단')
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {item.productionLeakRisk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4-Tier Dependency Classification */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-indigo-600" />
                  MOK Data 의존도 4단계 분류 및 완화 대책 (Dependency Matrix)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* High */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300">
                        1. High 의존도 (엄격 격리 필수)
                      </span>
                      <span className="text-[11px] font-bold text-rose-700">실측 검증 전 운영 배포 불가</span>
                    </div>
                    {dataPolicyAudit?.dependencyClassification?.high?.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-rose-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">• {d.feature}</span>
                        <p className="text-[11px] text-slate-600">위험: {d.reason}</p>
                        <p className="text-[11px] text-teal-700 font-semibold">대책: {d.mitigationPlan}</p>
                      </div>
                    ))}
                  </div>

                  {/* Medium */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                        2. Medium 의존도 (동적 교체 준비)
                      </span>
                      <span className="text-[11px] font-bold text-amber-700">Gate 0 실물 CSV로 전환</span>
                    </div>
                    {dataPolicyAudit?.dependencyClassification?.medium?.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">• {d.feature}</span>
                        <p className="text-[11px] text-slate-600">사유: {d.reason}</p>
                        <p className="text-[11px] text-teal-700 font-semibold">대책: {d.mitigationPlan}</p>
                      </div>
                    ))}
                  </div>

                  {/* Low */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-xs">
                      3. Low 의존도 (구조적 불변 자산)
                    </span>
                    {dataPolicyAudit?.dependencyClassification?.low?.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">• {d.feature}</span>
                        <p className="text-[11px] text-slate-600">{d.reason}</p>
                      </div>
                    ))}
                  </div>

                  {/* Independent */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                      4. Independent 자산 (MOK 의존도 0%)
                    </span>
                    {dataPolicyAudit?.dependencyClassification?.independent?.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-emerald-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900 block">• {d.feature}</span>
                        <p className="text-[11px] text-emerald-800 font-semibold">{d.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: 3-Tier Environment & Structural Guards */}
          {activePolicySubTab === 'ENVIRONMENTS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Dev Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-slate-600" />
                      1. Development (개발 환경)
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                      Mock 자유 허용
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>DB:</strong> SQLite 로컬 파일 (<code className="font-mono text-[11px] text-slate-800">cf_dev.db</code>)</p>
                    <p><strong>허용 데이터:</strong> MOK Data 및 개발자 합성 데이터 자유 활용</p>
                    <p><strong>접근 권한:</strong> 개발자 및 AI 임원 전체 읽기/쓰기 허용</p>
                    <p><strong>네트워크:</strong> 로컬호스트 격리 (외부 운영망 접근 원천 차단)</p>
                    <div className="p-2 bg-slate-100 rounded text-[11px] text-slate-600 font-mono">
                      is_mock_allowed = true
                    </div>
                  </div>
                </div>

                {/* Staging Card */}
                <div className="bg-white rounded-xl p-5 border border-indigo-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-indigo-600" />
                      2. Staging (통합 검증 환경)
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold">
                      실데이터 1,000건
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>DB:</strong> Cloud SQL PostgreSQL (<code className="font-mono text-[11px] text-slate-800">cf_staging_db</code>)</p>
                    <p><strong>허용 데이터:</strong> 비식별화(개인정보 마스킹)된 실제 공장 데이터 1,000건</p>
                    <p><strong>접근 권한:</strong> COO, CTO, QA Lead 한정 접근 (Shadow Test 전용)</p>
                    <p><strong>네트워크:</strong> VPC 사설망 + IP 화이트리스트</p>
                    <div className="p-2 bg-indigo-50 rounded text-[11px] text-indigo-900 font-mono">
                      shadow_test_enabled = true
                    </div>
                  </div>
                </div>

                {/* Production Card */}
                <div className="bg-white rounded-xl p-5 border border-emerald-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      3. Production (운영 환경)
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
                      100% 실측 운영
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>DB:</strong> Supabase / Cloud SQL (<code className="font-mono text-[11px] text-slate-800">cf_prod_db</code>)</p>
                    <p><strong>허용 데이터:</strong> 100% 실제 레미콘 공장 운영 데이터만 허용</p>
                    <p><strong>접근 권한:</strong> 엄격한 RBAC (대표이사 최종 승인 필수, AI 직접 수정 금지)</p>
                    <p><strong>네트워크:</strong> VPC 전용선 + HMAC-SHA256 상호 인증</p>
                    <div className="p-2 bg-emerald-50 rounded text-[11px] text-emerald-900 font-mono">
                      is_mock = false (NOT NULL)
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Layer Structural Guards */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600" />
                  MOK Data 운영 데이터 혼합 방지 3중 구조적 방화벽 (Leak Prevention Guards)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      가드 1: 컴파일 타임 린트 가드
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      TypeScript 빌드 시 <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">NODE_ENV=production</code>인 경우, 프로덕션 번들에 <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">mockData.ts</code> 임포트가 감지되면 빌드가 즉시 차단(Exit 1)됩니다.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      가드 2: 데이터베이스 스키마 가드
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      프로덕션 DB의 모든 테이블에 <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">CHECK (is_mock = false)</code> 제약조건을 강제하여, Mock 플래그를 가진 레코드의 INSERT 시도를 DB 레벨에서 거부합니다.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      가드 3: API 게이트웨이 가드
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      외부 인입 텔레메트리 페이로드를 HMAC-SHA256으로 전수 검증하며, 페이로드 내에 합성 데이터 마커가 감지되면 즉시 403 Forbidden 및 침입 탐지 로그를 기록합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Real Data Assets & 8-Stage Flow */}
          {activePolicySubTab === 'REAL_DATA' && (
            <div className="space-y-6">
              {/* 5 Real Data Assets */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  기확보 5대 실제 데이터 자산 명세서 (Physical Ground Truth Assets)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataPolicyAudit?.realDataAssets?.map((asset: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{asset.assetName}</span>
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold font-mono text-[11px]">
                          {asset.securedCount}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <p><strong>수집 범위:</strong> {asset.flowCoverage}</p>
                        <p><strong>준비 상태:</strong> {asset.readiness}</p>
                        <p><strong>오류/누락 위험:</strong> <span className="text-amber-800 font-semibold">{asset.errorRisk}</span></p>
                        <p><strong>DB 적재 방안:</strong> <span className="text-teal-700 font-medium">{asset.dbLoadable}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Stage Flow Table */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  8단계 표준 데이터 흐름별 정합성 검토 매트릭스
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">운행 단계</th>
                        <th className="py-2.5 px-3">실제 확보 여부</th>
                        <th className="py-2.5 px-3">데이터 출처</th>
                        <th className="py-2.5 px-3">시간/포맷 기준</th>
                        <th className="py-2.5 px-3">오류/누락 가능성</th>
                        <th className="py-2.5 px-3">적재 준비 상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {dataPolicyAudit?.dataFlowIntegrity?.map((df: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{df.stage}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              df.realSecured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {df.realSecured ? '실물 확보됨' : '추정 보완 필요'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{df.source}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{df.format}</td>
                          <td className="py-2.5 px-3 text-slate-600">{df.errorRisk}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-teal-700">{df.dbStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: 7-Item Verification Checkpoint Tester (Section 7) */}
          {activePolicySubTab === 'VERIFICATION' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-teal-600" />
                      AI 임원 7대 실무 검증 기록기 (Section 7 CEO 자체 검증 게이트)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      "계획 수립이나 코드 수정만으로 개발 완료를 선언하지 않는다" — 모든 임원의 업무 결과를 7대 항목으로 엄격히 심사합니다.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                    심사 엔진 가동 중
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Input parameters */}
                  <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">검증 대상 AI 임원</label>
                      <select
                        value={selectedExecRole}
                        onChange={e => setSelectedExecRole(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-semibold"
                      >
                        <option value="COO">COO (AI 비서실장)</option>
                        <option value="CTO">CTO (기술총괄)</option>
                        <option value="CDO">CDO (데이터총괄)</option>
                        <option value="CPO">CPO (제품총괄)</option>
                        <option value="FIELD_EXPERT">현장 운영 전문가</option>
                        <option value="QA">QA Lead (품질검증)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">업무 및 태스크 제목</label>
                      <textarea
                        value={taskTitleInput}
                        onChange={e => setTaskTitleInput(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
                      />
                    </div>

                    <button
                      onClick={handleEvaluateCheckpoint}
                      disabled={isEvaluatingCheck}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isEvaluatingCheck ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      7대 검증 요건 심사 실행
                    </button>
                  </div>

                  {/* Right: Checkbox Toggles & Result */}
                  <div className="space-y-4 md:col-span-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      필수 7대 검증 체크포인트 토글 (현재 상태 입력)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkMokTested}
                          onChange={e => setCheckMokTested(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>1. MOK Data 기반 테스트 여부</span>
                      </label>

                      <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${
                        checkRealTested ? 'border-emerald-300 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/40'
                      }`}>
                        <input
                          type="checkbox"
                          checked={checkRealTested}
                          onChange={e => setCheckRealTested(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span className="font-bold">2. 실제 업무 데이터 기반 테스트 (핵심)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkCodeChanged}
                          onChange={e => setCheckCodeChanged(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>3. 실제 코드 변경 여부</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkFeatureImpl}
                          onChange={e => setCheckFeatureImpl(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>4. 실제 기능 구현 여부</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkTestPassed}
                          onChange={e => setCheckTestPassed(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>5. 테스트 통과 여부</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkPreviewVerified}
                          onChange={e => setCheckPreviewVerified(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span>6. 프리뷰 반영 확인 여부</span>
                      </label>

                      <label className={`flex items-center gap-2 p-2.5 rounded-lg border sm:col-span-2 cursor-pointer ${
                        checkProdDeployed ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'
                      }`}>
                        <input
                          type="checkbox"
                          checked={checkProdDeployed}
                          onChange={e => setCheckProdDeployed(e.target.checked)}
                          className="rounded text-teal-600"
                        />
                        <span className="font-bold text-amber-950">7. 운영 환경 반영 여부 (Production Deployed)</span>
                      </label>
                    </div>

                    {/* Result Callout */}
                    {checkpointResult && (
                      <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                        checkpointResult.deploymentStatus === 'READY_FOR_CEO_APPROVAL'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : checkpointResult.deploymentStatus === 'VIOLATION_BLOCKED'
                          ? 'bg-rose-50 border-rose-300 text-rose-950 animate-pulse'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}>
                        <div className="flex items-center justify-between font-bold text-sm">
                          <span className="flex items-center gap-1.5">
                            {checkpointResult.deploymentStatus === 'READY_FOR_CEO_APPROVAL' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : checkpointResult.deploymentStatus === 'VIOLATION_BLOCKED' ? (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                            )}
                            심사 판정: {checkpointResult.deploymentStatus}
                          </span>
                          <span className="text-[11px] font-mono text-slate-600">
                            {checkpointResult.role} 대상
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                          {checkpointResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Shadow Test 3-Way Comparator */}
          {activePolicySubTab === 'SHADOW_TEST' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-teal-600" />
                      실제 데이터 기반 Shadow Test (그림자 테스트 3자 비교 시뮬레이터)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      실제 배차에 영향을 주지 않고 백그라운드에서 [AI 제안] vs [출하실장 실제 판단] vs [현장 실측치]를 비교합니다.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-teal-50 text-teal-700 font-bold border border-teal-200">
                    그림자 검증 모드
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      실증 대상: 강남구 대치동 은마 B동 현장 (기준 배차 간격: {shadowIntervalInput}분)
                    </label>
                    <input
                      type="range"
                      min={8}
                      max={25}
                      step={1}
                      value={shadowIntervalInput}
                      onChange={e => setShadowIntervalInput(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={handleRunShadowTest}
                    disabled={isShadowRunning}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                  >
                    {isShadowRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
                    Shadow Test 3자 비교 실행
                  </button>
                </div>

                {/* 3-Way Comparison Display */}
                {shadowTestResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1. AI Recommendation */}
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                          ① AI 알고리즘 제안
                        </span>
                        <div className="text-2xl font-black text-indigo-950 font-mono">
                          {shadowTestResult.comparison.aiRecommendation.intervalMinutes}분
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {shadowTestResult.comparison.aiRecommendation.rationale}
                        </p>
                        <div className="text-[11px] text-indigo-700 font-semibold pt-1 border-t border-indigo-100">
                          실측 대비 오차: ±{shadowTestResult.comparison.aiRecommendation.errorFromActualMinutes}분
                        </div>
                      </div>

                      {/* 2. Human Dispatcher */}
                      <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
                          ② 출하실장 실제 판단 (Human)
                        </span>
                        <div className="text-2xl font-black text-slate-900 font-mono">
                          {shadowTestResult.comparison.humanDispatcherDecision.intervalMinutes}분
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {shadowTestResult.comparison.humanDispatcherDecision.rationale}
                        </p>
                        <div className="text-[11px] text-slate-700 font-semibold pt-1 border-t border-slate-200">
                          실측 대비 오차: ±{shadowTestResult.comparison.humanDispatcherDecision.errorFromActualMinutes}분
                        </div>
                      </div>

                      {/* 3. Ground Truth Actual */}
                      <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                          ③ 현장 초시계 실측 (Ground Truth)
                        </span>
                        <div className="text-2xl font-black text-emerald-950 font-mono">
                          {shadowTestResult.comparison.actualGroundTruth.intervalMinutes}분
                        </div>
                        <p className="text-[11px] text-emerald-900 leading-relaxed">
                          {shadowTestResult.comparison.actualGroundTruth.recordedSource} (회차: {shadowTestResult.comparison.actualGroundTruth.actualTurnaroundTime})
                        </p>
                        <div className="text-[11px] text-emerald-700 font-bold pt-1 border-t border-emerald-200">
                          기준 검증치: 0.0분 (기준점)
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-amber-300 block">
                        💡 그림자 분석 결과 및 지식 베이스 피드백 (Lesson Learned):
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {shadowTestResult.shadowVerdict.lessonLearned} (판단 차이: {shadowTestResult.shadowVerdict.deltaMinutes}분)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Tab 6: 6-Gate Clearance Tracker */}
          {activePolicySubTab === 'GATES' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    MOK Data 운영 종료 및 실제 데이터 전환 6대 게이트 현황
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                    대표이사 최종 결재 기준
                  </span>
                </div>
                <div className="space-y-3">
                  {dataPolicyAudit?.retirementGates?.map((g: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-100 text-teal-800">
                            {g.gateId}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{g.title}</span>
                        </div>
                        <span className={`text-[11px] font-bold ${
                          g.status === 'VERIFIED' ? 'text-emerald-700' : 'text-indigo-700'
                        }`}>
                          {g.passRate}% 완료
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            g.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${g.passRate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>목표 기준: {g.target}</span>
                        <span className="font-semibold text-slate-700">{g.current}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Tab 1: Hermes vs CF HQ Separation */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'SEPARATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hermes Domain Card */}
            <div className="bg-white rounded-xl p-5 border border-purple-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Hermes 영역 (Agent Memory & Skills)</h3>
                    <span className="text-[10px] text-purple-600 font-semibold">소유: AI 에이전트 인스턴스 (가변적)</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                  Runtime Cache
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="text-[11px] text-slate-500">
                  AI 임원 개인의 지시 처리 습관, 단기 태스크 프롬프트 메모리 및 반복 시행착오 경험을 보관합니다.
                </p>
                <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> AI 임원별 지시 처리 노하우 및 프롬프트 캐시
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 재사용 가능한 워크플로 스킬(Skills)
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 모델별 토큰 최적화 및 함수 호출 파라미터 습관
                  </div>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 font-medium">
                  ※ 엄격 통제: Hermes의 임의 경험은 승인 전까지 공식 지식이 될 수 없습니다.
                </div>
              </div>
            </div>

            {/* CF HQ Knowledge Domain Card */}
            <div className="bg-white rounded-xl p-5 border border-teal-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Database className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">CF HQ 공식 지식 (Official Platform Knowledge)</h3>
                    <span className="text-[10px] text-teal-700 font-semibold">소유: ConcreteFlow 회사 영구 자산</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold">
                  Immutable SemVer
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="text-[11px] text-slate-500">
                  원천 텔레메트리, 실측 타설 시간, 검증된 분석 규칙 및 경영진이 최종 승인한 산업 기준을 영구 보존합니다.
                </p>
                <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> 원본 ERP 출하 송장 및 6대 이벤트 실측 데이터
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> 건설 현장별 통계적 타설/회차 베이스라인
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> CEO/COO 공식 승인 배차 규칙 (v1.0.X SemVer 관리)
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900 font-medium">
                  ※ 무영향 보장: 에이전트를 Claude/GPT로 교체해도 CF HQ 공식 지식은 100% 보존됩니다.
                </div>
              </div>
            </div>
          </div>

          {/* 5-Step Knowledge Promotion Pipeline */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              공식 지식 승격 및 SemVer 버전 관리 파이프라인 (Promotion Workflow)
            </h3>
            <p className="text-xs text-slate-500">
              Hermes 에이전트가 제안한 경험적 규칙은 5단계 검증과 사람(대표이사/COO)의 승인을 거쳐야만 공식 지식으로 승격됩니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-purple-700 block mb-1">Step 01. 가설 제안</span>
                <span className="font-semibold text-slate-800">Hermes 경험 관측</span>
                <p className="text-[10px] text-slate-500 mt-0.5">반복 분석 중 패턴 초안 작성</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-sky-700 block mb-1">Step 02. 통계 실측</span>
                <span className="font-semibold text-slate-800">CDO 오차율 검증</span>
                <p className="text-[10px] text-slate-500 mt-0.5">실측치 표본 대비 유의성 확인</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-amber-700 block mb-1">Step 03. 현장 타당성</span>
                <span className="font-semibold text-slate-800">현장전문가 검토</span>
                <p className="text-[10px] text-slate-500 mt-0.5">물리적 안전 및 규격 부합 확인</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-teal-700 block mb-1">Step 04. 최종 의결</span>
                <span className="font-semibold text-slate-800">COO / CEO 승인</span>
                <p className="text-[10px] text-slate-500 mt-0.5">전자 서명 날인 및 규칙 채택</p>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-300 rounded-lg">
                <span className="text-[10px] font-bold text-teal-900 block mb-1">Step 05. 지식 승격</span>
                <span className="font-semibold text-teal-950 font-mono">SemVer 배포</span>
                <p className="text-[10px] text-teal-700 mt-0.5">공식 저장소 불변 커밋</p>
              </div>
            </div>

            {/* Quick Promotion Simulator Form */}
            <form onSubmit={handlePromoteRule} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="검증된 신규 배차 규칙 제안 (예: 우천 시 슬럼프 보정 계수 1.1 적용)..."
                value={newRuleTitle}
                onChange={e => setNewRuleTitle(e.target.value)}
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isPromoting || !newRuleTitle.trim()}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                공식 지식 승격 (SemVer 승격)
              </button>
            </form>
            {promoteMsg && (
              <p className="text-xs font-semibold text-teal-800 bg-teal-50 p-2 rounded border border-teal-200">
                {promoteMsg}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Tab 2: Closed-Loop Performance Improvement */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'CLOSED_LOOP' && (
        <div className="space-y-6">
          {/* 10-Step Cycle Diagram */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              10단계 폐쇄형 지속 개선 루프 (Closed-Loop Improvement Engine)
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              데이터 수집 $\rightarrow$ 오차 비교 $\rightarrow$ 원인 분석 $\rightarrow$ 지식 개선 $\rightarrow$ 성능 검증으로 이어지는 선순환 구조입니다.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              {[
                { step: '01', title: '실데이터 수집', desc: '출하 송장 및 기사 실측' },
                { step: '02', title: '신뢰도 평가 (DCS)', desc: '동적 신뢰도 점수 산출' },
                { step: '03', title: '유사 사례 검색', desc: 'CF HQ 공식 지식 매칭' },
                { step: '04', title: 'AI 분석 및 예측', desc: '타설 시간 및 배차 간격' },
                { step: '05', title: '현장 실측 결과', desc: '기사 2-Touch 실측 완료' },
                { step: '06', title: '예측 오차 비교', desc: 'MAE 및 잔차 오차 분석' },
                { step: '07', title: '오차 원인 분석', desc: '도로 정체 vs 펌프 병목' },
                { step: '08', title: '지식/분석 개선', desc: '규칙 수정안 및 가중치' },
                { step: '09', title: '다음 업무 적용', desc: '개선된 알고리즘 반영' },
                { step: '10', title: '전후 성능 비교', desc: '객관적 오차 감소 증명' }
              ].map(item => (
                <div key={item.step} className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-bold text-teal-400 block mb-0.5">Step {item.step}</span>
                  <span className="font-semibold text-white block">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Required Metrics Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  CEO 7대 필수 성능 개선 지표 (Performance Benchmark)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  데이터가 불충분한 지표는 '검증 대기'로 투명하게 표시하며, 입증되지 않은 성과는 개선으로 보고하지 않습니다.
                </p>
              </div>
              <button
                onClick={fetchClosedLoop}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> 새로고침
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {closedLoopData?.metrics?.map((metric: any) => {
                const isMeasured = metric.status === 'MEASURED_IMPROVED';
                return (
                  <div
                    key={metric.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isMeasured
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{metric.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isMeasured
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isMeasured ? '실측 개선 입증' : '검증 대기 (데이터 축적 중)'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1">{metric.name}</h4>

                    <div className="space-y-1 text-xs my-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">목표 기준:</span>
                        <span className="font-semibold text-slate-800">{metric.target}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">과거 베이스라인:</span>
                        <span className="text-slate-600 font-mono">{metric.baseline}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">현재 실측치:</span>
                        <span className={isMeasured ? 'text-emerald-700 font-mono text-sm' : 'text-amber-700'}>
                          {metric.current}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-2 flex justify-between">
                      <span>표본: {metric.sampleCount} / {metric.requiredSample}건</span>
                      <span className="truncate max-w-[140px]">{metric.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Tab 3: Schema Export Preview (No Fake Migration Execution) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'MIGRATION' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                지식 스키마 Export 미리보기 [테스트 전용 · 외부 AI 미연결]
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                1단계에서는 Hermes/Claude/GPT 외부 에이전트 실제 교체나 연동을 수행하지 않습니다. 현재 CF HQ 공식 지식 규칙을 표준 JSON 스키마로 내보내는 형식만 미리 확인합니다.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
              [테스트 전용 미리보기 · 외부 API 미호출]
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs font-bold text-slate-700">대상 스키마 프로필:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'CLAUDE_35' as const, label: 'Claude 호환 JSON 프로필 (미연동)' },
                { id: 'GPT_4O' as const, label: 'OpenAI 호환 JSON 프로필 (미연동)' },
                { id: 'GEMINI_FLASH' as const, label: 'Gemini 프로필 (현재 사용 중)' }
              ].map(eng => (
                <button
                  key={eng.id}
                  onClick={() => setMigrationEngine(eng.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    migrationEngine === eng.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {eng.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRunMigrationTest}
              disabled={isMigrating}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto shadow-sm cursor-pointer"
            >
              {isMigrating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
              JSON 스키마 미리보기 생성
            </button>
          </div>

          {migrationOutput && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  참고용 JSON Export 미리보기 생성됨 (실제 에이전트 교체·검증 아님)
                </span>
                <span className="text-[10px] font-mono text-amber-800">Schema: CF-Knowledge-JSON-v1</span>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {migrationOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Tab 4: Domain Knowledge Base Articles */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ARTICLES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="지식 검색 (슬럼프, 세척, 이벤트)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {filtered.map(art => {
              const isSelected = selectedArticle.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono mb-1.5 inline-block">
                    {art.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{art.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{art.summary}</p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[600px]">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-teal-700 font-mono uppercase block mb-1">
                {selectedArticle.category}
              </span>
              <h2 className="text-base font-bold text-slate-900">{selectedArticle.title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 pr-2 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
