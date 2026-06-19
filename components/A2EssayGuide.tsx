import React, { useState } from 'react';

const GUIDE_CONTENT = [
  {
    title: 'General A2 Essay Structure & Strategy',
    icon: '📝',
    content: (
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-700">A full-mark A2 essay contains 5 essential parts. For a standard \"A\" grade (15-16/20), you can focus on Definition (AO1), Thesis (AO2), Anti-thesis (AO3), and Conclusion.</p>
        <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-600">
          <li><strong>Introduction (Optional for basic high score, required for full marks):</strong> State approach, framework, and directly answer the question in one sentence.</li>
          <li><strong>Definition (AO1):</strong> Define ALL key terms in the question. Remember, many A2 questions still require defining AS terms (e.g., Economic growth, Monetary policy).</li>
          <li><strong>Thesis & Anti-thesis (AO2/AO3):</strong> Form clear logical chains (e.g., Govt spending &rarr; multiplier effect &rarr; Actual growth). Ensure at least 3 distinct evaluation paragraphs in the mark scheme. For Anti-thesis, 2-3 well-explained points are sufficient.</li>
          <li><strong>Synthesis (Optional for basic high score):</strong> Compare the varying impacts or policies against each other.</li>
          <li><strong>Conclusion (AO3):</strong> Summarize the argument. Sentence 1: Answer the question directly. Sentence 2: Justify using your strongest key arguments. (Must be comprehensive, 4+ marks available here).</li>
        </ol>
      </div>
    )
  },
  {
    title: 'Consumer Theory',
    icon: '🛒',
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li><strong>Utility Approach:</strong> AO1 covers TU, MU, DMU, Consumer Equilibrium. AO2 involves deriving the individual demand curve. AO3 needs to explain why utility cannot provide an \"adequate\" explanation (cannot measure cardinally, bounded rationality).</li>
          <li><strong>Indifference Curve Approach:</strong> AO1 covers IC, BL, Consumer Equilibrium. AO2 is about graphic changes (price changes, income changes, preference shifts) and normal/inferior goods. Understand Substitution Effect (SE) and Income Effect (IE).</li>
          <li>Always draw clear diagrams when deriving the demand curve or showing changes due to taxation/price drops.</li>
        </ul>
      </div>
    )
  },
  {
    title: 'Producer Theory (Market Structure & Firms)',
    icon: '🏭',
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li><strong>Market Structures:</strong> PC (Perfect Competition), Monopoly, Oligopoly. Define their assumptions. Define Efficiency (Productive, Allocative, Dynamic) explicitly.</li>
          <li><strong>Evaluations:</strong> Compare Monopolistic Competition (MPC) vs Monopoly. MPC elastic demand curve &rarr; closer to MC &rarr; less allocative inefficiency. Oligopoly (collusive vs competitive).</li>
          <li><strong>Contestability:</strong> High BTE (Barriers to Entry) &rarr; less contestable. Contestable markets act like competitive markets.</li>
          <li><strong>Firms\' Decisions:</strong> Profit maximizing vs Sales Maximizing vs Revenue Maximizing. Evaluate implications of Price Discrimination, Monopsony power, Integrations (Horizontal/Vertical).</li>
        </ul>
      </div>
    )
  },
  {
    title: 'Labour Market',
    icon: '💼',
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li><strong>Core Foundations (AO1):</strong> ALWAYS write about MRP and Labour Supply. These are essential for wage rate determination in PC.</li>
          <li><strong>Wage Differences:</strong> Analyze MR/MP differences, Elasticity of SL, Trade Unions, and Government minimum wage.</li>
          <li><strong>Imperfect Markets:</strong> Monopsony (leads to lower wage, lower employment). Government intervention or TU representation might cause unemployment depending on the elasticity. Analyze outcomes comprehensively.</li>
        </ul>
      </div>
    )
  },
  {
    title: 'Market Failure & Interventions',
    icon: '📉',
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li><strong>Externalities:</strong> Focus on distinguishing between consumption and production externalities. Define allocative efficiency, show Deadweight Loss (DWL) on the diagram.</li>
          <li><strong>Monopolies as Market Failure:</strong> Private monopoly (Allocative Inefficiency &rarr; Use lump sum tax or Anti-trust law). Public monopoly (X-inefficiency &rarr; Use Privatisation or Deregulation). Natural monopolies &rarr; Price capping.</li>
          <li><strong>Public vs Private Sector:</strong> Focus on equity vs efficiency. Private sector provides high price / under-consumption. Public sector lacks incentive (X-inefficient) but focuses on positive externalities.</li>
        </ul>
      </div>
    )
  }
];

export const A2EssayGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 relative shrink-0">
            <h1 className="text-xl font-bold text-slate-800">A2 Essay Writing Guide</h1>
            <p className="text-sm text-slate-500 mt-1">Masterclass framework & chapter-specific strategies for 20/20 A Level essays.</p>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar menu */}
            <div className="w-1/3 border-r border-slate-100 bg-white overflow-y-auto hidden md:block">
                {GUIDE_CONTENT.map((section, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSection(idx)}
                        className={`w-full text-left px-4 py-4 border-b border-slate-50 flex items-center gap-3 transition-colors ${activeSection === idx ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                    >
                        <span className="text-xl">{section.icon}</span>
                        <span className={`font-semibold text-sm ${activeSection === idx ? 'text-blue-700' : 'text-slate-600'}`}>{section.title}</span>
                    </button>
                ))}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
                 <div className="max-w-2xl">
                     <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                         <span>{GUIDE_CONTENT[activeSection].icon}</span>
                         {GUIDE_CONTENT[activeSection].title}
                     </h2>
                     <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed">
                         {GUIDE_CONTENT[activeSection].content}
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};
