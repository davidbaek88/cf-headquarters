import React, { useState } from 'react';
import {
  HQTask,
  TaskStatus,
  TaskPriority,
  ExecutiveRole
} from '../../types/headquarters';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Code,
  Database,
  Truck,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface TaskBoardProps {
  tasks: HQTask[];
  onOpenApprovalModal?: (task: HQTask) => void;
  onSelectTask?: (task: HQTask) => void;
  onViewReport?: (task: HQTask) => void;
}

const ROLE_ICONS: Record<ExecutiveRole, React.ElementType> = {
  CEO: ShieldAlert,
  COO: BrainCircuit,
  CTO: Code,
  CDO: Database,
  FIELD_EXPERT: Truck,
  CPO: Sparkles
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onOpenApprovalModal,
  onSelectTask,
  onViewReport
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'awaiting_approval' | 'completed'>('all');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({
    'task-test-001': true,
    'task-test-003': true
  });

  const toggleExpand = (id: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'in_progress') {
      return task.status === 'in_progress' || task.status === 'coo_dispatching' || task.status === 'cross_review' || task.status === 'revision_requested';
    }
    if (filter === 'awaiting_approval') {
      return task.status === 'awaiting_approval';
    }
    if (filter === 'completed') {
      return task.status === 'completed';
    }
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">긴급</span>;
      case 'high':
        return <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">높음</span>;
      case 'normal':
        return <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">보통</span>;
      case 'low':
        return <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">낮음</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'coo_dispatching':
        return <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">COO 작업 분해 중</span>;
      case 'in_progress':
        return <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">부서별 실무 진행 중</span>;
      case 'cross_review':
        return <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">교차 검토 및 반론 단계</span>;
      case 'awaiting_approval':
        return <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300 animate-pulse">대표 승인 대기 중</span>;
      case 'revision_requested':
        return <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">대표 반려 및 재검토</span>;
      case 'completed':
        return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">취합 및 완료</span>;
      default:
        return <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">접수 대기</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Mandated Local Snapshot Banner */}
      <div className="px-4 py-2 bg-slate-900 text-slate-300 text-[11px] font-mono flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <span className="text-teal-300 font-medium">
          안내: 2단계는 AI 에이전트 파이프라인 검증 단계로, 데이터는 브라우저 로컬 스냅샷으로 보존되며 서버 영구 저장은 지원하지 않습니다. (4단계 Supabase 연동 시 영구 저장 지원 예정)
        </span>
        <span className="text-slate-400 shrink-0">gemini-3.8-flash</span>
      </div>

      {/* Board Header & Filter Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              업무 진행 현황 파이프라인
            </h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({filteredTasks.length}건)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            지시 접수 → COO 분해 → 4대 부서 실무 → 상호 반론 검증 → 대표 승인
          </p>
        </div>

        {/* Filter Tabs (Interactive filter controls allowed by constitution) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'in_progress'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            진행 중
          </button>
          <button
            onClick={() => setFilter('awaiting_approval')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'awaiting_approval'
                ? 'bg-white text-amber-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            승인 대기
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            완료
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            해당 조건의 업무가 없습니다. 새로운 대표 지시를 내려보세요.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = !!expandedTaskIds[task.id];

            return (
              <div key={task.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Top line metadata (unboxed, separated by middots) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                      {task.isLiveAiGenerated ? (
                        <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-700" />
                          [실제 AI 에이전트 생성]
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          [테스트 데이터]
                        </span>
                      )}
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">{task.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>카테고리: {task.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{task.createdAt}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Notes & Progress */}
                    {task.notes && (
                      <p className="text-xs text-teal-800 bg-teal-50/60 px-2.5 py-1 rounded border border-teal-150 inline-block font-medium">
                        💡 진행 메모: {task.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Progress & Action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 font-medium">진행률 </span>
                      <span className="text-sm font-bold font-mono tabular-nums text-slate-800">
                        {task.progressPercent}%
                      </span>
                    </div>

                    <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          task.status === 'awaiting_approval'
                            ? 'bg-amber-500'
                            : task.status === 'revision_requested'
                            ? 'bg-rose-500'
                            : task.status === 'completed'
                            ? 'bg-emerald-500'
                            : 'bg-teal-600'
                        }`}
                        style={{ width: `${task.progressPercent}%` }}
                      />
                    </div>

                    {task.session && onViewReport && (
                      <button
                        onClick={() => onViewReport(task)}
                        className="mt-1 px-3 py-1 text-xs font-bold text-teal-900 bg-teal-100 hover:bg-teal-200 border border-teal-300 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        <span>AI 협업 보고서 열람</span>
                      </button>
                    )}

                    {task.status === 'awaiting_approval' && onOpenApprovalModal && (
                      <button
                        onClick={() => onOpenApprovalModal(task)}
                        className="mt-1 px-3 py-1 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 shadow-xs animate-bounce"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>대표 승인 심사</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium mt-1"
                    >
                      <span>세부 AI 분해 내역 ({task.subTasks.length})</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-tasks Accordion */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 pl-2 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-between">
                      <span>COO 작업 분해 및 부서별 담당 업무 (AI 멀티 에이전트 연계)</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        상호 반론 및 검증 규칙 활성화
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {task.subTasks.map((sub) => {
                        const SubIcon = ROLE_ICONS[sub.assignedTo] || BrainCircuit;

                        return (
                          <div
                            key={sub.id}
                            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs flex items-start gap-2.5"
                          >
                            <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-slate-700 shadow-2xs">
                              <SubIcon className="w-3.5 h-3.5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-bold text-slate-800 truncate">
                                  {sub.assignedTo} ({sub.assignedTo === 'CDO' ? '데이터연구' : sub.assignedTo === 'CTO' ? '개발팀' : sub.assignedTo === 'FIELD_EXPERT' ? '현장전문' : '제품기획'})
                                </span>
                                <span
                                  className={`text-[10px] font-medium px-1.5 py-0.2 rounded font-mono ${
                                    sub.status === 'completed'
                                      ? 'text-emerald-700 bg-emerald-50'
                                      : sub.status === 'in_progress'
                                      ? 'text-blue-700 bg-blue-50'
                                      : 'text-slate-500 bg-slate-100'
                                  }`}
                                >
                                  {sub.status === 'completed'
                                    ? '완료'
                                    : sub.status === 'in_progress'
                                    ? '실행 중'
                                    : '대기'}
                                </span>
                              </div>

                              <p className="text-slate-700 font-medium leading-tight">
                                {sub.title}
                              </p>

                              {sub.resultSummary && (
                                <p className="text-[11px] text-teal-800 mt-1 bg-white/80 p-1.5 rounded border border-slate-200 leading-tight">
                                  ↳ {sub.resultSummary}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
