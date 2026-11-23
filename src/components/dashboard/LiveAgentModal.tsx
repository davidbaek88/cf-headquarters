import React, { useState } from 'react';
import {
  MultiAgentSession,
  ExecutiveRole,
  ExecutiveAnalysisReport,
  MilestoneItem
} from '../../types/headquarters';
import {
  X,
  BrainCircuit,
  Code,
  Database,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  AlertCircle,
  FileText,
  Activity,
  Layers,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface LiveAgentModalProps {
  session: MultiAgentSession | null;
  onClose: () => void;
  onCancel: (executionId: string) => void;
  onSaveToDashboard?: (session: MultiAgentSession) => void;
  isPolling?: boolean;
}

const ROLE_ICONS: Record<ExecutiveRole, React.ElementType> = {
  CEO: ShieldAlert,
  COO: BrainCircuit,
  CTO: Code,
  CDO: Database,
  FIELD_EXPERT: Truck,
  CPO: Sparkles
};

export const LiveAgentModal: React.FC<LiveAgentModalProps> = ({
  session,
  onClose,
  onCancel,
  onSaveToDashboard,
  isPolling
}) => {
  if (!session) return null;

  const [activeTab, setActiveTab] = useState<
    'final_report' | 'coo_decomp' | 'CTO' | 'CDO' | 'FIELD_EXPERT' | 'CPO' | 'rebuttal'
  >(session.finalReport ? 'final_report' : 'coo_decomp');

  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            AI 협업 정상 완료 (7~8회 호출 완결)
          </span>
        );
      case 'completed_with_warnings':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 font-bold border border-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            일부 결측 보고 완료 (COO 결측 인지)
          </span>
        );
      case 'timed_out':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-800 font-bold border border-rose-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            시간 초과 중단 (timed_out)
          </span>
        );
      case 'failed':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-800 font-bold border border-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            협업 실행 실패 (failed)
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 flex items-center gap-1">
            <Ban className="w-3.5 h-3.5 text-slate-600" />
            대표 직접 취소 (cancelled)
          </span>
        );
      case 'analyzing':
      default:
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-800 font-bold border border-teal-300 flex items-center gap-1 animate-pulse">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            실제 AI 임원 협업 진행 중...
          </span>
        );
    }
  };

  const expertRoles: ExecutiveRole[] = ['CTO', 'CDO', 'FIELD_EXPERT', 'CPO'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
                CF
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                실제 AI 임원 협업 관제 센터
              </h2>
              {getStatusBadge()}
              <span className="text-[11px] font-mono text-teal-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                gemini-3.8-flash (서버 호출)
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              [지시]: {session.directiveTitle}
            </p>

            {/* Token Usage Summary & Call Count Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                API 호출: <strong className="text-white">{session.totalCalls}</strong>회
              </span>
              <span>·</span>
              <span>
                프롬프트: <strong className="text-slate-200">{session.totalTokens.promptTokens}</strong> 토큰
              </span>
              <span>·</span>
              <span>
                응답: <strong className="text-slate-200">{session.totalTokens.candidatesTokens}</strong> 토큰
              </span>
              <span>·</span>
              <span className="text-teal-300">
                총 사용량: <strong className="text-teal-200">{session.totalTokens.totalTokens}</strong> 토큰
              </span>
              <span>·</span>
              <span className="text-slate-400">ID: {session.executionId}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="창 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {session.status === 'analyzing' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping shrink-0" />
            ) : session.status === 'completed' || session.status === 'completed_with_warnings' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold text-slate-800 truncate">
              {session.statusMessage}
            </span>
          </div>

          {session.status === 'analyzing' && (
            <button
              onClick={() => onCancel(session.executionId)}
              className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors shrink-0 flex items-center gap-1"
            >
              <Ban className="w-3 h-3" />
              <span>실행 취소</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs for Reports */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
          {session.finalReport && (
            <button
              onClick={() => setActiveTab('final_report')}
              className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'final_report'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>COO 최종 종합 보고서 (10대 과제)</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('coo_decomp')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'coo_decomp'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-teal-600" />
            <span>COO 업무 분해</span>
          </button>

          {expertRoles.map((role) => {
            const report = session.reports[role];
            const Icon = ROLE_ICONS[role] || Code;
            return (
              <button
                key={role}
                onClick={() => setActiveTab(role as any)}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === role
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{role} 독립 분석</span>
                {report && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      report.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'failed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {report.status === 'completed' ? '완료' : report.status === 'failed' ? '실패' : '진행'}
                  </span>
                )}
              </button>
            );
          })}

          {session.rebuttalReport && (
            <button
              onClick={() => setActiveTab('rebuttal')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'rebuttal'
                  ? 'border-indigo-600 text-indigo-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>1회 재검토 ({session.rebuttalTargetRole})</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: COO Final Report */}
          {activeTab === 'final_report' && session.finalReport && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200">
                <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>COO 총괄 브리핑 (Executive Summary)</span>
                </h3>
                <p className="text-xs text-teal-900 leading-relaxed font-medium">
                  {session.finalReport.executiveSummary}
                </p>
                <div className="mt-3 pt-2 border-t border-teal-200/80 flex items-center justify-between text-[11px] text-teal-800 font-mono">
                  <span>작성: COO (AI 비서실장)</span>
                  <span>
                    토큰: {session.finalReport.tokens.totalTokens} · 소요: {(session.finalReport.totalLatencyMs / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>

              {/* Top 10 Milestones Table (대표 테스트 업무용) */}
              {session.finalReport.top10Milestones && session.finalReport.top10Milestones.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>향후 3개월 핵심 개발 과제 TOP 10 로드맵</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold">
                        4개 부서 합의안
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      우선순위 1위 ~ 10위
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {session.finalReport.top10Milestones.map((item) => (
                      <div key={item.rank} className="p-3.5 hover:bg-slate-50/80 transition-colors text-xs">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {item.rank}
                            </span>
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 truncate">
                                  {item.title}
                                </h5>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                                  주관: {item.leadRole}
                                </span>
                                {item.timelineWeeks && (
                                  <span className="text-[10px] font-mono text-slate-500">
                                    ({item.timelineWeeks})
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {item.objective}
                              </p>
                              {item.expectedOutput && (
                                <p className="text-teal-800 text-[11px] bg-teal-50/50 p-1.5 rounded border border-teal-100 font-medium">
                                  ↳ 산출물: {item.expectedOutput}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicts and Debates */}
              {session.finalReport.conflictsAndDebates.length > 0 && (
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>부서 간 주요 이견 및 조율 내용</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-800">
                    {session.finalReport.conflictsAndDebates.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CEO Approval Items */}
              {session.finalReport.ceoApprovalNeededItems.length > 0 && (
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-teal-400 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-teal-400" />
                    <span>대표이사(CEO) 최종 승인 필요 안건</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {session.finalReport.ceoApprovalNeededItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-400 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COO Decomposition */}
          {activeTab === 'coo_decomp' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">업무 목적</span>
                <p className="text-slate-700">
                  {session.cooDecomposition?.purpose || '대표 지시 분석 중...'}
                </p>
                {session.cooDecomposition?.successCriteria && (
                  <div>
                    <span className="font-bold text-slate-800 block mt-2">성공 기준:</span>
                    <ul className="list-disc pl-4 text-slate-600 space-y-1 mt-1">
                      {session.cooDecomposition.successCriteria.map((sc, i) => (
                        <li key={i}>{sc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4대 부서 세부 배분 과제
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {session.cooDecomposition?.assignments.map((as, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-800 font-mono">[{as.role}]</span>
                        <span className="text-[11px] text-slate-500 font-medium">{as.title}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{as.objective}</p>
                      <p className="text-slate-500 text-[11px]">제약: {as.constraints}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3-6: Individual Expert Reports */}
          {expertRoles.includes(activeTab as ExecutiveRole) && (
            <div>
              {(() => {
                const role = activeTab as ExecutiveRole;
                const report = session.reports[role];
                if (!report) {
                  return (
                    <div className="p-8 text-center text-xs text-slate-500">
                      아직 {role}의 분석이 시작되지 않았습니다.
                    </div>
                  );
                }

                if (report.status === 'failed') {
                  return (
                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>{report.name} 분석 실패</span>
                      </div>
                      <p>{report.coreAnalysis}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-5 text-xs">
                    {/* Header bar */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{report.name}</h4>
                        <p className="text-slate-500 text-[11px]">{report.department} · {report.purpose}</p>
                      </div>
                      <div className="text-right text-[11px] font-mono text-slate-500">
                        <span>토큰: {report.tokens.totalTokens}</span>
                        <span className="ml-2">소요: {(report.latencyMs / 1000).toFixed(1)}s</span>
                      </div>
                    </div>

                    {/* Core Analysis */}
                    <div>
                      <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                        도메인 핵심 분석
                      </h5>
                      <p className="text-slate-700 p-3 bg-white rounded-lg border border-slate-200 leading-relaxed font-medium">
                        {report.coreAnalysis}
                      </p>
                    </div>

                    {/* Concrete Proposals */}
                    <div>
                      <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                        구체적인 제안 사항
                      </h5>
                      <ul className="space-y-1.5">
                        {report.concreteProposals.map((p, i) => (
                          <li key={i} className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-150 text-teal-900 flex items-start gap-2">
                            <span className="font-bold text-teal-600 shrink-0">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks and Critique */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                        <span className="font-bold text-amber-900 block">식별된 위험 요인:</span>
                        <ul className="list-disc pl-4 text-amber-800 space-y-1">
                          {report.risks.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1.5">
                        <span className="font-bold text-indigo-900 block">타 부서 대상 반론 및 경고:</span>
                        <p className="text-indigo-800">{report.rebuttalOrCritique}</p>
                      </div>
                    </div>

                    {/* Unconfirmed & Next steps */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 block mb-1">추가 확인 필수 사항:</span>
                      <p className="text-slate-600">{report.unconfirmedItems}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 7: Rebuttal Round Report */}
          {activeTab === 'rebuttal' && session.rebuttalReport && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200">
                <span className="font-bold text-indigo-900 block text-sm mb-1">
                  {session.rebuttalTargetRole} 1회 재검토 조정안
                </span>
                <p className="text-indigo-800 leading-relaxed font-medium">
                  {session.rebuttalReport.coreAnalysis}
                </p>
                <div className="mt-2 text-[11px] text-indigo-600 font-mono">
                  토큰: {session.rebuttalReport.tokens.totalTokens} · 소요: {(session.rebuttalReport.latencyMs / 1000).toFixed(1)}s
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1.5">조율된 제안 사항:</span>
                <ul className="space-y-1.5">
                  {session.rebuttalReport.concreteProposals.map((p, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions & Data Persistence Notice */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          {/* Official Mandated Notice */}
          <div className="text-[11px] text-slate-500 font-mono text-center leading-relaxed">
            취소 시점까지 확인된 API 호출 기록과 토큰 사용량은 현재 실행 세션 및 브라우저 로컬 스냅샷에 보존한다. 서버 재시작, 컨테이너 교체, 브라우저 데이터 삭제 시 복구할 수 없다.
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 font-mono">
              [CF Headquarters 2단계 실제 AI 에이전트]
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              >
                닫기
              </button>

              {(session.status === 'completed' || session.status === 'completed_with_warnings') && onSaveToDashboard && (
                <button
                  onClick={() => {
                    onSaveToDashboard(session);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>본사 업무 현황판에 반영</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
