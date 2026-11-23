import React from 'react';
import { NavTab } from '../../types/headquarters';
import { Send, Shield, AlertTriangle, Search, Info } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onNewDirectiveClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetData?: () => void;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: '본사 대시보드',
    subtitle: 'ConcreteFlow AI 가상 본사 총괄 현황 및 AI 임원 현황'
  },
  executives: {
    title: 'AI 직원 관리',
    subtitle: '5개 전문 분야 AI 임원 조직도 및 자율 권한/업무 지침'
  },
  directives: {
    title: '대표 업무 지시실',
    subtitle: 'CEO 전용 업무 지시 발령 및 COO 중심 업무 분해 터미널'
  },
  departments: {
    title: '부서별 업무실',
    subtitle: '운영기획실, 엔지니어링본부, 데이터연구실, 현장운영실, 제품기획실'
  },
  task_status: {
    title: '업무 진행 현황',
    subtitle: '접수, COO 분해, 부서 실무, 교차 검토, 대표 승인 대기 전체 파이프라인'
  },
  reports: {
    title: '보고서 보관함',
    subtitle: 'AI 임원진이 작성 및 취합한 공식 업무 결과 보고서 보관소'
  },
  knowledge: {
    title: '회사 자료실',
    subtitle: '운행일보 샘플, 배차 표준 규격, OCR 예외 규정 등 지식 아카이브'
  },
  approvals: {
    title: '대표 승인함',
    subtitle: '운영 코드 병합, DB 스키마 수정 등 대표 승인 대기 목록'
  },
  system: {
    title: '시스템 관리',
    subtitle: 'CF Headquarters 환경 설정, 토큰 사용량 및 접근 권한 통제'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNewDirectiveClick,
  searchQuery,
  onSearchChange,
  onResetData
}) => {
  const currentInfo = TAB_TITLES[currentTab] || TAB_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-6 transition-all">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>CF Headquarters</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="text-teal-700 font-semibold">{currentInfo.title}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
            [테스트 데이터 모드]
          </span>
          {onResetData && (
            <button
              onClick={onResetData}
              className="text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors"
              title="테스트 데이터를 초기값으로 리셋합니다"
            >
              데이터 리셋
            </button>
          )}
        </div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate mt-0.5">
          {currentInfo.title}
        </h1>
      </div>

      {/* Center: Quick Search Bar */}
      <div className="hidden lg:flex items-center max-w-xs w-full relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="업무, AI 직원, 보고서 검색..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right: CEO Action Zone */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-medium text-slate-800">대표 권한 유효</span>
        </div>

        <button
          onClick={onNewDirectiveClick}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors shadow-sm shadow-teal-900/10 whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          <span>대표 업무 지시 발령</span>
        </button>
      </div>
    </header>
  );
};
