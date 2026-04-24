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
        topic: "Basic Economic Ideas (PPC, Systems & Specialisation)",
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
          },
          {
            id: "basic-specialisation",
            name: "Specialisation & Division of Labour",
            description: "Analysing how tasks are divided across consumers, firms, and the economy.",
            ao2: [
              "Specialisation occurs at the consumer level (purchasing/career), firm level (core products/services), and economy level (macro comparative advantage).",
              "Division of labour is a type of specialisation breaking production into small repetitive tasks for individual workers.",
              "It increases productivity by saving time (no switching tools), reducing training costs, and allowing workers to become highly skilled at one specific task."
            ],
            ao3: [
              "Does it always improve productivity?: No. Extreme repetition causes severe worker boredom and alienation. This leads to high absenteeism, strikes, and a catastrophic drop in product quality.",
              "Over-dependence Risk: If one vital stage of the highly divided production line breaks (or specialist workers strike), the entire firm's output instantly grinds to a halt."
            ]
          }
        ]
      },
      {
        id: "micro-price-system",
        topic: "The Price System & Mechanism",
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
            id: "price-disequilibrium",
            name: "Market Equilibrium vs Disequilibrium",
            description: "How markets clear and resolve imbalances.",
            ao2: [
              "Equilibrium is where Quantity Demanded equals Quantity Supplied (leaving no tendency for the price to change).",
              "Disequilibrium exists when there is excess supply (price is set too high) or excess demand (price is set too low).",
              "To clear excess demand, the price mechanism signals producers to raise prices, rationing the good and incentivising more supply until EQ is restored."
            ],
            ao3: [
              "Can a market move back automatically?: Yes, the invisible hand of the price mechanism normally clears imbalances seamlessly without external help.",
              "Government Blockade Limitation: A market may become permanently trapped in disequilibrium IF the government implements artificial Price Controls (Min/Max prices) that render the price mechanism paralyzed."
            ]
          },
          {
            id: "price-surplus",
            name: "Consumer and Producer Surplus",
            description: "Evaluating the impact of cost increases and shifts on surplus.",
            ao2: [
              "Consumer surplus is the difference between what consumers are willing to pay and the market price.",
              "Producer surplus is the difference between what producers are willing to accept and the market price.",
              "An increase in production costs shifts supply to the left, raising the market price and typically reducing both consumer and producer surplus."
            ],
            ao3: [
              "Extent of Impact depends on PED: Does cost always reduce producer surplus? No! If demand is perfectly inelastic, producers pass 100% of the cost burden to consumers via higher prices, preserving their entire producer surplus.",
              "Impact of Gov Intervention: Minimum prices artificially increase producer surplus (though cause massive excess supply), while maximum prices increase consumer surplus but cause brutal shortages."
            ]
          }
        ]
      },
      {
        id: "micro-gov-intervention",
        topic: "Gov Intervention & Market Failure",
        concepts: [
          {
            id: "micro-taxes-subsidies",
            name: "Indirect Taxes & Subsidies (and Incidence)",
            description: "Evaluating pros, cons, and incidence based on PED.",
            ao2: [
              "Pros [Taxes]: Internalises negative externalities, reduces over-consumption of demerit goods, and raises vital government revenue.",
              "Cons [Taxes]: Regressive (hurts the poor more), can cause cost-push inflation, and may encourage black markets/smuggling.",
              "Pros [Subsidies]: Increases consumption of merit goods, helps lower income inequality, and supports domestic infant industries.",
              "Cons [Subsidies]: Huge opportunity cost for the government, and protected firms may become reliant and inefficient."
            ],
            ao3: [
              "Incidence of Subsidy/Tax (Depends on Elasticity): If Demand is highly elastic, the price to consumers falls very little, so producers mathematically keep almost all the subsidy. If Demand is highly inelastic, the price crashes, and consumers enjoy most of the subsidy.",
              "Depends on Magnitude: A very small tax won't shift supply enough to change consumer behaviour; a massive one destroys an industry.",
              "Time Period: Subsidies might work in the short run to boost an industry, but in the long run create uncompetitive structural inefficiency."
            ]
          },
          {
            id: "micro-price-controls",
            name: "Maximum & Minimum Prices",
            description: "Regulating prices to protect consumers or producers.",
            ao2: [
              "Pros [Max Price]: Makes essential goods (like food/rent) affordable for low-income households, increasing equity.",
              "Cons [Max Price]: Causes massive shortages (excess demand), queueing, and encourages illegal black markets.",
              "Pros [Min Price]: Protects producer incomes (e.g., farmers) from price volatility, and limits consumption of demerit goods.",
              "Cons [Min Price]: Causes massive surpluses (excess supply) which the government might have to buy, and hurts poor consumers' living standards."
            ],
            ao3: [
              "Depends on Enforcement: Without strict government policing, illegal markets will form immediately, rendering the policy useless.",
              "Depends on Elasticities: Highly elastic supply and demand curves will create massive surpluses/shortages, amplifying the cost of the intervention."
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
              "Depends on Perishability: Buffer stocks only work for storable commodities (wheat, grain). It fails catastrophically for perishable goods (fresh milk, tomatoes).",
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
              "Depends on Opportunity: If inequality exists because of different effort levels, it is acceptable. If it exists due to corruption or lack of basic education access, it permanently paralyzes long-term growth."
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
              "Time dimension to Supply: PES is always intensely inelastic in the immediate short run (especially agriculture), rendering PES calculations practically useless against sudden shocks."
            ]
          },
          {
            id: "micro-reduce-ped",
            name: "Firms Attempting to Reduce PED",
            description: "How firms make their demand more price inelastic to gain pricing power.",
            ao2: [
              "Firms reduce PED through aggressive advertising (creating brand loyalty), product differentiation (creating Unique Selling Points), or restricting substitutes (mergers).",
              "They can also use legal lock-ins (long-term contracts) or ecosystem integration (e.g., restrictive gaming ecosystems or tech software)."
            ],
            ao3: [
              "Which is most successful?: Advertising is powerful but incurs massive opportunity costs and takes years to permanently alter perception.",
              "Product differentiation is arguably the most sustainable approach, but faces the constant risk of rapid copying by competitors.",
              "Contracts/Lock-ins are instantly effective in the short run to trap consumers, but generate heavy resentment and provoke anti-monopoly government regulation."
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
        topic: "The Macroeconomy (AD/AS, GDP, Inflation & Unemployment)",
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
            id: "macro-measuring-gdp",
            name: "Methods of Measuring GDP",
            description: "How GDP is calculated and limitations of its accuracy.",
            ao2: [
              "GDP can be measured using the Output method (value added across all firms), Income method (wages, profits, rents), or Expenditure method (C + I + G + (X - M)).",
              "To completely avoid double counting, calculations must only count final goods or use the strict value-added approach, and exclude transfer payments."
            ],
            ao3: [
              "Difficulties in Accuracy: The Hidden/Informal Economy (e.g., cash jobs, illegal black markets) is completely untraceable, massively understating real GDP in developing nations.",
              "Non-Market Activities: Valuable output like housework, subsistence farming, or volunteer work is entirely excluded from official GDP figures.",
              "Inflation Distortion: In extreme hyperinflation, separating nominal values into meaningful Real GDP becomes statistically difficult and prone to severe error."
            ]
          },
          {
            id: "macro-calculating-cpi",
            name: "Calculating the Inflation Rate (CPI)",
            description: "How CPI is constructed and its measurement flaws.",
            ao2: [
              "CPI is constructed by establishing a base year, selecting a 'basket of representative goods and services', and carefully weighting each item based on the proportion of average household expenditure.",
              "A periodic survey tracks the prices of these items at retail outlets to calculate the index change."
            ],
            ao3: [
              "Measurement Limitations: The 'Average Household' does not exist. Poorer households spend heavily on food/energy, so if food prices spike, their personal inflation rate is vastly higher than the official CPI.",
              "Updating the Basket: Consumer habits change rapidly. If the basket is slow to update, it overweights outdated technology and ignores new services.",
              "Quality vs Price: If a phone doubles in price but also doubles in processing power, CPI statisticans struggle to mathematically separate 'inflation' from genuine 'quality improvement'."
            ]
          },
          {
            id: "macro-ad-as-shifts",
            name: "Causes of Inflation and Deflation",
            description: "Distinguishing between Cost-Push and Demand-Pull mechanisms.",
            ao2: [
              "Demand-Pull Inflation: Occurs when Aggregate Demand (AD) shifts right faster than Aggregate Supply. Caused by high consumer confidence, low interest rates, or increased government spending.",
              "Cost-Push Inflation: Occurs when Short-Run Aggregate Supply (SRAS) shifts left. Caused by rising wages, expensive raw materials, or currency depreciation (imported inflation).",
              "Deflation: Can be caused by a collapse in AD (Demand-side) or massive productivity gains shifting AS right (Supply-side)."
            ],
            ao3: [
              "Which is more damaging?: Cost-push inflation is universally more damaging as it causes 'Stagflation' (high inflation paired with rising unemployment and falling GDP). Demand-pull inflation at least runs parallel with economic growth.",
              "State of the Economy: Demand-pull inflation is only a severe problem if the economy is operating at or near full capacity on the LRAS curve. If there is spare capacity, an AD increase mostly boosts output rather than prices.",
              "Deflation severity: Demand-side deflation causes a catastrophic deflationary spiral (consumers delay all spending). Supply-side deflation is highly beneficial as output expands and prices fall."
            ]
          },
          {
            id: "macro-unemployment",
            name: "Types of Unemployment & Measurement",
            description: "Evaluating which types of unemployment are most damaging and how they are measured.",
            ao2: [
              "Measurement 1 (Claimant Count): Measures unemployment by counting individuals claiming unemployment-related welfare benefits.",
              "Measurement 2 (Labour Force Survey): Uses sampling to identify people who are without a job but have actively sought work recently.",
              "Types: Cyclical (Demand-deficient), Structural (Mismatch of skills due to changing tech/industries), Frictional (Between jobs).",
              "Pros (Frictional only): Frictional unemployment allows workers to search for jobs that perfectly match their skills, leading to higher long-term productivity and happiness.",
              "Cons: Massive loss of potential GDP, massive fiscal drain (welfare benefits rise, income tax falls), hysteresis (long-term unemployed lose skills), and crime/social unrest."
            ],
            ao3: [
              "Reliability of Measures: The Claimant Count often vastly underestimates actual unemployment due to stigma or strict eligibility rules. The LFS avoids limit errors but is subject to statistical sampling errors and hidden/informal economy presence.",
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
            id: "macro-budget-causes",
            name: "Causes of Budget Deficits (Cyclical vs Structural)",
            description: "Understanding why governments overspend and which type is worse.",
            ao2: [
              "A budget deficit occurs when government spending directly exceeds tax revenue in a financial year.",
              "Cyclical Deficit: Caused by automatic stabilizers during a recession (tax revenue organically falls because of unemployment, welfare benefits organically rise).",
              "Structural Deficit: A permanent imbalance that exists even when the economy is booming, caused by historically reckless spending or a fundamentally flawed tax collection network."
            ],
            ao3: [
              "Which is more damaging?: Structural is infinitely more damaging. It causes permanent, unsustainable accumulation of national debt and requires painful discretionary austerity (massive spending cuts / tax hikes) to fix.",
              "Cyclical Deficits are economically healthy: Letting a cyclical deficit balloon during a recession is mathematically necessary to cushion the crash (Keynesian support). It naturally self-corrects once economic growth returns."
            ]
          },
          {
            id: "macro-taxation-types",
            name: "Direct vs Indirect Taxation",
            description: "Which method is best to raise tax revenue?",
            ao2: [
              "Direct Taxes (e.g., Income/Corporation tax): Levied on income/wealth. They are highly reliable revenue generators and mostly progressive.",
              "Indirect Taxes (e.g., VAT/Sales tax): Levied on expenditure. They are harder to evade, quick to adjust, and can target demerit goods to fix market failure."
            ],
            ao3: [
              "Fairness/Equity vs Revenue: Direct taxes are much fairer (progressive) but extreme marginal rates cause 'Brain Drain' and disincentivise entrepreneurial work (Laffer Curve effect).",
              "The Regressive Flaw: Indirect taxes raise revenue efficiently but are mathematically regressive—they consume a vastly larger percentage of a poor person's income compared to a rich person, worsening inequality."
            ]
          },
          {
            id: "macro-gov-spending-types",
            name: "Types of Gov Spending",
            description: "Current, Capital, and Transfer Payments.",
            ao2: [
              "Current Spending: Recurring daily operational costs (civil servant wages, consumables in hospitals, military supplies).",
              "Capital Spending: Investments in long-term physical assets (new highways, schools, fiber-optic broadband networks).",
              "Transfer Payments: Redistribution of wealth where no economic output is received in return (state pensions, unemployment benefits)."
            ],
            ao3: [
              "Is it always beneficial?: Capital spending is profoundly beneficial as it heavily shifts LRAS right, essentially paying for itself in the long run (despite distinct short-run implementation lags).",
              "The Dangers of Current/Transfer Spending: Flooding the economy with massive transfer payments without simultaneously increasing AS creates violent demand-pull inflation. An over-reliance on current spending balloons the structural deficit to a point of crisis."
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
          },
          {
            id: "macro-deflation-policies",
            name: "Policies to Correct Deflation (FP vs MP)",
            description: "How to escape a deflationary spiral.",
            ao2: [
              "Deflation (falling general price level) crushes consumption. To fix it, Expansionary Monetary Policy (MP) slashes interest rates and injects money supply to stimulate borrowing.",
              "Expansionary Fiscal Policy (FP) drastically cuts taxes and ramps up public capital spending (G) to forcibly inject money into the circular flow."
            ],
            ao3: [
              "The Liquidity Trap Limitation: In severe deflation, MP frequently becomes completely useless. Even at 0% interest rates, fearful consumers will hoard cash rather than borrow (Consumer Confidence is zero).",
              "Fiscal Supremacy: In deep deflation, FP is vastly superior. The government must step in directly as the 'spender of last resort' to guarantee wages via infrastructure jobs, though this will drastically increase the national debt."
            ]
          }
        ]
      },
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
          },
          {
            id: "macro-comp-abs",
            name: "Comparative and Absolute Advantage",
            description: "The core arguments for free country specialisation.",
            ao2: [
              "What determines comparative advantage? Factor Endowments (abundance of land, labour, or capital). A country rich in fertile land will inevitably have a lower opportunity cost in agriculture.",
              "Comparative Advantage vs Absolute: Absolute is producing more with the same resources. Comparative is producing at a lower opportunity cost.",
              "Specialising based on comparative advantage increases total world output, reduces prices, and raises absolute living standards globally."
            ],
            ao3: [
              "Does it change over time? (Dynamic Advantage): Yes. Rapid depletion of natural resources destroys initial endowments. Conversely, strong Supply-Side Policy (SSP) funding STEM education and tech infrastructure can artificially create new comparative advantages over decades (e.g., South Korea's tech dominance).",
              "Unrealistic Assumptions: The classical theory operates on highly unrealistic assumptions such as zero transport costs, perfect occupational factor mobility, and constant returns to scale."
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
          }
        ]
      }
    ]
  }
];
