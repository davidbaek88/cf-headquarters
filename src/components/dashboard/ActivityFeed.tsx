import React from 'react';
import { ActivityEvent } from '../../types/headquarters';
import { Activity, Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            본사 최근 업무 타임라인
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          [테스트/세션 로컬 타임라인]
        </span>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {activities.map((act) => (
          <div key={act.id} className="py-2.5 flex items-start gap-3 text-xs">
            {/* Timestamp */}
            <span className="text-slate-400 font-mono tabular-nums text-[11px] pt-0.5 shrink-0">
              {act.timestamp}
            </span>

            {/* Actor Tag */}
            <span className="font-semibold text-slate-800 shrink-0 font-mono">
              [{act.actorRole}]
            </span>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
              <span className="font-medium text-slate-900">{act.action}: </span>
              <span className="text-slate-600 truncate">{act.target}</span>
            </div>

            {/* Status Type */}
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                act.badgeType === 'alert'
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : act.badgeType === 'warning'
                  ? 'bg-amber-50 text-amber-700'
                  : act.badgeType === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {act.badgeType === 'alert' ? '승인요청' : act.badgeType === 'success' ? '보고완료' : '진행기록'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
