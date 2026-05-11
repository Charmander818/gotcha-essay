const fs = require('fs');
const parsedAlevel = JSON.parse(fs.readFileSync('parsed_alevel.json', 'utf8'));

const sections = [
  {
    "id": "1",
    "title": "1. Basic economic ideas and resource allocation (AS Level)",
    "subsections": [
      {
        "id": "1.1",
        "title": "1.1 Scarcity, choice and opportunity cost",
        "points": [
          "1.1.1 Fundamental economic problem of scarcity: why resources are scarce in relation to wants",
          "1.1.1 Fundamental economic problem of scarcity: the difference between wants and needs",
          "1.1.1 Fundamental economic problem of scarcity: why decisions have to be made involving choices",
          "1.1.2 Need to make choices: why wants are not essential for survival",
          "1.1.2 Need to make choices: why individual consumers have to make choices",
          "1.1.2 Need to make choices: why firms have to make choices",
          "1.1.2 Need to make choices: why governments have to make choices",
          "1.1.3 Nature and definition of opportunity cost: the concept of opportunity cost",
          "1.1.3 Nature and definition of opportunity cost: opportunity cost and an individual’s budget decisions",
          "1.1.3 Nature and definition of opportunity cost: opportunity cost applied to a firm’s production decisions",
          "1.1.3 Nature and definition of opportunity cost: opportunity cost applied to a government’s spending plans",
          "1.1.4 Basic questions of resource allocation: why all economies are faced with the fundamental economic problem",
          "1.1.4 Basic questions of resource allocation: what to produce",
          "1.1.4 Basic questions of resource allocation: how to produce",
          "1.1.4 Basic questions of resource allocation: for whom to produce",
          "1.1.4 Basic questions of resource allocation: the scope for redistribution of income"
        ]
      },
      {
        "id": "1.2",
        "title": "1.2 Economic methodology",
        "points": [
          "1.2.1 Economics as a social science: the difference in scope between microeconomics and macroeconomics",
          "1.2.1 Economics as a social science: why this distinction is not always clear",
          "1.2.1 Economics as a social science: why economics is a social science",
          "1.2.1 Economics as a social science: why economics makes use of models",
          "1.2.2 Positive and normative statements: the meaning of a positive statement",
          "1.2.2 Positive and normative statements: the meaning of a normative statement",
          "1.2.2 Positive and normative statements: the distinction between facts and value judgements",
          "1.2.3 Meaning of the term ceteris paribus: what the term ceteris paribus means",
          "1.2.3 Meaning of the term ceteris paribus: its relevance in modelling the effects of change over time",
          "1.2.4 Importance of the time period: the use of various time periods to assess how change can influence economic situations",
          "1.2.4 Importance of the time period: the short run period",
          "1.2.4 Importance of the time period: the long run period",
          "1.2.4 Importance of the time period: the very long run period"
        ]
      },
      {
        "id": "1.3",
        "title": "1.3 Factors of production",
        "points": [
          "1.3.1 Nature and definition of factors of production: the factors of production as resources (land, labour, capital and enterprise)",
          "1.3.2 Difference between human capital and physical capital: the meaning of human capital",
          "1.3.2 Difference between human capital and physical capital: the meaning of physical capital",
          "1.3.2 Difference between human capital and physical capital: the difference between human capital and physical capital",
          "1.3.3 Rewards to the factors of production: rent or income as a reward for owning land",
          "1.3.3 Rewards to the factors of production: wages or earnings as a reward for labour’s services",
          "1.3.3 Rewards to the factors of production: income or a return as a reward for using capital",
          "1.3.3 Rewards to the factors of production: profit as a reward for enterprise",
          "1.3.4 Division of labour and specialisation: the nature of the division of labour",
          "1.3.4 Division of labour and specialisation: the benefits of the division of labour",
          "1.3.4 Division of labour and specialisation: the drawbacks of the division of labour",
          "1.3.4 Division of labour and specialisation: the nature of specialisation",
          "1.3.4 Division of labour and specialisation: the benefits of specialisation",
          "1.3.4 Division of labour and specialisation: the drawbacks of specialisation",
          "1.3.5 Role of the entrepreneur: the entrepreneur as an organiser",
          "1.3.5 Role of the entrepreneur: the entrepreneur as a risk-taker",
          "1.3.5 Role of the entrepreneur: the skills and qualities for entrepreneurial success"
        ]
      },
      {
        "id": "1.4",
        "title": "1.4 Resource allocation in different economic systems",
        "points": [
          "1.4.1 Decision-making in market, planned and mixed economies: the role of the price mechanism in market, planned and mixed economies",
          "1.4.1 Decision-making in market, planned and mixed economies: the role of government in market, planned and mixed economies",
          "1.4.2 Resource allocation in these economic systems: the advantages and disadvantages of resource allocation in market, planned and mixed economic systems",
          "AO3: Evaluate the effectiveness of the market mechanism vs government intervention in allocating resources",
          "AO3: Assess whether a mixed economy is always the most efficient system"
        ]
      },
      {
        "id": "1.5",
        "title": "1.5 Production possibility curves",
        "points": [
          "1.5.1 Nature and meaning of a PPC: the concept of a PPC",
          "1.5.1 Nature and meaning of a PPC: straight line and curved PPCs",
          "1.5.1 Nature and meaning of a PPC: the significance of a point on the PPC in terms of resource allocation",
          "1.5.1 Nature and meaning of a PPC: the use of a PPC when economies are faced with having to make choices",
          "1.5.2 Shape of the PPC: the trade-off of products on the PPC (constant and increasing opportunity costs)",
          "1.5.3 Causes and consequences of shifts in a PPC: why the PPC shifts outwards or inwards",
          "1.5.3 Causes and consequences of shifts in a PPC: the consequences of these shifts",
          "1.5.4 Significance of a position within a PPC: the meaning of a point within a PPC",
          "1.5.4 Significance of a position within a PPC: why such a point is an inefficient use of resources",
          "1.5.4 Significance of a position within a PPC: how to move from a point within a PPC"
        ]
      },
      {
        "id": "1.6",
        "title": "1.6 Classification of goods and services",
        "points": [
           "1.6.1 Nature and definition of free goods and economic goods",
           "1.6.2 Nature and definition of public goods",
           "1.6.3 Nature and definition of merit goods and demerit goods"
        ]
      }
    ]
  },
  {
    "id": "2",
    "title": "2. The price system and the microeconomy (AS Level)",
    "subsections": [
      {
        "id": "2.1",
        "title": "2.1 Demand and supply curves",
        "points": ["Changes in demand and supply and causes of shifts"]
      },
      {
        "id": "2.2",
        "title": "2.2 Price elasticity, income elasticity and cross elasticity of demand",
        "points": ["Calculation, determinants and significance of PED, YED, XED"]
      },
      {
        "id": "2.3",
        "title": "2.3 Price elasticity of supply",
        "points": ["Calculation, determinants and significance of PES"]
      },
      {
        "id": "2.4",
        "title": "2.4 The interaction of demand and supply",
        "points": ["Equilibrium price, disequilibrium and functions of price mechanism"]
      },
      {
        "id": "2.5",
        "title": "2.5 Consumer and producer surplus",
        "points": ["Meaning, calculation and impact of market changes"]
      }
    ]
  },
  {
    "id": "3",
    "title": "3. Government microeconomic intervention (AS Level)",
    "subsections": [
      {
        "id": "3.1",
        "title": "3.1 Reasons for government intervention in markets",
        "points": ["Market failure, public goods, merit/demerit goods"]
      },
      {
        "id": "3.2",
        "title": "3.2 Methods and effects of government intervention in markets",
        "points": ["Taxes, subsidies, maximum/minimum prices, transfer payments, direct provision"]
      },
      {
        "id": "3.3",
        "title": "3.3 Addressing income and wealth inequality",
        "points": ["Causes and policies to alleviate poverty and inequality"]
      }
    ]
  },
  {
    "id": "4",
    "title": "4. The macroeconomy (AS Level)",
    "subsections": [
      {
        "id": "4.1",
        "title": "4.1 National income statistics",
        "points": ["GDP, GNI and real vs nominal statistics"]
      },
      {
        "id": "4.2",
        "title": "4.2 Introduction to the circular flow of income",
        "points": ["Closed and open economies, injections and leakages"]
      },
      {
        "id": "4.3",
        "title": "4.3 Aggregate Demand and Aggregate Supply analysis",
        "points": ["Components of AD, determinants of AS, macroeconomic equilibrium"]
      },
      {
        "id": "4.4",
        "title": "4.4 Economic growth",
        "points": ["Actual vs potential growth, consequences of growth"]
      },
      {
        "id": "4.5",
        "title": "4.5 Unemployment",
        "points": ["Measurement, causes, consequences and policies"]
      },
      {
        "id": "4.6",
        "title": "4.6 Price stability",
        "points": ["Inflation measurement, causes (cost-push, demand-pull), consequences and policies"]
      }
    ]
  },
  {
    "id": "5",
    "title": "5. Government macroeconomic intervention (AS Level)",
    "subsections": [
      {
        "id": "5.1",
        "title": "5.1 Government macroeconomic policy objectives",
        "points": ["Economic growth, low inflation, low unemployment, BOP stability"]
      },
      {
        "id": "5.2",
        "title": "5.2 Fiscal policy",
        "points": ["Government spending, taxation, budget deficit/surplus"]
      },
      {
        "id": "5.3",
        "title": "5.3 Monetary policy",
        "points": ["Interest rates, money supply, exchange rate effects"]
      },
      {
        "id": "5.4",
        "title": "5.4 Supply-side policy",
        "points": ["Market-based and interventionist supply-side policies"]
      }
    ]
  },
  {
    "id": "6",
    "title": "6. International economic issues (AS Level)",
    "subsections": [
      {
        "id": "6.1",
        "title": "6.1 The reasons for international trade",
        "points": [
          "6.1.1 Distinction between absolute and comparative advantage: the principle of absolute advantage",
          "6.1.1 Distinction between absolute and comparative advantage: the principle of comparative advantage",
          "6.1.1 Distinction between absolute and comparative advantage: factor endowment",
          "6.1.1 Distinction between absolute and comparative advantage: the application of opportunity cost",
          "6.1.2 Benefits of specialisation and free trade: the meaning of free trade (trade liberalisation)",
          "6.1.2 Benefits of specialisation and free trade: the benefits of free trade for consumers, producers and the economy",
          "6.1.2 Benefits of specialisation and free trade: the trading possibility curve",
          "6.1.3 Exports, imports and the terms of trade: the measurement of the terms of trade",
          "6.1.3 Exports, imports and the terms of trade: the causes of changes in the terms of trade",
          "6.1.3 Exports, imports and the terms of trade: the impact of changes in the terms of trade",
          "6.1.4 Limitations of the theories: the assumptions underpinning the theories",
          "6.1.4 Limitations of the theories: real world relevance"
        ]
      },
      {
        "id": "6.2",
        "title": "6.2 Protectionism",
        "points": [
          "6.2.1 Meaning of protectionism in the context of international trade: the protection of domestic industries from foreign competition",
          "6.2.2 Different tools of protection: tariffs and their impact",
          "6.2.2 Different tools of protection: import quotas and their impact",
          "6.2.2 Different tools of protection: export subsidies and their impact",
          "6.2.2 Different tools of protection: embargoes and their impact",
          "6.2.2 Different tools of protection: excessive administrative burdens (‘red tape’) and their impact",
          "6.2.3 Arguments for and against protection: the reasons for protection (infant industries, sunset industries, strategic industries, dumping, etc.)",
          "6.2.3 Arguments for and against protection: the reasons against protection (anti-specialisation, increased prices, lower quality, etc.)",
          "AO3: Evaluate the arguments for and against protectionism"
        ]
      },
      {
        "id": "6.3",
        "title": "6.3 Current account of the balance of payments",
        "points": [
          "6.3.1 Components of the current account: the purpose of the balance of payments",
          "6.3.1 Components of the current account: the components of the current account (trade in goods, trade in services, primary income, secondary income)",
          "6.3.2 Calculation: the balance of trade in goods",
          "6.3.2 Calculation: the balance of trade in services",
          "6.3.2 Calculation: the balance of trade in goods and services",
          "6.3.2 Calculation: the current account balance",
          "6.3.3 Causes of imbalances: the causes of a current account deficit",
          "6.3.3 Causes of imbalances: the causes of a current account surplus",
          "6.3.4 Consequences of imbalances: the consequences of a current account deficit",
          "6.3.4 Consequences of imbalances: the consequences of a current account surplus"
        ]
      },
      {
        "id": "6.4",
        "title": "6.4 Exchange rates",
        "points": [
          "6.4.1 Definition of exchange rate: what is meant by a (foreign) exchange rate",
          "6.4.2 Determination of a floating foreign exchange rate: the role of demand and supply in the determination of a foreign exchange rate",
          "6.4.3 Distinction between depreciation and appreciation: the meaning of depreciation of a floating exchange rate",
          "6.4.3 Distinction between depreciation and appreciation: the meaning of appreciation of a floating exchange rate",
          "6.4.4 Causes of changes: changes in the demand for a currency",
          "6.4.4 Causes of changes: changes in the supply of a currency",
          "6.4.4 Causes of changes: ‘hot money’ flows",
          "6.4.5 AD/AS analysis of impact of exchange rate: the impact on equilibrium national income",
          "6.4.5 AD/AS analysis of impact of exchange rate: the impact on level of real output",
          "6.4.5 AD/AS analysis of impact of exchange rate: the impact on the price level",
          "6.4.5 AD/AS analysis of impact of exchange rate: the impact on employment"
        ]
      },
      {
        "id": "6.5",
        "title": "6.5 Policies to correct imbalances in the current account of the balance of payments",
        "points": [
          "6.5.1 Government policy objective: the meaning of stability in the current account of the balance of payments",
          "6.5.2 Effect of policies: the effect of fiscal policies on the current account of the balance of payments",
          "6.5.2 Effect of policies: the effect of monetary policies on the current account of the balance of payments",
          "6.5.2 Effect of policies: the effect of supply-side policies on the current account of the balance of payments",
          "6.5.2 Effect of policies: the effect of protectionist policies on the current account of the balance of payments",
          "AO3: Evaluate the effectiveness of different policies to correct current account imbalances"
        ]
      }
    ]
  }
];

