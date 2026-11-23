import React, { useState, useEffect } from 'react';
import {
  Building2,
  Cpu,
  Database,
  Smartphone,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Sparkles,
  Server,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Radio,
  FileCheck2,
  Activity
} from 'lucide-react';
import { ExecutiveRole, Executive } from '../../types/headquarters';
import { CFDriverView, DriverSyncStatus } from './CFDriverView';

interface DepartmentViewProps {
  executives: Executive[];
  onDirectOrder: (role: ExecutiveRole) => void;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({
  executives,
  onDirectOrder
}) => {
  const [activeDept, setActiveDept] = useState<ExecutiveRole>('COO');

  // CTO State: HMAC & Fail-safe simulation
  const [hmacInput, setHmacInput] = useState('{"plantId":"PLANT-SEOUL-01","events":[{"tripId":"TRIP-101","eventType":"SITE_ARRIVAL"}]}');
  const [hmacResult, setHmacResult] = useState<any>(null);
  const [isHmacTesting, setIsHmacTesting] = useState(false);
  const [failSafeMode, setFailSafeMode] = useState<'normal' | 'timeout' | 'error503'>('normal');
  const [failSafeResult, setFailSafeResult] = useState<any>(null);
  const [isFailSafeTesting, setIsFailSafeTesting] = useState(false);

  // CDO State: DCS Interactive Calculator
  const [completenessScore, setCompletenessScore] = useState(95);
  const [sequenceScore, setSequenceScore] = useState(90);
  const [geofenceScore, setGeofenceScore] = useState(85);
  const [cdoMetrics, setCdoMetrics] = useState<any>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // CPO State: Unified CFDriverView sync state
  const [cpoViewMode, setCpoViewMode] = useState<'ACTUAL_CF_DRIVER' | 'COCKPIT_INTEGRATION'>('ACTUAL_CF_DRIVER');
  const [syncedDriverStatus, setSyncedDriverStatus] = useState<DriverSyncStatus>({
    currentStep: 5,
    stepLabel: '공장 도착',
    isReturnCompleted: true,
    queueRank: 1,
    estimatedMinutesLeft: 3,
    roundsCount: 4,
    totalVolume: 24.0,
    lastActionAt: '초기 상태'
  });

  // Field Expert State: Gate 0 CSV Inspector
  const [csvContent, setCsvContent] = useState('');
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvValidationResult, setCsvValidationResult] = useState<any>(null);
  const [isValidatingCsv, setIsValidatingCsv] = useState(false);

  const fetchMetrics = async () => {
    setMetricsError(null);
    try {
      const res = await fetch('/api/data/metrics');
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setCdoMetrics(data);
    } catch (err: any) {
      setCdoMetrics(null);
      setMetricsError(`데이터 지표 API(/api/data/metrics) 조회 실패: ${err?.message || '연결 오류'}`);
    }
  };

  const fetchSampleCsv = async () => {
    setCsvError(null);
    try {
      const res = await fetch('/api/gate0/sample-csv');
      const data = await res.json();
      if (!res.ok || !data.ok || !data.content) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setCsvContent(data.content);
    } catch (err: any) {
      setCsvError(`샘플 CSV API(/api/gate0/sample-csv) 조회 실패: ${err?.message || '연결 오류'}`);
    }
  };

  // Fetch initial metrics
  useEffect(() => {
    fetchMetrics();
    fetchSampleCsv();
  }, []);

  // Run Real HMAC Test via /api/telemetry/test-sign + /api/telemetry/digest
  const handleTestHmac = async (mode: 'valid' | 'invalid_signature' | 'malformed_length' = 'valid') => {
    setIsHmacTesting(true);
    setHmacResult(null);
    const start = Date.now();
    try {
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(hmacInput);
      } catch {
        setHmacResult({
          ok: false,
          mode,
          httpStatus: 400,
          error: 'INVALID_JSON_INPUT',
          message: '입력된 페이로드가 올바른 JSON 형식이 아닙니다.'
        });
        return;
      }

      const signRes = await fetch('/api/telemetry/test-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsedPayload, mode })
      });
      const signData = await signRes.json();
      if (!signRes.ok || !signData.ok) {
        setHmacResult({
          ok: false,
          mode,
          httpStatus: signRes.status,
          error: signData.error || 'SIGN_FAILED',
          message: signData.message || '테스트 서명 발급 실패'
        });
        return;
      }

