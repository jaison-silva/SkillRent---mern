import * as fs from 'fs';
import * as path from 'path';

const controllersDir = path.join(__dirname, 'src', 'controllers');

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add import if not present
    if (!content.includes('import { ApiResponse }')) {
        content = content.replace(/(import .*;\r?\n)/, '$1import { ApiResponse } from "../utils/ApiResponse";\n');
    }

    // Replace res.status(201).json({ user: result.user, accessToken: result.accessToken })
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*user:\s*(.*?),\s*accessToken:\s*(.*?)\s*\}\);?/g, 
        'return ApiResponse.success(res, { user: $2, accessToken: $3 }, null, $1);');
        
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*message,\s*user,\s*accessToken\s*\}\);?/g, 
        'return ApiResponse.success(res, { user, accessToken }, { message }, $1);');

    // Replace basic res.status(status).json({ message, data })
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*message,\s*data:\s*(.*?)\s*\}\);?/g, 
        'return ApiResponse.success(res, $2, { message }, $1);');

    // Replace res.status(status).json({ message, user })
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*message,\s*user\s*\}\);?/g, 
        'return ApiResponse.success(res, { user }, { message }, $1);');

    // Replace paginated
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*message,\s*count:\s*(.*?),\s*([a-zA-Z0-9_]+)\s*\}\);?/g, 
        'return ApiResponse.success(res, { $3 }, { message, total: $2 }, $1);');

    // Replace generic { success: true, message: ... }
    content = content.replace(/res\.status\((.*?)\)\.json\(\{\s*success:\s*true,\s*message:\s*(.*?),\s*\}\);?/g, 
        'return ApiResponse.success(res, null, { message: $2 }, $1);');

    // Replace simple errors
    content = content.replace(/res\.status\((\d+)\)\.json\(\{\s*message:\s*(".*?")\s*\}\);?/g, 
        'return ApiResponse.error(res, $2, "ERROR", $1);');

    fs.writeFileSync(filePath, content, 'utf-8');
}

const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.ts'));
for (const file of files) {
    processFile(path.join(controllersDir, file));
}
console.log("Refactoring complete.");
