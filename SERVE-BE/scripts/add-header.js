const fs = require('fs');
const path = require('path');
const glob = require('glob');

const header = `/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */\n`;
glob('src/**/*.{js,ts}', { nodir: true }, (err, files) => {
  if (err) {
    console.error('❌ Errore nella ricerca dei file:', err);
    return;
  }

  if (files.length === 0) {
    console.log('⚠️ Nessun file trovato nel pattern specificato');
    return;
  }

  files.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      if (!content.startsWith(header)) {
        const cleaned = content.replace(/^\/\*\*[\s\S]*?\*\/\s*/m, '');
        fs.writeFileSync(filePath, header + cleaned.trimStart(), 'utf8');
        console.log(`🔁 Header aggiornato in: ${filePath}`);
      } else {
        console.log(`✅ Header già corretto in: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Errore nel processare ${filePath}:`, error);
    }
  });
});
