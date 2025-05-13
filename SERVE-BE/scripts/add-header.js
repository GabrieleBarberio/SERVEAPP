const fs = require('fs');
const path = require('path');
const glob = require('glob');

const header = `/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */
`;

const files = glob.sync('src/**/*.{js,ts}', { nodir: true });

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.startsWith(header)) {
    // Rimuove eventuali vecchi header che iniziano con /**
    const cleaned = content.replace(/^\/\*\*[\s\S]*?\*\/\s*/m, '');
    fs.writeFileSync(filePath, header + '\n' + cleaned.trimStart(), 'utf8');
    console.log(`🔁 Header aggiornato in: ${filePath}`);
  } else {
    console.log(`✅ Header già corretto in: ${filePath}`);
  }
});
