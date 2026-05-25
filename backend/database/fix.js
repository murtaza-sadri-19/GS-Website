const fs = require('fs');
const file = 'C:/Users/navne/Downloads/backup-3.24.2026_11-49-06_sgsits_handover/backup-3.24.2026_11-49-06_sgsits_handover/GS-Website/backend/database/seed_enterprise_04_content.sql';

let data = fs.readFileSync(file, 'utf8');

const regex = /stored_name='' LIMIT 1 LIMIT 1/g;
let matchCount = 0;
data = data.replace(regex, (match) => {
    matchCount++;
    return `stored_name='FIXME_${matchCount}' LIMIT 1`;
});

fs.writeFileSync(file, data, 'utf8');
console.log(`Replaced ${matchCount} matches.`);
