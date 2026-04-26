const fs = require('fs');
const files = ['src/data/himalaya.ts', 'src/components/ExpeditionGrid.tsx', 'src/components/Hero.tsx', 'src/pages/PlacePage.tsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  let original = code;
  
  // replace '/images/...' with BASE_URL
  code = code.replace(/('\/images\/[^']*')/g, 'import.meta.env.BASE_URL + $1.slice(1)');
  code = code.replace(/('\/img\/[^']*')/g, 'import.meta.env.BASE_URL + $1.slice(1)');
  code = code.replace(/"\/images\/([^"]+)"/g, 'import.meta.env.BASE_URL + "images/$1"');
  code = code.replace(/"\/img\/([^"]+)"/g, 'import.meta.env.BASE_URL + "img/$1"');
  
  // Also handle template literals in ExpeditionGrid
  code = code.replace(/\`\/images\/\$\{([^}]+)\}\/thumbnail.jpg\`/g, '\`${import.meta.env.BASE_URL}images/${$1}/thumbnail.jpg\`');

  if (original !== code) {
    fs.writeFileSync(file, code);
    console.log('Updated ' + file);
  }
}
