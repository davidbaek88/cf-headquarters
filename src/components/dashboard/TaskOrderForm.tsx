import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookmarkPlus,
  HelpCircle
} from 'lucide-react';
import { ExecutiveRole, HQTask, TaskPriority } from '../../types/headquarters';
import { DIRECTIVE_PRESETS } from '../../data/mockData';

interface TaskOrderFormProps {
  onSubmitDirective: (newTask: HQTask) => void;
  onStartLiveAgent?: (params: {
    directiveTitle: string;
    directiveDescription: string;
    category: string;
    priority: TaskPriority;
    idempotencyKey: string;
  }) => void;
  preselectedRole?: ExecutiveRole;
}

export const TaskOrderForm: React.FC<TaskOrderFormProps> = ({
  onSubmitDirective,
  onStartLiveAgent,
  preselectedRole = 'COO'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState<ExecutiveRole>(preselectedRole);
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [category, setCategory] = useState<'OCR' | 'FIELD' | 'SYSTEM' | 'PRODUCT' | 'DISPATCH'>('OCR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentIdempotencyKey, setCurrentIdempotencyKey] = useState<string>('');

  const applyOfficialTestPreset = () => {
    setTitle('ConcreteFlow AI의 현재 개발 상황을 기준으로 향후 3개월 동안 가장 중요한 개발 과제 10개를 선정하라');
    setDescription(
      'CTO는 기술적 구현 가능성과 아키텍처 위험, CDO는 운행일보 OCR 및 데이터 확보 기반, 현장 전문가는 레미콘 배차 관행 및 현장 적용성, CPO는 MVP 완성도와 고객 가치 중심 우선순위를 각각 독립 분석하고, COO는 전체 의견을 통합하여 최종 10개 과제 순위와 로드맵을 확정할 것.'
    );
    setTargetRole('COO');
    setPriority('urgent');
    setCategory('PRODUCT');
    // 새 지시 작성 시 고유 멱등키 신규 발급
    setCurrentIdempotencyKey(`idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
  };

  const applyPreset = (preset: typeof DIRECTIVE_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setTargetRole(preset.targetExecutive);
    setPriority(preset.priority);
    setCategory(preset.category);
    setCurrentIdempotencyKey(`idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
  };

  const handleLiveAiStart = () => {
    if (!title.trim() || !description.trim() || !onStartLiveAgent) return;

    // 키가 없으면 1회 발급, 동일 지시 재시도 시에는 기존 키 재사용
    const key = currentIdempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    setCurrentIdempotencyKey(key);

    onStartLiveAgent({
      directiveTitle: title.trim(),
      directiveDescription: description.trim(),
      category,
      priority,
      idempotencyKey: key
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const taskId = `task-test-${uniqueSuffix}`;

    const newTask: HQTask = {
      id: taskId,
      title: `[테스트 데이터] ${title.trim()}`,
      description: description.trim(),
      originator: 'CEO (대표)',
      targetExecutive: targetRole,
      priority,
      status: targetRole === 'COO' ? 'coo_dispatching' : 'in_progress',
      statusLabel: targetRole === 'COO' ? 'COO 작업 분해 중' : '실무 진행 중',
      progressPercent: 20,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      isTestData: true,
      category,
      subTasks:
        targetRole === 'COO'
          ? [
              {
                id: `sub-${uniqueSuffix}-cdo`,
                assignedTo: 'CDO',
                title: '관련 레미콘 운행일보 데이터 패턴 분석',
                status: 'in_progress'
              },
              {
                id: `sub-${uniqueSuffix}-field`,
                assignedTo: 'FIELD_EXPERT',
                title: '현장 배차 실무 규칙 및 오차 한계 검증',
                status: 'pending'
              },
              {
                id: `sub-${uniqueSuffix}-cto`,
                assignedTo: 'CTO',
                title: '기술 검토 및 구현 방안 초안 수립',
                status: 'pending'
              }
            ]
          : [
              {
                id: `sub-${uniqueSuffix}-${targetRole.toLowerCase()}`,
                assignedTo: targetRole,
                title: '대표 직속 지시 분석 및 실행 계획 수립',
                status: 'in_progress'
              }
            ]
    };

    setTimeout(() => {
      onSubmitDirective(newTask);
      setIsSubmitting(false);
      setSuccessMessage(`지시가 등록되었습니다. COO 비서실장이 분석을 개시합니다.`);
      setTitle('');
      setDescription('');
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 400);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>대표 업무 지시 입력 터미널</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              [로컬 테스트 시뮬레이션 포함]
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            지시가 접수되면 COO(비서실장)가 즉시 업무를 분석하고 4인의 전문 임원에게 분해·배분합니다.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-slate-400 shrink-0 font-medium flex items-center gap-1">
            <BookmarkPlus className="w-3.5 h-3.5" />
            예시:
          </span>
          <button
            type="button"
            onClick={applyOfficialTestPreset}
            className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-bold border border-teal-300 hover:bg-teal-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>[공식 과제] 3개월 10대 과제 선정</span>
          </button>
          {DIRECTIVE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              {preset.category === 'OCR' ? 'OCR 개선' : preset.category === 'FIELD' ? '현장 지연' : 'Supabase 격리'}
            </button>
          ))}
        </div>
      </div>

      {successMessage && (
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2 text-xs text-teal-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Target Executive */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              수신자 (기본: COO 총괄 위임)
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as ExecutiveRole)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="COO">COO (AI 비서실장 - 전사 분해/조율 권장)</option>
              <option value="CTO">CTO (개발팀장 - 웹/DB/PR 직접 지시)</option>
              <option value="CDO">CDO (데이터 연구원 - 운행일보/OCR 직접 지시)</option>
              <option value="FIELD_EXPERT">현장 운영 전문가 (배차/현장 규칙 직접 지시)</option>
              <option value="CPO">CPO (제품 기획자 - UX/MVP 기획 직접 지시)</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              업무 우선순위
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="urgent">긴급 (즉시 임원 소집 및 검토)</option>
              <option value="high">높음 (당일 우선 처리)</option>
              <option value="normal">보통 (일반 개발/분석 스프린트)</option>
              <option value="low">낮음 (리서치 및 아이디어)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              도메인 분류
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="OCR">OCR 인식 개선 (운행일보)</option>
              <option value="FIELD">현장 배차/타설 지연 분석</option>
              <option value="SYSTEM">시스템/DB/GitHub 연동</option>
              <option value="PRODUCT">제품 기획/UX 완성도</option>
              <option value="DISPATCH">배차 담당자 의사결정 지원</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            지시 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: ConcreteFlow AI의 OCR 인식률을 3% 이내로 개선해 줘"
            required
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        {/* Detailed Directive Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            세부 지시 내용 및 목표
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="COO가 어떤 관점으로 분석하고 각 임원에게 어떤 산출물을 요구해야 하는지 구체적인 목표를 작성하세요."
            required
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>[실제 AI 가동] 클릭 시 7~8회 Gemini API(gemini-3.8-flash) 파이프라인이 즉시 기동됩니다.</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLiveAiStart}
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:bg-slate-300 rounded-lg transition-colors shadow-sm shadow-teal-900/10 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>실제 AI 멀티 에이전트 가동 (Gemini 3.8 Flash)</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
              title="실제 AI 호출 없이 브라우저 로컬 테스트 목록에만 등록"
            >
              <Send className="w-3 h-3 text-amber-600" />
              <span>테스트 전용 로컬 등록 (AI 미호출)</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
