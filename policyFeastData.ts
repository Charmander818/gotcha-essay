export interface FeastAnalysis {
  feasibility: string;
  effectiveness: string;
  appropriateness: string;
  sideEffects: string;
  timeLag: string;
}

export interface Policy {
  name: string;
  feast: FeastAnalysis;
  evaluation: string;
}

export interface EconomicProblem {
  id: string;
  problem: string;
  description: string;
  policies: Policy[];
}

export interface PolicyCategory {
  category: "Microeconomics" | "Macroeconomics";
  problems: EconomicProblem[];
}

export const policyFeastData: PolicyCategory[] = [
  {
    category: "Macroeconomics",
    problems: [
      {
        id: "macro-inflation",
        problem: "Inflation (High General Price Level)",
        description: "Addressing demand-pull and cost-push inflation to achieve price stability.",
        policies: [
          {
            name: "Contractionary Monetary Policy (Raising Interest Rates)",
            feast: {
              feasibility: "High feasibility. Central banks can change base rates quickly and independently without political approval.",
              effectiveness: "Highly effective for Demand-Pull inflation. Higher rates increase the cost of borrowing and reward saving, reducing Consumption (C) and Investment (I). Effectiveness depends on consumer/business confidence (if confidence is very high, they may still borrow).",
              appropriateness: "Very appropriate for Demand-Pull inflation. INAPPROPRIATE for Cost-Push inflation, as higher interest rates increase costs for firms (borrowing costs), potentially worsening cost-push pressures and causing a severe recession (stagflation).",
              sideEffects: "Conflicts with economic growth and employment. Reduces AD, leading to lower GDP and cyclical unemployment. Also causes exchange rate appreciation (hot money inflows), which worsens the current account.",
              timeLag: "Short implementation lag (central bank meets monthly), but LONG transmission lag (takes 12-18 months for interest rate changes to fully affect consumer mortgages and business investment plans)."
            },
            evaluation: "Evaluate the conflict of macroeconomic objectives (higher interest rates may cause unemployment and lower growth), the dependency on consumer/firm confidence (if confidence is high, raising rates might not deter spending), and the long transmission time lag."
          },
          {
            name: "Contractionary Fiscal Policy (Raising Taxes, Cutting Gov Spending)",
            feast: {
              feasibility: "Low feasibility. Highly political. Raising taxes or cutting public services is unpopular and faces strong political opposition and debate.",
              effectiveness: "Directly reduces AD. Cutting G has a direct impact. Raising Income Tax reduces disposable income. Effectiveness depends on the size of the multiplier and consumer marginal propensity to consume.",
              appropriateness: "Appropriate for Demand-Pull inflation, especially if caused by excessive government borrowing. Inappropriate for Cost-Push inflation.",
              sideEffects: "Cutting government spending may harm public services (healthcare, education), negatively impacting long-term LRAS and living standards. Raising taxes may disincentivize work (Laffer curve effect).",
              timeLag: "LONG implementation lag (requires annual budget approval by parliament), but relatively short effectiveness lag once implemented."
            },
            evaluation: "Evaluate the political feasibility (raising taxes is unpopular), the risk of causing a recession, and the crowding-in effect (lower government spending might leave more room for the private sector)."
          },
          {
            name: "Supply-Side Policies (e.g., Subsidies, Deregulation, Education)",
            feast: {
              feasibility: "Moderate to Low. Requires significant government funding (opportunity cost) and complex planning.",
              effectiveness: "Shifts LRAS to the right, reducing the price level while increasing GDP. Effectiveness depends on the specific policy (e.g., education quality vs. just spending money).",
              appropriateness: "The ONLY truly appropriate long-term solution for Cost-Push inflation, as it tackles the root cause by lowering costs of production and increasing productivity.",
              sideEffects: "Very few negative macroeconomic side effects (achieves growth, low inflation, and employment simultaneously). However, deregulation might harm worker rights or the environment.",
              timeLag: "VERY LONG time lag. Education, infrastructure, and R&D take years or decades to impact productivity and inflation."
            },
            evaluation: "Evaluate the significant time lag (takes years to improve education/infrastructure) and the high opportunity cost of government spending, but highlight that it's the only policy that solves inflation without conflicting with economic growth."
          }
        ]
      },
      {
        id: "macro-unemployment",
        problem: "Unemployment (Cyclical & Structural)",
        description: "Reducing unemployment to achieve full employment and economic growth.",
        policies: [
          {
            name: "Expansionary Monetary Policy (Lowering Interest Rates)",
            feast: {
              feasibility: "High. Easy for central banks to implement quickly.",
              effectiveness: "Lowers borrowing costs, stimulating C and I, shifting AD right. However, if consumer/business confidence is very low (e.g., during a severe recession), cutting rates may not work (Keynesian Liquidity Trap).",
              appropriateness: "Appropriate for Cyclical (demand-deficient) unemployment. COMPLETELY INAPPROPRIATE for Structural unemployment (doesn't give coal miners IT skills).",
              sideEffects: "Demand-pull inflation if AD shifts too close to full capacity. May cause exchange rate depreciation (capital outflows), increasing imported inflation.",
              timeLag: "Short implementation lag, long transmission lag (12-18 months)."
            },
            evaluation: "Evaluate the 'liquidity trap' (if rates are already low, cutting them further won't help), low business confidence during a recession, and the risk of demand-pull inflation."
          },
          {
            name: "Expansionary Fiscal Policy (Cutting Taxes, Increasing Gov Spending)",
            feast: {
              feasibility: "Politically popular, but limited by the government's budget deficit and national debt levels.",
              effectiveness: "Directly creates jobs (e.g., infrastructure projects). Multiplier effect can create further jobs. Depends on consumer confidence (tax cuts might be saved rather than spent).",
              appropriateness: "Highly appropriate for deep recessions and Cyclical unemployment.",
              sideEffects: "Worsens the budget deficit. May cause 'Crowding Out' (government borrowing drives up interest rates, reducing private sector investment). Demand-pull inflation.",
              timeLag: "Long implementation lag (budget approval), but fast impact once spending begins."
            },
            evaluation: "Evaluate the budget deficit implications, the crowding-out effect (government borrowing increases interest rates, reducing private investment), and the risk of demand-pull inflation."
          },
          {
            name: "Supply-Side Policies (Education, Training, Reducing Trade Union Power)",
            feast: {
              feasibility: "Costly to fund training programs. Reducing union power faces massive political and social resistance (strikes).",
              effectiveness: "Improves occupational mobility. Effectiveness depends on the relevance of the training to future industries.",
              appropriateness: "The ONLY appropriate solution for Structural and Frictional unemployment. Tackles the root cause (skills mismatch).",
              sideEffects: "Opportunity cost of government spending. Reducing union power or cutting unemployment benefits may increase income inequality and poverty.",
              timeLag: "Very long time lag for education/training to take effect."
            },
            evaluation: "Evaluate the cost and time lag. Note that it's highly effective for structural unemployment but less effective for cyclical unemployment compared to demand-side policies."
          }
        ]
      },
      {
        id: "macro-growth",
        problem: "Low Economic Growth / Recession",
        description: "Stimulating aggregate demand and aggregate supply to increase real GDP and living standards.",
        policies: [
          {
            name: "Expansionary Monetary Policy (Lowering Interest Rates)",
            feast: {
              feasibility: "High. Central banks can act quickly and independently.",
              effectiveness: "Lowers borrowing costs, stimulating Consumption (C) and Investment (I). However, effectiveness is limited if consumer/business confidence is very low (Keynesian Liquidity Trap).",
              appropriateness: "Appropriate for short-term, demand-deficient recessions.",
              sideEffects: "May cause demand-pull inflation if the economy approaches full capacity. Higher incomes may increase imports, worsening the current account deficit.",
              timeLag: "Short implementation lag, but long transmission lag (12-18 months to fully affect the economy)."
            },
            evaluation: "Evaluate the risk of demand-pull inflation, dependency on consumer confidence, and potential depreciation of the exchange rate."
          },
          {
            name: "Expansionary Fiscal Policy (Cutting Taxes, Increasing Gov Spending)",
            feast: {
              feasibility: "Politically popular, but constrained by existing budget deficits and national debt levels.",
              effectiveness: "Direct injection into the circular flow (via G). Multiplier effect amplifies the initial spending. Effectiveness depends on the marginal propensity to consume (tax cuts might be saved instead of spent).",
              appropriateness: "Highly appropriate for deep recessions where monetary policy has failed.",
              sideEffects: "Worsens the budget deficit and national debt. May cause 'Crowding Out' (government borrowing drives up interest rates, reducing private investment). Demand-pull inflation.",
              timeLag: "Long implementation lag (requires budget approval), but fast impact once spending begins."
            },
            evaluation: "Evaluate the crowding-out effect, worsening of the national debt, and risk of inflation."
          },
          {
            name: "Supply-Side Policies (Infrastructure, Education, Deregulation)",
            feast: {
              feasibility: "Moderate to Low. Expensive and requires long-term government commitment.",
              effectiveness: "Increases productive capacity (shifting LRAS right), leading to sustainable, non-inflationary economic growth.",
              appropriateness: "The most appropriate solution for long-term trend growth and improving international competitiveness.",
              sideEffects: "Opportunity cost of government spending. Deregulation may harm the environment or worker rights. Income inequality may worsen if welfare is cut to incentivize work.",
              timeLag: "Very long time lag (takes years for education or infrastructure to impact GDP)."
            },
            evaluation: "Evaluate the high opportunity cost, long time lag, and potential lack of guarantee of success (e.g., training programs might not match future job needs)."
          }
        ]
      },
      {
        id: "macro-bop",
        problem: "Current Account Deficit",
        description: "Correcting a persistent deficit in the balance of trade.",
        policies: [
          {
            name: "Expenditure-Reducing Policies (Contractionary Fiscal/Monetary)",
            feast: {
              feasibility: "Monetary is easy; Fiscal is politically difficult.",
              effectiveness: "Reduces AD, which lowers national income. As people are poorer, their Marginal Propensity to Import (MPM) means they buy fewer imports, improving the deficit.",
              appropriateness: "Appropriate if the deficit is caused by excessive domestic demand and high inflation. Inappropriate if the deficit is structural (poor quality exports).",
              sideEffects: "Deliberately causes a recession! Reduces economic growth and increases cyclical unemployment. A very harsh cure.",
              timeLag: "Monetary has long transmission lags; Fiscal has long implementation lags."
            },
            evaluation: "Evaluate the conflict with economic growth and employment (can cause a recession). It's a short-term fix that harms the domestic economy."
          },
          {
            name: "Expenditure-Switching: Protectionism (Tariffs / Quotas)",
            feast: {
              feasibility: "Easy to implement, but often violates WTO rules and international trade agreements.",
              effectiveness: "Tariffs increase the price of imports, switching domestic consumption to domestic goods. Effectiveness depends on the PED for imports. If imports are inelastic (necessities), tariffs just cause inflation without reducing import volumes.",
              appropriateness: "Appropriate as a short-term fix, but doesn't solve the root cause of uncompetitive domestic industries.",
              sideEffects: "RETALIATION. Trading partners will put tariffs on your exports, worsening the deficit. Causes imported cost-push inflation. Reduces global efficiency.",
              timeLag: "Short implementation and effectiveness lag."
            },
            evaluation: "Evaluate the risk of retaliation (trade wars), the loss of comparative advantage, and the fact that it doesn't solve the underlying lack of competitiveness."
          },
          {
            name: "Expenditure-Switching: Devaluation / Depreciation",
            feast: {
              feasibility: "Central bank can lower interest rates or sell domestic currency to depreciate it.",
              effectiveness: "Makes exports cheaper and imports dearer. Effectiveness strictly depends on the Marshall-Lerner Condition (PEDx + PEDm > 1). If inelastic, the deficit worsens.",
              appropriateness: "Appropriate if the currency is overvalued. Inappropriate if exports are fundamentally poor quality.",
              sideEffects: "J-Curve effect (worsens in the short run). Causes imported cost-push inflation (raw materials cost more).",
              timeLag: "Short run: Deficit worsens (J-Curve). Long run: Deficit improves as consumers/firms adjust behavior."
            },
            evaluation: "Evaluate the Marshall-Lerner condition (devaluation only works if PEDx + PEDm > 1), the J-Curve effect, and the risk of imported inflation."
          },
          {
            name: "Supply-Side Policies (R&D, Infrastructure)",
            feast: {
              feasibility: "Expensive and requires long-term government commitment.",
              effectiveness: "Increases productivity, lowers relative unit labor costs, and improves the quality/innovation of exports.",
              appropriateness: "The most appropriate long-term solution. Tackles the root cause of a structural deficit (lack of international competitiveness).",
              sideEffects: "Opportunity cost of government spending. Few macroeconomic conflicts.",
              timeLag: "Extremely long time lag. Cannot solve a short-term balance of payments crisis."
            },
            evaluation: "Evaluate as the best long-term solution to improve international competitiveness, but note the high cost and long time lag."
          }
        ]
      }
    ]
  },
  {
    category: "Microeconomics",
    problems: [
      {
        id: "micro-negative-ext",
        problem: "Negative Externalities (e.g., Pollution, Demerit Goods)",
        description: "Correcting over-production or over-consumption where MSC > MPC.",
        policies: [
          {
            name: "Indirect Taxation (e.g., Carbon Tax, Sugar Tax)",
            feast: {
              feasibility: "High. Governments like taxes because they generate revenue.",
              effectiveness: "Internalizes the externality (shifts MPC up to MSC). Effectiveness depends on PED. If demand is inelastic (e.g., cigarettes, petrol), a tax will not significantly reduce quantity, though it raises massive revenue.",
              appropriateness: "Appropriate for market-based solutions. Allows the market to still function but at a socially optimum level.",
              sideEffects: "Indirect taxes are regressive (take a larger % of income from the poor), worsening income inequality. May cause cost-push inflation or make domestic firms internationally uncompetitive.",
              timeLag: "Short time lag to implement and take effect."
            },
            evaluation: "Evaluate the difficulty of measuring the exact external cost to set the right tax level, the inelastic demand of demerit goods (tax might not reduce quantity much), and the regressive nature of the tax."
          },
          {
            name: "Regulation / Legislation (e.g., Bans, Quotas, Age limits)",
            feast: {
              feasibility: "Requires strong enforcement agencies and monitoring, which incurs high administrative costs.",
              effectiveness: "Very effective if strictly enforced. A ban guarantees quantity falls to zero. Does not depend on PED.",
              appropriateness: "Appropriate for extremely harmful goods where any level of consumption is dangerous (e.g., hard drugs, toxic waste).",
              sideEffects: "Creates black markets (shadow economy). Loss of jobs in the regulated industry. No tax revenue generated for the government.",
              timeLag: "Short time lag once passed into law."
            },
            evaluation: "Evaluate the high cost of enforcement and monitoring, the risk of regulatory capture, and the creation of black markets."
          }
        ]
      },
      {
        id: "micro-positive-ext",
        problem: "Positive Externalities / Merit Goods",
        description: "Correcting under-consumption where MSB > MPB (e.g., Education, Healthcare).",
        policies: [
          {
            name: "Subsidies",
            feast: {
              feasibility: "Low to Moderate. Requires significant government tax revenue (opportunity cost).",
              effectiveness: "Lowers costs of production, shifting MPC down, lowering price and increasing quantity. Effectiveness depends on PED; if inelastic, price falls but quantity doesn't increase much.",
              appropriateness: "Appropriate for encouraging consumption of merit goods without removing the free market entirely.",
              sideEffects: "Opportunity cost (money could be spent elsewhere). May make firms inefficient and reliant on government handouts. Difficult to calculate the exact size of the subsidy needed.",
              timeLag: "Short time lag once implemented."
            },
            evaluation: "Evaluate the opportunity cost of government spending, the difficulty in measuring the external benefit, and the risk that firms become reliant on subsidies and inefficient."
          },
          {
            name: "Direct State Provision (e.g., Public Schools, NHS)",
            feast: {
              feasibility: "Extremely expensive. Requires massive tax revenue and bureaucracy.",
              effectiveness: "Guarantees provision and consumption. Ensures equity (everyone gets it regardless of income).",
              appropriateness: "Highly appropriate for Public Goods (non-rival, non-excludable) due to the free-rider problem, and essential Merit goods.",
              sideEffects: "State monopolies lack the profit motive, often leading to productive inefficiency (x-inefficiency) and poor quality. Opportunity cost.",
              timeLag: "Long time lag to build infrastructure (hospitals, schools)."
            },
            evaluation: "Evaluate the high cost to taxpayers, potential inefficiency of state-run organizations (lack of profit motive), and the risk of excess demand (waiting lists)."
          }
        ]
      },
      {
        id: "micro-public-goods",
        problem: "Public Goods (Missing Markets)",
        description: "The free market fails to provide public goods (non-rival, non-excludable) due to the free-rider problem.",
        policies: [
          {
            name: "Direct State Provision (e.g., National Defense, Street Lighting)",
            feast: {
              feasibility: "Requires sufficient tax revenue to fund the provision.",
              effectiveness: "Solves the missing market problem completely by ensuring the good is provided to society.",
              appropriateness: "The ONLY appropriate solution for pure public goods, as private firms cannot charge a price and make a profit.",
              sideEffects: "Opportunity cost of government funds. Potential government failure (productive inefficiency and lack of innovation due to the absence of a profit motive).",
              timeLag: "Varies depending on the good (e.g., building new infrastructure takes significant time)."
            },
            evaluation: "Evaluate the opportunity cost, the difficulty in deciding the optimal quantity to provide (missing price mechanism), and potential government failure."
          }
        ]
      },
      {
        id: "micro-info-failure",
        problem: "Information Failure (Asymmetric / Imperfect Information)",
        description: "Consumers or producers lack accurate information, leading to irrational choices (e.g., underestimating the harm of demerit goods).",
        policies: [
          {
            name: "Provision of Information / Education Campaigns",
            feast: {
              feasibility: "Relatively cheap and easy to implement compared to direct provision or subsidies.",
              effectiveness: "Helps consumers make rational choices, shifting demand closer to the socially optimum level. However, effectiveness is limited by habitual behavior, addiction, or peer pressure.",
              appropriateness: "Highly appropriate for addressing the root cause of information failure without distorting the free market mechanism.",
              sideEffects: "Opportunity cost of funding the campaigns. Campaigns may be ignored by the target audience.",
              timeLag: "Long time lag to change cultural habits and consumer attitudes."
            },
            evaluation: "Evaluate the cost of campaigns, the risk of consumers ignoring the message, and the time it takes to change habits."
          },
          {
            name: "Regulation (e.g., Mandatory Labeling, Advertising Bans)",
            feast: {
              feasibility: "Requires enforcement agencies and monitoring, which incurs administrative costs.",
              effectiveness: "Forces firms to disclose information (e.g., nutritional labels) or restricts misleading information (e.g., banning tobacco ads). Very effective if strictly enforced.",
              appropriateness: "Appropriate for harmful goods or complex products where consumers cannot easily verify quality.",
              sideEffects: "Compliance costs for firms, which may be passed on to consumers as higher prices.",
              timeLag: "Short time lag once laws are passed."
            },
            evaluation: "Evaluate the cost of enforcement, the risk of regulatory capture, and the potential for black markets."
          }
        ]
      },
      {
        id: "micro-price-instability",
        problem: "Price Instability (Agricultural / Commodity Markets)",
        description: "Solving wild price swings caused by inelastic demand and supply shocks.",
        policies: [
          {
            name: "Buffer Stock Schemes",
            feast: {
              feasibility: "Low. High administrative and storage costs. Goods must be non-perishable.",
              effectiveness: "Government buys surplus during good harvests (shifting demand right) and sells stock during bad harvests (shifting supply right), keeping prices within a target band.",
              appropriateness: "Appropriate for storable commodities (wheat, copper). Inappropriate for perishable goods (fresh fruit).",
              sideEffects: "If the target price is set too high, the government will constantly buy surplus, running out of money. If set too low, they run out of stock. Opportunity cost of storage.",
              timeLag: "Immediate effect on prices once the agency buys/sells."
            },
            evaluation: "Evaluate the high storage and security costs, the risk of perishable goods spoiling, and the difficulty of setting the correct target price."
          },
          {
            name: "Minimum Price (Price Floor)",
            feast: {
              feasibility: "Easy to legislate but requires monitoring to prevent illegal sales below the minimum price.",
              effectiveness: "Guarantees a minimum income for farmers, protecting them from price crashes during bumper harvests.",
              appropriateness: "Appropriate for protecting vulnerable producers in volatile markets.",
              sideEffects: "Creates a surplus (excess supply). The government often has to buy this surplus, incurring massive opportunity costs. Can lead to inefficiency as uncompetitive farmers are kept in business.",
              timeLag: "Immediate impact on legal prices."
            },
            evaluation: "Evaluate the creation of surpluses, the massive cost to the government if they have to buy the surplus, and the inefficiency of keeping uncompetitive farmers in business."
          },
          {
            name: "Maximum Price (Price Ceiling)",
            feast: {
              feasibility: "Easy to pass into law, but extremely difficult to enforce.",
              effectiveness: "Prevents prices from spiking too high during bad harvests, protecting consumers (especially low-income households) from unaffordable food prices.",
              appropriateness: "Appropriate as a short-term emergency measure to ensure food security.",
              sideEffects: "Creates a shortage (excess demand). Leads to black markets where goods are sold at illegally high prices. Reduces the incentive for farmers to produce.",
              timeLag: "Immediate impact on legal prices."
            },
            evaluation: "Evaluate the creation of shortages, the emergence of black markets, and the reduced incentive for farmers to produce in the long run."
          },
          {
            name: "Subsidies",
            feast: {
              feasibility: "Requires significant government tax revenue.",
              effectiveness: "Lowers the cost of production for farmers, shifting supply right and stabilizing their income while keeping prices low for consumers.",
              appropriateness: "Appropriate for supporting domestic agriculture and ensuring food security.",
              sideEffects: "High opportunity cost. May lead to overproduction. Can cause international trade disputes if subsidized goods are 'dumped' on foreign markets.",
              timeLag: "Short time lag once implemented."
            },
            evaluation: "Evaluate the opportunity cost to the government, the risk of overproduction, and potential retaliation from foreign countries (dumping)."
          }
        ]
      },
      {
        id: "micro-inequality",
        problem: "Income Inequality & Unfair Prices",
        description: "Protecting vulnerable consumers from high prices or workers from low wages.",
        policies: [
          {
            name: "Maximum Price (Price Ceiling) - e.g., Rent Control, Food Caps",
            feast: {
              feasibility: "Easy to pass a law, but hard to police the resulting black markets.",
              effectiveness: "Lowers the price for consumers who can get the good. However, it causes a massive shortage (Demand > Supply).",
              appropriateness: "Appropriate only as a short-term emergency measure (e.g., during war or natural disaster).",
              sideEffects: "Creates shortages. Leads to black markets where goods are sold illegally at higher prices. Reduces producer incentive to supply or maintain quality (e.g., landlords stop fixing apartments).",
              timeLag: "Immediate impact on legal prices."
            },
            evaluation: "Evaluate the resulting shortages and black markets, meaning some poor people still can't access the good despite the lower price."
          },
          {
            name: "Minimum Price (Price Floor) - e.g., Minimum Wage, Alcohol Pricing",
            feast: {
              feasibility: "Easy to legislate. Requires monitoring of employers.",
              effectiveness: "Increases income for workers who keep their jobs. For demerit goods (alcohol), it raises the price to discourage consumption.",
              appropriateness: "Appropriate for reducing poverty among low-skilled workers or preventing exploitation by monopsony employers.",
              sideEffects: "Causes a surplus. In labor markets, this means real-wage unemployment (Supply of labor > Demand for labor). Increases costs for firms, which may be passed on as cost-push inflation.",
              timeLag: "Immediate impact."
            },
            evaluation: "Evaluate the risk of real-wage unemployment (firms hiring fewer workers) and the increase in costs for firms leading to cost-push inflation."
          },
          {
            name: "Transfer Payments (e.g., Welfare Benefits, Food Vouchers)",
            feast: {
              feasibility: "Requires a strong tax collection system to fund and an administrative system to distribute.",
              effectiveness: "Directly increases the disposable income of the poorest households, reducing absolute poverty and inequality.",
              appropriateness: "Highly appropriate for addressing income inequality without distorting market prices (unlike price controls).",
              sideEffects: "Opportunity cost of government spending. May create a disincentive to work (welfare trap) if benefits are too generous.",
              timeLag: "Short time lag once the welfare system is established."
            },
            evaluation: "Evaluate the 'welfare trap' (disincentive to work), the high tax burden required to fund it (which might cause brain drain or capital flight), and the opportunity cost."
          }
        ]
      }
    ]
  }
];
