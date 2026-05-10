const { v4: uuidv4 } = require('crypto');
const fs = require('fs');

const questions = [
  // May/June 2023 43
  {
    year: "2023", paper: "9708/43", variant: "May/June", questionNumber: "2", topic: "SyllabusTopic.GOVT_MICRO_AL", chapter: "8.1 Government policies to achieve efficient resource allocation and correct market failure", maxMarks: 20,
    questionText: "To improve allocative efficiency economists frequently advise governments to remove existing subsidies to the private sector providers of education.\nWith the help of a diagram, evaluate this advice.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• The distinction between public and private ownership should be clearly explained
• Education should be identified as a merit good and the significance of merit goods explained.
• The links between a merit good, positive externalities and allocative efficiency should be analysed.
• Analysis of the relationship between the private provision of education, the use of subsidies and potential efficient outcomes should be provided.
• A diagram should be provided to illustrate the impact of a subsidy on the provision of education by the private sector

AO3 Evaluation

• The use of subsidies to encourage the provision of education in the private sector might not be entirely successful because of the difficulties involved when attempting to assess the precise level of subsidy required to achieve an allocatively efficient outcome.
• Subsidies provided by the public sector are often expensive and their use will automatically create opportunity costs. For example, money spent on state subsidies to health care
• Subsidies in the private sector will mean that access to education is still based on an ability to pay, this might create inequitable outcomes in society.
• The pursuit of profit supported by subsidies might enable private firms to cut costs and reduce any unnecessary bureaucracy thus leading to a more efficient use of scarce resources.
• Direct state provision of education might lead to less efficient outcomes and reduce the time taken to ensure a high standard of education is available on an equal basis throughout the population.
• A conclusion should be attempted which examines the net benefits of each alternative i.e. private or public sector provision of education.
• Also, the impact on price and output in some circumstances takes a long time to become effective.
• Advertising is often costly and it is not always certain that it will have a sufficiently persuasive effect to ensure the correct level of output / consumption is reached
• It is possible to show that government intervention can reduce the level of inefficiency caused by the existence of negative externalities, but it is not clear whether the net effect of government intervention will always be positive. Some types of intervention will be more effective than others depending on the nature of the good / service under consideration.`
  },
  {
    year: "2023", paper: "9708/43", variant: "May/June", questionNumber: "3", topic: "SyllabusTopic.PRICE_SYSTEM_AL", chapter: "7.6 Monopoly", maxMarks: 20,
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
    year: "2023", paper: "9708/43", variant: "May/June", questionNumber: "4", topic: "SyllabusTopic.GOVT_MACRO_AL", chapter: "10.2 Macroeconomic policies", maxMarks: 20,
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
  {
    year: "2023", paper: "9708/43", variant: "May/June", questionNumber: "5", topic: "SyllabusTopic.INTERNATIONAL_AL", chapter: "11.1 Economic growth and economic development", maxMarks: 20,
    questionText: "To what extent do you agree that an increase in productivity will lead to a higher standard of living in low-income countries.",
    markScheme: `AO1 Knowledge and understanding and AO2 Analysis

• An increase in productivity will occur when there is an increase in output per unit of input in a given time period.
• Key characteristics of low-income countries would include: low levels of productivity, relatively low levels of GDP per capita and a significant proportion of the labour force working in the primary sector
• Low-income countries often fail to generate a sufficient level of savings to generate sufficient investment to promote an increase in productivity
• Access to material goods and essential services such as health and education is frequently used as a measure of living standards in low-income economies.
• Globalisation can lead to economic dependency and significant imbalances of trade which, in the long run, might have a negative effect on living standards in low-income countries.

AO3 Evaluation

• Low-income countries might increase productivity due the transfer of new technology from high income countries, however this might lead to a substitution of capital for labour thus increasing the level of unemployment.
• An increase in Foreign Direct Investment (FDI) might lead to the exploitation of the indigenous raw materials, thus leading to a long run decline in economic growth.
• Increases in productivity might provide opportunities to create more real wealth but it will still depend upon a government in a low – income country to ensure that any increases in wealth lead to equitable outcomes.
• It is relatively easy to link an increase in productivity to the availability of more goods, however living standards are also influenced by an increase in the provision of services such as health and education. It is not easy to measure change
• In conclusion, it is clear that there is a potential role for an increase in productivity to influence living standards in low re – income countries but this will depend on many factors which have been referred to above, some of which might have a less direct positive impact.`
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
let idCounter = 1778313737200;
let generatedStr = generated.join(',\n');
generatedStr = generatedStr.replace(/custom-\d+/g, () => 'custom-' + (idCounter++));

text = text.replace(/\];$/, ',\n' + generatedStr + '\n];');
fs.writeFileSync('data.ts', text);
console.log('Appended set 2');
