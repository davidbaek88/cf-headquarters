import React from 'react';
import { Users, Clock, ShieldAlert, FileCheck, Layers } from 'lucide-react';
import { HQTask, Executive } from '../../types/headquarters';

interface MetricCardsProps {
  tasks: HQTask[];
  executives: Executive[];
  onFilterClick?: (filterType: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  tasks,
  executives,
  onFilterClick
}) => {
  const activeTasksCount = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'awaiting_approval'
  ).length;

  const awaitingApprovalCount = tasks.filter(
    (t) => t.status === 'awaiting_approval'
  ).length;

  const completedReportsCount = tasks.filter(
    (t) => t.status === 'completed'
  ).length;

  const workingExecutivesCount = executives.filter(
    (e) => e.status === 'working' || e.status === 'analyzing'
  ).length;

  const metrics = [
    {
      id: 'executives',
      label: '가동 중인 AI 임원',
      value: `${workingExecutivesCount} / ${executives.length}`,
      unit: '명 가동 중',
      sublabel: 'COO, CTO, CDO, 현장전문가, CPO',
      icon: Users,
      color: 'teal'
    },
    {
      id: 'active_tasks',
      label: '실시간 진행 업무',
      value: activeTasksCount.toString(),
      unit: '건 실무 중',
      sublabel: '부서별 분해 및 개발 진행',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 'pending_approval',
      label: '대표 승인 대기',
      value: awaitingApprovalCount.toString(),
      unit: '건 검토 필요',
      sublabel: '운영 변경 및 DB 스키마 승인 요청',
      icon: ShieldAlert,
      color: 'amber',
      highlight: awaitingApprovalCount > 0
    },
    {
      id: 'completed_reports',
      label: '취합 완료 보고서',
      value: completedReportsCount.toString(),
      unit: '건 보관됨',
      sublabel: '현재 세션 완료 보고서 기준',
      icon: FileCheck,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            onClick={() => onFilterClick && onFilterClick(m.id)}
            className={`p-4 bg-white rounded-xl border transition-all cursor-pointer hover:shadow-sm ${
              m.highlight
                ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{m.label}</span>
              <div
                className={`p-2 rounded-lg ${
                  m.color === 'teal'
                    ? 'bg-teal-50 text-teal-700'
                    : m.color === 'blue'
                    ? 'bg-blue-50 text-blue-700'
                    : m.color === 'amber'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-purple-50 text-purple-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
                {m.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">{m.unit}</span>
            </div>

            <p className="mt-2 text-xs text-slate-500 truncate border-t border-slate-100 pt-2">
              {m.sublabel}
            </p>
          </div>
        );
      })}
    </div>
  );
};
