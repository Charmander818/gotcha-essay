import React, { useMemo } from 'react';
import { Question, SyllabusTopic } from '../types';

interface ExamTrendsProps {
  questions: Question[];
}

const isMicro = (topic: SyllabusTopic) => [
  SyllabusTopic.BASIC_IDEAS,
  SyllabusTopic.PRICE_SYSTEM,
  SyllabusTopic.GOVT_MICRO,
  SyllabusTopic.PRICE_SYSTEM_AL,
  SyllabusTopic.GOVT_MICRO_AL
].includes(topic);

const isAL = (topic: SyllabusTopic) => [
  SyllabusTopic.PRICE_SYSTEM_AL,
  SyllabusTopic.GOVT_MICRO_AL,
  SyllabusTopic.MACROECONOMY_AL,
  SyllabusTopic.GOVT_MACRO_AL,
  SyllabusTopic.INTERNATIONAL_AL
].includes(topic);

const ExamTrends: React.FC<ExamTrendsProps> = ({ questions }) => {
  // Aggregate data
  const stats = useMemo(() => {
    const asMicroCounts = new Map<string, number>();
    const alMicroCounts = new Map<string, number>();
    const asMacroCounts = new Map<string, number>();
    const alMacroCounts = new Map<string, number>();
    const yearChapterMap = new Map<string, Map<string, number>>();

    questions.forEach(q => {
      // Micro / Macro separation by Chapter
      const micro = isMicro(q.topic);
      const isALTopic = isAL(q.topic);

      if (micro) {
        if (isALTopic) {
          alMicroCounts.set(q.chapter, (alMicroCounts.get(q.chapter) || 0) + 1);
        } else {
          asMicroCounts.set(q.chapter, (asMicroCounts.get(q.chapter) || 0) + 1);
        }
      } else {
        if (isALTopic) {
          alMacroCounts.set(q.chapter, (alMacroCounts.get(q.chapter) || 0) + 1);
        } else {
          asMacroCounts.set(q.chapter, (asMacroCounts.get(q.chapter) || 0) + 1);
        }
      }

      // Year -> Chapter count
      if (!yearChapterMap.has(q.year)) {
        yearChapterMap.set(q.year, new Map<string, number>());
      }
      const yMap = yearChapterMap.get(q.year)!;
      yMap.set(q.chapter, (yMap.get(q.chapter) || 0) + 1);
    });

    const sortedASMicro = Array.from(asMicroCounts.entries()).sort((a, b) => b[1] - a[1]);
    const sortedALMicro = Array.from(alMicroCounts.entries()).sort((a, b) => b[1] - a[1]);
    const sortedASMacro = Array.from(asMacroCounts.entries()).sort((a, b) => b[1] - a[1]);
    const sortedALMacro = Array.from(alMacroCounts.entries()).sort((a, b) => b[1] - a[1]);
    const years = Array.from(yearChapterMap.keys()).sort((a, b) => b.localeCompare(a));

    return { sortedASMicro, sortedALMicro, sortedASMacro, sortedALMacro, yearChapterMap, years };
  }, [questions]);

  // Prediction Logic
  const getPrediction = () => {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm mt-8">
        <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          2026 May/June Paper 24 Prediction
        </h3>
        <p className="text-slate-700 leading-relaxed mb-4 text-sm">
          Based on the historical frequency of topics, particularly recent shifts in Cambridge 9708 examinations (2023-2025), here are the most likely topics to appear:
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <span className="font-bold text-indigo-700 mt-0.5">1.</span>
            <div>
              <strong className="text-slate-900">2.X Elasticities & Revenue (High Probability):</strong> 
              <p className="text-slate-600 text-sm mt-1">Almost an absolute guarantee. You are very likely to see a question testing how YED, PED or XED influences business revenue or guides government indirect tax decisions.</p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="font-bold text-indigo-700 mt-0.5">2.</span>
            <div>
              <strong className="text-slate-900">3.2 / 3.3 Government Micro Intervention:</strong> 
              <p className="text-slate-600 text-sm mt-1">Given recent trends focusing on specific policies like minimum price or subsidies, expect an evaluation question comparing two policies reducing inequality or targeting negative externalities.</p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="font-bold text-indigo-700 mt-0.5">3.</span>
            <div>
              <strong className="text-slate-900">5.X Macroeconomic Policy Effectiveness:</strong> 
              <p className="text-slate-600 text-sm mt-1">A significant 12-mark essay will likely target the conflicts between macroeconomic objectives (e.g., inflation vs unemployment) and the comparative effectiveness of Monetary vs Supply-side policies.</p>
            </div>
          </li>
        </ul>
      </div>
    );
  };

  const renderFrequencyChart = (title: string, data: [string, number][], isMicro: boolean) => {
    const maxCount = data.length > 0 ? data[0][1] : 1;
    const colorClass = isMicro ? "bg-emerald-500" : "bg-blue-500";
    const headerBgClass = isMicro ? "bg-emerald-50" : "bg-blue-50";

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px] flex flex-col">
        <div className={`border-b border-slate-200 px-5 py-3 ${headerBgClass}`}>
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5 overflow-auto flex-1">
          <div className="space-y-4">
            {data.map(([chapter, count]) => {
              const widthPercent = (count / maxCount) * 100;
              return (
                <div key={chapter}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 line-clamp-1 mr-4" title={chapter}>{chapter}</span>
                    <span className="text-slate-500 font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className={`${colorClass} h-1.5 rounded-full`} 
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Exam Trends & Statistics</h2>
        <p className="text-slate-500 mt-1">Precise subtopic frequency analysis categorized by AS/AL Level and Micro/Macroeconomics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {renderFrequencyChart("AS Level - Microeconomics", stats.sortedASMicro, true)}
        {renderFrequencyChart("AS Level - Macroeconomics", stats.sortedASMacro, false)}
        {renderFrequencyChart("A Level - Microeconomics", stats.sortedALMicro, true)}
        {renderFrequencyChart("A Level - Macroeconomics", stats.sortedALMacro, false)}
      </div>

      {/* Year-by-Year Trend */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-8">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Top Topics By Year</h3>
        </div>
        <div className="p-5 flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.years.map(year => {
              const yearMap = stats.yearChapterMap.get(year)!;
              const sortedForYear = Array.from(yearMap.entries()).sort((a, b) => b[1] - a[1]);
              const top3 = sortedForYear.slice(0, 3);

              return (
                <div key={year} className="relative pl-4 border-l-2 border-indigo-200">
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400 -left-[5.5px] top-1"></div>
                  <div className="font-bold text-slate-800 text-sm mb-2">{year}</div>
                  <div className="space-y-2">
                    {top3.map(([t, c]) => (
                      <div key={t} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 line-clamp-1 flex-1" title={t}>{t}</span>
                        <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium ml-2">{c} Qs</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {getPrediction()}
    </div>
  );
};

export default ExamTrends;
