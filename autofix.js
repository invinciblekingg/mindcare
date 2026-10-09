const fs = require('fs');
const { execSync } = require('child_process');

function run() {
  try {
    execSync('npm run typecheck', { stdio: 'pipe' });
    console.log('Typecheck passed!');
  } catch (err) {
    const output = err.stdout.toString();
    const lines = output.split('\n');
    const fixes = {}; // file -> set of line numbers

    for (const line of lines) {
      const match = line.match(/(app\/api\/[^\(]+)\((\d+),\d+\):\s*error\s*(TS1005|TS1472|TS1128)/);
      if (match) {
        const file = match[1];
        const lineNum = parseInt(match[2], 10);
        if (!fixes[file]) fixes[file] = [];
        fixes[file].push(lineNum);
      }
    }

    for (const file of Object.keys(fixes)) {
      // deduplicate and sort descending so we don't mess up line numbers when inserting
      let lineNums = [...new Set(fixes[file])].sort((a, b) => b - a);
      if (!fs.existsSync(file)) continue;

      let contentLines = fs.readFileSync(file, 'utf8').split('\n');

      for (const lineNum of lineNums) {
        // lineNum is 1-based.
        const idx = lineNum - 1;
        if (contentLines[idx].includes('});')) {
            contentLines[idx] = contentLines[idx].replace('});', '}\n    });');
        } else if (contentLines[idx].includes('}')) {
            // maybe it's just } instead of });?
            // it could be     }); on the next line?
        }
      }
      fs.writeFileSync(file, contentLines.join('\n'));
      console.log('Fixed', file, lineNums);
    }
  }
}

run();
