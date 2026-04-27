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
            description: "Analysing scarcity, choice, movements, and shifts of the PPC.",
            ao2: [
              "Scarcity means we cannot produce outside the PPC. Choice means we must select a single point. A point inside indicates unemployment.",
              "A movement along the PPC demonstrates a trade-off between consumer and capital goods, revealing the exact opportunity cost.",
              "A shift outwards indicates an increase in the quantity or quality of resources (e.g., labour education, entrepreneurship), pushing output up.",
              "Constant opportunity cost is drawn as a straight line, while increasing opportunity cost is drawn as a concave curve."
            ],
            ao3: [
              "Equal Opportunity Cost?: Not every choice has an equal opportunity cost. Due to imperfect factor mobility, opportunity cost usually increases as we push for more of one good.",
              "Is a position inside permanent?: No. A position inside the PPC is not necessarily permanent if the government implements successful policies to reduce unemployment.",
              "Shifts = Economic Growth: An outward shift of the PPC is synonymous with long-run economic growth. Prioritising capital goods over consumer goods drives this long-term shift despite short-term costs."
            ]
          },
          {
            id: "basic-goods",
            name: "Classification & Provision of Goods",
            description: "Analysing how goods are classified and whether intervention is needed for provision.",
            ao2: [
              "Free goods: Zero opportunity cost, abundant in supply, and no factors of production required (e.g., sunlight).",
              "Public goods: Non-rivalrous (consumption by one limits none for others) and non-excludable (cannot prevent non-payers). This causes the 'free-rider problem'.",
              "Merit goods: Private goods that generate positive externalities but are under-consumed by the free market due to people's imperfect information about long-term benefits.",
              "Demerit goods: Private goods that generate negative externalities and are over-consumed due to imperfect information regarding their long-term harms (e.g., tobacco).",
              "Exams require assessing both 'classification' AND 'provision'. Always tie analysis to the specific good mentioned (e.g., healthcare vs national defence)."
            ],
            ao3: [
              "The Pure Market Failure: Can a market ever produce pure public goods? No. Due to the free-rider problem, private firms cannot extract profit. Thus, relying on a market economy guarantees complete non-provision, requiring 100% government funding.",
              "Merit Goods Debate: Will a market provide Merit Goods? Yes, because they are excludable and rivalrous, but it will severely under-produce them at a price too high for the socially optimal level. Government subsidies or free state provision is needed to fix this quantity gap.",
              "Categorisation Flaws (Quasi-Public Goods): Absolute categorization is dangerous. A beach or a road can be 'quasi-public'. A road is non-excludable initially, but becomes rivalrous when congested, pushing it closer to a private good and requiring new allocation methods (e.g., tolls)."
            ]
          },
          {
            id: "basic-sys",
            name: "Allocation in Different Economic Systems",
            description: "Evaluating resource allocation, pricing mechanism, and pros/cons of Market, Planned, and Mixed economies.",
            ao2: [
              "Market Economy: Relies purely on the price mechanism without government intervention. Pros: Aggressive efficiency due to the profit motive, rapid innovation, maximum consumer choice, and automatic resource allocation without bureaucratic costs (invisible hand). Cons: Fails to provide public goods, severe wealth inequality, over-production of demerit goods, and risk of monopolistic exploitation.",
              "Planned Economy: Government answers what, how, and for whom to produce. Pros: Low unemployment, prevents extreme inequality, ensures provision of public/merit goods, and stops monopoly exploitation. Cons: Massive bureaucratic inefficiency, slow to react to consumer demands (causing extreme shortages/surpluses), lack of profit motive destroys innovation, and loss of personal freedom.",
              "Mixed Economy: Combines private sector efficiency with state intervention. Pros: Corrects market failures (subsidizing merit goods, taxing demerit goods, providing public goods) while retaining the profit motive for innovation. Cons: Risk of 'Government Failure' (intervention worsens the market outcome due to huge administrative costs, political bias, or imperfect information)."
            ],
            ao3: [
              "Is a mixed economy always the superior system? While pure market economies suffer from devastating market failures (pollution, inequality) and planned economies suffer from fatal inefficiencies, a mixed economy is technically the ideal balance. However, its actual success relies entirely on the 'quality' of government intervention.",
              "The Paradox of Intervention: The very act of government intervention to fix a market failure (e.g., bureaucracy in healthcare) can create 'Government Failure', leading to massive red tape, corruption, and deadweight welfare loss. Thus, a 'light-touch' mixed economy might outperform a heavily regulated one.",
              "Transitioning Economies: Historically, economies transitioning from planned to mixed experienced rapid explosions in GDP and GDP-per-capita growth, proving the absolute necessity of the price incentive for long-term growth, despite rising inequality."
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
            id: "micro-demand-supply-determinants",
            name: "Determinants of Demand and Supply",
            description: "Factors that shift curves, particularly applied to specific goods.",
            ao2: [
              "Demand Determinants: Changes in consumer income, tastes/fashions, advertising, and the price of substitutes/complements (e.g., price of petrol impacts demand for electric cars).",
              "Supply Determinants: Changes in costs of production (wages, raw materials), technological improvements, taxes/subsidies, and climate/weather (crucial for agricultural goods like rice)."
            ],
            ao3: [
              "Greatest Significance?: Exams will ask which determinant is of 'greatest significance'. For electric cars, battery cost (Supply) or charging network availability (Demand) might overpower sheer vehicle price.",
              "Extent of the shift: A determinant like 'weather' will violently shift agricultural supply, but its impact on price vs quantity depends totally on the fact that agricultural PED is inelastic."
            ]
          },
          {
            id: "price-functions",
            name: "Functions of Price in Resource Allocation",
            description: "How the invisible hand solves the basic economic problem in a free market.",
            ao2: [
              "Signalling function: Prices transmit vital information to buyers and sellers about changing market conditions. A rising price signals a shortage, guiding economic behavior without a central planner.",
              "Incentivising function: Higher prices provide a profit motive for producers to forcefully reallocate resources away from unprofitable sectors and into high-demand sectors to increase output.",
              "Rationing function: When demand exceeds supply, rising prices clear the shortage by allocating scarce goods only to consumers willing and most able to pay."
            ],
            ao3: [
              "Pros of the Price Mechanism: It operates automatically, totally eliminating the massive bureaucratic costs and endless delays of a planned economy. It adapts rapidly to changing consumer preferences.",
              "Effectiveness depends on Elasticities: If supply is highly inelastic (e.g., agricultural goods like wheat in the short run), the signalling and incentivising functions cannot immediately increase output. A price spike occurs, but supply stays stagnant, leading to severe price volatility.",
              "Inequality Limitation (The Moral Flaw): The rationing function purely allocates goods based on 'ability to pay', not 'need'. Thus, vital necessities (like medicine) may become completely unaffordable for the poor, leading to a highly inequitable and socially undesirable allocation that requires government correction."
            ]
          },
          {
            id: "price-disequilibrium",
            name: "Market Equilibrium vs Disequilibrium",
            description: "How markets clear and the price adjustment process.",
            ao2: [
              "Equilibrium is where Quantity Demanded equals Quantity Supplied (market clears).",
              "Disequilibrium exists during excess supply or excess demand. For example, if wages rise across an economy, Supply shifts left, creating an immediate excess demand at the original price.",
              "The Price Adjustment Process: To clear this excess demand, the price mechanism signals producers to raise prices, rationing the good and incentivising more supply until a new Equilibrium is restored."
            ],
            ao3: [
              "Can a market move back automatically?: Yes, the invisible hand of the price mechanism seamlessly re-establishes a new equilibrium.",
              "Extent of change: The extent to which the equilibrium price and quantity change depends heavily on the gradients (PED and PES).",
              "Government Blockade Limitation: A market becomes permanently trapped in disequilibrium IF the government implements artificial Price Controls (Min/Max prices)."
            ]
          },
          {
            id: "price-surplus",
            name: "Consumer and Producer Surplus",
            description: "Evaluating the impact of cost increases and shifts on surplus.",
            ao2: [
              "Consumer surplus is the difference between what consumers are willing to pay and the market price.",
              "Producer surplus is the difference between what producers are willing to accept and the market price.",
              "An increase in production costs (e.g., higher wages) shifts supply left, raising the market price and severely reducing consumer surplus."
            ],
            ao3: [
              "Evaluating Outcome using Elasticity: Does cost always reduce surplus? If demand is perfectly inelastic, producers pass 100% of the cost burden to consumers, preserving their entire producer surplus while destroying consumer surplus.",
              "Extent of Shift (YED/XED): If a demand shift causes surplus changes, the extent is assessed using income/cross elasticities.",
              "Gov Intervention: Minimum prices artificially increase producer surplus, while maximum prices increase consumer surplus but cause brutal shortages."
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
            description: "The 4-step policy breakdown: Why, Mechanism, Pros, and Cons.",
            ao2: [
              "Indirect Tax Breakdown: Why use it? For overconsumed demerit goods. Mechanism: Shifts supply left, reducing Qd. Pro: Generates rapid tax revenue. Con: If PED < 1 (inelastic), Qd hardly falls, failing to fix the root cause.",
              "Subsidy Breakdown: Why use it? For underconsumed merit goods. Mechanism: Shifts supply right, lowering price. Pro: Quick impact. Con: Massive opportunity cost for the government.",
              "Exam Strategy: Questions often ask if a subsidy is the 'best' method. Structure answer by comparing Subsidy to an alternative like Information Campaigns."
            ],
            ao3: [
              "Incidence Strict Rule: The incidence of tax/subsidy depends entirely on PED. If demand is highly inelastic, consumers swallow the tax burden but also reap the most benefit from a subsidy price drop.",
              "Does it solve the root cause?: A tax treats the symptom (high consumption) but fails to fix the deep root cause (e.g., addiction or lack of education).",
              "Time Period: Subsidies might work in the short run, but in the long run create uncompetitive structural inefficiency."
            ]
          },
          {
            id: "micro-direct-provision",
            name: "Direct Provision of Merit & Public Goods",
            description: "Should governments always provide healthcare, education, or transit?",
            ao2: [
              "Merit Goods (Healthcare/Education) and Public Goods require intervention.",
              "Why support Direct Provision?: Solves imperfect information, guarantees equity/fairness so the poor are not excluded, and generates massive positive macro-externalities (a healthy, educated workforce drives the whole economy).",
              "Mass Transit (Bus/Rail): Receiving substantial subsidies reduces traffic congestion and carbon footprints (correcting negative externalities of cars)."
            ],
            ao3: [
              "Why NOT support?: Direct provision has a titanic opportunity cost. Money spent on free healthcare cannot be spent on infrastructure.",
              "Inefficiency Limitation: Government-run monopolies lack the profit motive, often making them financially inefficient, bloated, and slow to innovate.",
              "Targeted vs Blanket: 'Always' providing them free of charge to everyone (including the rich) is a waste of funds. A targeted voucher system might be vastly superior to blanket provision."
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
            name: "Income vs Wealth Inequality",
            description: "Measurement, causes, and pros/cons of inequality.",
            ao2: [
              "Measurement: Evaluated using the Gini coefficient and Lorenz Curve. Causes include differences in skills/education levels (Income) and inheritance of property/financial assets (Wealth).",
              "Pros of Inequality: Slight inequality is mathematically necessary in a market economy as a vital incentive for entrepreneurship, upskilling, and hard work. It rewards risk-taking, accelerating overall GDP growth.",
              "Cons of Inequality (Consequences): Severe poverty, tragically wasted human capital (children in poverty unable to afford higher education), extreme social friction/crime, and skewed production (firms only cater to luxury demands of the wealthy)."
            ],
            ao3: [
              "Why is Wealth Inequality harder to measure?: Unlike income (which is cleanly recorded by employer payrolls), wealth consists of heavily fluctuating asset valuations (shares, prime real estate) and is easily hidden in complex offshore trusts.",
              "Why is Wealth harder to redistribute?: A government can easily alter PAYE income tax brackets to be more progressive. But taxing accumulated physical wealth (Wealth Taxes) frequently triggers massive capital flight and aggressively destroys future investment incentives.",
              "Depends on Equality of Opportunity: Inequality is only economically 'acceptable' if it strictly stems from different effort levels. If it instead stems from a systemic lack of basic education/healthcare access at birth, it permanently paralyzes long-term growth and traps the economy inside its PPC."
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
            name: "Methods of Measuring GDP & Living Standards",
            description: "How GDP is calculated, its limitations, and whether it measures living standards accurately.",
            ao2: [
              "GDP Measurement: Evaluated via the Output method (adding up value added), Income method (wages, profits, rents), or Expenditure method (C + I + G + (X - M)).",
              "Measurement Best Practices: To avoid 'double counting', economists strictly count final goods (or use the value-added method) and universally exclude government transfer payments (e.g., pensions).",
              "GDP vs Real GDP per Capita: Real GDP actively strips out the distortion of inflation. GDP per capita divides the total by population to roughly estimate average individual income."
            ],
            ao3: [
              "Does GDP accurately measure living standards?: No. GDP purely measures output, NOT human happiness or quality of life.",
              "The Informal Economy Blindspot: The Hidden/Informal Economy (e.g., unrecorded cash jobs, illegal black markets) is completely untraceable. This massively understates the true living standards and actual output in developing nations.",
              "Non-Market Activities & Quality: High-value societal 'output' like housework, subsidence farming, or volunteer work is ignored. Furthermore, GDP completely ignores the 'quality' of products and the amount of leisure time residents enjoy.",
              "Environmental Tragedy: GDP heavily counts the production of a factory, but actively ignores the terrifying negative externalities (air pollution, deforestation) it causes. An economy might boom in GDP while completely poisoning its citizens' life expectancy."
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
            name: "Causes & Impacts of Budget Deficits (Cyclical vs Structural)",
            description: "Understanding why governments overspend, the pros/cons, and which type is worse.",
            ao2: [
              "A budget deficit explicitly occurs when government spending drastically exceeds tax revenue in a single financial year, adding to the National Debt.",
              "Cyclical Deficit: Automatically caused by the business cycle during a recession. As workers lose jobs, income tax revenue organically crashes, and unemployment welfare payouts organically skyrocket (Automatic Stabilizers).",
              "Structural Deficit: A permanent, terrifying imbalance that exists even when the economy is booming. It is caused by historically reckless political spending pledges, massive evasion, or an aging population triggering endless pension costs."
            ],
            ao3: [
              "Which is more damaging?: Structural is infinitely more damaging. It causes a permanent, massive accumulation of national debt, terrifying interest repayment burdens, and requires agonizing discretionary 'Austerity' (aggressively cutting public services / raising taxes) to fix.",
              "Cyclical Deficits are economically necessary: Actively allowing a cyclical deficit to balloon violently during a severe recession is mathematically necessary to cushion the crash (Keynesian support). Without this spending, the economy plunges into depression. Furthermore, cyclical deficits organically self-correct once economic growth returns.",
              "The 'Crowding Out' Consequence: If a government continually runs massive structural deficits, it must aggressively borrow from financial markets. This can drive up national interest rates, horrifyingly 'crowding out' private sector investment as lending becomes too expensive for normal businesses."
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
            name: "Economic Growth (Policies & Consequences)",
            description: "Evaluating if GDP growth is always desirable and how to safely trigger it.",
            ao2: [
              "Triggers of Growth: Sustained Long-Run economic growth requires an outward shift of the PPC/LRAS. This is achieved via Supply-Side Policies (SSP) like heavy investments in STEM education, privatization, building 5G infrastructure, and promoting enterprise.",
              "Pros: Drastically higher living standards, massive creation of new jobs (obliterating cyclical unemployment), and a powerful 'fiscal dividend' (the government naturally collects vastly more tax revenue to build hospitals without ever needing to raise tax rates).",
              "Cons: Severe environmental degradation (carbon emissions), brutal workplace stress/reduced leisure time, potentially widening income inequality (if growth is captured only by elites), and explosive demand-pull inflation if the growth is unmanaged."
            ],
            ao3: [
              "Demand-Led vs Supply-Led Growth: Demand-led growth (AD shifting rapidly to the right near full capacity) is highly dangerous and inflationary. Supply-led growth (LRAS shifting right) is universally superior because it is sustainable and non-inflationary.",
              "Distribution of Benefits: Growth is only a 'success' if it is evenly distributed. A booming 5% GDP growth rate means absolutely nothing to working-class families if inflation is running at 6% and all the newly created wealth was instantly captured by corporate monopolies.",
              "Sustainable vs Short-term Strip Mining: Growth artificially driven by the rapid, chaotic depletion of natural resources (e.g., hastily chopping down entire national forests for timber) provides a brilliant short-term boom but causes a catastrophic, permanent loss of GDP in the long term."
            ]
          }
        ]
      }
    ]
  }
];
