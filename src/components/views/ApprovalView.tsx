import React, { useState } from 'react';
import { HQTask } from '../../types/headquarters';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Code,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ApprovalViewProps {
  tasks: HQTask[];
  onApproveTask: (taskId: string, comment?: string) => void;
  onRejectTask: (taskId: string, comment?: string) => void;
}

export const ApprovalView: React.FC<ApprovalViewProps> = ({
  tasks,
  onApproveTask,
  onRejectTask
}) => {
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const pendingTasks = tasks.filter((t) => t.status === 'awaiting_approval');
  const pastApprovals = tasks.filter((t) => t.status === 'completed');

  const handleCommentChange = (taskId: string, text: string) => {
    setCommentText((prev) => ({ ...prev, [taskId]: text }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>대표 승인함 (CEO Approval Gate)</span>
                {pendingTasks.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                    {pendingTasks.length}건 대기 중
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                운영 코드 병합(Merge), 프로덕션 배포, 운영 DB 스키마 수정 등은 대표의 명시적 승인 없이는 결코 실행되지 않습니다.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            인증 주체: 대표이사 (David Baek)
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>승인 심사 대기 목록</span>
          <span className="text-slate-400 font-mono">({pendingTasks.length})</span>
        </h3>

        {pendingTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-slate-800">현재 대기 중인 승인 안건이 없습니다.</p>
            <p className="mt-1 text-slate-400">AI 직원들이 대표의 승인 권한을 우회하지 않고 안전하게 업무를 수행하고 있습니다.</p>
          </div>
        ) : (
          pendingTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-xs relative overflow-hidden"
            >
              {/* Top Banner Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                    승인 요청 건 [{task.id}]
                  </span>
                  <span className="text-xs text-slate-500">
                    요청 부서: <strong className="text-slate-800">{task.targetExecutive}</strong>
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  요청 일시: {task.updatedAt}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-3">
                <h4 className="text-base font-bold text-slate-900">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Technical Security Impact Review */}
              <div className="mt-4 p-3.5 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>시스템 안전 및 격리 검토 리포트</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  본 작업은 Supabase 운영 데이터베이스에 직접 영향을 미치지 않도록 <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-[11px]">headquarters</code> 독립 스키마 내에서만 적용되도록 설계되었습니다. 대표 승인 전까지 실제 변경 명령은 잠겨 있습니다.
                </p>
              </div>

              {/* Sub-task Results Checklist */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  실행 전 사전 검토 완료 항목:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {task.subTasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="text-slate-700 font-medium truncate mr-2">
                        {sub.assignedTo}: {sub.title}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono shrink-0">
                        완료됨
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Representative Review Input & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    대표 의견 및 승인 조건 메모 (선택사항)
                  </label>
                  <input
                    type="text"
                    value={commentText[task.id] || ''}
                    onChange={(e) => handleCommentChange(task.id, e.target.value)}
                    placeholder="예: 격리 스키마 생성 허가함. 단, 메인 데이터베이스 접근 권한은 읽기 전용으로 제한할 것."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => onRejectTask(task.id, commentText[task.id])}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span>반려 및 재검토 명령</span>
                  </button>

                  <button
                    onClick={() => onApproveTask(task.id, commentText[task.id])}
                    className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-900/10 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>대표 승인 및 실행 허가 (Approve)</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Approved History */}
      {pastApprovals.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            과거 승인 및 완료 이력
          </h3>
          <div className="divide-y divide-slate-100">
            {pastApprovals.map((task) => (
              <div key={task.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{task.title}</span>
                  <span className="text-slate-400 text-[11px] ml-2 font-mono">
                    완료일시: {task.updatedAt}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  대표 승인 완료
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
