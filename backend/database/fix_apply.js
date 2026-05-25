const fs = require('fs');
const file = 'C:/Users/navne/Downloads/backup-3.24.2026_11-49-06_sgsits_handover/backup-3.24.2026_11-49-06_sgsits_handover/GS-Website/backend/database/seed_enterprise_04_content.sql';

let data = fs.readFileSync(file, 'utf8');

const replacements = {
    'FIXME_1': 'seed_exam_circular_dec2025.pdf', // End Semester Examination December 2025
    'FIXME_2': 'seed_admit_card_dec2025.pdf',    // Admit Card Availability
    'FIXME_3': 'seed_result_may2025.pdf',        // Result Declaration: B.E. / M.Tech. May 2025
    'FIXME_4': 'seed_ce_sem5_syllabus_2025.pdf', // Computer Engineering (Syllabus update notice) - assuming CE syllabus
    'FIXME_5': 'seed_anti_ragging_policy_2025.pdf', // Anti-Ragging Policy
    'FIXME_6': 'seed_ug_admission_2025.pdf',    // UG Admission 2025
    'FIXME_7': 'seed_placement_brochure_2526.pdf', // Placement Season 2025-26 Open
    'FIXME_8': 'seed_technova2025.jpg',         // National Tech Fest: TechNova 2025
    'FIXME_9': 'seed_convocation2025.jpg',      // Silver Jubilee Convocation Ceremony
    'FIXME_10': 'seed_sports2025.jpg',          // Annual Sports Meet
    'FIXME_11': 'seed_ce_sem5_syllabus_2025.pdf', // CE Semester 5 Syllabus 2025
    'FIXME_12': 'seed_it_sem5_syllabus_2025.pdf', // IT Semester 5 Syllabus 2025
    'FIXME_13': 'seed_me_sem5_syllabus_2025.pdf', // ME Semester 5 Syllabus 2025
    'FIXME_14': 'seed_academic_calendar_2526.pdf', // Academic Calendar 2025-26
    'FIXME_15': 'seed_fee_structure_2526.pdf',  // Fee Structure 2025-26
    'FIXME_16': 'seed_hostel_fee_2025.pdf',     // Hostel Fee Structure 2025-26
    'FIXME_17': 'seed_ug_admission_2025.pdf',   // UG Admission Prospectus 2025-26
    'FIXME_18': 'seed_pg_admission_2025.pdf',   // PG Admission Prospectus 2025-26
    'FIXME_19': 'seed_scholarship_2025.pdf',    // State Govt Scholarship Guidelines 2025
    'FIXME_20': 'seed_placement_brochure_2526.pdf', // Placement Brochure 2025-26
    'FIXME_21': 'seed_tender_lab_equip_2025.pdf', // Supply of Computer Laboratory Equipment 
    '{NULL}': 'seed_hvac_amc_2025.pdf', // Wait, tender 2 is NULL
    '{NULL}': 'seed_canteen_lease_2025.pdf', // Wait, tender 3 is NULL
    // Let me check tenders... wait there's 3 tenders, 3 alerts...
};

for (const [key, value] of Object.entries(replacements)) {
    data = data.replace(key, value);
}

fs.writeFileSync(file, data, 'utf8');
console.log('Done');