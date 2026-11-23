import React from 'react';
import {
  Bot,
  BrainCircuit,
  Code,
  Database,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Executive, ExecutiveRole } from '../../types/headquarters';

interface ExecutiveGridProps {
  executives: Executive[];
  onSelectExecutive: (executive: Executive) => void;
  selectedRole?: ExecutiveRole;
}

const ROLE_ICONS: Record<ExecutiveRole, React.ElementType> = {
  CEO: ShieldCheck,
  COO: BrainCircuit,
  CTO: Code,
  CDO: Database,
  FIELD_EXPERT: Truck,
  CPO: Sparkles
};

export const ExecutiveGrid: React.FC<ExecutiveGridProps> = ({
  executives,
  onSelectExecutive,
  selectedRole
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI 핵심 임원진 현황</span>
            <span className="text-xs font-normal text-slate-500">
              (5인의 전문 AI 직원 · CEO 명령 체계)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            각 직원은 전문 도메인 업무를 자율 수행하며, 중대 변경 사항은 대표의 승인 없이는 적용할 수 없습니다.
          </p>
        </div>
        <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
          모든 직원 정상 대기 중
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {executives.map((exec) => {
          const Icon = ROLE_ICONS[exec.role] || Bot;
          const isSelected = selectedRole === exec.role;

          return (
            <div
              key={exec.id}
              onClick={() => onSelectExecutive(exec)}
              className={`p-4 bg-white rounded-xl border transition-all text-left flex flex-col justify-between hover:shadow-md cursor-pointer group ${
                isSelected
                  ? 'border-teal-500 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header: Icon, Role & Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 ${
                      exec.role === 'COO'
                        ? 'bg-teal-600 text-white'
                        : exec.role === 'CTO'
                        ? 'bg-blue-600 text-white'
                        : exec.role === 'CDO'
                        ? 'bg-indigo-600 text-white'
                        : exec.role === 'FIELD_EXPERT'
                        ? 'bg-amber-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Clean unboxed status indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-right">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        exec.status === 'working' || exec.status === 'analyzing'
                          ? 'bg-teal-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <span className="font-medium text-slate-700 text-[11px] truncate max-w-[80px]">
                      {exec.statusLabel}
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {exec.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {exec.department}
                  </p>
                </div>

                {/* Domain Focus */}
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {exec.specialization}
                </p>

                {/* Current Active Task (Test Data) */}
                {exec.currentTaskTitle && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-150">
                    <span className="text-[10px] font-semibold text-slate-500 block">
                      현재 수행 중인 업무
                    </span>
                    <span className="text-xs text-slate-800 font-medium line-clamp-1 mt-0.5">
                      {exec.currentTaskTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer: Stats & Detail Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono tabular-nums">
                  누적 보고 <strong className="text-slate-800">{exec.stats.completedReports}</strong>건
                </span>
                <span className="text-teal-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  상세 지침
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
