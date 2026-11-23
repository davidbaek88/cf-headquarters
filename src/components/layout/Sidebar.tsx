import React from 'react';
import {
  LayoutDashboard,
  Users,
  Send,
  Building2,
  ListTodo,
  FileText,
  FolderArchive,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { NavTab } from '../../types/headquarters';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  pendingApprovalsCount
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: '본사 대시보드',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'executives' as NavTab,
      label: 'AI 직원 관리',
      icon: Users,
      badge: '5명'
    },
    {
      id: 'directives' as NavTab,
      label: '대표 업무 지시실',
      icon: Send,
      badge: undefined
    },
    {
      id: 'departments' as NavTab,
      label: '부서별 업무실',
      icon: Building2,
      badge: undefined
    },
    {
      id: 'task_status' as NavTab,
      label: '업무 진행 현황',
      icon: ListTodo,
      badge: undefined
    },
    {
      id: 'reports' as NavTab,
      label: '보고서 보관함',
      icon: FileText,
      badge: undefined
    },
    {
      id: 'knowledge' as NavTab,
      label: '회사 자료실',
      icon: FolderArchive,
      badge: undefined
    },
    {
      id: 'approvals' as NavTab,
      label: '대표 승인함',
      icon: ShieldCheck,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}건 대기` : undefined,
      badgeHighlight: pendingApprovalsCount > 0
    },
    {
      id: 'system' as NavTab,
      label: '시스템 관리',
      icon: Settings,
      badge: undefined
    }
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-teal-900/40">
              CF
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-white truncate">
                CF Headquarters
              </span>
              <span className="text-xs text-teal-400 font-medium truncate">
                ConcreteFlow AI 가상 본사
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-sm shadow-teal-900/40">
              CF
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            collapsed ? 'mx-auto mt-2 hidden' : ''
          }`}
          title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Test Data Environment Banner */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/60">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-teal-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
              1단계: UI 화면 가동 중
            </span>
            <span className="font-mono text-slate-400 text-[10px]">v1.0-alpha</span>
          </div>
        ) : (
          <div className="flex justify-center" title="1단계 프로토타입 가동 중">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-950'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium ${
                        item.badgeHighlight
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* CEO Identity Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
              CEO
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white truncate">대표이사 (나)</span>
                <span className="text-[10px] text-teal-400 font-medium">최종 승인권</span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">ConcreteFlow AI 운영</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="대표이사 (최종 승인권자)">
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-xs">
              CEO
            </div>
          </div>
        )}

        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full mt-2 p-1.5 rounded-md flex justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="사이드바 펼치기"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