const aLevelSections = [
    {
        id: "7",
        title: "7. The price system and the microeconomy (A Level)",
        subsections: [
            { id: "7.1", title: "7.1 Utility", points: parsedAlevel["7.1"] || [] },
            { id: "7.2", title: "7.2 Indifference curves and budget lines", points: parsedAlevel["7.2"] || [] },
            { id: "7.3", title: "7.3 Efficiency and market failure", points: parsedAlevel["7.3"] || [] },
            { id: "7.4", title: "7.4 Private costs and benefits, externalities and social costs and benefits", points: parsedAlevel["7.4"] || [] },
            { id: "7.5", title: "7.5 Types of cost, revenue and profit, short-run and long-run production", points: parsedAlevel["7.5"] || [] },
            { id: "7.6", title: "7.6 Different market structures", points: parsedAlevel["7.6"] || [] },
            { id: "7.7", title: "7.7 Growth and survival of firms", points: parsedAlevel["7.7"] || [] },
            { id: "7.8", title: "7.8 Differing objectives and policies of firms", points: parsedAlevel["7.8"] || [] }
        ]
    },
    {
        id: "8",
        title: "8. Government microeconomic intervention (A Level)",
        subsections: [
            { id: "8.1", title: "8.1 Government policies to achieve efficient resource allocation to tackle different forms of market failure", points: parsedAlevel["8.1"] || [] },
            { id: "8.2", title: "8.2 Equity and redistribution of income and wealth", points: parsedAlevel["8.2"] || [] },
            { id: "8.3", title: "8.3 Labour market forces and government intervention", points: parsedAlevel["8.3"] || [] }
        ]
    },
    {
        id: "9",
        title: "9. The macroeconomy (A Level)",
        subsections: [
            { id: "9.1", title: "9.1 The circular flow of income", points: parsedAlevel["9.1"] || [] },
            { id: "9.2", title: "9.2 Economic growth and sustainability", points: parsedAlevel["9.2"] || [] },
            { id: "9.3", title: "9.3 Employment/unemployment", points: parsedAlevel["9.3"] || [] },
            { id: "9.4", title: "9.4 Money and banking", points: parsedAlevel["9.4"] || [] }
        ]
    },
    {
        id: "10",
        title: "10. Government macroeconomic intervention (A Level)",
        subsections: [
            { id: "10.1", title: "10.1 Government macroeconomic policy objectives", points: parsedAlevel["10.1"] || [] },
            { id: "10.2", title: "10.2 Links between macroeconomic problems and their interrelatedness", points: parsedAlevel["10.2"] || [] },
            { id: "10.3", title: "10.3 Effectiveness of policy options to meet all macroeconomic objectives", points: parsedAlevel["10.3"] || [] }
        ]
    },
    {
        id: "11",
        title: "11. International economic issues (A Level)",
        subsections: [
            { id: "11.1", title: "11.1 Policies to correct disequilibrium in the balance of payments", points: parsedAlevel["11.1"] || [] },
            { id: "11.2", title: "11.2 Exchange rates", points: parsedAlevel["11.2"] || [] },
            { id: "11.3", title: "11.3 Economic development", points: parsedAlevel["11.3"] || [] },
            { id: "11.4", title: "11.4 Characteristics of countries at different levels of development", points: parsedAlevel["11.4"] || [] },
            { id: "11.5", title: "11.5 Relationship between countries at different levels of development", points: parsedAlevel["11.5"] || [] },
            { id: "11.6", title: "11.6 Globalisation", points: parsedAlevel["11.6"] || [] }
        ]
    }
];

const finalOutput = `import { SyllabusSection } from "./types";

export const SYLLABUS_CHECKLIST: SyllabusSection[] = ${JSON.stringify([...sections, ...aLevelSections], null, 2)};
`;

fs.writeFileSync('syllabusChecklistData.ts', finalOutput);
console.log("Written successfully");
