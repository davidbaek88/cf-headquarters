/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { NavTab, Executive, HQTask, ActivityEvent, ExecutiveRole, MultiAgentSession, TaskPriority } from './types/headquarters';
import { AI_EXECUTIVES, INITIAL_TEST_TASKS, INITIAL_ACTIVITY_LOGS } from './data/mockData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { ExecutivesView } from './components/views/ExecutivesView';
import { DirectivesView } from './components/views/DirectivesView';
import { ApprovalView } from './components/views/ApprovalView';
import { DepartmentView } from './components/views/DepartmentView';
import { ReportsView } from './components/views/ReportsView';
import { SystemView } from './components/views/SystemView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { ExecutiveModal } from './components/dashboard/ExecutiveModal';
import { TaskBoard } from './components/dashboard/TaskBoard';
import { LiveAgentModal } from './components/dashboard/LiveAgentModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [executives, setExecutives] = useState<Executive[]>(AI_EXECUTIVES);

  // Phase 2: Live AI Multi-Agent Session State
  const [liveSession, setLiveSession] = useState<MultiAgentSession | null>(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [liveAgentError, setLiveAgentError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // 브라우저 새로고침 시에도 대표 지시 및 승인 내역이 유지되도록 localStorage 지원
  const [tasks, setTasks] = useState<HQTask[]>(() => {
    try {
      const saved = localStorage.getItem('cf_hq_tasks_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage load failed, using mock defaults', e);
    }
    return INITIAL_TEST_TASKS;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem('cf_hq_activities_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage load failed, using mock defaults', e);
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [preselectedRoleForOrder, setPreselectedRoleForOrder] = useState<ExecutiveRole>('COO');

  // 상태 변경 시 localStorage 동기화
  React.useEffect(() => {
    try {
      localStorage.setItem('cf_hq_tasks_v1', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [tasks]);

  React.useEffect(() => {
    try {
      localStorage.setItem('cf_hq_activities_v1', JSON.stringify(activities));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [activities]);

  // 테스트 데이터 초기화
  const handleResetTestData = () => {
    setTasks(INITIAL_TEST_TASKS);
    setActivities(INITIAL_ACTIVITY_LOGS);
    setExecutives(AI_EXECUTIVES);
    try {
      localStorage.removeItem('cf_hq_tasks_v1');
      localStorage.removeItem('cf_hq_activities_v1');
    } catch (e) {
      // ignore
    }
  };

  // Phase 2 Live Multi-Agent Polling & Actions
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsPolling(false);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const pollExecutionStatus = (executionId: string) => {
    stopPolling();
    setIsPolling(true);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/agents/collaborate/${executionId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.session) {
          setLiveSession(data.session);
          const terminalStatuses = ['completed', 'completed_with_warnings', 'timed_out', 'failed', 'cancelled'];
          if (terminalStatuses.includes(data.session.status)) {
            stopPolling();
          }
        }
      } catch (e) {
        console.warn('Status polling error', e);
      }
    }, 1500);
  };

  const handleStartLiveAgent = async (params: {
    directiveTitle: string;
    directiveDescription: string;
    category: string;
    priority: TaskPriority;
    idempotencyKey: string;
  }) => {
    setLiveAgentError(null);
    try {
      const res = await fetch('/api/agents/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveAgentError(data.message || `AI 에이전트 실행 요청 실패 (HTTP ${res.status})`);
        return;
      }

      if (!data.session || !data.executionId) {
        setLiveAgentError('서버 응답에 실행 세션 정보가 포함되지 않았습니다.');
        return;
      }

      setLiveSession(data.session);
      setIsLiveModalOpen(true);
      pollExecutionStatus(data.executionId);
    } catch (e) {
      console.error('Failed to trigger live agent pipeline', e);
      setLiveAgentError('서버 연결 실패: Gemini API 에이전트 파이프라인을 호출할 수 없습니다.');
    }
  };

  const handleCancelLiveAgent = async (executionId: string) => {
    setLiveAgentError(null);
    try {
      const res = await fetch(`/api/agents/collaborate/${executionId}/cancel`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        setLiveAgentError(data.message || `세션 취소 요청 실패 (HTTP ${res.status})`);
      }
      if (data.session) {
        setLiveSession(data.session);
      }
      stopPolling();
    } catch (e) {
      console.error('Cancel request failed', e);
      setLiveAgentError('세션 취소 요청 중 서버 연결 오류가 발생했습니다.');
    }
  };

  const handleSaveSessionToDashboard = (session: MultiAgentSession) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const subTasks = Object.entries(session.reports).map(([role, report]) => ({
      id: `sub-live-${session.executionId}-${role.toLowerCase()}`,
      assignedTo: role as ExecutiveRole,
      title: report.purpose || `${role} 독립 분석 완료`,
      status: (report.status === 'completed' ? 'completed' : 'in_progress') as 'completed' | 'in_progress',
      resultSummary: report.coreAnalysis ? report.coreAnalysis.substring(0, 80) + '...' : undefined,
      detailedReport: report.coreAnalysis,
      tokensUsed: typeof report.tokens.totalTokens === 'number' ? report.tokens.totalTokens : undefined,
      executedAt: report.completedAt
    }));

    const newTask: HQTask = {
      id: `task-live-${session.executionId.replace('exec-', '')}`,
      title: `[실제 AI] ${session.directiveTitle}`,
      description: session.directiveDescription,
      originator: 'CEO (대표)',
      targetExecutive: 'COO',
      priority: session.priority,
      status: session.finalReport?.ceoApprovalNeededItems?.length ? 'awaiting_approval' : 'completed',
      statusLabel: session.finalReport?.ceoApprovalNeededItems?.length ? '대표 승인 대기 중 (10대 과제 종합)' : 'AI 협업 완결',
      progressPercent: 100,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      isTestData: false,
      isLiveAiGenerated: true,
      category: (session.category as any) || 'PRODUCT',
      notes: session.finalReport ? `COO 총괄: ${session.finalReport.executiveSummary}` : undefined,
      finalReport: session.finalReport?.executiveSummary,
      session,
      subTasks
    };

    setTasks((prev) => [newTask, ...prev]);

    // Audit log
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newActivity: ActivityEvent = {
      id: `act-live-${Date.now()}`,
      timestamp: timeStr,
      actorRole: 'COO',
      actorName: 'COO (비서실장)',
      action: '실제 AI 임원 협업 결과 등록',
      target: `[${session.totalCalls}회 호출 / ${session.totalTokens.totalTokens} 토큰] ${session.directiveTitle}`,
      badgeType: 'success',
      isTestData: false
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Update executives workload stats
    setExecutives((prev) =>
      prev.map((exec) => {
        if (session.reports[exec.role] || exec.role === 'COO') {
          return {
            ...exec,
            status: 'idle',
            statusLabel: '정상 대기 (협업 분석 완료)',
            stats: {
              ...exec.stats,
              completedReports: exec.stats.completedReports + 1,
              collaborationCount: exec.stats.collaborationCount + 1
            }
          };
        }
        return exec;
      })
    );
  };

  const handleViewReport = (task: HQTask) => {
    if (task.session) {
      setLiveSession(task.session);
      setIsLiveModalOpen(true);
    }
  };

  // Handle New CEO Directive
  const handleNewDirective = (newTask: HQTask) => {
    setTasks((prev) => [newTask, ...prev]);

    // Append to activity log
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      actorRole: 'CEO',
      actorName: '대표 (CEO)',
      action: '업무 지시 발령',
      target: newTask.title,
      badgeType: 'info',
      isTestData: true
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Update target executive's active status
    setExecutives((prev) =>
      prev.map((exec) => {
        if (exec.role === newTask.targetExecutive) {
          return {
            ...exec,
            status: 'working',
            statusLabel: '지시 접수 및 분석 중',
            currentTaskTitle: newTask.title,
            stats: {
              ...exec.stats,
              activeTasks: exec.stats.activeTasks + 1
            }
          };
        }
        return exec;
      })
    );
  };

  // Handle Representative Approval
  const handleApproveTask = (taskId: string, comment?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
            now.getDate()
          ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')}`;

          return {
            ...t,
            status: 'completed',
            statusLabel: '대표 승인 완료 및 배포 허가',
            progressPercent: 100,
            updatedAt: formattedDate,
            approvalComment: comment,
            approvedAt: formattedDate,
            approvedBy: 'CEO (대표)',
            notes: comment ? `대표 승인 코멘트: ${comment}` : '대표이사 정식 승인 완료'
          };
        }
        return t;
      })
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      actorRole: 'CEO',
      actorName: '대표 (CEO)',
      action: '대표 승인 처리',
      target: `[안건 ${taskId}] 운영 변경 정식 허가됨`,
      badgeType: 'success',
      isTestData: true
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Handle Representative Rejection
  const handleRejectTask = (taskId: string, comment?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
            now.getDate()
          ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')}`;

          return {
            ...t,
            status: 'revision_requested',
            statusLabel: '대표 반려에 따른 재검토',
            progressPercent: 50,
            updatedAt: formattedDate,
            notes: comment ? `반려 사유: ${comment}` : '대표이사의 보완 요구로 재검토 진행'
          };
        }
        return t;
      })
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: timeStr,
      actorRole: 'CEO',
      actorName: '대표 (CEO)',
      action: '안건 보완 반려',
      target: `[안건 ${taskId}] 재검토 및 반론 보강 지시`,
      badgeType: 'alert',
      isTestData: true
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Direct order shortcut to specific executive
  const handleDirectOrder = (role: ExecutiveRole) => {
    setPreselectedRoleForOrder(role);
    setCurrentTab('directives');
  };

  // Filter tasks and executives by search query if present
  const filteredTasks = searchQuery.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const pendingApprovalsCount = tasks.filter((t) => t.status === 'awaiting_approval').length;

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* 2. Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onNewDirectiveClick={() => {
            setPreselectedRoleForOrder('COO');
            setCurrentTab('directives');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetData={handleResetTestData}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {liveAgentError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 font-medium">
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                  AI 실행 오류
                </span>
                <span>{liveAgentError}</span>
              </div>
              <button
                type="button"
                onClick={() => setLiveAgentError(null)}
                className="px-2.5 py-1 rounded border border-rose-300 bg-white hover:bg-rose-100 text-rose-800 font-semibold text-[11px] shrink-0 cursor-pointer"
              >
                닫기
              </button>
            </div>
          )}
          {currentTab === 'dashboard' && (
            <DashboardView
              tasks={filteredTasks}
              executives={executives}
              activities={activities}
              onSelectExecutive={setSelectedExecutive}
              onSubmitDirective={handleNewDirective}
              onOpenApprovalModal={(task) => {
                setCurrentTab('approvals');
              }}
              onNavigateTab={setCurrentTab}
              onStartLiveAgent={handleStartLiveAgent}
              onViewReport={handleViewReport}
            />
          )}

          {currentTab === 'executives' && (
            <ExecutivesView
              executives={executives}
              tasks={filteredTasks}
              onSelectExecutive={setSelectedExecutive}
              onDirectOrder={handleDirectOrder}
            />
          )}

          {currentTab === 'directives' && (
            <DirectivesView
              tasks={filteredTasks}
              onSubmitDirective={handleNewDirective}
              onOpenApprovalModal={() => setCurrentTab('approvals')}
              preselectedRole={preselectedRoleForOrder}
              onStartLiveAgent={handleStartLiveAgent}
              onViewReport={handleViewReport}
            />
          )}

          {currentTab === 'task_status' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">
                  전체 업무 진행 현황 파이프라인 상세
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  COO 작업 분해 및 5인의 AI 임원 간 상호 협업/검증 내역을 실시간으로 확인합니다.
                </p>
              </div>
              <TaskBoard
                tasks={filteredTasks}
                onOpenApprovalModal={() => setCurrentTab('approvals')}
                onViewReport={handleViewReport}
              />
            </div>
          )}

          {currentTab === 'approvals' && (
            <ApprovalView
              tasks={tasks}
              onApproveTask={handleApproveTask}
              onRejectTask={handleRejectTask}
            />
          )}

          {currentTab === 'departments' && (
            <DepartmentView
              executives={executives}
              onDirectOrder={handleDirectOrder}
            />
          )}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'knowledge' && <KnowledgeView />}

          {currentTab === 'system' && <SystemView />}
        </main>
      </div>

      {/* 3. Executive Detail Modal */}
      <ExecutiveModal
        executive={selectedExecutive}
        onClose={() => setSelectedExecutive(null)}
        onAssignTask={(role) => handleDirectOrder(role as ExecutiveRole)}
      />

      {/* 4. Live AI Multi-Agent Collaboration Modal */}
      {isLiveModalOpen && (
        <LiveAgentModal
          session={liveSession}
          onClose={() => setIsLiveModalOpen(false)}
          onCancel={handleCancelLiveAgent}
          onSaveToDashboard={handleSaveSessionToDashboard}
          isPolling={isPolling}
        />
      )}
    </div>
  );
}
