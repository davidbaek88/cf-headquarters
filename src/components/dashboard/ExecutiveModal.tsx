import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileText,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Executive } from '../../types/headquarters';

interface ExecutiveModalProps {
  executive: Executive | null;
  onClose: () => void;
  onAssignTask?: (role: string) => void;
}

export const ExecutiveModal: React.FC<ExecutiveModalProps> = ({
  executive,
  onClose,
  onAssignTask
}) => {
  if (!executive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {executive.role}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {executive.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono border border-slate-700">
                  {executive.isAi ? 'AI 전문 임원' : '인간 대표이사'}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-0.5">
                {executive.title} · {executive.department}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status and Active Task */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">현재 업무 상태</span>
              <span className="font-mono text-teal-700 font-semibold">{executive.statusLabel}</span>
            </div>
            <p className="text-sm font-medium text-slate-800">
              {executive.currentTaskTitle || '현재 대기 중이며 새로운 대표 지시를 기다리고 있습니다.'}
            </p>
          </div>

          {/* Specialization */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-teal-600" />
              전문 영역 및 도메인 전문성
            </h3>
            <p className="text-sm text-slate-700 bg-teal-50/40 p-3.5 rounded-lg border border-teal-150 leading-relaxed">
              {executive.specialization}
            </p>
          </div>

          {/* Key Guidelines (업무 지침) */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              업무 수행 원칙 및 행동 지침
            </h3>
            <ul className="space-y-2">
              {executive.guidelinesSummary.map((guide, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions Grid: Autonomous vs Restricted */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Autonomous Permissions */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                자율 수행 가능 권한 (대표 사전승인 불필요)
              </h4>
              <ul className="space-y-1.5">
                {executive.autonomousPermissions.map((perm, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-emerald-800 flex items-start gap-2"
                  >
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restricted Permissions */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2.5">
                <Lock className="w-4 h-4 text-amber-600" />
                대표 명시적 승인 필수 항목 (자율 실행 불가)
              </h4>
              {executive.restrictedPermissions.length > 0 ? (
                <ul className="space-y-1.5">
                  {executive.restrictedPermissions.map((perm, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-amber-800 flex items-start gap-2"
                    >
                      <span className="text-amber-500 font-bold shrink-0">!</span>
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  대표이사이므로 최고 권한을 행사합니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            [테스트 데이터 환경: 지침 열람 모드]
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              닫기
            </button>
            {onAssignTask && (
              <button
                onClick={() => {
                  onClose();
                  onAssignTask(executive.role);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>이 임원에게 업무 지시</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
