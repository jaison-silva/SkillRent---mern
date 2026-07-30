import * as fs from 'fs';
import * as path from 'path';

const controllersDir = path.join(__dirname, 'src', 'controllers');

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove : Promise<void> from controller method signatures
    content = content.replace(/: Promise<void> = async/g, ' = async');

    fs.writeFileSync(filePath, content, 'utf-8');
}

const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.ts'));
for (const file of files) {
    processFile(path.join(controllersDir, file));
}
console.log("Types fixed.");
