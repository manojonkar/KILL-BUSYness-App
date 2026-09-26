const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/all_modules.json', 'utf-8'));
let suspicious = [];

data.forEach(m => {
    let text = m.core_lesson.trim();
    if (!text) return;
    
    let issues = [];
    
    // Check if ends without punctuation (ignoring markdown images at the end)
    const endChar = text.slice(-1);
    if (!/[.?!:;"')\]*]/.test(endChar) && !text.endsWith(')')) {
        issues.push('No ending punctuation: ' + endChar);
    }
    
    // Check if starts with lowercase
    let cleanStart = text.replace(/^[^a-zA-Z]+/g, '');
    if (cleanStart.length > 0 && cleanStart[0] === cleanStart[0].toLowerCase()) {
        issues.push('Starts with lowercase letter');
    }
    
    // Check for stray page numbers or roman numerals
    let lines = text.split('\n').map(l => l.trim());
    for (let line of lines) {
        if (/^(x{1,3}|i{1,3}|v|iv|vi{1,3})$/i.test(line)) {
            issues.push('Stray Roman numeral: ' + line);
        }
        if (/^\d+$/.test(line)) {
            issues.push('Stray page number: ' + line);
        }
    }
    
    if (issues.length > 0) {
        suspicious.push({
            id: m.linear_id,
            title: m.title,
            issues: issues,
            start: text.substring(0, 30).replace(/\n/g, ' '),
            end: text.substring(text.length - 30).replace(/\n/g, ' ')
        });
    }
});

console.log(`Found ${suspicious.length} suspicious modules.`);
suspicious.forEach(s => {
    console.log(`Module ${s.id} (${s.title}): ${s.issues.join(', ')}`);
    console.log(`  Start: ${s.start}...`);
    console.log(`  End: ...${s.end}`);
});
