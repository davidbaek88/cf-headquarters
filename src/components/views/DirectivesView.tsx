import React from 'react';
import { HQTask, ExecutiveRole } from '../../types/headquarters';
import { TaskOrderForm } from '../dashboard/TaskOrderForm';
import { TaskBoard } from '../dashboard/TaskBoard';
import { BrainCircuit, Send, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DirectivesViewProps {
  tasks: HQTask[];
  onSubmitDirective: (task: HQTask) => void;
  onOpenApprovalModal: (task: HQTask) => void;
  preselectedRole?: ExecutiveRole;
  onStartLiveAgent?: (params: {
    directiveTitle: string;
    directiveDescription: string;
    category: string;
    priority: any;
    idempotencyKey: string;
  }) => void;
  onViewReport?: (task: HQTask) => void;
}

export const DirectivesView: React.FC<DirectivesViewProps> = ({
  tasks,
  onSubmitDirective,
  onOpenApprovalModal,
  preselectedRole = 'COO',
  onStartLiveAgent,
  onViewReport
}) => {
  return (
    <div className="space-y-6">
      {/* Workflow Explainer Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">
              대표 업무 지시 및 COO 총괄 프로세스
            </h2>
            <p className="text-xs text-slate-300">
              대표는 상위 목표만 지시하면, COO(비서실장)가 즉시 업무를 분해하고 4인의 전문 임원에게 배분합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-teal-400 font-bold block mb-1">01. 대표 지시 발령</span>
            <span>대표가 도메인 문제(예: OCR 오인식, 배차 지연)를 명령</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-teal-400 font-bold block mb-1">02. COO 세부 작업 분해</span>
            <span>CDO, 현장전문가, CTO, CPO에게 개별 서브태스크 자동 할당</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-teal-400 font-bold block mb-1">03. 상호 검토 및 반론</span>
            <span>각 직원의 결과물을 상호 검증(예: 현장전문가의 현장성 평가)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span className="text-[10px] text-teal-400 font-bold block mb-1">04. 대표 최종 보고 및 승인</span>
            <span>COO가 취합한 보고서를 제출하고 중대 변경 승인 요청</span>
          </div>
        </div>
      </div>

      {/* Input Terminal */}
      <TaskOrderForm
        onSubmitDirective={onSubmitDirective}
        preselectedRole={preselectedRole}
        onStartLiveAgent={onStartLiveAgent}
      />

      {/* Existing Directives Table */}
      <TaskBoard
        tasks={tasks}
        onOpenApprovalModal={onOpenApprovalModal}
        onViewReport={onViewReport}
      />
    </div>
  );
};
