const fs = require('fs');

const alQuestions = JSON.parse(fs.readFileSync('al_questions.json', 'utf8'));

// Classification function
function classify(q) {
  const text = q.questionText.toLowerCase();
  const old = q.chapter.toLowerCase();
  const mark = (q.markScheme || '').toLowerCase();
  
  // Try 7
  if (old.includes('consumer behaviour') || old.includes('utility')) {
    if (text.includes('indifference') || text.includes('budget line')) return '7.2 Indifference curves and budget lines';
    return '7.1 Utility';
  }
  if (old.includes('market structures') || old.includes('market structure') || old.includes('perfect competition') || old.includes('monopoly') || old.includes('oligopoly')) {
    if (text.includes('integration') || text.includes('growth of firms') || text.includes('survival')) return '7.7 Growth and survival of firms';
    if (text.includes('objectives') || text.includes('price discrimination') || text.includes('limit pricing') || text.includes('predatory')) return '7.8 Differing objectives and policies of firms';
    if (text.includes('cost') && !text.includes('barrier') && !text.includes('oligopoly') && !text.includes('monopoly') && !text.includes('perfect competition')) {
      if (text.includes('short-run') || text.includes('long-run') || text.includes('scale')) return '7.5 Types of cost, revenue and profit, short-run and long-run production';
    }
    return '7.6 Different market structures';
  }
  if (old.includes('trade unions') || old.includes('labour market')) {
    return '8.3 Labour market forces and government intervention';
  }
  
  if (old.includes('market failure')) {
      if (text.includes('external') || text.includes('social cost') || text.includes('private cost') || text.includes('welfare loss') || text.includes('positive externality') || text.includes('negative externality')) {
          if (text.includes('government') || text.includes('policy') || text.includes('intervene') || text.includes('intervention')) {
             return '8.1 Government policies to achieve efficient resource allocation and correct market failure';
          }
          return '7.4 Private costs and benefits, externalities and social costs and benefits';
      }
      if (text.includes('efficient resource allocation') || text.includes('government intervention') || text.includes('policy')) {
          return '8.1 Government policies to achieve efficient resource allocation and correct market failure';
      }
      return '7.3 Efficiency and market failure';
  }
  
  if (old.includes('government microeconomic intervention') || old.includes('government policies to achieve efficient resource allocation') || old.includes('policies')) {
      if (text.includes('equity') || text.includes('equality') || text.includes('poverty') || text.includes('redistribution')) {
          return '8.2 Equity and redistribution of income and wealth';
      }
      return '8.1 Government policies to achieve efficient resource allocation and correct market failure';
  }
  
  // 9
  if (old.includes('national income statistics') || text.includes('circular flow') || text.includes('multiplier') || text.includes('aggregate demand') || text.includes('components of aggregate demand')) {
     if (text.includes('living standard') || text.includes('development') || text.includes('hdi')) {
         return '11.3 Economic development';
     }
     return '9.1 The circular flow of income';
  }
  if (old.includes('economic growth')) {
      if (text.includes('inclusive') || text.includes('sustainable') || text.includes('potential') || text.includes('actual') || text.includes('output gap') || text.includes('cycle')) {
          return '9.2 Economic growth and sustainability';
      }
      if (text.includes('living standard') || text.includes('development')) {
          return '11.3 Economic development';
      }
      return '9.2 Economic growth and sustainability';
  }
  if (old.includes('unemployment')) {
      return '9.3 Employment/unemployment';
  }
  if (old.includes('money') || old.includes('inflation')) {
      return '9.4 Money and banking';
  }
  
  // 10
  if (old.includes('macroeconomic policies') || old.includes('effectiveness of policy')) {
      if (text.includes('interrelatedness') || text.includes('relationship between') || text.includes('phillips curve') || (text.includes('conflict') && text.includes('objectives'))) {
          return '10.2 Links between macroeconomic problems and their interrelatedness';
      }
      if (text.includes('objective')) {
          return '10.1 Government macroeconomic policy objectives';
      }
      return '10.3 Effectiveness of policy options to meet all macroeconomic objectives';
  }
  
  // 11
  if (old.includes('balance of payments')) {
      return '11.1 Policies to correct disequilibrium in the balance of payments';
  }
  if (old.includes('exchange rates')) {
      return '11.2 Exchange rates';
  }
  if (old.includes('economic development')) {
      if (text.includes('characteristics') || text.includes('population') || text.includes('urbanisation') || text.includes('gini') || text.includes('lorenz')) {
          return '11.4 Characteristics of countries at different levels of development';
      }
      return '11.3 Economic development';
  }
  if (old.includes('multinational') || old.includes('mnc') || text.includes('fdi') || text.includes('aid') || text.includes('world bank') || text.includes('imf') || text.includes('debt')) {
      return '11.5 Relationship between countries at different levels of development';
  }
  if (old.includes('globalisation')) {
      return '11.6 Globalisation';
  }
  
  // Fallbacks based on topic
  const t = q.topic || '';
  if (t === 'PRICE_SYSTEM_AL') return '7.1 Utility';
  if (t === 'GOVT_MICRO_AL') return '8.1 Government policies to achieve efficient resource allocation and correct market failure';
  if (t === 'MACROECONOMY_AL') return '9.1 The circular flow of income';
  if (t === 'GOVT_MACRO_AL') return '10.3 Effectiveness of policy options to meet all macroeconomic objectives';
  if (t === 'INTERNATIONAL_AL') return '11.6 Globalisation';
  
  return old;
}

const classified = alQuestions.map(q => {
  const newQ = { ...q, newChapter: classify(q) };
  return newQ;
});

fs.writeFileSync('al_questions_classified.json', JSON.stringify(classified, null, 2));
console.log("Classified correctly!");
