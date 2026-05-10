const fs = require('fs');
const lines = fs.readFileSync('data.ts', 'utf8').split('\n');
const newLines = lines.slice(0, 5086); // Keep up to line 5086 (0-indexed 5085 is line 5086)
const appendStr = `  },
  {
    id: "custom-1778313737041",
    year: "2023",
    paper: "9708/42",
    variant: "Feb/March",
    questionNumber: "5",
    topic: SyllabusTopic.INTERNATIONAL_AL,
    chapter: "11.1 Economic growth and economic development",
    maxMarks: 20,
    questionText: "Assess the impact of globalisation on the standard of living in low-income countries.",
    markScheme: \`AO1 Knowledge and understanding and AO2 Analysis

• Globalisation would promote free trade, free movement of capital and labour and the transfer of technology. Cultural and political ties would be strengthened.
• Key characteristics of low-income countries would include: low levels of productivity; high dependency ratios; low GDP per capita; significant dependence on producing and exporting primary goods.
• Low living standards are generally associated with: high poverty levels; inequality; poor housing, education and health; and rapid population growth.
• An improvement in living standards is very closely linked with an improvement in economic performance. An improvement in economic performance is measured by increases in GDP per capita and changes in productivity which enable changes in GDP to be achieved.
• Globalization through trade and technology transfer should provide opportunities to create more real wealth.
• Higher levels of tax revenue are likely to be received by a low-income country's government. This will enable more expenditure on health, housing and education as well as increased access to more consumer goods. These improvements are generally associated with a rise in the standard of living.

AO3 Evaluation

• The links between globalisation and GDP and an increase in living standards in low-income countries are not clear. Sometimes, labour is exploited by more advanced, higher income countries.
• Globalisation can lead to economic dependency and significant imbalances of trade which, in the long run, might have a negative effect on living standards in low-income countries.
• Higher skilled work might be provided through the global transfer of labour therefore training of the indigenous population does not take place.
• In some cases, individual firms in low-income countries might be outcompeted and go out of business. Unemployment might then rise and living standards might fall.
• In conclusion, it is clear that there is a potential role for globalisation to improve the standard of living but this will depend on many factors which have been referred to above, some of which might have an overall negative impact. Also, it is very important to ensure that an appropriate measure of the standard of living is used, one which does not rely entirely on the material benefits gained by globalisation.\`
  }
];
`;
fs.writeFileSync('data.ts', newLines.join('\n') + '\n' + appendStr);
console.log('Fixed data.ts');
