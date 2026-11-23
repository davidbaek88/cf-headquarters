import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  DollarSign,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

export const SystemView: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'MIN' | 'BASE' | 'MAX'>('BASE');
  const [includePitr, setIncludePitr] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    setHealthError(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setHealthData(data);
    } catch (err: any) {
      setHealthData(null);
      setHealthError(`서버 헬스체크(/api/health) 조회 실패: ${err?.message || '연결 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Compute Cost based on selected scenario
  const getCostEstimate = () => {
    if (selectedScenario === 'MIN') {
      return {
        usd: 46.50,
        krw: '65,100원',
        label: '최소 시나리오 (Low-traffic / 개발 및 내부 테스트)',
        vercel: '$20.00 (Pro)',
        supabase: '$25.00 (Pro)',
        cloudRun: '$0.00 (무료 티어)',
        cloudSql: '$0.00 (SQLite)',
        gemini: '$1.50 (약 20회 호출)'
      };
    }
    if (selectedScenario === 'BASE') {
      const pitrAddon = includePitr ? 100 : 0;
      return {
        usd: 73.50 + pitrAddon,
        krw: includePitr ? '242,900원' : '102,900원',
        label: '기준 시나리오 (단일 공장 PoC 예상 표준) [CEO 승인안]',
        vercel: '$20.00 (Pro)',
        supabase: includePitr ? '$125.00 (Pro + PITR 7일)' : '$25.00 (Pro 일일백업)',
        cloudRun: '$6.50 (서울 리전 상시)',
        cloudSql: '$12.00 (Cloud SQL db-f1-micro)',
        gemini: '$10.00 (월 100회 풀세션)'
      };
    }
    return {
      usd: 223.50,
      krw: '312,900원',
      label: '최대 시나리오 (고부하 + PITR 백업 풀옵션)',
      vercel: '$20.00 (Pro)',
      supabase: '$125.00 (Pro + PITR)',
      cloudRun: '$18.50 (다중 컨테이너)',
      cloudSql: '$25.00 (고용량 DB)',
      gemini: '$35.00 (월 400회 고빈도 협업)'
    };
  };

  const cost = getCostEstimate();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-teal-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              시스템 및 독립 인프라 관제 (System & Infra Command)
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            CF AI (Vercel Edge)와 CF HQ (GCP Cloud Run)의 독립 런타임 상태, HMAC 인증, 월간 예산 집행을 모니터링합니다.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {healthError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{healthError} (정상 상태로 대체 표시하지 않음)</span>
          </div>
          <button
            onClick={fetchHealth}
            className="px-3 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
          >
            재조회
          </button>
        </div>
      )}

      {/* 2 Runtimes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Runtime 1: CF AI (Production Edge) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">CF AI (현장 운영 시스템)</h3>
                <span className="text-[11px] text-slate-500 font-mono">cf-ai.concreteflow.com</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 운영 동결 유지 (Frozen)
            </span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">호스팅 인프라:</span>
              <span className="font-semibold text-slate-900 font-mono">Vercel Edge Network</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">운영 데이터베이스:</span>
              <span className="font-semibold text-slate-900 font-mono">Supabase PostgreSQL (접근 차단)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">텔레메트리 전송:</span>
              <span className="font-semibold text-emerald-700">비동기 단방향 (1.5s 타임아웃)</span>
            </div>
          </div>
        </div>

        {/* Runtime 2: CF HQ (Management & AI Engine) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">CF HQ (경영 의사결정 플랫폼)</h3>
                <span className="text-[11px] text-slate-500 font-mono">hq.concreteflow.com</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 개발 착수 (Day 1~14)
            </span>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">호스팅 인프라:</span>
              <span className="font-semibold text-slate-900 font-mono">GCP Cloud Run (Node.js 22 LTS)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">배치 지역 (Region):</span>
              <span className="font-semibold text-slate-900 font-mono">asia-northeast3 (서울)</span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">AI 오케스트레이션:</span>
              <span className={`font-semibold font-mono ${healthData?.geminiConfigured ? 'text-purple-700' : 'text-rose-700'}`}>
                {healthData ? (healthData.geminiConfigured ? `${healthData.model} (활성)` : 'GEMINI_API_KEY 미설정') : '조회 중 / 미확인'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">HMAC 서명 비밀키 상태:</span>
              <span className={`font-semibold font-mono ${healthData?.hmacSecretConfigured ? 'text-emerald-700' : 'text-rose-700'}`}>
                {healthData
                  ? `${healthData.hmacSecretConfigured ? '설정됨' : '미설정'} (${healthData.hmacSecretSource || 'UNKNOWN'})`
                  : '미확인'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-600">수신된 텔레메트리 배치:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {healthData ? `${healthData.architecture?.telemetryIngestedBatches ?? 0}건 (${healthData.env})` : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Calculator Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              인프라 월간 비용 시뮬레이터 (공식 요금 기반 3대 시나리오)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              CEO 승인 예산($73.50/월)과 PITR 옵션 여부에 따른 실제 월간 예상 비용입니다.
            </p>
          </div>
          <div className="flex gap-1.5">
            {[
              { id: 'MIN' as const, label: '최소 ($46.50)' },
              { id: 'BASE' as const, label: '기준 ($73.50) [승인]' },
              { id: 'MAX' as const, label: '최대 ($223.50)' }
            ].map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  selectedScenario === sc.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800 block">총 월간 예상 비용</span>
            <div className="text-2xl font-black text-emerald-950 my-1">
              ${cost.usd.toFixed(2)} <span className="text-sm font-semibold text-emerald-800">({cost.krw})</span>
            </div>
            <span className="text-[11px] text-emerald-700 block">{cost.label}</span>
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Vercel Pro (CF AI)</span>
              <span className="font-bold text-slate-800">{cost.vercel}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Supabase Database (CF AI)</span>
              <span className="font-bold text-slate-800">{cost.supabase}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Cloud Run + SQL (CF HQ)</span>
              <span className="font-bold text-slate-800">{cost.cloudRun} + {cost.cloudSql}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[10px]">Gemini 3.8 Flash API</span>
              <span className="font-bold text-purple-700">{cost.gemini}</span>
            </div>
          </div>
        </div>

        {selectedScenario === 'BASE' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <input
              type="checkbox"
              id="pitr-check"
              checked={includePitr}
              onChange={e => setIncludePitr(e.target.checked)}
              className="accent-teal-600 cursor-pointer"
            />
            <label htmlFor="pitr-check" className="cursor-pointer">
              Supabase PITR (Point-in-Time Recovery 7일 복원 add-on +$100/월) 반영 여부 (현재: 미반영 권고)
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