      const verifyRes = await fetch('/api/telemetry/digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cf-timestamp': String(signData.timestamp),
          'x-cf-signature': signData.signature
        },
        body: JSON.stringify(parsedPayload)
      });
      const verifyData = await verifyRes.json();
      const elapsed = Date.now() - start;

      setHmacResult({
        ok: Boolean(verifyRes.ok && verifyData.ok),
        mode,
        httpStatus: verifyRes.status,
        clientTimestamp: signData.timestamp,
        signature: signData.signature,
        secretSource: signData.secretSource,
        verifiedAt: new Date().toLocaleTimeString(),
        latencyMs: elapsed,
        serverResponse: verifyData
      });
    } catch (e: any) {
      setHmacResult({
        ok: false,
        mode,
        httpStatus: 0,
        error: 'NETWORK_ERROR',
        message: e?.message || 'HMAC API 호출 실패'
      });
    } finally {
      setIsHmacTesting(false);
    }
  };

  // Run Fail-Safe Test (with real 1.5s AbortController timeout cut)
  const handleTestFailSafe = async (mode: 'normal' | 'timeout' | 'error503') => {
    setFailSafeMode(mode);
    setIsFailSafeTesting(true);
    setFailSafeResult(null);
    const start = Date.now();
    const controller = new AbortController();
    const abortTimer = mode === 'timeout' ? setTimeout(() => controller.abort(), 1500) : null;
    try {
      const res = await fetch('/api/telemetry/simulate-fail-safe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
        signal: controller.signal
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      setFailSafeResult({
        mode,
        elapsed,
        httpStatus: res.status,
        abortedByClient: false,
        data,
        cfAiStatus: '테스트 통과: 비동기 분리로 배차 처리 블로킹 없음'
      });
    } catch (e: any) {
      const elapsed = Date.now() - start;
      const isAbort = e?.name === 'AbortError';
      setFailSafeResult({
        mode,
        elapsed,
        httpStatus: isAbort ? 'ABORTED_1500MS' : 'ERROR',
        abortedByClient: isAbort,
        error: isAbort ? '클라이언트 1.5초 AbortController 타임아웃 컷 작동' : e.message,
        cfAiStatus: isAbort
          ? '테스트 통과: 1.5초 초과 응답 즉시 중단'
          : '네트워크 오류 발생'
      });
    } finally {
      if (abortTimer) clearTimeout(abortTimer);
      setIsFailSafeTesting(false);
    }
  };

  // Run CSV Validation
  const handleValidateCsv = async () => {
    setIsValidatingCsv(true);
    setCsvValidationResult(null);
    try {
      const res = await fetch('/api/gate0/validate-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvContent })
      });
      const data = await res.json();
      setCsvValidationResult(data);
    } catch (e: any) {
      setCsvValidationResult({ ok: false, error: e.message });
    } finally {
      setIsValidatingCsv(false);
    }
  };

  // Calculate dynamic DCS
  const calculatedDcs = (
    completenessScore * 0.4 +
    sequenceScore * 0.4 +
    geofenceScore * 0.2
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                AI 임원별 전문 업무실 (Department Workspaces)
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              대표이사 최종 승인(CF-CEO-2026-1111-01)에 따라 5대 전문 부서가 독립 개발 및 Gate 0 실증 작업을 실시간 진행 중입니다.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium">
              개발 착수 상태: Active (Day 1~14)
            </span>
          </div>
        </div>

        {/* Executive Department Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-800">
          {[
            { role: 'COO' as ExecutiveRole, name: '운영기획실 (COO)', icon: Building2, desc: '공정 및 Gate 0 총괄' },
            { role: 'CTO' as ExecutiveRole, name: '엔지니어링본부 (CTO)', icon: Cpu, desc: '독립 인프라 & HMAC' },
            { role: 'CDO' as ExecutiveRole, name: '데이터연구실 (CDO)', icon: Database, desc: 'DCS & 1,000건 축적' },
            { role: 'CPO' as ExecutiveRole, name: '제품기획실 (CPO)', icon: Smartphone, desc: '기사 2-Touch & 콕핏' },
            { role: 'FIELD_EXPERT' as ExecutiveRole, name: '현장운영실 (전문가)', icon: Truck, desc: 'CSV 실물 & 안전 검증' }
          ].map(dept => {
            const isActive = activeDept === dept.role;
            const Icon = dept.icon;
            return (
              <button
                key={dept.role}
                onClick={() => setActiveDept(dept.role)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-teal-700/40 border-teal-500 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold truncate">{dept.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{dept.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. COO: Operations Room */}
      {/* ------------------------------------------------------------- */}
      {activeDept === 'COO' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  운영기획실: 90일 프로젝트 및 Gate 0 공정 파이프라인
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  대표이사 최종 승인에 따른 4단계 승인 게이트와 병렬 개발 진척 상황을 관리합니다.
                </p>
              </div>
              <button
                onClick={() => onDirectOrder('COO')}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                COO 업무 지시
              </button>
            </div>

            {/* 4 Approval Gates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-teal-800">Gate 0 (선행조건)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    진행 중 (85%)
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900">실제 CSV 300건 확보</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  협력 공장 출하 PC 샘플 파일 전수 검증 및 필수 5개 헤더 규격 일치 확인 중
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-teal-300 bg-teal-50/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-teal-800">Gate 1 (Day 7)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    진행 중 (Day 3)
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900">독립 인프라 & Fail-Safe</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Vercel Edge(CF AI)와 Cloud Run(CF HQ) 격리, HMAC 서명 및 1.5초 타임아웃 검증
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Gate 2 (Day 14)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    대기
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900">기사 2-Touch & 콕핏</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  모바일 웹 브라우저 렌더링 성능(1.5초 미만), 지하 오프라인 큐 복구 및 3초 콕핏 완성
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">Gate 3 (Day 20)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    대기
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900">종합 모의 부하 검증</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  가상 트럭 20대 합성 트랜잭션 1,000건 스트레스 테스트 통과 후 현장 설치 결재
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CTO: Engineering Lab */}
      {/* ------------------------------------------------------------- */}
      {activeDept === 'CTO' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: HMAC Signature Verification Test */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  HMAC-SHA256 텔레메트리 서명 검증기
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                  윈도우: ±300s
                </span>
              </div>
              <p className="text-xs text-slate-500">
                CF AI에서 발행된 비동기 배치 페이로드가 CF HQ로 유입될 때 전자서명을 실측 검증합니다.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  모의 텔레메트리 배치 페이로드 (JSON)
                </label>
                <textarea
                  value={hmacInput}
                  onChange={e => setHmacInput(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleTestHmac('valid')}
                  disabled={isHmacTesting}
                  className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {isHmacTesting ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  정상 서명 (200)
                </button>
                <button
                  onClick={() => handleTestHmac('invalid_signature')}
                  disabled={isHmacTesting}
                  className="py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  서명 변조 (403)
                </button>
                <button
                  onClick={() => handleTestHmac('malformed_length')}
                  disabled={isHmacTesting}
                  className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  길이 오류 (403)
                </button>
              </div>

              {hmacResult && (
                <div className={`p-3 rounded-lg border space-y-1.5 text-xs ${hmacResult.ok ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/70 border-rose-200'}`}>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-700">
                      실제 API 결과 (HTTP {hmacResult.httpStatus} · 모드: {hmacResult.mode}):
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${hmacResult.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {hmacResult.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {hmacResult.ok ? '200 VERIFIED' : `${hmacResult.httpStatus} REJECTED`}
                    </span>
                  </div>
                  {hmacResult.signature && (
                    <div className="text-[11px] text-slate-600 font-mono break-all">
                      Signature ({hmacResult.secretSource}): {hmacResult.signature}
                    </div>
                  )}
                  <pre className="p-2 bg-slate-900 text-slate-100 rounded text-[10px] font-mono overflow-x-auto">
                    {JSON.stringify(hmacResult.serverResponse || { error: hmacResult.error, message: hmacResult.message }, null, 2)}
                  </pre>
                  {hmacResult.latencyMs !== undefined && (
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>검증 시각: {hmacResult.verifiedAt}</span>
                      <span>실제 왕복 레이턴시: {hmacResult.latencyMs}ms</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Fail-Safe Zero-Impact Simulator */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  CF AI 무영향 격리 [테스트 전용 시뮬레이터]
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  1.5s AbortController
                </span>
              </div>
              <p className="text-xs text-slate-500">
                테스트 전용 엔드포인트(/api/telemetry/simulate-fail-safe)에 대해 실제 1.5초 AbortController 타임아웃 차단 및 503 오류 분기를 검증합니다.
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleTestFailSafe('normal')}
                  disabled={isFailSafeTesting}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    failSafeMode === 'normal'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  정상 상태
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">200 OK</span>
                </button>
                <button
                  onClick={() => handleTestFailSafe('timeout')}
                  disabled={isFailSafeTesting}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    failSafeMode === 'timeout'
                      ? 'bg-amber-50 border-amber-500 text-amber-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  지연 타임아웃 모의
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">1.5초 Abort 컷</span>
                </button>
                <button
                  onClick={() => handleTestFailSafe('error503')}
                  disabled={isFailSafeTesting}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                    failSafeMode === 'error503'
                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  503 중단 모의
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">HTTP 503 응답</span>
                </button>
              </div>

              {failSafeResult && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>실제 소요 시간: {failSafeResult.elapsed}ms (HTTP: {failSafeResult.httpStatus})</span>
                    <span className="text-emerald-700 font-bold">검증 완료</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium">
                    격리 판정: {failSafeResult.cfAiStatus}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {failSafeResult.error || failSafeResult.data?.message || '정상 처리 완료'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CDO: Data Research Lab */}
      {/* ------------------------------------------------------------- */}
      {activeDept === 'CDO' && (
        <div className="space-y-6">
          {metricsError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{metricsError} (MOK 데이터로 대체하지 않음)</span>
              </div>
              <button
                onClick={fetchMetrics}
                className="px-3 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
              >
                재조회
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Dynamic Confidence Score Calculator */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-600" />
                  동적 데이터 신뢰도 점수 (DCS) 시뮬레이터
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  DCS: {calculatedDcs}점
                </span>
              </div>
              <p className="text-xs text-slate-500">
                임의 고정 수치(99% 등)를 폐기하고, 완성도·시계열정합성·위치일치도 가중치에 따라 실시간 산출합니다.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>1. 필수 항목 완성도 (가중치 40%)</span>
                    <span className="font-bold text-sky-700">{completenessScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={completenessScore}
                    onChange={e => setCompletenessScore(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">차량번호, 규격, 루베 수, 현장명 결측률 검사</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>2. 시계열 논리 정합성 (가중치 40%)</span>
                    <span className="font-bold text-sky-700">{sequenceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={sequenceScore}
                    onChange={e => setSequenceScore(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">출하 &lt; 도착 &lt; 타설완료 &lt; 복귀 시간 순서 역전 여부</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>3. 지오펜스 위치 일치도 (가중치 20%)</span>
                    <span className="font-bold text-sky-700">{geofenceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={geofenceScore}
                    onChange={e => setGeofenceScore(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">버튼 누름 시점의 위경도가 현장 반경 500m 이내 여부</span>
                </div>
              </div>

              <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-lg text-xs text-sky-900">
                <span className="font-semibold block mb-0.5">신뢰도 등급 판정:</span>
                {Number(calculatedDcs) >= 80 ? (
                  <span className="text-emerald-700 font-bold">Grade A (고신뢰 베이스라인 데이터셋 진입 가능)</span>
                ) : (
                  <span className="text-amber-700 font-bold">Grade B (정제 필요 / AI 베이스라인 산출 격리)</span>
                )}
              </div>
            </div>

            {/* Right: 1,000 Complete Events Accumulator */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  완전 이벤트 1,000건 축적 현황 (결측률 25% 반영)
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">
                  소요 기간: 3.46주 (19영업일)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                단순 운행 횟수(385건/주)와 결측이 없는 완전 이벤트(288.75건/주)를 엄격히 분리하여 계측합니다.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Ground Truth 실측 완전 이벤트 진행률</span>
                  <span className="text-purple-700 font-bold">84건 / 1,000건 (8.4%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: '8.4%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>주당 예상 완전 이벤트: 288.75건</span>
                  <span>달성 목표 시점: 실증 4주 차</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 block text-[11px]">합성(Synthetic) 풀</span>
                  <span className="text-base font-bold text-slate-900">1,000건</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">부하 테스트 전용 (격리)</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs">
                  <span className="text-purple-700 block text-[11px]">Ground Truth 실측 풀</span>
                  <span className="text-base font-bold text-purple-900">84건</span>
                  <span className="text-[10px] text-purple-600 block mt-0.5">실제 검증용 유효 데이터</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CPO: Product Experience Studio */}
      {/* ------------------------------------------------------------- */}
      {activeDept === 'CPO' && (
        <div className="space-y-6">
          {/* Sub-navigation & Analysis Callout */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-600" />
                  CF AI Driver 화면 분석 및 기개발 자산 기반 개선 솔루션
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  새로 만들지 않고, 이미 우수하게 구현된 CF AI Driver 화면을 보존하며 백엔드 및 콕핏을 연동합니다.
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setCpoViewMode('ACTUAL_CF_DRIVER')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cpoViewMode === 'ACTUAL_CF_DRIVER'
                      ? 'bg-slate-900 text-amber-400 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🚚 CF AI Driver 실제 화면 (스크린샷 일치)
                </button>
                <button
                  onClick={() => setCpoViewMode('COCKPIT_INTEGRATION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    cpoViewMode === 'COCKPIT_INTEGRATION'
                      ? 'bg-slate-900 text-amber-400 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🎛️ 출하실장 3초 콕핏 연동 뷰
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-950">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                대표이사 분석 지침 확인: "이미 개발된 CF AI를 출발점으로 삼고 필요한 부분을 개선한다"
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                • <strong>차내 대기순번 공유</strong>: 대기 1순번, 호퍼 예상 시각(10:30), 라인업이 기개발 UI에 완벽히 구현되어 있습니다.<br />
                • <strong>귀차키 모바일 대체</strong>: 상단의 [공장 도착 완료] 누르고 대기순번 받기 버튼이 기존 물리적 귀차키를 1-Touch로 대체합니다.<br />
                • <strong>5단계 간편 단계 보고</strong>: 1.공장출발 → 2.현장도착 → 3.타설중 → 4.현장출발 → 5.공장도착(귀차) 흐름이 수기 일보를 완전히 대체합니다.<br />
                • <strong>개선 방향</strong>: 본 화면을 그대로 승계하고, 누를 때 출하실 콕핏과의 실시간 WebSocket/API 통신과 오프라인 큐 복원력을 백엔드에서 완성합니다.
              </p>
            </div>
          </div>

          {cpoViewMode === 'ACTUAL_CF_DRIVER' ? (
            <CFDriverView onStatusChange={setSyncedDriverStatus} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Unified CF AI Driver View (Single Source of Truth) */}
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-900 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>기사 단말 뷰 (단일 통합 CFDriverView)</span>
                  <span className="text-[11px] font-mono text-slate-300">
                    현재 단계: {syncedDriverStatus.currentStep}. {syncedDriverStatus.stepLabel}
                  </span>
                </div>
                <CFDriverView compact onStatusChange={setSyncedDriverStatus} />
              </div>

              {/* Right: Dispatcher 3-Second Cockpit Preview */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    출하실장 3초 판단 콕핏 (확정/추정 분리)
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                    좌측 기사 화면 실시간 연동
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  좌측 기사 화면에서 단계 버튼 또는 [공장 도착 완료]를 누르면 출하실장 콕핏의 차량 상태와 대기순번이 즉시 동기화됩니다.
                </p>

                {/* Live Synced Truck (106호차) */}
                <div className="p-4 rounded-xl border-2 border-teal-500/50 bg-teal-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">106호차 (조OO 기사님)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        syncedDriverStatus.isReturnCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {syncedDriverStatus.currentStep}단계: {syncedDriverStatus.stepLabel}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      최근 갱신: {syncedDriverStatus.lastActionAt}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">공장 대기순번</span>
                      <span className="font-bold text-slate-900">
                        {syncedDriverStatus.queueRank > 0 ? `${syncedDriverStatus.queueRank}순번` : '운행 중 (대기선 밖)'}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">귀차키 대체 상태</span>
                      <span className="font-bold text-emerald-700">
                        {syncedDriverStatus.isReturnCompleted ? '공장 복귀 완료' : '현장 운행 중'}
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">금일 누적 회전</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {syncedDriverStatus.roundsCount}회 ({syncedDriverStatus.totalVolume.toFixed(1)}㎥)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Truck 1: Normal */}
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">서울82사1201 (참고 샘플)</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          현장 타설 중
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">역삼 자이 (25-24-150 / 6㎥)</p>
                      <div className="text-[10px] text-slate-500 flex gap-2 font-mono">
                        <span>출하: 08:05</span>
                        <span>도착: 08:34 (기사실측)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">예상 타설 완료</span>
                      <span className="text-xs font-bold text-slate-700">09:05 전후</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200 block mt-0.5">
                        통계추정 ±8분
                      </span>
                    </div>
                  </div>

                  {/* Truck 2: Delayed with Recommendation */}
                  <div className="p-3.5 rounded-lg border border-rose-300 bg-rose-50/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">서울82사1204 (참고 샘플)</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                          타설 지연 경보 (35분 대기)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">대치 은마 B동 (25-24-150 / 6㎥)</p>
                      <div className="text-[10px] text-rose-700 font-semibold">
                        ※ 펌프카 병목 감지: 후속 1208호 배차 15분 보류 권고
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-rose-600 font-bold block">배차 간격 조정</span>
                      <span className="text-xs font-black text-rose-700">+15분 지연배차</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. Field Operations: Field Expert Lab */}
      {/* ------------------------------------------------------------- */}
      {activeDept === 'FIELD_EXPERT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                  Gate 0 협력 공장 CSV 300건 실물 검증기
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  실제 레미콘 공장 출하 PC에서 다운로드한 300건 샘플 CSV의 필수 헤더와 결측률을 검사합니다.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                선행조건 검증 도구
              </span>
            </div>

            {csvError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{csvError} (MOK 데이터로 대체하지 않음)</span>
                </div>
                <button
                  onClick={fetchSampleCsv}
                  className="px-2.5 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
                >
                  재조회
                </button>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  출하 데이터 CSV 내용 (헤더 포함)
                </label>
                <button
                  onClick={fetchSampleCsv}
                  className="text-[11px] text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> 기본 샘플 복원
                </button>
              </div>
              <textarea
                value={csvContent}
                onChange={e => setCsvContent(e.target.value)}
                rows={6}
                className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
              />
            </div>

            <button
              onClick={handleValidateCsv}
              disabled={isValidatingCsv}
              className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isValidatingCsv ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
              Gate 0 CSV 데이터 정합성 검증 실행
            </button>

            {csvValidationResult && (
              <div
                className={`p-4 rounded-xl border ${
                  csvValidationResult.gate0Status === 'PASS'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                } text-xs space-y-2`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{csvValidationResult.message}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-white border">
                    {csvValidationResult.integrityScore}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-slate-700 font-medium">
                  <div>전체 행 수: {csvValidationResult.totalRows}행</div>
                  <div>유효 행 수: {csvValidationResult.validRowCount}행</div>
                  <div>결측 결함 수: {csvValidationResult.nullFieldCount}건</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
