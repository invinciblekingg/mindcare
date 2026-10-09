const fs = require('fs');
const path = require('path');

function fix(fullPath) {
  let content = fs.readFileSync(fullPath, 'utf8');
  
  content = content.replace(/,\s*\n\s*\}\s*\n\s*\}\);/g, ',\n    });');
  content = content.replace(/true,\s*\n\s*\}\);/g, 'true,\n      }\n    });');
  content = content.replace(/null,\s*\n\s*\}\);/g, 'null,\n      }\n    });');
  content = content.replace(/'desc',\s*\n\s*\}\);/g, '\'desc\',\n      }\n    });');
  content = content.replace(/'asc',\s*\n\s*\}\);/g, '\'asc\',\n      }\n    });');
  content = content.replace(/'ACTIVE',\s*\n\s*\}\);/g, '\'ACTIVE\',\n      }\n    });');
  content = content.replace(/details: \{\s*action:\s*'([^']+)'\s*\}\s*\n*\s*\}\);/g, 'details: { action: \'\' }\n    });');
  
  // also fix if we have details: { action: '...' }, });
  content = content.replace(/details: \{\s*action:\s*'([^']+)'\s*\}\s*,\s*\n\s*\}\);/g, 'details: { action: \'\' }\n    });');
  // or details: { action: '...'   });
  content = content.replace(/details: \{\s*action:\s*'([^']+)'\s*\}\);/g, 'details: { action: \'\' }\n    });');

  fs.writeFileSync(fullPath, content);
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      fix(fullPath);
    }
  }
}
processDir('app/api');
