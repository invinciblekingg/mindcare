const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('prisma.auditLog.create')) {
        if (!content.includes('createAuditLog')) {
          content = 'import { createAuditLog } from \'@/lib/audit/log\';\n' + content;
        }
        
        // Match prisma.auditLog.create({ ... data: { ... } ... })
        // We will replace prisma.auditLog.create({[\s\S]*?data:\s*\{ with createAuditLog({
        // And then we have to remove the closing } of the data object before the final })
        // Actually simpler:
        // 1. replace prisma.auditLog.create( with createAuditLog(
        // 2. We can't simply remove data: { with regex without breaking. 
        // Let's use string manipulation based on data: location.
        let newContent = content;
        while (newContent.includes('prisma.auditLog.create')) {
            let idx = newContent.indexOf('prisma.auditLog.create');
            let startOfCreate = idx;
            let start = idx + 'prisma.auditLog.create'.length;
            
            // we find the outer matching brace
            let braceCount = 0;
            let inData = false;
            let dataStart = -1;
            let dataEnd = -1;
            
            let i = start;
            while(i < newContent.length) {
                if (newContent[i] === '{') braceCount++;
                if (newContent[i] === '}') braceCount--;
                
                if (braceCount === 1 && newContent.slice(i, i+5) === 'data:') {
                    inData = true;
                    // find the '{' after data:
                    let j = i + 5;
                    while(newContent[j] !== '{') j++;
                    dataStart = j;
                    
                    let dataBraceCount = 0;
                    for (let k = j; k < newContent.length; k++) {
                        if (newContent[k] === '{') dataBraceCount++;
                        if (newContent[k] === '}') dataBraceCount--;
                        if (dataBraceCount === 0) {
                            dataEnd = k;
                            break;
                        }
                    }
                    break;
                }
                
                if (braceCount === 0 && i > start + 2) break;
                i++;
            }
            
            if (dataStart !== -1 && dataEnd !== -1) {
                // remove 'data:' and its braces
                // Basically, the contents of data object become the contents of the main object.
                let beforeData = newContent.slice(start, i); // inside create(...) before data
                let dataInner = newContent.slice(dataStart + 1, dataEnd);
                let afterData = newContent.slice(dataEnd + 1, i + 1); // remainder of outer object?
                // Wait, this is getting complicated.
            }
        }
      }
    }
  }
}
