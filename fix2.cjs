const fs = require('fs');

const file = 'App.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Also update text-purple-400 and border-purple-500
let newContent = content.replace(/bg-blue-600/g, 'bg-primary-600');
newContent = newContent.replace(/bg-purple-600/g, 'bg-primary-600');
newContent = newContent.replace(/hover:bg-purple-700/g, 'hover:bg-primary-700');
newContent = newContent.replace(/text-blue-700/g, 'text-primary-700');
newContent = newContent.replace(/text-purple-400/g, 'text-primary-400');
newContent = newContent.replace(/border-purple-500/g, 'border-primary-500');

fs.writeFileSync(file, newContent, 'utf-8');
console.log('App.tsx updated');
