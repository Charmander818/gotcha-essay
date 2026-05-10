const { v4: uuidv4 } = require('crypto');
const fs = require('fs');

const questions = [
  // May/June 2023 41
  {
    year: "2023", paper: "9708/41", variant: "May/June", questionNumber: "3", topic: "SyllabusTopic.PRICE_SYSTEM_AL", chapter: "7.6 Monopoly", maxMarks: 20,
    questionText: "Some firms frequently use price discrimination.\nAssess the view that when this occurs, price discrimination will always benefit the producer at the expense of the consumer and society.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• The key characteristics for effective price discrimination (PD) to take place. (Ability to set price, separable markets with different price elasticities of demand)
• The use of practical examples to illustrate the meaning of PD.
• An explanation / analysis of at least one model of PD to show the effects on the producer in terms of price, output and profit.
• An explanation / analysis of PD on the consumer in terms of price and quantity demanded.
• The use of relevant labelled diagrams (not mandatory)

AO3 Evaluation

• If firms are rational profit – maximisers, the firms must benefit from their action therefore the initial point that the producer will always benefit is true.
• As total spending on the good / service takes place this represents a transfer of consumer surplus to the producers.
• But it depends on whether the firms gain at the expense of consumer and society.
• If the price discrimination exists between domestic and foreign markets The producer may also be able to drive competition from the foreign market if it charges high domestic prices / recovers overheads domestically. This may improve a country's balance of payments.
• Some consumers gain and some lose. The lower price in the low PED market will benefit those consumers in that market whilst the opposite occurs in the High PED market.
• The increase in profits may allow the producer to increase its research and development leading to innovative production techniques which lower long term costs – dynamic efficiency. The benefits of the dynamic efficiency may be enjoyed by consumers / society as lower prices.
• The assessment of the statement should conclude with the view that it should benefit the producer as a matter of rationality but whether this is always at the expense of consumers / society is debateable.`
  },
  {
    year: "2023", paper: "9708/41", variant: "May/June", questionNumber: "4", topic: "SyllabusTopic.GOVT_MACRO_AL", chapter: "10.2 Macroeconomic policies", maxMarks: 20,
    questionText: "An increase in a government's budget surplus will increase unemployment in the short run but it will make it easier to control a balance of payments deficit in the long run.\nEvaluate this statement.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• Knowledge of what is meant by a budget surplus, in relation to the difference between government expenditure and government income.
• Reference to links between a government surplus, aggregate monetary demand and unemployment.
• Explanation of the specific type of unemployment that might relate to an increase in a governments budget surplus.
• Analysis of the links between changes in interest rates and unemployment in the short run.
• Explanation of some of the key elements of the balance of payments accounts and how they might be influenced by changes in fiscal policy.
• Analysis of the links between a budget surplus and the control of a balance of payments in the long run.

AO3 Evaluation

• The impact of a budget surplus in the short run on the level of unemployment will depend upon the main cause of the existing level of unemployment.
• A budget surplus is more likely to have a negative effect on unemployment when an economy has a lot of existing spare capacity.
• If structural factors are responsible for unemployment, supply side policies might be more effective.
• A budget surplus might lead to lower interest rates and cause problems for specific industries within an economy. For example, low interest rates might cause a boom in the housing market.
• If a budget surplus leads to a subsequent fall in interest rate, this might ultimately make it more difficult to control a balance of payments in the long run.
• A conclusion should make an attempt to make an overall comparison between the use of monetary policy and alternative fiscal or supply side policies. A judgement should be made which directly addresses the statement in question.`
  },
  
  // May/June 2023 42
  {
    year: "2023", paper: "9708/42", variant: "May/June", questionNumber: "2", topic: "SyllabusTopic.GOVT_MICRO_AL", chapter: "8.1 Government policies to achieve efficient resource allocation and correct market failure", maxMarks: 20,
    questionText: "The increased use of electric vehicles (EVs) is encouraged as part of governments' climate change policies because they create fewer negative externalities than diesel and petrol (gas) vehicles.\nEvaluate, with the help of diagrams, two policies that a government may use to encourage the use of EVs.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• Market failure regarding this question would relate to allocative inefficiency. Market failure can be explained by defining allocative efficiency and linking this to the requirement to allocate resources to maximise consumer satisfaction. This can be supported by a diagram illustrating a level of output where AR = MC or MSB = MSC which is consistent with an outcome that achieves allocative efficiency.
• Negative externalities occur when the when the consumption/use of a good produces a cost to society which is greater than that received by an individual producer MPB > MSB or MSC >MPC. This is sometimes described as a negative 'spill-over' effect. The negative externality leads to an over production of the good.
• Government intervention takes place to address the failure of market forces to allocate resources efficiently. In this case positive externalities would lead to under-consumption of a good or service.
• Different types of government intervention can be used to correct the under-production of output to enable consumer satisfaction to be maximised.
• Forms of government intervention might include: the use of subsidies for consumers to increase consumption and also producers to change production methods, use of positive advertising; the direct provision of goods and services such as alternative transport methods. Indirect taxation. Nudge theory effects.
• A clearly labelled, accurate diagram can be used to show the impact of a positive/negative externality on the level of output and the welfare change will be identified.
• The diagram could show the market equilibrium point which does not take into account the existence of a negative consumption externality and may compare this with the allocatively efficient level of output when the negative externality is taken into account. The diagram may be amended or re-drawn to show the impact of a chosen policy(ies) and the impact on consumption or production shown.
• Reference to the diagram and the outcomes it illustrates is made in the text.

AO3 Evaluation

• A government might introduce a subsidy to encourage producers to increase output to enable allocative efficiency, however it is difficult to measure the precise value of the subsidy. Subsidies are costly in that the funds might have been used by governments for other purposes. This means governments will have to make a value judgement when deciding whether to provide a subsidy.
• Also, the impact on price and output in some circumstances takes a long time to become effective.
• Advertising is often costly and it is not always certain that it will have a sufficiently persuasive effect to ensure the correct level of output/ consumption is reached.
• Direct provision is also costly and sometimes less efficient than that provided through market forces.
• It is possible to show that government intervention can reduce the level of inefficiency caused by the existence of positive externalities but it is not clear whether the net effect of government intervention will always be positive. Some types of intervention will be more effective than others depending on the nature of the good/service under consideration.`
  },
  {
    year: "2023", paper: "9708/42", variant: "May/June", questionNumber: "3", topic: "SyllabusTopic.PRICE_SYSTEM_AL", chapter: "7.2 Market structure", maxMarks: 20,
    questionText: "Evaluate, with the help of a diagram(s) how total market demand and minimum efficient scale may determine the form of market structure in an industry.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• The concepts of increasing/constant/decreasing returns to scale and the minimum efficient scale (MES) of production the level of output where LRAC are initially minimized.
• The explanation of a number of examples of economies of scale: division of labour, financial, marketing, managerial technical and their impact on the long run average cost curve (LRAC).
• An analysis of the relationship between total demand for a product and the minimum efficient scale effectively total demand divided by MES to give the maximum number of firms who could operate at the MES.
• A description of different forms of market structure eg perfect competition, monopolistic competition, oligopoly or monopoly.
• An analysis of the relationship between the MES and the market demand determining the number of firms many/a few/one equivalent to perfect competition, monopolistic competition, oligopoly or monopoly.
• Examples MES and market demand. MES = 50% therefore in theory 2 firms – a duopoly MES 2% therefore 50 firms perfect/monopolistic competition.
• Relevant diagram for economies of scale with indication of MES and demand curve.

AO3 Evaluation

• MES is not static and may change over time eg technological change.
• The definition of the market will affect the calculation of the relationship. The village shop which operates at a small scale is appropriate for the village market.
• Markets will still exist where particular firms produce small scale high-cost items e.g. luxury cars or designer clothes to satisfy a niche portion of a bigger market.`
  },
  {
    year: "2023", paper: "9708/42", variant: "May/June", questionNumber: "4", topic: "SyllabusTopic.INTERNATIONAL_AL", chapter: "11.1 Economic growth and economic development", maxMarks: 20,
    questionText: "Consider the extent to which the depreciation of its foreign exchange rate contributes to the economic growth of a low-income country.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• Knowledge and understanding of the effect of depreciation on the external value of a country's currency (exchange rate - ER), economic growth and low-income country
• Analysis of this effect on the price of exports (X) and imports (M) and the effect on their demand and supply, links to aggregate demand (AD) through the balance of payments effect (X-M)
• Candidates may refer to this in terms of injections and leakages and their effect on AD
• AD and AS diagram showing this may be used to show the effect on the level of national income.
• Alternatively, the analysis of the increased injection may be through the multiplier effect and/or the 45° diagram.
• A clear link must be made between the effect of the depreciation and the level of economic growth, the type of economic growth: actual or potential should be made.

AO3 Evaluation

• The ability of supply capacity in the low-income country to react to the effect of the depreciation.
• The nature of many developing countries exports of agricultural commodities being price inelastic in supply compared with oil exports.
• The short run effects on employment (positive) and inflation (negative)
• Beneficial effect on ability to service international debt positive if denominated in domestic currency but negative if borrowings are in a foreign currency.`
  },
  {
    year: "2023", paper: "9708/42", variant: "May/June", questionNumber: "5", topic: "SyllabusTopic.GOVT_MACRO_AL", chapter: "10.2 Macroeconomic policies", maxMarks: 20,
    questionText: "Evaluate the effectiveness of using monetary policy to reduce the rate of inflation and how this policy may affect a government's ability to achieve its other macroeconomic aims.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• A knowledge of monetary policies which might include interest rate, money supply, exchange rates and reserve asset ratio policy.
• A definition of inflation and a statement of a government's macroeconomic aims: eg low unemployment, economic growth and balance of payments equilibrium.
• An explanation of the impact of higher interest rates to reduce inflation either through consumer demand or its impact on investment. This can be shown either through the monetary transmission mechanism analysis or AS/AD analysis.
• Alternative macroeconomic aims of the government are identified for example economic growth, unemployment and balance of payments.
• The model employed to analyse the reduction in inflation is applied to the alternative aims to find the outcomes.
• Phillips curve analysis may be used to demonstrate the relationship between inflation and employment to illustrate the unlikelihood of both low inflation and low unemployment being achieved together.

AO3 Evaluation

• Evaluation may be concerned with either the analysis used to reduce inflation or the ability to meet all the macroeconomic aims.
• An initial analysis of the monetary policy to reducing the level of inflation which may be in terms of how accurate the central bank is in determining the increase in the rate of interest/reserve asset ratio required or reduction in the money supply.
• The time lags between policy implementation and outcome may also be discussed.
• Expectations and the role they play in determining policy outcomes.
• The model(s) employed will show either the effect of the policy on the alternative aims and requires an explicit comment on whether this enables the alternative to be achieved or not.
• Two examples of a contradiction in the simultaneous achievement of the aims need to be shown and commented upon.
• The short and long run implications of inflation reduction on achieving the alternative aims might be evaluated.
• The Phillips curve relationship may be criticised from the "rational expectations" viewpoint.
• The short run and long run effects of the chosen inflation policy can be compared in terms of actual and potential reduction/increase in economic growth.
• The relationship between the rate of inflation, the exchange rate and the balance of payments including the Marshall-Lerner effect.`
  }
];

let text = fs.readFileSync('data.ts', 'utf8');
const generated = questions.map(q => {
  return \`  {
    id: "custom-\${Date.now()}" /* temp */,
    year: "\${q.year}",
    paper: "\${q.paper}",
    variant: "\${q.variant}",
    questionNumber: "\${q.questionNumber}",
    topic: \${q.topic},
    chapter: "\${q.chapter}",
    maxMarks: \${q.maxMarks},
    questionText: \` + JSON.stringify(q.questionText) + \`,
    markScheme: \` + "\`" + q.markScheme + "\`" + \`
  }\`;
});
// Need to replace temp ids
let idCounter = 1778313737100;
let generatedStr = generated.join(',\n');
generatedStr = generatedStr.replace(/custom-\d+/g, () => 'custom-' + (idCounter++));

text = text.replace(/\];$/, ',\n' + generatedStr + '\n];');
fs.writeFileSync('data.ts', text);
console.log('Appended set 1');
