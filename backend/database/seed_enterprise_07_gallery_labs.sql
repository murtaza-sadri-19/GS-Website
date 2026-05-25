-- =============================================================================
-- ENTERPRISE SEED — Part 07: Gallery Albums, Gallery Items, Labs, Achievements
-- Run AFTER: seed_enterprise_04_content.sql (files must exist)
-- =============================================================================
USE college_website;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Gallery Albums ────────────────────────────────────────────────────────
INSERT INTO gallery_albums
  (title, slug, description, department_id, event_date, status, created_by)
VALUES
  ('Technova 2025 — Annual Technical Festival',
   'technova-2025-gallery',
   'Photo gallery from the 18th edition of Technova annual technical festival held in March 2025 at SGSITS Indore.',
   NULL, '2025-03-15', 'ACTIVE',
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in')),

  ('38th Convocation Ceremony 2025',
   'convocation-2025-gallery',
   'Highlights from the 38th Annual Convocation Ceremony where degrees were conferred on the graduating batch.',
   NULL, '2025-11-15', 'ACTIVE',
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in')),

  ('Annual Sports Meet 2025',
   'sports-meet-2025-gallery',
   'Action shots and prize distribution ceremony from Annual Sports Meet 2025.',
   NULL, '2025-02-05', 'ACTIVE',
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in')),

  ('TCS Campus Drive September 2025',
   'tcs-drive-2025-gallery',
   'Placement drive photos — TCS NQT campus hiring September 2025.',
   NULL, '2025-09-18', 'ACTIVE',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('CE Department Labs',
   'ce-department-labs',
   'Computer Engineering Department Laboratory facilities including Programming Lab, Networks Lab, and AI/ML Lab.',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   '2025-01-01', 'ACTIVE',
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ('IT Department Labs',
   'it-department-labs',
   'IT Department laboratory facilities including Cybersecurity Lab, Web Development Studio, and Data Science Lab.',
   (SELECT id FROM departments WHERE slug='information-technology'),
   '2025-01-01', 'ACTIVE',
   (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),

  ('Campus Infrastructure Gallery',
   'campus-infrastructure',
   'Photo tour of SGSITS campus infrastructure including Main Building, Library, Hostels, and Sports facilities.',
   NULL, '2025-01-01', 'ACTIVE',
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in')),

  ('Fresher Orientation 2025–26',
   'freshers-orientation-2025',
   'Welcome programme for newly admitted students for the academic year 2025–26.',
   NULL, '2025-07-21', 'ACTIVE',
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'))
ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- ─── 2. Gallery Items ─────────────────────────────────────────────────────────
-- Note: gallery.file_id is RESTRICT delete, so we insert using the placeholder
-- image files seeded in Part 04. For albums without specific images, we reuse
-- available files since actual uploads happen via API.
INSERT INTO gallery
  (title, description, department_id, file_id, album_id, uploaded_by, status)
VALUES
  ('Technova 2025 — Inaugural Ceremony',
   'Chief Guest addressing students at the inauguration of Technova 2025.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_technova2025.jpg' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='technova-2025-gallery'),
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'), 'ACTIVE'),

  ('Technova 2025 — Hackathon Winners',
   'Team Syntax Error from CE Department receiving the first prize in Code Storm Hackathon.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_hackathon2025.jpg' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='technova-2025-gallery'),
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'), 'ACTIVE'),

  ('Convocation 2025 — Degree Distribution',
   'Director conferring degrees to graduating batch at the 38th Convocation.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_convocation2025.jpg' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='convocation-2025-gallery'),
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'), 'ACTIVE'),

  ('Annual Sports Meet — Cricket Final',
   'CE Department cricket team winning the championship at Annual Sports Meet 2025.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_sports2025.jpg' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='sports-meet-2025-gallery'),
   (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'), 'ACTIVE'),

  ('TCS Drive — Students Appearing for Test',
   'Final year students appearing for TCS National Qualifier Test at computer lab.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_tcs_drive2025.jpg' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='tcs-drive-2025-gallery'),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),

  ('TCS Drive — Offer Letters Distribution',
   'Placement officer distributing TCS offer letters to selected students.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_placement_brochure_2526.pdf' LIMIT 1),
   (SELECT id FROM gallery_albums WHERE slug='tcs-drive-2025-gallery'),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE')
ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- ─── 3. Labs ──────────────────────────────────────────────────────────────────
INSERT INTO labs
  (department_id, name, description, incharge, capacity, is_active, created_by)
VALUES
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Programming Laboratory I',
    'Equipped with 60 HP EliteDesk workstations (i7, 16GB RAM, 512GB SSD) running Ubuntu 22.04 and Windows 11 dual-boot. Software: JetBrains Suite, VS Code, Eclipse, GCC, Python 3.11, Java 17. Available for C, C++, Java, Python, and Data Structures practicals for Sem 1–3 students.',
    'Prof. Amit Soni', 60, 1,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Networks & Security Laboratory',
    'Dedicated to computer networking and cybersecurity experiments. Contains 30 Cisco Catalyst switches, 15 Cisco 2900 series routers, Packet Tracer workstations, Wireshark, and Kali Linux systems. Supports CCNA lab practicals and cybersecurity workshops.',
    'Dr. Seema Rathore', 30, 1,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Artificial Intelligence & Machine Learning Lab',
    'State-of-the-art AI/ML lab with 20 NVIDIA RTX 3080 GPU-equipped workstations, TensorFlow, PyTorch, Scikit-learn, Jupyter Notebooks. Access to Google Colab Pro accounts and AWS Educate credits for cloud ML workloads.',
    'Dr. Nisha Thakur', 20, 1,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Web Development & UI/UX Studio',
    'Modern lab with 40 iMac systems equipped with Adobe XD, Figma, VS Code, LAMP stack, Docker, and Git. Internet speed: 100Mbps dedicated line. Used for Web Technologies, Human-Computer Interaction, and Mobile App Development practicals.',
    'Prof. Sneha Tiwari', 40, 1,
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Data Science & Analytics Lab',
    'Equipped with 30 high-performance workstations with R Studio, Python, MATLAB, SPSS, and Tableau. Supports Machine Learning, Data Mining, and Business Analytics practicals. Connected to institute data warehouse for live analytics practicals.',
    'Dr. Pooja Chouhan', 30, 1,
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Heat Transfer & Fluid Mechanics Laboratory',
    'Contains pin-fin apparatus, forced convection over flat plate setup, heat exchanger (parallel & counter flow), Pelton wheel turbine, centrifugal pump test rig, and Francis turbine model. All experimental setups are computerised for digital data acquisition.',
    'Dr. Neha Joshi', 30, 1,
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'CNC & Additive Manufacturing Laboratory',
    'Houses HAAS VF2 3-axis CNC machining centre, Makerbot Replicator 5 FDM printers, 2 SLA printers, CMM (Coordinate Measuring Machine), and reverse engineering setup with 3D scanner. Used for CNC Programming and Additive Manufacturing practicals.',
    'Dr. Rakesh Chouksey', 15, 1,
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
    'TI Innovation Laboratory (Texas Instruments)',
    'Industry-sponsored lab by Texas Instruments containing MSP430 LaunchPads, TI AM335x EVM boards, DSP starter kits (TMS320), Code Composer Studio. Used for embedded systems, DSP, and IoT development courses.',
    'Dr. Shailendra Kumar Singh', 30, 1,
    (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='electrical-engineering'),
    'Power Systems & Smart Grid Laboratory',
    'Features power system simulation software (PSCAD, ETAP, MATLAB/Simulink), real-time digital simulator (RTDS), transformer testing setup, and relay coordination panel. Used for power systems, protection, and control experiments.',
    'Dr. Manoj Kumar Jain', 25, 1,
    (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in')
  )
ON DUPLICATE KEY UPDATE description=VALUES(description), incharge=VALUES(incharge);

-- ─── 4. Department Achievements ───────────────────────────────────────────────
INSERT INTO department_achievements
  (department_id, title, description, achievement_year, category, status, created_by)
VALUES
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'NBA Accreditation Renewed for B.E. Computer Engineering',
    'The B.E. Computer Engineering programme has received renewed NBA accreditation for a period of 3 years (2025–2028), recognising the programme''s quality in terms of outcomes-based education, teaching-learning processes, and industry interface.',
    2025, 'Accreditation', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Team SGSITS Wins Hack MP State Hackathon 2025',
    'A team of five CE students — Arjun Mishra, Kavya Sharma, Navneet Singh, Mohit Rajput, and Ananya Chouhan — won first prize at Hack MP, the Madhya Pradesh State Government hackathon, for their project "AgroSense — Smart Crop Advisory System" using IoT and ML.',
    2025, 'Student Achievement', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='information-technology'),
    'IT Department Establishes Cybersecurity Research Centre',
    'The IT Department has established a dedicated Cybersecurity Research Centre in collaboration with NASSCOM FutureSkills with a grant of Rs. 15 Lakhs. The centre will focus on ethical hacking, digital forensics, and security research.',
    2025, 'Infrastructure', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Dr. Pradeep Kasande Receives Best Teacher Award — RGPV 2024',
    'Dr. Pradeep Kasande, Head of Mechanical Engineering Department, was awarded the RGPV Best Teacher Award 2024 by Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal in recognition of his distinguished contributions to technical education over three decades.',
    2024, 'Faculty Achievement', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
    'EC Department Receives DST-SERB Core Research Grant',
    'The EC Department received a Core Research Grant of Rs. 28 Lakhs from DST-SERB for the project "FPGA Implementation of Post-Quantum Cryptographic Algorithms for Secure Embedded Systems" led by Dr. Shailendra Kumar Singh.',
    2025, 'Research Grant', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in')
  ),
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Record 58 CE Students Placed in 2024–25 Placement Season',
    'Computer Engineering Department achieved its best-ever placement result with 58 students placed in 2024–25 academic year, including offers from Oracle (Rs. 8 LPA), KPIT (Rs. 5 LPA), Persistent Systems (Rs. 4.5 LPA), and TCS, Infosys, Wipro.',
    2025, 'Placement', 'PUBLISHED',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  )
ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

SET foreign_key_checks = 1;
