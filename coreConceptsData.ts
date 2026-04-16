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
        id: "micro-basic",
        topic: "Basic Economic Ideas (PPC & Systems)",
        concepts: [
          {
            id: "basic-ppc",
            name: "Production Possibility Curves (PPC) & Opportunity Cost",
            description: "Analysing movements, shifts, and the shape of the PPC.",
            ao2: [
              "A movement along the PPC demonstrates reallocation of resources and exact opportunity cost (a trade-off).",
              "A shift outwards indicates an increase in the quantity/quality of resources or technological advancement, pushing potential output up.",
              "A point inside the PPC indicates production inefficiency or unemployment.",
              "Constant opportunity cost is drawn as a straight line, while increasing opportunity cost is drawn as a concave curve."
            ],
            ao3: [
              "Time Frame & Priority: A decision to produce more capital goods over consumer goods carries short-term opportunity costs (lower living standards today) but drives sustainable long-run economic growth.",
              "Permanence: A position inside the PPC is not necessarily permanent if the government implements successful demand-management or supply-side policies to reduce unemployment.",
              "Shape dependency: Whether opportunity cost is constant or increasing depends on factor mobility (how easily resources switch between producing different goods)."
            ]
          },
          {
            id: "basic-goods",
            name: "Classification of Goods (Public, Merit, Free, Private)",
            description: "Distinguishing characteristics of different economic goods.",
            ao2: [
              "Free goods: Have zero opportunity cost, are abundant, and require no factors of production (e.g., sunlight).",
              "Public goods: Are non-rivalrous and non-excludable. This leads to the free-rider problem where consumers can enjoy the good without paying.",
              "Private goods: Are rivalrous and excludable. They are effectively supplied by the market mechanism.",
              "Merit goods: Are private goods that are under-consumed by the free market due to imperfect information (consumers do not realise their full positive externalities, like vaccines)."
            ],
            ao3: [
              "Missing Markets: Without government intervention via tax revenue, a pure market economy will face complete market failure regarding public goods.",
              "Dynamic nature of Free Goods: Free goods can become economic goods over time if they become scarce (e.g., fresh water or clean air due to pollution).",
              "Difficulty in categorisation: Goods like a beach can be 'quasi-public'. They might be non-excludable but can become rivalrous if overcrowded."
            ]
          },
          {
            id: "basic-sys",
            name: "Allocation in Different Economic Systems",
            description: "Market vs Planned vs Mixed Economies.",
            ao2: [
              "Market economy: relies purely on the price mechanism. It encourages efficiency and innovation via the profit motive and offers broad consumer choice.",
              "Planned economy: ignores price mechanisms to focus on welfare. It aims to prevent exploitation, inequality, and under-provision of merit goods.",
              "Mixed economy: combines market forces with government intervention to correct market failures while maintaining the efficiency incentives of the private sector."
            ],
            ao3: [
              "Market failure vs Government failure: A market economy is not 'always' desirable because it under-provides merit goods and completely ignores public goods and inequality. Conversely, planned economies suffer from massive information failures and lack of incentives.",
              "The success of a mixed economy heavily depends on the efficiency of the government and the scale of taxation required, which may create disincentives to work (Crowding Out)."
            ]
          }
        ]
      },
      {
        id: "micro-price",
        topic: "The Price System & Interaction",
        concepts: [
          {
            id: "price-functions",
            name: "Functions of Price in Resource Allocation",
            description: "How prices solve the basic economic problem in a free market.",
            ao2: [
              "Signalling function: Prices transmit information to buyers and sellers about changing market conditions (e.g., rising price signals a shortage).",
              "Incentivising function: Higher prices provide a profit motive for producers to reallocate resources to increase output.",
              "Rationing function: When demand exceeds supply, rising prices clear the shortage by allocating goods only to those willing and able to pay."
            ],
            ao3: [
              "Effectiveness depends on Elasticities: If supply is perfectly inelastic (e.g., agricultural goods in the short run), the signalling and incentivising functions cannot quickly increase output, leading to severe price volatility.",
              "Inequality limitation: The rationing function allocates goods based on the 'ability to pay', meaning vital necessities may become unaffordable for the poor, leading to a socially undesirable allocation."
            ]
          },
          {
            id: "price-surplus",
            name: "Consumer and Producer Surplus",
            description: "Evaluating the impact of price controls and supply/demand shifts on surplus.",
            ao2: [
              "Consumer surplus is the difference between what consumers are willing to pay and the market price.",
              "Producer surplus is the difference between what producers are willing to accept and the market price.",
              "An increase in production costs shifts supply to the left, which usually raises the market price and reduces consumer surplus."
            ],
            ao3: [
              "Extent of impact depends on PED: The exact loss of consumer surplus following a cost increase depends heavily on price elasticity. If demand is highly inelastic, the fall in consumer surplus will be severe, but producer surplus might be relatively protected.",
              "Impact of government intervention: Minimum prices (price floors) drastically reduce consumer surplus but can increase producer surplus, while maximum prices (price ceilings) increase consumer surplus but cause massive shortages."
            ]
          },
          {
            id: "price-elasticities",
            name: "Using Elasticities in Business (PED, PES, YED, XED)",
            description: "How businesses use elasticities to maximize revenue and plan production.",
            ao2: [
              "Price Elasticity of Demand (PED) & Revenue: If demand is price inelastic (<1), firms should raise prices to increase revenue. If elastic, they should lower prices.",
              "Price Elasticity of Supply (PES): Measures supply responsiveness. Firms try to make PES highly elastic by keeping spare capacity and stock to rapidly capture demand surges.",
              "Income Elasticity of Demand (YED): Helps firms plan for economic cycles. Normal goods (YED>0) thrive in booms; Inferior goods (YED<0) thrive in recessions.",
              "Cross Elasticity of Demand (XED): Helps track competitors. Substitutes (XED>0) mean rival price cuts steal market share. Complements (XED<0) allow loss-leader pricing."
            ],
            ao3: [
              "PED/XED Limitations: Brand loyalty can override elasticity formulas; a strong brand may remain unresponsive to competitor price cuts despite XED suggesting they are close substitutes.",
              "PES Opportunity Costs: Keeping large amounts of idle spare capacity or massive inventory to maintain an elastic PES incurs huge storage and opportunity costs, harming short-turn profit.",
              "Time Period factor: All elasticity measures tend to be highly inelastic in the short run (due to habit or production lag) but become much more elastic in the long run.",
              "Reliability of Data: Elasticities are calculated based on historical data and assume 'Ceteris Paribus', making future predictions frequently inaccurate."
            ]
          }
        ]
      },
      {
        id: "micro-inequality",
        topic: "Income and Wealth Inequality",
        concepts: [
          {
            id: "ineq-causes",
            name: "Causes and Measurement (Gini Coefficient)",
            description: "Why inequality exists and how it is measured.",
            ao2: [
              "Causes of income inequality include wage differentials due to skills/education, part-time vs full-time work, and varying levels of state welfare.",
              "Causes of wealth inequality include unequal ownership of assets (like property and stocks) which appreciate over time.",
              "The Gini Coefficient measures inequality: 0 is complete equality, 1 is complete inequality. A falling Gini coefficient indicates income is becoming more evenly distributed."
            ],
            ao3: [
              "Why Wealth Inequality is harder to measure than Income: Income is heavily documented via taxes, but wealth/assets can be hidden in offshore accounts, transferred to family, or hard to accurately value (e.g., private art).",
              "Is inequality always negative?: Some level of income inequality is essential in a market economy to provide an incentive for workers to retrain and for entrepreneurs to take risks, driving economic growth.",
              "Redistribution difficulty: High direct taxes to resolve inequality may cause capital flight (rich earners leaving the country) or disincentivize work, leading to a Laffer Curve effect."
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
        id: "macro-ad-as",
        topic: "The Macroeconomy (AD, AS & Circular Flow)",
        concepts: [
          {
            id: "macro-circular",
            name: "Circular Flow of Income (Closed vs Open)",
            description: "Understanding injections, leakages, and equilibrium.",
            ao2: [
              "A closed economy model has Injections (Investment + Government Spending) and Leakages (Savings + Taxation). Equilibrium is where I + G = S + T.",
              "An open economy incorporates international trade. Exports (X) act as a strong injection, while Imports (M) act as a leakage. Equilibrium becomes I + G + X = S + T + M.",
              "If injections exceed leakages, the economy experiences a positive multiplier effect leading to aggregate economic growth."
            ],
            ao3: [
              "Extent of Impact: Whether an increase in infrastructure investment (Injection) successfully boosts the circular flow depends on the size of the Multiplier (MPC). If consumers save massive amounts of new income (high MPS), the impact is negligible.",
              "Dependence on Trade: A trade deficit (Leakage > Injection in trade) does not guarantee negative economic growth IF it is heavily offset by massive domestic government spending or private investment."
            ]
          },
          {
            id: "macro-inflation",
            name: "Causes of Inflation and Deflation",
            description: "Distinguishing between Cost-Push and Demand-Pull mechanisms.",
            ao2: [
              "Demand-Pull Inflation: Occurs when Aggregate Demand (AD) shifts right faster than Aggregate Supply. Caused by high consumer confidence, low interest rates, or increased government spending.",
              "Cost-Push Inflation: Occurs when Short-Run Aggregate Supply (SRAS) shifts left. Caused by rising wages, expensive raw materials, or currency depreciation (imported inflation).",
              "Deflation: Can be caused by a collapse in AD (Demand-side) or huge productivity gains shifting AS right (Supply-side)."
            ],
            ao3: [
              "Which is more damaging?: Cost-push inflation is almost universally more damaging as it causes 'Stagflation' (high inflation paired with rising unemployment and falling GDP). Demand-pull inflation at least brings economic growth and job creation.",
              "State of the Economy: Demand-pull inflation is only a severe problem if the economy is operating at or near full capacity on the LRAS curve. If there is spare capacity, an AD increase mostly boosts output rather than prices.",
              "Positive side of inflation: A low, stable rate of inflation reduces the real value of national/consumer debt and boosts business optimism."
            ]
          },
          {
            id: "macro-unemployment",
            name: "Measuring and Causes of Unemployment",
            description: "Technological, Frictional, Cyclical, and Measurement Methods.",
            ao2: [
              "Measurement 1 (Claimant Count): Measures unemployment by counting individuals claiming unemployment-related welfare benefits.",
              "Measurement 2 (Labour Force Survey): Uses sampling to identify people who are without a job but have actively sought work recently.",
              "Frictional Unemployment: Temporary gap between jobs. Technological Unemployment: Capital/machines replacing manual labor. Cyclical Unemployment: Caused by a massive fall in AD during a recession."
            ],
            ao3: [
              "Reliability of Measures: The Claimant Count often vastly underestimates actual unemployment due to stigma or strict eligibility rules. The LFS avoids limit errors but is subject to statistical sampling errors and hidden/informal economy presence.",
              "Inevitable vs Damaging: Some Frictional unemployment is completely inevitable and even healthy (allows workers to reallocate to better-suited roles). Technological/Structural unemployment is the most severely damaging as it renders old skills entirely permanently obsolete."
            ]
          }
        ]
      },
      {
        id: "macro-international",
        topic: "International Economic Issues",
        concepts: [
          {
            id: "int-adv",
            name: "Comparative and Absolute Advantage",
            description: "The core arguments for free country specialisation.",
            ao2: [
              "Absolute Advantage: When a country can produce more of a good with the exact same amount of resources.",
              "Comparative Advantage: When a country can produce a good at a lower opportunity cost.",
              "Specialising based on comparative advantage increases total world output, reduces prices, and raises absolute living standards globally."
            ],
            ao3: [
              "Unrealistic Assumptions: The theory operates on highly unrealistic assumptions such as zero transport costs, perfect occupational factor mobility, and constant returns to scale.",
              "Over-specialization Risk: Complete dedication to one commodity based on comparative advantage leaves a country fatally vulnerable to global price shocks (e.g., collapse of coffee prices).",
              "Protectionist necessity: Infant industries in developing countries absolutely require protection (tariffs) until they hit economies of scale, meaning pure free trade is damaging early on."
            ]
          },
          {
            id: "int-tot",
            name: "Terms of Trade vs Balance of Trade",
            description: "Understanding export and import price ratios.",
            ao2: [
              "Balance of Trade: Measures export revenues minus import expenditure (volume traded).",
              "Terms of Trade (ToT): Is an index ratio of export prices to import prices. ToT improves (rises) when Export Prices rise relative to Import Prices.",
              "An improved ToT means a given volume of exports can now purchase a larger volume of imports, raising domestic living standards."
            ],
            ao3: [
              "The Quality vs Inflation dilemma: Whether an improved ToT is 'good' heavily depends on the cause. If it improved because domestic goods got higher in quality and global demand, it's beneficial.",
              "Elasticity Evaluation: If ToT improved solely because domestic inflation forced export prices up, AND export demand is highly price elastic, the export volume will massively collapse, fatally worsening the Balance of Trade and causing unemployment."
            ]
          },
          {
            id: "int-exchange",
            name: "Exchange Rates (Depreciation & Appreciation)",
            description: "The causes and consequences of currency value fluctuations.",
            ao2: [
              "Depreciation (fall in currency value): Lowers the perceived price of exports and raises the price of imports. This boots AD via Net Exports, creates jobs in export sectors, and helps resolve a current account deficit.",
              "Appreciation (rise in currency value): Lowers the price of imports. This dramatically reduces cost-push inflationary pressure for manufacturers reliant on foreign raw materials.",
              "Causes of shifts: Changes in relative interest rates (capital/hot money flows), trade balances, and investor speculation."
            ],
            ao3: [
              "Evaluation on Elasticities (Marshall-Lerner concept): A depreciation will ONLY effectively improve the current account trade deficit if the demand for exports and imports is relatively price elastic. If a country imports highly inelastic necessities (like oil), depreciation just causes massive imported cost-push inflation with no trade gain.",
              "State of the Macroeconomy: A depreciation boosting AD is highly beneficial during a recession to cut cyclical unemployment. But if the economy is already at full capacity, depreciation will simply trigger severe demand-pull inflation.",
              "Interest Rates vs Trade: Changes in relative interest rates are often vastly more significant in determining short-term exchange rates than the actual trade balance, due to the sheer volume of global speculative hot money flows."
            ]
          }
        ]
      }
    ]
  }
];
