export interface CoreConcept {
  id: string;
  name: string;
  description: string;
  ao2: string[];
  ao3: string[];
}

export interface ConceptCategory {
  category: "Microeconomics" | "Macroeconomics";
  topics: {
    id: string;
    topic: string;
    concepts: CoreConcept[];
  }[];
}

export const coreConceptsData: ConceptCategory[] = [
  {
    category: "Microeconomics",
    topics: [
      {
        id: "micro-gov-intervention",
        topic: "Gov Intervention & Market Failure",
        concepts: [
          {
            id: "micro-taxes-subsidies",
            name: "Indirect Taxes & Subsidies",
            description: "Evaluating the pros and cons of using taxes and subsidies to fix market failure.",
            ao2: [
              "Pros [Taxes]: Internalises negative externalities, reduces over-consumption of demerit goods, and raises vital government revenue.",
              "Cons [Taxes]: Regressive (hurts the poor more), can cause cost-push inflation, and may encourage black markets/smuggling.",
              "Pros [Subsidies]: Increases consumption of merit goods, helps lower income inequality by making essentials cheaper, and supports domestic infant industries.",
              "Cons [Subsidies]: Huge opportunity cost for the government, necessitates higher taxes elsewhere, and firms may become reliant/inefficient."
            ],
            ao3: [
              "Depends on Elasticity (PED/PES): Taxes on highly inelastic demerit goods (e.g., cigarettes) won't reduce consumption much, but WILL raise massive tax revenue.",
              "Depends on Magnitude: A small subsidy won't shift supply enough to change consumer behaviour; a massive one ruins the government budget.",
              "Time Period: Subsidies might work in the short run to boost an industry, but in the long run create structural inefficiency."
            ]
          },
          {
            id: "micro-price-controls",
            name: "Maximum & Minimum Prices",
            description: "Regulating prices to protect consumers or producers.",
            ao2: [
              "Pros [Max Price / Price Ceiling]: Makes essential goods (like food/rent) affordable for low-income households, increasing equity and living standards.",
              "Cons [Max Price]: Causes massive shortages (excess demand), queueing, and encourages illegal black markets where goods are sold at even higher prices.",
              "Pros [Min Price / Price Floor]: Protects producer incomes (e.g., farmers) from price volatility, and reduces consumption of demerit goods (e.g., alcohol).",
              "Cons [Min Price]: Causes massive surpluses (excess supply) which the government might have to buy (expensive!), and hurts poor consumers' living standards."
            ],
            ao3: [
              "Depends on Enforcement: Without strict government policing, illegal markets will form immediately, rendering the policy useless.",
              "Depends on Elasticities: The size of the shortage or surplus directly depends on PED and PES. Highly elastic supply and demand curves will create massive surpluses/shortages.",
              "Depends on Level Set: A maximum price set above the equilibrium has absolutely no effect."
            ]
          },
          {
            id: "micro-buffer-stock",
            name: "Buffer Stock Schemes",
            description: "Buying and selling stocks to stabilize agricultural prices.",
            ao2: [
              "Pros: Stabilizes prices for consumers (stopping food inflation), guarantees stable incomes for farmers (encouraging investment), and prevents market crashes.",
              "Cons: Massive storage and administrative costs. If the minimum target price is set too high, the government faces endless overproduction and massive purchasing costs."
            ],
            ao3: [
              "Depends on Perishability: Buffer stocks only work for storable commodities (wheat, grain). It fails for perishable goods (fresh milk, tomatoes).",
              "Depends on Global Climate Shocks: Several years of consecutive bumper harvests will bankrupt the scheme, while consecutive droughts will deplete all reserves."
            ]
          },
          {
            id: "micro-inequality",
            name: "Income Inequality",
            description: "The pros and cons of having an unequal distribution of income.",
            ao2: [
              "Pros: Provides a massive incentive to work harder, upskill, and innovate. Entrepreneurs take risks because they want wealth, which drives economic growth and jobs.",
              "Cons: Causes poverty, reduces overall living standards, creates social friction/crime, and wastes human capital (poor cannot afford education)."
            ],
            ao3: [
              "Depends on the Degree: A small amount of inequality is healthy for incentives. High inequality (Gini > 0.4) strictly damages growth by suppressing consumption.",
              "Depends on Opportunity: If inequality exists because of different effort levels, it is acceptable. If it exists due to corruption or lack of basic education access, it prevents growth."
            ]
          }
        ]
      },
      {
        id: "micro-elasticities",
        topic: "Elasticities in Decision Making",
        concepts: [
          {
            id: "micro-ped-yed",
            name: "PED & YED (Consumer Demand)",
            description: "Whether knowledge of PED and YED is useful for firm decision making.",
            ao2: [
              "Pros [PED]: Crucial for pricing strategy. If inelastic, raising prices maximizes revenue. If elastic, lowering prices captures market share.",
              "Pros [YED]: Crucial for strategic forecasting. If heading into a recession, firms can switch production to inferior goods (YED < 0). In a boom, shift to normal/luxury goods (YED > 0).",
              "Cons: Both assume 'ceteris paribus' (that competitors don't react). Data is often historical and immediately out of date."
            ],
            ao3: [
              "Depends on Time Period: In the short run, habits make PED inelastic. In the long run, consumers find substitutes, making past PED data dangerously misleading.",
              "Brand Loyalty vs Math: A firm with aggressive branding (e.g., Apple) can ignore PED math entirely, as their brand overrides natural consumer price sensitivity.",
              "Which is better?: YED is vital for long-term survival against macro-shocks (recessions), while PED is vital for daily retail pricing."
            ]
          },
          {
            id: "micro-xed-pes",
            name: "XED & PES (Competitors & Supply)",
            description: "Whether knowledge of XED and PES is useful.",
            ao2: [
              "Pros [XED]: Identifies substitute threats. If XED is highly positive, a firm must instantly match a rival's price cut. Also helps price loss-leader complements.",
              "Pros [PES]: Tells a firm how fast it can capture new demand. Highly elastic supply means the firm can grab massive profits during sudden demand surges.",
              "Cons [XED]: Initiating price cuts based on XED calculations can trigger destructive price wars, destroying revenue for everyone.",
              "Cons [PES]: Maintaining an elastic PES requires holding spare capacity and massive idle inventories, incurring huge opportunity and storage costs."
            ],
            ao3: [
              "Depends on Spare Capacity Cost: A firm must evaluate if the massive daily cost of warehousing idle inventory is worth the rare benefit of a highly elastic PES.",
              "Time dimension to Supply: PES is always intensely inelastic in the immediate short run (especially agriculture), rendering PES calculations useless against sudden shocks."
            ]
          }
        ]
      }
    ]
  },
  {
    category: "Macroeconomics",
    topics: [
      {
        id: "macro-exchange-trade",
        topic: "Exchange Rates & International Trade",
        concepts: [
          {
            id: "macro-depreciate",
            name: "Depreciation / Appreciation",
            description: "Evaluating the impact of a falling or rising exchange rate.",
            ao2: [
              "Pros [Depreciation]: Lowers export prices & raises import prices -> Boosts AD (via Net Exports), cuts cyclical unemployment, and closes a trade deficit.",
              "Cons [Depreciation]: Causes imported cost-push inflation (raw materials suddenly cost more), reducing living standards.",
              "Pros [Appreciation]: Excellent for crushing inflationary pressure, as imported goods become cheap. Cheaper raw materials boost SRAS.",
              "Cons [Appreciation]: Destroys export competitiveness, worsens the trade deficit, and costs domestic jobs."
            ],
            ao3: [
              "Marshall-Lerner Condition (Depends on Elasticity): Depreciation ONLY improves the trade deficit if the combined PED of exports and imports is > 1. If imports are inelastic necessities (oil), the deficit actually worsens.",
              "State of the Economy: If the economy is already at full employment, a depreciation won't boost real GDP, it will just cause violent demand-pull inflation.",
              "Time Lags (J-Curve): In the short term, trade contracts are signed. Depreciation worsens the deficit initially before improving it in the long run."
            ]
          },
          {
            id: "macro-tot",
            name: "Terms of Trade (TOT) Improvement",
            description: "Evaluating whether an improved TOT is always beneficial.",
            ao2: [
              "Pros: An improved TOT (Export prices rise relative to Import prices) means a country can buy a larger volume of imports for the same volume of exports, immediately boosting living standards.",
              "Cons: If export prices rose rapidly because of severe domestic inflation, then exports lose their international competitiveness, export volumes crash, and the balance of trade worsens."
            ],
            ao3: [
              "Depends on the Root Cause: An improved TOT is excellent if caused by an increase in global demand for a country's high-quality exports. It is terrible if caused by rampant domestic inflation.",
              "Depends on Export Elasticity: If export prices rise, but global demand for them is highly price elastic, the country will lose massive amounts of export revenue, causing unemployment."
            ]
          },
          {
            id: "macro-ca-deficit",
            name: "Current Account Deficit / Surplus",
            description: "Is a trade imbalance always bad or good?",
            ao2: [
              "Pros [Deficit]: In the short term, a deficit means consumers are importing heavily, leading to high current living standards. It may also mean the country is importing vital capital machinery for future growth.",
              "Cons [Deficit]: Causes debt, downward pressure on exchange rates, and signifies structural weakness (domestic firms are uncompetitive).",
              "Pros [Surplus]: Indicates export-led growth, high employment in domestic industries, and stable, strong currency.",
              "Cons [Surplus]: Causes demand-pull inflation, and signifies that the country is exporting its output rather than consuming it (lowering domestic living standards)."
            ],
            ao3: [
              "Depends on Financing: A deficit is safe if financed by long-term Foreign Direct Investment (FDI). It is deadly if financed by volatile short-term 'Hot Money'.",
              "Nature of the Imports (Cause): A deficit driven by importing capital machinery will improve the LRAS tomorrow. A deficit driven by importing luxury consumption goods is unsustainable."
            ]
          },
          {
            id: "macro-free-trade",
            name: "Free Trade vs Protectionism",
            description: "Evaluating the costs and benefits of opening borders vs tariffs.",
            ao2: [
              "Pros [Free Trade]: Consumers get massive choices and lower prices. Global resources are allocated efficiently via Comparative Advantage. Economies of scale are achieved.",
              "Cons [Free Trade]: Structural unemployment as uncompetitive domestic businesses collapse. Over-specialisation leaves a country fatally vulnerable to global price shocks.",
              "Pros [Protectionism]: Protects infant industries, saves domestic jobs, fixes current account deficits, and stops dumping.",
              "Cons [Protectionism]: Guarantees retaliation (trade wars). Consumers subsidize inefficient domestic firms by paying higher prices."
            ],
            ao3: [
              "Depends on Development Stage: Free trade is great for developed nations, but protectionism is mathematically necessary for developing nations to build infant industries.",
              "Short Run vs Long Run: Tariffs might save jobs today (short run), but in the long run create lazy, uncompetitive monopolies that drag down economic growth.",
              "Depends on Retaliation likelihood: If you place a tariff on a major superpower, they will retaliate and crush your exports, negating all benefits."
            ]
          }
        ]
      },
      {
        id: "macro-performance",
        topic: "Macroeconomic Objectives & Performance",
        concepts: [
          {
            id: "macro-economic-growth",
            name: "Economic Growth",
            description: "Evaluating whether GDP growth is always desirable.",
            ao2: [
              "Pros: Higher living standards, creation of jobs (reducing cyclical unemployment), and a 'fiscal dividend' (gov collects more tax without raising rates) to spend on health/education.",
              "Cons: Severe environmental degradation, massive stress/less leisure time, rising income inequality if growth is skewed towards the rich, and vicious demand-pull inflation."
            ],
            ao3: [
              "Depends on the Type of Growth: Demand-led growth (AD shifting right near full capacity) is dangerous and inflationary. Supply-led growth (LRAS shifting right) is sustainable and non-inflationary.",
              "Distribution of Benefits: Growth is only meaningful if it is evenly distributed. A 5% GDP growth means nothing to the poor if inflation is 6% and only elites captured the newly created wealth.",
              "Sustainable vs Short-term: Growth driven by rapid depletion of natural resources (e.g. chopping down entire forests) is catastrophic in the long term."
            ]
          },
          {
            id: "macro-inflation",
            name: "Inflation",
            description: "Is inflation always damaging?",
            ao2: [
              "Pros: Greases the labor market (allows silent real-wage cuts), reduces the real value of national debt, and stops the dreaded 'deflationary spiral' (where consumers delay all spending).",
              "Cons: Destroys fixed incomes/pensions, causes menu/shoe-leather costs, creates massive uncertainty crushing business investment, and destroys export competitiveness.",
              "Note: Deflation is horrible because it postpones consumption, crushes AD, and increases the real burden of debt, leading to deep recessions."
            ],
            ao3: [
              "Depends on the Rate: Creeping inflation (2%) is the bedrock of a healthy, optimistic economy. Hyperinflation destroys the entire currency system.",
              "Depends on the Cause: Cost-push inflation is infinitely more damaging than demand-pull. Cost-push brings 'Stagflation' (unemployment + inflation), while demand-pull at least brings jobs.",
              "Anticipated vs Unanticipated: Sudden, surprise inflation wrecks business contracts and wage negotiations. Steady, expected inflation is easily managed."
            ]
          },
          {
            id: "macro-unemployment",
            name: "Types of Unemployment",
            description: "Evaluating which types of unemployment are most damaging.",
            ao2: [
              "Pros (Frictional only): Frictional unemployment allows workers to search for jobs that perfectly match their skills, leading to higher long-term productivity and happiness.",
              "Cons: Massive loss of potential GDP (operating inside PPC), massive fiscal drain (welfare benefits rise, income tax falls), hysteresis (long-term unemployed lose skills and motivation), and crime/social unrest.",
              "Types: Cyclical (Demand-deficient), Structural (Mismatch of skills due to changing tech/industries), Frictional (Between jobs)."
            ],
            ao3: [
              "Comparison of Severity: Structural and Technological unemployment are radically more severe than Cyclical because the skills of the workers are permanently rendered obsolete. Cyclical reverses once the economy booms.",
              "Depends on Duration: Short-term frictional is harmless. Long-term unemployment causes a permanent inward shift of the PPC as human capital erodes (Hysteresis)."
            ]
          }
        ]
      },
      {
        id: "macro-policies",
        topic: "Macroeconomic Policies & Budgets",
        concepts: [
          {
            id: "macro-budget",
            name: "Budget Balance / Deficit / Surplus",
            description: "The pros and cons of government budget positions.",
            ao2: [
              "Pros [Deficit]: Stimulates the economy during a recession (Expansionary Fiscal Policy). Government spends more than taxes, injecting AD.",
              "Cons [Deficit]: Explodes the national debt, causing massive interest repayment burdens. Can cause 'Crowding Out' (gov borrowing drives up interest rates, crushing private investment).",
              "Pros [Surplus/Balance]: Creates stability, reduces national debt, and cools down a violently inflationary boom.",
              "Cons [Surplus/Balance]: Adhering strictly to a balanced budget during a recession forces the government to cut spending, accelerating the economic collapse."
            ],
            ao3: [
              "Depends on Expenditure Type: A deficit is excellent if the money is spent on Capital Expenditure (new roads, broadband) because it builds LRAS to pay off the debt. It is terrible if spent on Current Expenditure (wages, pensions).",
              "State of the Cycle: Running a deficit during a recession is responsible Keynesian economics. Running a massive deficit during an economic boom is highly inflationary and irresponsible."
            ]
          },
          {
            id: "macro-fp-mp-ssp",
            name: "FP vs MP vs SSP",
            description: "Evaluating the three main macroeconomic tools.",
            ao2: [
              "Expansionary Fiscal Policy (FP): Cuts taxes & raises Gov spending. Direct injection to AD. Cons: Causes budget deficits & takes massive political time (Implementation Lag).",
              "Monetary Policy (MP): Central banks cut interest rates. Pros: Fast to execute. Cons: Liquidity Trap - if confidence is dead, 0% rates won't make anyone borrow. Hot money outflows cause depreciation.",
              "Supply Side Policy (SSP): Education, training, deregulation. Pros: The ONLY policy that gives growth WITHOUT inflation. Cons: Gigantic time lags (takes 15 years to educate a child) and massive opportunity costs."
            ],
            ao3: [
              "Time vs Effectiveness (SSP vs MP): MP acts quickly but doesn't fix underlying structural issues. SSP fixes the root cause but takes decades. Both must be used together.",
              "Ceteris Paribus & Confidence: An aggressive MP rate cut will fail entirely if Global Recessions block trade or if Consumer Confidence is utterly destroyed.",
              "Depends on Initial State: Pushing an expansionary FP or MP is disastrous if the economy has no spare capacity (steep part of AS curve), it will just ignite hyperinflation."
            ]
          }
        ]
      }
    ]
  }
];
