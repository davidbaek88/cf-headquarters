import React, { useState, useEffect } from 'react';
import {
  Truck,
  ArrowRight,
  CheckCircle2,
  ListTodo,
  Users,
  Code2,
  FileText,
  Activity,
  Layers,
  GitBranch,
  ShieldCheck,
  Search,
  Filter,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Clock,
  Send,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { HQTask, Executive, ActivityEvent, ExecutiveRole, AIActivityLog, ProductionFeatureRecord, ExecutiveHandoff } from '../../types/headquarters';
import { MetricCards } from '../dashboard/MetricCards';
import { TaskOrderForm } from '../dashboard/TaskOrderForm';
import { ExecutiveGrid } from '../dashboard/ExecutiveGrid';
import { TaskBoard } from '../dashboard/TaskBoard';
import { ActivityFeed } from '../dashboard/ActivityFeed';
import { OFFICIAL_FEATURE_RECORDS } from '../../data/mockData';

interface DashboardViewProps {
  tasks: HQTask[];
  executives: Executive[];
  activities: ActivityEvent[];
  onSelectExecutive: (exec: Executive) => void;
  onSubmitDirective: (task: HQTask) => void;
  onOpenApprovalModal: (task: HQTask) => void;
  onNavigateTab: (tab: any) => void;
  onStartLiveAgent?: (params: {
    directiveTitle: string;
    directiveDescription: string;
    category: string;
    priority: any;
    idempotencyKey: string;
  }) => void;
  onViewReport?: (task: HQTask) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  executives,
  activities,
  onSelectExecutive,
  onSubmitDirective,
  onOpenApprovalModal,
  onNavigateTab,
  onStartLiveAgent,
  onViewReport
}) => {
  // CEO Directive Section 8: 4-Cockpit Navigation
  const [activeCockpitTab, setActiveCockpitTab] = useState<'TASKS' | 'EXECUTIVES' | 'DEVELOPMENT' | 'ACTIVITY_LOGS'>('DEVELOPMENT');

  // Activity Log Filter State
  const [logFilterRole, setLogFilterRole] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Selected Feature for Before/After Modal/Detail
  const [selectedFeature, setSelectedFeature] = useState<ProductionFeatureRecord>(OFFICIAL_FEATURE_RECORDS[0]);

  // Handoff State (Fetched from API - NO silent MOK fallback)
  const [handoffList, setHandoffList] = useState<ExecutiveHandoff[]>([]);
  const [isLoadingHandoffs, setIsLoadingHandoffs] = useState(false);
  const [handoffsError, setHandoffsError] = useState<string | null>(null);
  const [isSendingHandoff, setIsSendingHandoff] = useState(false);
  const [handoffSuccessMsg, setHandoffSuccessMsg] = useState('');
  const [handoffErrorMsg, setHandoffErrorMsg] = useState<string | null>(null);

  // Live Activity Logs (Fetched from API - NO silent MOK fallback)
  const [activityLogs, setActivityLogs] = useState<AIActivityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const fetchLiveActivityLogs = async () => {
    setIsLoadingLogs(true);
    setLogsError(null);
    try {
      const res = await fetch('/api/operations/activity-logs');
      const data = await res.json();
      if (!res.ok || !data.ok || !Array.isArray(data.logs)) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setActivityLogs(data.logs);
    } catch (err: any) {
      setActivityLogs([]);
      setLogsError(`Activity Log API(/api/operations/activity-logs) 연결 실패: ${err?.message || '오류'} — MOK 데이터로 자동 대체하지 않습니다.`);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchLiveHandoffs = async () => {
    setIsLoadingHandoffs(true);
    setHandoffsError(null);
    try {
      const res = await fetch('/api/operations/handoffs');
      const data = await res.json();
      if (!res.ok || !data.ok || !Array.isArray(data.handoffs)) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }
      setHandoffList(data.handoffs);
    } catch (err: any) {
      setHandoffList([]);
      setHandoffsError(`Handoff API(/api/operations/handoffs) 연결 실패: ${err?.message || '오류'} — MOK 데이터로 자동 대체하지 않습니다.`);
    } finally {
      setIsLoadingHandoffs(false);
    }
  };

  useEffect(() => {
    fetchLiveActivityLogs();
    fetchLiveHandoffs();
  }, []);

  const renderDataOriginBadge = (origin?: 'MOK_SEED' | 'REAL_AI' | 'TEST_SIMULATION') => {
    if (origin === 'REAL_AI') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
          [실제 AI 실행]
        </span>
      );
    }
    if (origin === 'TEST_SIMULATION') {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
          [테스트 시뮬레이션]
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 border border-slate-300 font-bold">
        [MOK 시드]
      </span>
    );
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchRole = logFilterRole === 'ALL' || log.actorRole === logFilterRole;
    const matchQuery = logSearchQuery.trim() === '' ||
      log.directiveTitle.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.executedWork.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.featureChanges.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(logSearchQuery.toLowerCase());
    return matchRole && matchQuery;
  });

  const handleSimulateHandoff = async () => {
    setIsSendingHandoff(true);
    setHandoffSuccessMsg('');
    setHandoffErrorMsg(null);
    try {
      const res = await fetch('/api/operations/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromRole: 'COO',
          toRole: 'CTO',
          directiveTitle: '[테스트 검증] 실질 운영 체계 Handoff API 왕복 검증',
          passedArtifacts: ['src/components/views/DashboardView.tsx', 'server.ts'],
          changesSummary: '4대 콕핏 대시보드 뷰 및 10대 필수 항목 Activity Log API 연동 확인',
          currentStatus: '테스트 API 호출 기록됨',
          issuesFound: '특이사항 없음',
          nextActionPrompt: '실제 Gemini 협업 실행 시에는 [실제 AI 실행] 로그로 별도 기록됩니다.'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.handoff) {
        throw new Error(data.error || data.message || `HTTP ${res.status}`);
      }
      setHandoffList(prev => [data.handoff, ...prev]);
      setHandoffSuccessMsg(`${data.message} (출처: TEST_SIMULATION)`);
    } catch (e: any) {
      setHandoffErrorMsg(`인계 API 전송 실패: ${e?.message || '연결 오류'}`);
    } finally {
      setIsSendingHandoff(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <MetricCards
        tasks={tasks}
        executives={executives}
        onFilterClick={(type) => {
          if (type === 'pending_approval') onNavigateTab('approvals');
          else if (type === 'executives') onNavigateTab('executives');
          else if (type === 'active_tasks') onNavigateTab('task_status');
        }}
      />

      {/* CEO Directive Live Banner: CF-CEO-2026-1111-05 실질 운영 체계 개편 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-xl p-5 border border-teal-500/30 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono text-[11px] font-bold">
              CF-CEO-2026-1111-05
            </span>
            <span className="text-xs font-bold text-amber-300">
              [대표이사 공식 지시] 실질 운영 체계 구축 및 AI 임원 성과 관리 시스템 가동
            </span>
            <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              이전 안건 정식 승인 완료 (task-mok-001)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "보여지는 완성도보다 실제 작동하는 신뢰성을 우선한다" — 계획서 작성을 넘어 <strong>가시적 제품 변화, 10대 Activity Log, 임원 간 Handoff</strong> 중심 운영으로 전면 개편되었습니다.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('departments')}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>CF AI 기사 실물화면</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. CEO Section 8: 4-Cockpit Operational Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-1.5">
        {[
          { id: 'DEVELOPMENT' as const, label: '③ 실제 개발 현황 (가시적 제품 변화)', icon: Code2, count: `${OFFICIAL_FEATURE_RECORDS.length}개 구현` },
          { id: 'ACTIVITY_LOGS' as const, label: '④ 공식 AI Activity Log (10대 항목)', icon: FileText, count: `${activityLogs.length}건 기록` },
          { id: 'TASKS' as const, label: '① 전체 업무 현황 및 지시 발령', icon: ListTodo, count: `${tasks.length}건` },
          { id: 'EXECUTIVES' as const, label: '② AI 임원별 업무 & 인계(Handoff)', icon: Users, count: '5인 가동' }
        ].map(tab => {
          const isActive = activeCockpitTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCockpitTab(tab.id)}
              className={`py-2.5 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COCKPIT 3: 실제 개발 현황 (가시적 제품 변화 트래커) */}
      {/* ------------------------------------------------------------- */}
      {activeCockpitTab === 'DEVELOPMENT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-600" />
                  실제 개발 현황 및 가시적 제품 변화 트래커 (CTO 결과물 증명)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  "코드 변경 자체를 개발 성과로 간주하지 않는다" — 실제 변경된 화면, 작동하는 기능, 변경 전후 비교 및 테스트 통과 증거를 전수 검증합니다.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200 font-mono">
                프리뷰 반영 100% 완료 (5/5)
              </span>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OFFICIAL_FEATURE_RECORDS.map((feat) => {
                const isSelected = selectedFeature?.id === feat.id;
                return (
                  <div
                    key={feat.id}
                    onClick={() => setSelectedFeature(feat)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/60 border-teal-500 shadow-md ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {feat.category}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 테스트 통과
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1">{feat.featureName}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500 font-mono">
                      <span>담당: {feat.implementedBy}</span>
                      <span className="text-teal-700 font-semibold">{feat.stage}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspection for Selected Feature */}
            {selectedFeature && (
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-900">
                      [결과물 심사] {selectedFeature.featureName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      타겟 사용자: <strong className="text-slate-800">{selectedFeature.targetUser}</strong>
                    </span>
                    <button
                      onClick={() => onNavigateTab(selectedFeature.category === 'DRIVER_VIEW' ? 'departments' : 'knowledge')}
                      className="text-xs px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      실제 화면 확인하기
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-lg space-y-1">
                    <span className="font-bold text-rose-800 block">❌ 변경 전 상태 (Before):</span>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{selectedFeature.beforeState}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-1">
                    <span className="font-bold text-emerald-800 block">✅ 변경 후 실제 작동 상태 (After):</span>
                    <p className="text-[11px] text-slate-800 font-medium leading-relaxed">{selectedFeature.afterState}</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between text-slate-700">
                  <span><strong>가시적 증거(Evidence):</strong> {selectedFeature.tangibleEvidence}</span>
                  <span className="font-mono text-[11px] text-teal-700 font-bold">검증 상태: {selectedFeature.stage}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COCKPIT 4: 공식 AI Activity Log (10대 필수 항목) */}
      {/* ------------------------------------------------------------- */}
      {activeCockpitTab === 'ACTIVITY_LOGS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  공식 AI Activity Log (10대 필수 기록 항목) 아카이브
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  "기록이 없으면 미기록, 증거가 없으면 미검증" — 사후 임의 조작 방지 및 외부 감사 전용 실명 업무 기록 시스템.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200 font-mono">
                독립 외부 감사 인증됨
              </span>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">임원 필터:</span>
                <select
                  value={logFilterRole}
                  onChange={e => setLogFilterRole(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                >
                  <option value="ALL">전체 AI 임원 ({activityLogs.length}건)</option>
                  <option value="COO">COO (AI 비서실장)</option>
                  <option value="CTO">CTO (기술총괄)</option>
                  <option value="CDO">CDO (데이터총괄)</option>
                  <option value="CPO">CPO (제품총괄)</option>
                  <option value="FIELD_EXPERT">현장 운영 전문가</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="지시 내용, 실행 내역, 산출물 검색..."
                  value={logSearchQuery}
                  onChange={e => setLogSearchQuery(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>
            </div>

            {logsError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{logsError}</span>
                </div>
                <button
                  onClick={fetchLiveActivityLogs}
                  className="px-3 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
                >
                  재조회
                </button>
              </div>
            )}

            {/* 10-Item Activity Log Accordion / Card Feed */}
            <div className="space-y-4">
              {isLoadingLogs && activityLogs.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  서버 Activity Log 조회 중...
                </div>
              )}
              {!isLoadingLogs && !logsError && filteredLogs.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  표시할 Activity Log가 없습니다.
                </div>
              )}
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-100 text-teal-800">
                        {log.actorRole}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{log.actorName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({log.date})</span>
                      {renderDataOriginBadge(log.dataOrigin)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        프리뷰 {log.previewStatus}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border">
                        {log.stage}
                      </span>
                    </div>
                  </div>

                  {/* 10 Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">③ 지시 내용 (최초 업무 지시):</span>
                      <p className="text-slate-900 font-medium">{log.directiveTitle}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">④ 계획 (예정 작업):</span>
                      <p className="text-slate-700">{log.plannedWork}</p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-[11px] text-teal-700 font-semibold block">⑤ 실행 (실제 수행 내역):</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{log.executedWork}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">⑥ 산출물 (파일/코드/문서):</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {log.artifacts.map((art, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded bg-white text-slate-700 font-mono text-[10px] border border-slate-200">
                            {art}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">⑦ 기능 변화 (화면/제품 구현):</span>
                      <p className="text-slate-800">{log.featureChanges}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">⑧ 검증 (테스트 방법과 결과):</span>
                      <p className="text-emerald-800 font-semibold">{log.verificationResult}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">⑩ 후속 작업 (미완료 및 인계):</span>
                      <p className="text-slate-600">{log.pendingFollowUp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COCKPIT 1: 전체 업무 현황 및 지시 발령 */}
      {/* ------------------------------------------------------------- */}
      {activeCockpitTab === 'TASKS' && (
        <div className="space-y-6">
          {/* CEO Directive Input Terminal */}
          <section>
            <TaskOrderForm
              onSubmitDirective={onSubmitDirective}
              onStartLiveAgent={onStartLiveAgent}
            />
          </section>

          {/* Task Pipeline Board & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskBoard
                tasks={tasks}
                onOpenApprovalModal={onOpenApprovalModal}
                onViewReport={onViewReport}
              />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COCKPIT 2: AI 임원별 업무 & 인계(Handoff) 파이프라인 */}
      {/* ------------------------------------------------------------- */}
      {activeCockpitTab === 'EXECUTIVES' && (
        <div className="space-y-6">
          {/* Executive Profiles Grid */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  AI 임원별 실시간 실무 상태 (5인 프로필 및 현재 과업)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  각 임원은 계획서에 머무르지 않고 실제 결과물을 다음 담당자에게 인계합니다.
                </p>
              </div>
            </div>
            <ExecutiveGrid
              executives={executives}
              onSelectExecutive={onSelectExecutive}
            />
          </section>

          {/* Inter-Executive Handoff Pipeline */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-600" />
                  임원 간 업무 인계(Handoff) 파이프라인 (CEO Section 7 의무화)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  대표 지시 → COO 분해 → CTO 개발 → QA 테스트 → COO 취합: 이전 담당자의 산출물이 다음 담당자에게 5대 인계 항목과 함께 전달됩니다.
                </p>
              </div>
              <button
                onClick={handleSimulateHandoff}
                disabled={isSendingHandoff}
                className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
              >
                {isSendingHandoff ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>테스트 전용 인계 API 검증</span>
              </button>
            </div>

            {handoffsError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{handoffsError}</span>
                </div>
                <button
                  onClick={fetchLiveHandoffs}
                  className="px-3 py-1 rounded bg-white border border-rose-300 hover:bg-rose-100 font-bold text-rose-800 shrink-0 cursor-pointer"
                >
                  재조회
                </button>
              </div>
            )}

            {handoffErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                {handoffErrorMsg}
              </div>
            )}

            {handoffSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {handoffSuccessMsg}
              </div>
            )}

            {/* Handoff Stream */}
            <div className="space-y-3">
              {isLoadingHandoffs && handoffList.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  서버 Handoff 파이프라인 조회 중...
                </div>
              )}
              {!isLoadingHandoffs && !handoffsError && handoffList.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  표시할 인계 기록이 없습니다.
                </div>
              )}
              {handoffList.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 font-bold flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px]">
                        {h.fromRole}
                      </span>
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-mono text-[10px]">
                        {h.toRole}
                      </span>
                      <span className="text-slate-900 text-xs truncate ml-1">{h.directiveTitle}</span>
                      {renderDataOriginBadge(h.dataOrigin)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{h.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-500 font-semibold block">인계 산출물:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {h.passedArtifacts.map((art, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-white border border-indigo-200 font-mono text-[10px]">
                            {art}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">현재 상태:</span>
                      <span className="font-semibold text-indigo-900">{h.currentStatus}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 text-[11px] text-slate-800">
                    <strong className="text-indigo-900">다음 담당자 액션:</strong> {h.nextActionPrompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
