import React, { useState } from 'react';
import {
  Truck,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface TripRound {
  round: number;
  volume: number;
  status: '완료' | '공장 복귀 대기' | '운행 중';
}

export interface DriverSyncStatus {
  currentStep: number;
  stepLabel: string;
  isReturnCompleted: boolean;
  queueRank: number;
  estimatedMinutesLeft: number;
  roundsCount: number;
  totalVolume: number;
  lastActionAt: string;
}

interface CFDriverViewProps {
  compact?: boolean;
  onStatusChange?: (status: DriverSyncStatus) => void;
}

const STEP_LABELS: Record<number, string> = {
  1: '공장 출발',
  2: '현장 도착',
  3: '타설 중',
  4: '현장 출발',
  5: '공장 도착'
};

export const CFDriverView: React.FC<CFDriverViewProps> = ({ compact = false, onStatusChange }) => {
  // Sound alert toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active step in 5-step flow: 1: 공장출발, 2: 현장도착, 3: 타설중, 4: 현장출발, 5: 공장도착
  const [currentStep, setCurrentStep] = useState<number>(5);

  // Return Key (귀차키 대체) status
  const [isReturnCompleted, setIsReturnCompleted] = useState(true);

  // Queue info
  const [queueRank, setQueueRank] = useState<number>(1);
  const [estimatedHopperTime, setEstimatedHopperTime] = useState<string>('10:30');
  const [estimatedMinutesLeft, setEstimatedMinutesLeft] = useState<number>(3);
  const [batchHopper, setBatchHopper] = useState<string>('2호기 호퍼 (BATCH #2)');
  const [hopperConfirmed, setHopperConfirmed] = useState(false);

  // Site detail collapsible
  const [showSiteDetail, setShowSiteDetail] = useState(false);

  // Driver rounds
  const [rounds, setRounds] = useState<TripRound[]>([
    { round: 1, volume: 6.0, status: '완료' },
    { round: 2, volume: 6.0, status: '완료' },
    { round: 3, volume: 6.0, status: '완료' },
    { round: 4, volume: 6.0, status: '공장 복귀 대기' }
  ]);

  const emitStatus = (
    step: number,
    returned: boolean,
    rank: number,
    minutesLeft: number,
    nextRounds: TripRound[]
  ) => {
    if (!onStatusChange) return;
    onStatusChange({
      currentStep: step,
      stepLabel: STEP_LABELS[step] || '공장 도착',
      isReturnCompleted: returned,
      queueRank: rank,
      estimatedMinutesLeft: minutesLeft,
      roundsCount: nextRounds.length,
      totalVolume: nextRounds.reduce((acc, r) => acc + r.volume, 0),
      lastActionAt: new Date().toLocaleTimeString()
    });
  };

  // Handle Return Key Click ([공장 도착 완료] 누르고 대기순번 1순위 받기)
  const handleReturnKeyClick = () => {
    const nextRounds = rounds.map((r, i) => (i === 3 ? { ...r, status: '완료' as const } : r));
    setCurrentStep(5);
    setIsReturnCompleted(true);
    setQueueRank(1);
    setEstimatedHopperTime('10:30');
    setEstimatedMinutesLeft(3);
    setRounds(nextRounds);
    emitStatus(5, true, 1, 3, nextRounds);
  };

  // Step click handler
  const handleStepClick = (stepNum: number) => {
    const returned = stepNum === 5;
    setCurrentStep(stepNum);
    if (returned) {
      setIsReturnCompleted(true);
    } else {
      setIsReturnCompleted(false);
      setHopperConfirmed(false);
    }
    emitStatus(stepNum, returned, queueRank, estimatedMinutesLeft, rounds);
  };

  // Reset to next round (1회전 운행 완료 · 다음 운행 시작)
  const handleNextRound = () => {
    const nextRounds: TripRound[] = [
      ...rounds.map(r => ({ ...r, status: '완료' as const })),
      { round: rounds.length + 1, volume: 6.0, status: '운행 중' as const }
    ];
    setCurrentStep(1);
    setIsReturnCompleted(false);
    setHopperConfirmed(false);
    setQueueRank(0);
    setRounds(nextRounds);
    emitStatus(1, false, 0, estimatedMinutesLeft, nextRounds);
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'} space-y-4 font-sans text-slate-800`}>
      {/* ------------------------------------------------------------- */}
      {/* 1. Top Header Card (Image 1 top) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0b1329] text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <Truck className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">106호차</h1>
                <span className="text-base font-bold text-slate-200">조OO 기사님 기사님</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                  기사 전용
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <span>제1공장 (서울강남 플랜트)</span>
                <span>·</span>
                <span className="text-slate-200 font-semibold">오늘 4회전 (24.0 m³)</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}
            title="음성 안내 토글"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">차량 선택 (순번 시뮬레이션):</span>
          </div>
          <span className="text-slate-400">대기열 차량 0대</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Real-time Waiting Queue Card (Image 1 bottom) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0b1329] text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-amber-400 tracking-tight">
            공장 출하 실시간 대기 순번
          </h2>
          <span className="text-xs text-slate-400 font-medium">제1공장 (서울강남 플랜트)</span>
        </div>

        {/* Hero Queue Panel */}
        <div className="bg-[#0f1a38] rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">
              현재 내 차량: <strong className="text-white">106호차</strong> (조OO 기사님 기사님)
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight">
                대기 {queueRank > 0 ? `${queueRank}순번` : '대기선 밖'}
              </span>
              {queueRank > 0 && (
                <span className="text-base font-bold text-slate-300">({queueRank}번째 순서)</span>
              )}
            </div>
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {queueRank === 1
                ? '내 앞 대기차량 없음 (다음 차례! 즉시 호퍼 진입 준비)'
                : queueRank > 1
                ? `내 앞 대기차량 ${queueRank - 1}대 대기 중`
                : '공장 도착 시 [공장 도착 완료] 버튼을 눌러 순번을 받으세요.'}
            </p>
          </div>

          {/* Right Hopper Estimate Box */}
          <div className="bg-[#0b1329]/90 rounded-2xl p-5 border border-slate-800 min-w-[200px] text-center w-full md:w-auto shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>호퍼 진입 예상 시각</span>
            </div>
            <div className="text-3xl font-black text-white font-mono my-1">
              {queueRank > 0 ? estimatedHopperTime : '--:--'}
            </div>
            <p className="text-[11px] font-bold text-amber-400/90">
              {queueRank > 0 ? `약 ${estimatedMinutesLeft}분 후 진입 예정` : '대기 등록 후 예상 산출'}
            </p>
          </div>
        </div>

        {/* Hopper Lineup Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              호퍼 진입 순서 라인업 (배정: {batchHopper})
            </span>
            <span className="text-slate-400 text-[11px]">좌측이 먼저 진입하는 순서</span>
          </div>

          <div className="p-4 bg-[#080d1d] rounded-xl border border-slate-800/80 text-center text-xs text-slate-400">
            {queueRank === 1 ? (
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                  1순번: 106호차 (내 차량)
                </span>
                <span className="text-slate-500 font-bold">➔</span>
                <span className="text-slate-400 text-xs">후속 대기 차량 없음</span>
              </div>
            ) : (
              '현재 대기선에 등록된 차량이 없습니다. 공장 도착 시 아래 [공장 도착 완료] 버튼을 눌러 순번을 등록하세요.'
            )}
          </div>
        </div>

        {/* Hopper Confirmation Alert Banner */}
        {queueRank === 1 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">
                다음 호퍼 진입 차량입니다! 대기선 A 진입 및 드럼(12 RPM) 회전을 준비해 주십시오.
              </span>
            </div>
            <button
              onClick={() => setHopperConfirmed(!hopperConfirmed)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 cursor-pointer shadow-md ${
                hopperConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              {hopperConfirmed ? '호퍼 진입 완료됨' : '호퍼 진입 확인'}
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. 귀차키 대체 원터치 대기순번 발급 Card (Image 2 top) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>현장 복귀 후 공장 도착 시</span>
              <span className="text-emerald-600">원터치 대기순번 발급</span>
            </h3>
            <p className="text-xs text-slate-500">
              현장 운행을 마치고 공장에 복귀하면, 버튼 하나로 즉시 대기열에 등록됩니다.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isReturnCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isReturnCompleted ? '공장 복귀 완료됨' : '복귀 대기 중'}
          </span>
        </div>

        {/* Big Prominent Green Return Button (귀차키 대체) */}
        <button
          onClick={handleReturnKeyClick}
          className="w-full py-4.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-99 text-white rounded-2xl font-black text-base tracking-tight shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
          <span>[공장 도착 완료] 누르고 대기순번 1순위 받기</span>
        </button>

        <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <span>💡 공장 정문 지오펜스 진입 시에도 자동 감지되며, 위 버튼을 누르면 즉시 관제탑에 순번이 등록됩니다.</span>
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. 5-Step Simple Status Reporting (Image 2 bottom) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>운행상태 확인 및 간편 단계 보고</span>
              <span className="text-slate-500 text-xs font-normal">(1-터치 보고)</span>
            </h3>
            <p className="text-xs text-slate-500">
              복잡한 입력 없이, 현재 진행 중인 버튼만 가볍게 눌러주시면 관제탑에 즉시 공유됩니다.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            현재: {currentStep === 1 ? '공장 출발' : currentStep === 2 ? '현장 도착' : currentStep === 3 ? '타설 중' : currentStep === 4 ? '현장 출발' : '공장 도착'}
          </span>
        </div>

        {/* 5-Step Horizontal Grid (1 to 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { step: 1, title: '공장 출발' },
            { step: 2, title: '현장 도착' },
            { step: 3, title: '타설 중' },
            { step: 4, title: '현장 출발' },
            { step: 5, title: '공장 도착' }
          ].map(item => {
            const isCompleted = item.step < currentStep || (currentStep === 5 && item.step < 5);
            const isCurrent = item.step === currentStep;

            return (
              <button
                key={item.step}
                onClick={() => handleStepClick(item.step)}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0f172a] border-[#0f172a] text-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className={`text-xs font-bold mb-1 ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {item.step}
                </span>
                <span className={`text-xs font-black tracking-tight ${isCurrent ? 'text-amber-400 font-extrabold' : isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {item.title}
                </span>
                <div className="mt-1.5 h-4 flex items-center justify-center">
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Round Bar Button */}
        <button
          onClick={handleNextRound}
          className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <span>1회전 운행 완료 · 다음 운행 시작</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. Assigned Site Info (Image 3 top) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <button
          onClick={() => setShowSiteDetail(!showSiteDetail)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer text-left"
        >
          <div className="text-xs">
            <span className="text-slate-500 font-medium">배정 현장 정보 (참고용): </span>
            <strong className="text-slate-900 font-bold">배차 대기 현장 (표준 규격 (대기) · 6.0m³)</strong>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
            <span>상세보기</span>
            {showSiteDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showSiteDetail && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <p>• 납품 현장: 서울시 강남구 역삼동 테헤란로 신축공사 2공구</p>
            <p>• 배합 규격: 25-24-150 (굵은골재 25mm, 강도 24MPa, 슬럼프 15cm)</p>
            <p>• 타설 방식: 52m 콘크리트 펌프카 타설 (현장 도착 시 신호수 지시 유의)</p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. Factory Queue Billboard (Image 3 middle) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>공장 전체 출하 대기 순번 전광판</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">총 0대 등록</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          현재 공장 대기열에 등록된 차량이 없습니다. 공장 도착 시 상단의 <strong className="text-slate-800">[공장 도착 완료]</strong>를 누르면 순번이 등록됩니다.
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 7. Today My Trip History (Image 3 bottom) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            오늘 내 운행 이력
          </h3>
          <span className="text-xs font-bold text-slate-700 font-mono">
            총 {rounds.length}회전 · 누적 {(rounds.reduce((acc, r) => acc + r.volume, 0)).toFixed(1)} m³
          </span>
        </div>

        {/* 4 Rounds Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rounds.map(r => (
            <div
              key={r.round}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-1"
            >
              <span className="text-xs text-slate-500 font-medium">{r.round}회전</span>
              <span className="text-lg font-black text-slate-900 font-mono">{r.volume.toFixed(1)} m³</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  r.status === '완료'
                    ? 'bg-slate-100 text-slate-600'
                    : r.status === '공장 복귀 대기'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
