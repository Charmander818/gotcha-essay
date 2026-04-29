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
        id: "macro-economy-1",
        topic: "1. Macro economy (Growth, Unemployment, Price Stability)",
        concepts: [
          {
            id: "macro-growth",
            name: "Economic Growth",
            description: "Measurement (GDP), Causes, and Consequences.",
            ao2: [
              "Measurement: Output method (adding up value added), Income method (wages + profits + rents), or Expenditure method (C + I + G + (X - M)).",
              "Causes: Demand-Led (AD shift right via lower interest rates/Gov spending) vs Supply-Led (LRAS shift right via tech advancements, education).",
              "Consequences (Pros): Higher living standards, massive job creation (reducing cyclical unemployment), and 'fiscal dividend' (Gov collects more tax revenue to spend on healthcare without raising tax rates)."
            ],
            ao3: [
              "Consequences (Cons): Severe environmental degradation (negative externalities), explosive demand-pull inflation if growth is too rapid, and widened income inequality if wealth is captured by monopolies.",
              "Measurement Difficulties: GDP purely measures output, not human happiness. It ignores the informal economy (unrecorded cash jobs) and non-market activities (unpaid housework).",
              "Is Growth Always Desirable?: It depends on how it is achieved. Supply-led growth is sustainable and non-inflationary. Demand-led growth at full capacity just creates inflation."
            ]
          },
          {
            id: "macro-unemployment",
            name: "Unemployment",
            description: "Measurement, Causes, Consequences, and Policies.",
            ao2: [
              "Measurement: Claimant count (welfare claims) vs Labour Force Survey (survey of active job seekers). Errors arise from stigma (under-claiming) or the hidden economy (fraud).",
              "Causes: Cyclical (Demand-deficient recessions), Structural (mismatch of skills due to tech/deindustrialization), Frictional (short-term gaps between jobs).",
              "Consequences (Cons): Massive loss of potential GDP, extreme fiscal drain (tax revenue collapses while welfare spending skyrockets), and 'hysteresis' (long-term unemployed permanently lose their skills)."
            ],
            ao3: [
              "Consequences (Pros): Almost universally negative, EXCEPT Frictional unemployment which has positive consequences—it allows workers time to find jobs that perfectly perfectly match their skills, boosting long-term productivity.",
              "Severity Comparison: Technological/Structural unemployment is radically more damaging and permanent than cyclical. Cyclical reverses naturally when AD recovers, but structural requires decades of retraining.",
              "Policies: For cyclical, use Expansionary Monetary Policy (cut rates to boost AD). For structural, use Supply-Side Policy (re-training, education). Using MP to fix structural unemployment just causes inflation."
            ]
          },
          {
            id: "macro-price-stability",
            name: "Price Stability (Inflation & Deflation)",
            description: "Measurement (CPI), Causes, Consequences, and Policies.",
            ao2: [
              "Measurement (CPI): Establish base year. Select a 'basket' of representative goods. Weight items based on average household expenditure proportion. Execute periodic price surveys.",
              "Causes: Demand-pull (surging AD via high confidence/Gov spending). Cost-push (shrinking SRAS via rising wages/raw material shocks - most damaging!).",
              "Consequences of Inflation (Pros): A low, stable rate allows firms to adjust real wages smoothly, prevents deflationary spirals, and erodes the real value of national/personal debt (benefiting borrowers)."
            ],
            ao3: [
              "Consequences of Inflation (Cons): Shoe-leather costs, menu costs, destroys savings, and brutally destroys international export competitiveness.",
              "Consequences of Deflation (Pros vs Cons): Supply-side 'good deflation' (SRAS shifts right) acts brilliantly to raise output, lower prices, and boost living standards. Demand-side 'bad deflation' causes a catastrophic deflationary spiral (consumers delay spending indefinitely).",
              "Measurement Flaws & Policy: The 'average household' doesn't exist. Poor households suffer uniquely if food/energy spike. MP (raising rates) fixes demand-pull, but raises costs during cost-push inflation."
            ]
          }
        ]
      },
      {
        id: "macro-ad-as",
        topic: "2 & 3. AD/AS Analysis & Circular Flow",
        concepts: [
          {
            id: "macro-ad-as-analysis",
            name: "AD/AS Analysis",
            description: "Causes of AD/AS shifts and their impacts.",
            ao2: [
              "Exams require deep textual explanations: DO NOT just say 'AD shifts right'. Explain the transmission mechanism.",
              "Increase in AD: If interest rates fall, borrowing becomes cheaper, causing Consumers to buy durables and Firms to invest in capital, shifting AD right. Or Gov raises spending on infrastructure.",
              "Increase in AS: A cut in corporation tax increases retained profit, allowing reinvestment. Or a fall in global oil prices lowers production costs for all firms, shifting SRAS right."
            ],
            ao3: [
              "Does AD increase ALWAYS lead to inflation?: No. It strictly depends on the current state of the economy. If operating deeply on the horizontal Keynesian segment (massive spare capacity), AD increases yield massive real GDP growth with zero inflation.",
              "Cost-Push Danger: An AS decrease is the only factor that forcefully creates both inflation and a recession simultaneously (Stagflation)."
            ]
          },
          {
            id: "macro-circular-flow",
            name: "Circular Flow of Income",
            description: "Equilibrium and Open vs Closed Economy shifts.",
            ao2: [
              "The Circular Flow traces income. Injections (J) = Investment (I) + Gov Spending (G) + Exports (X). Leakages (W) = Savings (S) + Taxes (T) + Imports (M).",
              "Mechanism of Change: Any injection (e.g., Gov spending ↑) raises household income immediately. Households spend a fraction of this based on their Marginal Propensity to Consume (MPC).",
              "Crucial Exam Trap: This triggers the Multiplier Effect. The newly spent money becomes income for someone else, continually cycling and expanding until the new Leakages perfectly match the original Injection (J = W)."
            ],
            ao3: [
              "What determines extent of the change?: The Multiplier Effect. The size of the marginal propensities to import, tax, and save directly constrain the final increase to national equilibrium income.",
              "If students write a standard AD/AS essay instead of explicitly linking to Injections (J) and Withdrawals (W), no major AO2 marks are awarded."
            ]
          }
        ]
      },
      {
        id: "macro-trade-protectionism",
        topic: "4 & 5. International Trade & Protectionism",
        concepts: [
          {
            id: "macro-trade-ca",
            name: "Theory of Comparative Advantage (CA)",
            description: "Limitations and Role in Decision Making.",
            ao2: [
              "Comparative Advantage states countries should specialise in the good where they have the lowest opportunity cost (giving up less alternative output).",
              "Benefits: By specialising and trading at a rate between their opportunity costs, both nations consume outside their native PPC boundaries, maximising global output.",
              "Limitations: Exam questions testing 'only based on CA' require stating its unrealistic assumptions: assumes zero transport costs, perfect occupational mobility of labour, and constant returns to scale."
            ],
            ao3: [
              "Are CA theories undermined by realities?: Absolutely. Transport costs can easily eliminate a margin of comparative advantage. Complete specialisation leads to dangerous over-reliance.",
              "Should CA be the main factor?: No. Strategic considerations (protecting infant industries, national security), transportation costs, and avoiding structural unemployment are equally critical factors.",
              "Free Trade vs CA: In exams on free trade limits, 'limitation' extends beyond CA assumptions; it includes risks like over-reliance, dumping, and destruction of infant industries."
            ]
          },
          {
            id: "macro-protectionism",
            name: "Protectionism (Tariffs & Quotas)",
            description: "Methods and whether free trade is always superior.",
            ao2: [
              "Pros of Free Trade: Consumers access cheaper prices and massive choice. Forces lazy domestic monopolies to become efficient. Global resources are maximized via Comparative Advantage.",
              "Cons of Free Trade: Causes structural unemployment as uncompetitive domestic firms collapse. Leads to dangerous over-reliance on foreign powers for vital goods.",
              "Pros of Protectionism: Essential to protect 'infant industries' until they reach economies of scale. Prevents predatory 'dumping' and saves domestic jobs during a crisis."
            ],
            ao3: [
              "Cons of Protectionism: Guarantees trade war retaliation. Consumers are forced to heavily subsidize inefficient domestic firms by paying artificially high prices. Breeds domestic monopolies.",
              "Methods Effectiveness: Tariffs generate tax revenue, but if import demand is totally inelastic, imports won't fall much. Quotas guarantee an absolute physical limit, but provide zero tax revenue.",
              "Impact on Different Agents: When testing 'does everyone benefit from protectionism', separate your analysis: Consumers suffer (pay higher prices), Producers win (gain market share), Government wins initially (tariff revenue)."
            ]
          }
        ]
      },
      {
        id: "macro-exchange-terms",
        topic: "6. Exchange Rate & Terms of Trade (TOT)",
        concepts: [
          {
            id: "macro-exchange-rate",
            name: "Exchange Rate (ER) Appreciation & Depreciation",
            description: "Causes and Consequences of ER movements.",
            ao2: [
              "Cause Analysis: If a Central Bank raises interest rates, it attracts foreign investors seeking higher returns ('hot money' inflows). They buy the domestic currency, shifting demand right and causing Appreciation.",
              "Pros of Depreciation: (SPICED backwards) Exports become massively cheaper abroad, boosting export volumes. Net exports rise, shifting AD right to fix cyclical unemployment and close a trade deficit.",
              "Cons of Depreciation: Severe imported inflation. Imported raw materials instantly cost more, shifting SRAS left (cost-push inflation), which lowers domestic living standards."
            ],
            ao3: [
              "Pros of Appreciation: Excellent for fighting inflation. Imported goods and raw materials become incredibly cheap, shifting SRAS right.",
              "Cons of Appreciation: Devastates export competitiveness. Domestic goods become too expensive abroad, destroying export industries and causing huge unemployment.",
              "Marshall-Lerner Condition: A depreciation ONLY successfully improves a trade deficit if the combined Price Elasticity of Demand for exports and imports is > 1. If imports are perfectly inelastic (oil), a depreciation just worsens the deficit."
            ]
          },
          {
            id: "macro-tot-true",
            name: "Terms of Trade (TOT)",
            description: "Measurement, Causes, and Consequences based on root cause.",
            ao2: [
              "Measurement: TOT is natively calculated: (Index of Export Prices / Index of Import Prices) x 100. A numerical rise indicates an 'improvement'.",
              "Pros of an Improved TOT: The nation can suddenly buy a vastly larger volume of essential imports for the exact same volume of exports, immediately boosting domestic living standards.",
              "The 'Cause' Trap: An improvement is only beneficial depending entirely on its root cause. If export prices rose due to surging global demand, export revenue and living standards skyrocket."
            ],
            ao3: [
              "Cons of an Improved TOT: If the TOT improved purely because the country suffers from violently high domestic inflation, their exports are now completely uncompetitive globally.",
              "The 'PED' Trap: Following the domestic inflation cause, if the price elasticity of demand for their exports is elastic, the volume of exports sold will instantly crash.",
              "Therefore: When discussing TOT consequences, you MUST explicitly state the cause. A demand-led TOT improvement is brilliant for the economy. An inflation-led TOT improvement destroys the Current Account."
            ]
          }
        ]
      },
      {
        id: "macro-fiscal-current",
        topic: "7 & 8. Fiscal Policy & Current Account",
        concepts: [
          {
            id: "macro-tax-budget",
            name: "Taxation & Budget Deficit vs Surplus",
            description: "Direct vs Indirect fairness, Deficits vs Surpluses.",
            ao2: [
              "Direct Tax (Income Tax): Levied on earnings. Progressive nature makes it equitable, shrinking the wealth gap. However, high marginal rates destroy incentives to work or invest.",
              "Indirect Tax (VAT/Sales Tax): Levied on expenditure. Excellent for rapid, unavoidable revenue collection and solving demerit goods. However, it is mathematically regressive, harming lower-income households disproportionately.",
              "Budget Deficit implies Expansionary Fiscal Policy (Gov Spending > Tax). It directly injects AD into the circular flow to pull the economy out of recession. Surplus withdraws AD to cool inflation."
            ],
            ao3: [
              "Which is \"Fairer\"?: Income tax is progressive (fairer) but severe rates trigger brain drain. Sales tax generates massive revenue effortlessly but is brutally regressive.",
              "Always aim for Balanced?: Assessing if Governments should 'always' aim for balance. In a severe recession, intentionally running a deficit (expansionary FP) is vital to save the economy.",
              "Surplus Limitations: A rigid surplus acts as a severe withdrawal from the circular flow, crushing AD and causing potential cyclical unemployment. Therefore, a surplus is heavily damaging unless the economy is dangerously overheating."
            ]
          },
          {
            id: "macro-current-account",
            name: "Current Account",
            description: "Deficits, Surpluses, Causes, and Consequences.",
            ao2: [
              "Causes of Deficit (CAD): Overvalued exchange rate, high domestic inflation, or a massive domestic boom organically sucking in luxury imports.",
              "Pros of CAD: In the short term, consumers are importing heavily, yielding incredible current living standards. Or, the deficit is caused by importing capital machinery, guaranteeing massive future LRAS growth.",
              "Cons of CAD: Represents a huge net leakage from the circular flow (crushing AD). Forces the country into severe international debt, and places downward pressure to collapse the exchange rate."
            ],
            ao3: [
              "Is CAD always a concern?: It entirely depends on the root cause. A Cyclical CAD (boom) or Capital-led CAD are totally harmless. A Structural CAD (uncompetitive, lazy domestic export industries) will irreversibly destroy national wealth.",
              "Pros of CAS: A Current Account Surplus signifies massive export-led growth, huge employment in domestic industries, and a sturdy, rock-solid currency.",
              "Cons of CAS: Causes extreme demand-pull inflation and means the nation is shipping its output abroad rather than consuming it, mathematically lowering domestic living standards."
            ]
          }
        ]
      }
    ]
  }
];
