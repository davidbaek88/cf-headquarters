import React, { useState } from 'react';
import { Executive, ExecutiveRole, HQTask } from '../../types/headquarters';
import { CEO_PROFILE } from '../../data/mockData';
import {
  Users,
  ShieldCheck,
  BrainCircuit,
  Code,
  Database,
  Truck,
  Sparkles,
  Lock,
  CheckCircle2,
  FileText,
  Send,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ExecutivesViewProps {
  executives: Executive[];
  tasks?: HQTask[];
  onSelectExecutive: (exec: Executive) => void;
  onDirectOrder: (role: ExecutiveRole) => void;
}

const ROLE_ICONS: Record<ExecutiveRole, React.ElementType> = {
  CEO: ShieldCheck,
  COO: BrainCircuit,
  CTO: Code,
  CDO: Database,
  FIELD_EXPERT: Truck,
  CPO: Sparkles
};

export const ExecutivesView: React.FC<ExecutivesViewProps> = ({
  executives,
  tasks = [],
  onSelectExecutive,
  onDirectOrder
}) => {
  const [activeTabRole, setActiveTabRole] = useState<ExecutiveRole>('COO');

  const allStaff = [CEO_PROFILE, ...executives];
  const currentExecutive = allStaff.find((s) => s.role === activeTabRole) || executives[0];
  const CurrentIcon = ROLE_ICONS[currentExecutive.role] || Users;

  const assignedDirectTasks = tasks.filter((t) => t.targetExecutive === currentExecutive.role);
  const assignedSubTasks = tasks.flatMap((t) =>
    t.subTasks
      .filter((s) => s.assignedTo === currentExecutive.role)
      .map((s) => ({ ...s, parentTaskTitle: t.title, parentTaskId: t.id }))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <span>CF Headquarters 조직 체계 및 AI 직원 관리</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              대표 1인과 5인의 AI 임원으로 구성되며, 자율 권한과 대표 명시적 승인 권한이 엄격히 분리되어 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
            <span>조직 구성: 대표 1명 + AI 임원 5명</span>
          </div>
        </div>

        {/* Executive Selector Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4 border-t border-slate-100">
          {allStaff.map((staff) => {
            const Icon = ROLE_ICONS[staff.role] || Users;
            const isSelected = activeTabRole === staff.role;

            return (
              <button
                key={staff.id}
                onClick={() => setActiveTabRole(staff.role)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      staff.role === 'CEO'
                        ? 'bg-slate-900 text-white'
                        : staff.role === 'COO'
                        ? 'bg-teal-600 text-white'
                        : staff.role === 'CTO'
                        ? 'bg-blue-600 text-white'
                        : staff.role === 'CDO'
                        ? 'bg-indigo-600 text-white'
                        : staff.role === 'FIELD_EXPERT'
                        ? 'bg-amber-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {staff.isAi ? 'AI' : 'Human'}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {staff.role}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {staff.name.split(' ')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Executive Detailed Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md ${
                currentExecutive.role === 'CEO'
                  ? 'bg-slate-900'
                  : currentExecutive.role === 'COO'
                  ? 'bg-teal-600'
                  : currentExecutive.role === 'CTO'
                  ? 'bg-blue-600'
                  : currentExecutive.role === 'CDO'
                  ? 'bg-indigo-600'
                  : currentExecutive.role === 'FIELD_EXPERT'
                  ? 'bg-amber-600'
                  : 'bg-purple-600'
              }`}
            >
              <CurrentIcon className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {currentExecutive.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-medium">
                  {currentExecutive.department}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    currentExecutive.status === 'working'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {currentExecutive.statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentExecutive.title}
              </p>
            </div>
          </div>

          {currentExecutive.role !== 'CEO' && (
            <button
              onClick={() => onDirectOrder(currentExecutive.role)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{currentExecutive.role}에게 직접 지시 발령</span>
            </button>
          )}
        </div>

        {/* Specialization & Role in ConcreteFlow AI */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            도메인 전문성 및 본사 내 역할
          </h4>
          <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed font-medium">
            {currentExecutive.specialization}
          </p>
        </div>

        {/* Guidelines Summary */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-600" />
            업무 행동 원칙 및 지침
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentExecutive.guidelinesSummary.map((guide, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs"
              >
                <div className="text-teal-700 font-bold mb-1">원칙 {idx + 1}</div>
                {guide}
              </div>
            ))}
          </div>
        </div>

        {/* Key Responsibilities */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            주요 담당 업무 (Key Responsibilities)
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentExecutive.keyResponsibilities.map((resp, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 flex items-center gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-150"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Permissions Boundary Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Autonomous Permissions */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
            <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              자율 수행 가능 권한 (대표 사전 승인 불필요)
            </h5>
            <ul className="space-y-1.5">
              {currentExecutive.autonomousPermissions.map((perm, idx) => (
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
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2.5">
              <Lock className="w-4 h-4 text-amber-600" />
              대표 명시적 승인 필수 (자율 실행 불가 · 차단됨)
            </h5>
            {currentExecutive.restrictedPermissions.length > 0 ? (
              <ul className="space-y-1.5">
                {currentExecutive.restrictedPermissions.map((perm, idx) => (
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
              <p className="text-xs text-slate-600 italic">
                최고 승인권자로서 모든 권한을 행사합니다.
              </p>
            )}
          </div>
        </div>

        {/* Currently Assigned Tasks (독립 업무 관리 확인) */}
        {currentExecutive.role !== 'CEO' && (
          <div className="pt-2 border-t border-slate-150">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{currentExecutive.name}에게 배정된 현재 업무 내역</span>
              <span className="text-[11px] font-mono text-slate-500">
                총 {assignedDirectTasks.length + assignedSubTasks.length}건
              </span>
            </h4>

            {assignedDirectTasks.length === 0 && assignedSubTasks.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
                현재 대기 중인 업무가 없습니다. 새로운 대표 지시를 발령할 수 있습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {assignedDirectTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-teal-50/40 rounded-lg border border-teal-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded mr-2">
                        직속 총괄
                      </span>
                      <span className="font-bold text-slate-900">{t.title}</span>
                      <span className="text-slate-500 text-[11px] ml-2">({t.statusLabel})</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-teal-700">{t.progressPercent}%</span>
                  </div>
                ))}

                {assignedSubTasks.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded mr-2">
                        세부 분해 업무
                      </span>
                      <span className="font-bold text-slate-800">{st.title}</span>
                      <span className="text-slate-500 text-[11px] ml-2">↳ 상위: {st.parentTaskTitle}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        st.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 font-semibold'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {st.status === 'completed' ? '완료' : '진행 중'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
