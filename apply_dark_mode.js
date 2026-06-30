const fs = require('fs');
const path = require('path');

const files = [
  'components/VendorNavbar.tsx',
  'components/VendorSidebar.tsx',
  'app/vendor/dashboard/page.tsx',
  'app/vendor/active/page.tsx',
  'app/vendor/earnings/page.tsx',
  'app/vendor/schedule/page.tsx',
  'app/vendor/ratings/page.tsx',
  'app/vendor/requests/page.tsx'
];

const replacements = [
  { regex: /bg-slate-50\/50(?! dark:)/g, replacement: 'bg-slate-50/50 dark:bg-[#0B1120]' },
  { regex: /bg-white(?!(\/|\w| dark:))/g, replacement: 'bg-white dark:bg-[#111827]' },
  { regex: /text-gray-900(?! dark:)/g, replacement: 'text-gray-900 dark:text-white' },
  { regex: /text-gray-800(?! dark:)/g, replacement: 'text-gray-800 dark:text-gray-100' },
  { regex: /text-gray-700(?! dark:)/g, replacement: 'text-gray-700 dark:text-gray-200' },
  { regex: /text-gray-600(?! dark:)/g, replacement: 'text-gray-600 dark:text-gray-300' },
  { regex: /text-gray-500(?! dark:)/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /text-gray-400(?! dark:)/g, replacement: 'text-gray-400 dark:text-gray-500' },
  { regex: /bg-gray-50\/80(?! dark:)/g, replacement: 'bg-gray-50/80 dark:bg-gray-800/50' },
  { regex: /bg-gray-50(?!(\/|\w| dark:))/g, replacement: 'bg-gray-50 dark:bg-[#1f2937]' },
  { regex: /border-gray-100(?! dark:)/g, replacement: 'border-gray-100 dark:border-gray-800' },
  { regex: /border-gray-200(?! dark:)/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { regex: /border-emerald-50(?! dark:)/g, replacement: 'border-emerald-50 dark:border-gray-800' },
  { regex: /border-emerald-100(?! dark:)/g, replacement: 'border-emerald-100 dark:border-emerald-900/30' },
  { regex: /bg-emerald-50(?!(\/|\w| dark:))/g, replacement: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { regex: /bg-indigo-50(?!(\/|\w| dark:))/g, replacement: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { regex: /bg-amber-50(?!(\/|\w| dark:))/g, replacement: 'bg-amber-50 dark:bg-amber-900/20' },
  { regex: /bg-red-50(?!(\/|\w| dark:))/g, replacement: 'bg-red-50 dark:bg-red-900/20' },
  { regex: /bg-white\/70(?! dark:)/g, replacement: 'bg-white/70 dark:bg-[#0B1120]/80' },
  { regex: /bg-white\/60(?! dark:)/g, replacement: 'bg-white/60 dark:bg-[#111827]/60' },
  { regex: /bg-white\/95(?! dark:)/g, replacement: 'bg-white/95 dark:bg-[#0B1120]/95' },
  { regex: /text-emerald-700(?! dark:)/g, replacement: 'text-emerald-700 dark:text-emerald-400' },
  { regex: /text-emerald-600(?! dark:)/g, replacement: 'text-emerald-600 dark:text-emerald-400' },
  { regex: /text-indigo-600(?! dark:)/g, replacement: 'text-indigo-600 dark:text-indigo-400' },
  { regex: /text-amber-600(?! dark:)/g, replacement: 'text-amber-600 dark:text-amber-400' },
  { regex: /text-red-600(?! dark:)/g, replacement: 'text-red-600 dark:text-red-400' },
  { regex: /border-gray-50\/50(?! dark:)/g, replacement: 'border-gray-50/50 dark:border-gray-800/50' },
  { regex: /divide-gray-100(?! dark:)/g, replacement: 'divide-gray-100 dark:divide-gray-800' },
  { regex: /hover:bg-gray-50(?!(\/|\w| dark:))/g, replacement: 'hover:bg-gray-50 dark:hover:bg-gray-800/50' },
  { regex: /hover:bg-gray-100(?!(\/|\w| dark:))/g, replacement: 'hover:bg-gray-100 dark:hover:bg-gray-700/50' },
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
