-- =============================================================================
-- ENTERPRISE SEED — Part 03: Faculty Profiles, Qualifications, Publications, Research
-- Run AFTER: seed_enterprise_02_departments.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Faculty Profiles ──────────────────────────────────────────────────────
-- CE HOD profile
INSERT INTO faculty_profiles
  (user_id, department_id, designation, qualification, specialization,
   experience, bio, subjects)
VALUES
  (
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Professor & Head of Department', 'Ph.D. (Computer Science), M.Tech. (CS), B.E. (CE)',
    'Machine Learning, Data Mining, Natural Language Processing',
    28,
    'Dr. Ajay Khunteta has over 28 years of teaching and research experience at SGSITS. He has published 45+ research papers in SCI/Scopus-indexed journals, guided 12 Ph.D. scholars, and secured two research grants from DST. He is a senior member of IEEE and ACM.',
    'Machine Learning, Data Structures & Algorithms, Advanced Database Management, Compiler Design'
  ),
  -- CE Faculty
  (
    (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Associate Professor', 'Ph.D. (CS), M.Tech. (Software Engineering), B.E. (CE)',
    'Deep Learning, Computer Vision, Neural Networks',
    18,
    'Dr. Nisha Thakur specialises in deep learning and computer vision with 18 years of teaching experience. She has published 22 research papers and is currently leading a DST-funded project on automated plant disease detection using CNN.',
    'Artificial Intelligence, Deep Learning, Computer Networks, Operating Systems'
  ),
  (
    (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Assistant Professor', 'M.Tech. (Computer Science), B.E. (CE)',
    'Cloud Computing, DevOps, Distributed Systems',
    10,
    'Prof. Amit Soni has 10 years of academic and industry experience. He worked at Infosys Pune for 4 years before joining SGSITS. His research focuses on microservices architectures and cloud-native applications.',
    'Cloud Computing, Web Technologies, Software Engineering, Object-Oriented Programming'
  ),
  (
    (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Associate Professor', 'Ph.D. (IT), M.Tech. (Networking), B.E. (CE)',
    'Network Security, Cryptography, Blockchain',
    20,
    'Dr. Seema Rathore is an expert in cybersecurity and blockchain technologies with 20 years of experience. She has filed two patents on blockchain-based academic credential verification.',
    'Cryptography & Network Security, Blockchain Technology, Computer Networks, Data Communications'
  ),
  (
    (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Associate Professor', 'Ph.D. (CS), M.Tech. (AI), B.E. (CE)',
    'Artificial Intelligence, Expert Systems, IoT',
    16,
    'Dr. Vivek Sharma has 16 years of experience in AI and IoT domains. He has collaborated with Tata Consultancy Services on an IoT-based smart campus monitoring project.',
    'Artificial Intelligence, Internet of Things, Design & Analysis of Algorithms, Theory of Computation'
  ),
  (
    (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Assistant Professor', 'M.Tech. (Computer Engineering), B.E. (CE)',
    'Database Systems, Big Data Analytics',
    7,
    'Prof. Kiran Patel has 7 years of teaching experience with expertise in database systems and big data technologies. She has guided 15+ M.Tech. dissertations.',
    'Database Management Systems, Big Data Analytics, Data Warehousing, Programming in Java'
  ),
  -- IT HOD profile
  (
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Professor & Head of Department', 'Ph.D. (IT), M.Tech. (CS), B.E. (IT)',
    'Software Testing, Agile Methodologies, Project Management',
    25,
    'Dr. Kapil Jain has 25 years of experience in IT education and research. He is an active consultant for several Indore-based IT companies and has been a key contributor to RGPV curriculum development for IT programmes.',
    'Software Engineering, Project Management, Agile & DevOps, IT Infrastructure'
  ),
  -- IT Faculty
  (
    (SELECT id FROM users WHERE email='pooja.chouhan@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Associate Professor', 'Ph.D. (CS), M.Tech. (IT), B.E. (CE)',
    'Machine Learning, Predictive Analytics, Health Informatics',
    15,
    'Dr. Pooja Chouhan is a data science researcher with 15 years of academic experience. Her research on health data analytics using ML has been published in IEEE Transactions on Biomedical Engineering.',
    'Machine Learning, Data Science, Python Programming, Statistics for Engineers'
  ),
  (
    (SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Assistant Professor', 'M.Tech. (Information Technology), B.E. (IT)',
    'Web Development, ReactJS, Node.js',
    9,
    'Prof. Rajesh Verma is a full-stack developer and educator with 9 years of experience. He has completed online certifications from AWS and Google Cloud and incorporates industry tools in his teaching.',
    'Web Technologies, JavaScript Frameworks, Database Management, Mobile Application Development'
  ),
  (
    (SELECT id FROM users WHERE email='anjali.singh.it@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Associate Professor', 'Ph.D. (CS), M.Tech. (SE), B.E. (IT)',
    'Natural Language Processing, Text Mining, Sentiment Analysis',
    17,
    'Dr. Anjali Singh is an NLP researcher with 17 years of experience. She has published 18 papers in Scopus-indexed journals and is guiding 3 Ph.D. scholars on multilingual NLP for Indian languages.',
    'Natural Language Processing, Artificial Intelligence, Data Structures, Formal Languages'
  ),
  (
    (SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Assistant Professor', 'M.Tech. (Network Technology), B.E. (CE)',
    'Network Administration, Cybersecurity, CCNA',
    8,
    'Prof. Manish Dubey holds Cisco CCNA and CompTIA Security+ certifications. He designed the department\'s cybersecurity lab and has conducted cybersecurity awareness workshops for Indore Police.',
    'Computer Networks, Network Security, System Administration, Linux Administration'
  ),
  (
    (SELECT id FROM users WHERE email='sneha.tiwari@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Assistant Professor', 'M.Tech. (IT), B.E. (CE)',
    'UI/UX Design, Human-Computer Interaction',
    6,
    'Prof. Sneha Tiwari specialises in user experience design and human-computer interaction. She has conducted UX workshops in collaboration with local startups and mentors student design projects.',
    'Human-Computer Interaction, Web Design, Multimedia Systems, Graphic Design for Engineers'
  ),
  -- ME HOD profile
  (
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Professor & Head of Department', 'Ph.D. (Thermal Engineering), M.Tech. (ME), B.E. (ME)',
    'Heat Transfer, Computational Fluid Dynamics, Renewable Energy',
    30,
    'Dr. Pradeep Kasande is a distinguished mechanical engineer with 30 years at SGSITS. He has received the MP Government Excellence Award in Technical Education and authored a textbook on Heat Transfer widely used in central India.',
    'Heat Transfer, Fluid Mechanics, Thermodynamics, Renewable Energy Systems'
  ),
  -- ME Faculty
  (
    (SELECT id FROM users WHERE email='rakesh.chouksey@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Associate Professor', 'Ph.D. (Manufacturing), M.Tech. (Production Engg.), B.E. (ME)',
    'CNC Machining, Additive Manufacturing, Manufacturing Processes',
    19,
    'Dr. Rakesh Chouksey has 19 years of experience in manufacturing engineering. His research on 3D printing of functional composites has led to a DST Young Scientist Award.',
    'Manufacturing Technology, CNC Programming, Additive Manufacturing, Engineering Materials'
  ),
  (
    (SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Professor', 'Ph.D. (Design), M.Tech. (Machine Design), B.E. (ME)',
    'Finite Element Analysis, CAD/CAM, Product Design',
    24,
    'Prof. Anil Kumar Agrawal has 24 years of experience in machine design and FEA. He has collaborated with BHEL Bhopal on fatigue analysis of turbine blades and has published extensively in ASME journals.',
    'Machine Design, CAD/CAM, Finite Element Analysis, Kinematics of Machines'
  ),
  (
    (SELECT id FROM users WHERE email='neha.joshi.me@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Assistant Professor', 'M.Tech. (Thermal Engineering), B.E. (ME)',
    'Refrigeration & Air Conditioning, Solar Energy',
    11,
    'Dr. Neha Joshi specialises in thermal systems and sustainable energy. She completed her Ph.D. on solar-assisted cooling systems and has published 10 research papers.',
    'Refrigeration & Air Conditioning, Power Plant Engineering, Applied Thermodynamics, Solar Energy'
  ),
  (
    (SELECT id FROM users WHERE email='sanjay.patidar@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Associate Professor', 'Ph.D. (Industrial Engg.), M.Tech. (Industrial Engg.), B.E. (ME)',
    'Operations Research, Supply Chain Management, Lean Manufacturing',
    21,
    'Dr. Sanjay Patidar is an industrial engineering expert with 21 years of experience. He has consulted for several Pithampur-based manufacturing units on lean implementation.',
    'Operations Research, Industrial Engineering, Supply Chain Management, Quality Engineering'
  ),
  -- Civil HOD
  (
    (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='civil-engineering'),
    'Professor & Head of Department', 'Ph.D. (Structural Engineering), M.Tech. (CE), B.E. (Civil)',
    'Earthquake Engineering, Structural Analysis, RCC Design',
    26,
    'Dr. Yogesh Kumar Bajpai is a structural engineering expert with 26 years of experience. He was part of the IS 13920:2016 code revision committee and has published over 35 research papers.',
    'Structural Analysis, RCC Design, Earthquake Engineering, Advanced Structural Design'
  ),
  -- Civil Faculty
  (
    (SELECT id FROM users WHERE email='meena.agrawal@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='civil-engineering'),
    'Associate Professor', 'Ph.D. (Environmental Engg.), M.Tech. (Environmental Engg.), B.E. (Civil)',
    'Water Treatment, Environmental Impact Assessment, Waste Management',
    17,
    'Dr. Meena Agrawal is an environmental engineer with 17 years of experience. She has collaborated with IMC (Indore Municipal Corporation) on sewage treatment plant design projects.',
    'Environmental Engineering, Water Supply Engineering, Solid Waste Management, EIA'
  ),
  (
    (SELECT id FROM users WHERE email='dinesh.shukla@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='civil-engineering'),
    'Associate Professor', 'M.Tech. (Geotechnical Engineering), B.E. (Civil)',
    'Foundation Engineering, Soil Mechanics, Ground Improvement',
    14,
    'Prof. Dinesh Kumar Shukla specialises in geotechnical engineering with 14 years of experience. He has conducted soil investigation for several highway projects in Madhya Pradesh.',
    'Soil Mechanics, Foundation Engineering, Ground Improvement Techniques, Engineering Geology'
  ),
  -- EE HOD
  (
    (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='electrical-engineering'),
    'Professor & Head of Department', 'Ph.D. (Power Systems), M.Tech. (Power Systems), B.E. (EE)',
    'Smart Grid, FACTS Devices, Power Quality',
    27,
    'Dr. Manoj Kumar Jain is an authority on smart grid technologies with 27 years of experience at SGSITS. He has received research grants from MPCOST and MNRE for smart grid and solar power research.',
    'Power Systems, Smart Grid Technologies, FACTS Devices, High Voltage Engineering'
  ),
  -- EE Faculty
  (
    (SELECT id FROM users WHERE email='archana.patel.ee@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='electrical-engineering'),
    'Associate Professor', 'Ph.D. (Control Systems), M.Tech. (Control & Instrumentation), B.E. (EE)',
    'PID Control, Fuzzy Logic, Industrial Automation',
    16,
    'Dr. Archana Patel specialises in intelligent control systems with 16 years of experience. She has developed laboratory setups for PLC and SCADA experiments widely used across central India.',
    'Control Systems, Industrial Automation, PLC & SCADA, Instrumentation'
  ),
  -- EC HOD
  (
    (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
    'Professor & Head of Department', 'Ph.D. (VLSI Design), M.Tech. (EC), B.E. (EC)',
    'VLSI Design, Embedded Systems, FPGA',
    22,
    'Dr. Shailendra Kumar Singh is a VLSI design expert with 22 years of experience. He is a Texas Instruments faculty associate and has designed curriculum for the TI Innovation Lab at SGSITS.',
    'VLSI Design, Embedded Systems, Digital Electronics, HDL Programming'
  ),
  -- EC Faculty
  (
    (SELECT id FROM users WHERE email='deepak.bhatt@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
    'Associate Professor', 'Ph.D. (Signal Processing), M.Tech. (EC), B.E. (EC)',
    'Digital Signal Processing, Image Processing, Communication Theory',
    18,
    'Dr. Deepak Bhatt is an expert in DSP and image processing with 18 years of experience. His work on compressed sensing for medical imaging has been published in Elsevier Signal Processing journals.',
    'Digital Signal Processing, Image Processing, Communication Engineering, Information Theory'
  ),
  -- MCA HOD
  (
    (SELECT id FROM users WHERE email='hod.mca@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='master-computer-applications'),
    'Professor & Head of Department', 'Ph.D. (CS), M.Tech. (CS), MCA, B.Sc. (CS)',
    'Distributed Computing, Cloud Architectures, Software Architecture',
    23,
    'Dr. Vandana Bhatt has 23 years of experience in computer applications education. She is a NASSCOM certified digital skills trainer and has guided over 40 MCA projects with industry collaboration.',
    'Software Architecture, Cloud Computing, Advanced Java, Mobile Application Development'
  ),
  -- MBA HOD
  (
    (SELECT id FROM users WHERE email='hod.mba@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='master-business-administration'),
    'Professor & Head of Department', 'Ph.D. (Management), MBA (Finance & Strategy), B.Com.',
    'Strategic Management, Financial Analysis, Corporate Governance',
    24,
    'Dr. Sanjay Sharma has 24 years of experience in management education. He is a certified independent director on the board of two Indore-based listed companies and has been a Fulbright visiting faculty at University of Colorado.',
    'Strategic Management, Corporate Finance, Business Analytics, Organisational Behaviour'
  )
ON DUPLICATE KEY UPDATE
  designation=VALUES(designation), qualification=VALUES(qualification),
  specialization=VALUES(specialization), experience=VALUES(experience),
  bio=VALUES(bio), subjects=VALUES(subjects);

-- ─── 2. Faculty Qualifications ────────────────────────────────────────────────
INSERT INTO faculty_qualifications (faculty_id, degree, institution, year, specialization)
SELECT fp.id, q.degree, q.institution, q.year, q.spec
FROM faculty_profiles fp
JOIN users u ON u.id = fp.user_id
JOIN (
  SELECT 'hod.ce@sgsits.ac.in' em, 'Ph.D.' degree, 'IIT Bombay' institution, 2001 year, 'Machine Learning & Data Mining' spec UNION ALL
  SELECT 'hod.ce@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1994, 'Computer Science' UNION ALL
  SELECT 'hod.ce@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1992, 'Computer Engineering' UNION ALL

  SELECT 'nisha.thakur@sgsits.ac.in', 'Ph.D.', 'DAVV Indore', 2010, 'Deep Learning' UNION ALL
  SELECT 'nisha.thakur@sgsits.ac.in', 'M.Tech.', 'IIT Indore', 2005, 'Software Engineering' UNION ALL
  SELECT 'nisha.thakur@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 2003, 'Computer Engineering' UNION ALL

  SELECT 'amit.soni@sgsits.ac.in', 'M.Tech.', 'MANIT Bhopal', 2014, 'Computer Science' UNION ALL
  SELECT 'amit.soni@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 2012, 'Computer Engineering' UNION ALL

  SELECT 'seema.rathore@sgsits.ac.in', 'Ph.D.', 'DAVV Indore', 2008, 'Network Security' UNION ALL
  SELECT 'seema.rathore@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 2003, 'Networking' UNION ALL
  SELECT 'seema.rathore@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 2001, 'Computer Engineering' UNION ALL

  SELECT 'hod.it@sgsits.ac.in', 'Ph.D.', 'IIT Roorkee', 2003, 'Software Engineering' UNION ALL
  SELECT 'hod.it@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1998, 'Computer Science' UNION ALL
  SELECT 'hod.it@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1996, 'Information Technology' UNION ALL

  SELECT 'pooja.chouhan@sgsits.ac.in', 'Ph.D.', 'DAVV Indore', 2012, 'Machine Learning' UNION ALL
  SELECT 'pooja.chouhan@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 2008, 'Information Technology' UNION ALL
  SELECT 'pooja.chouhan@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 2006, 'Computer Engineering' UNION ALL

  SELECT 'hod.me@sgsits.ac.in', 'Ph.D.', 'IIT Delhi', 1998, 'Thermal Engineering' UNION ALL
  SELECT 'hod.me@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1992, 'Mechanical Engineering' UNION ALL
  SELECT 'hod.me@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1990, 'Mechanical Engineering' UNION ALL

  SELECT 'hod.civil@sgsits.ac.in', 'Ph.D.', 'VNIT Nagpur', 2000, 'Structural Engineering' UNION ALL
  SELECT 'hod.civil@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1994, 'Civil Engineering' UNION ALL
  SELECT 'hod.civil@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1992, 'Civil Engineering' UNION ALL

  SELECT 'hod.ee@sgsits.ac.in', 'Ph.D.', 'IIT Kanpur', 1999, 'Power Systems' UNION ALL
  SELECT 'hod.ee@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1993, 'Power Systems' UNION ALL
  SELECT 'hod.ee@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1991, 'Electrical Engineering' UNION ALL

  SELECT 'hod.ec@sgsits.ac.in', 'Ph.D.', 'IIT Kharagpur', 2004, 'VLSI Design' UNION ALL
  SELECT 'hod.ec@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 1999, 'Electronics & Communication' UNION ALL
  SELECT 'hod.ec@sgsits.ac.in', 'B.E.', 'SGSITS Indore', 1997, 'Electronics & Telecommunication' UNION ALL

  SELECT 'hod.mca@sgsits.ac.in', 'Ph.D.', 'DAVV Indore', 2006, 'Distributed Computing' UNION ALL
  SELECT 'hod.mca@sgsits.ac.in', 'M.Tech.', 'SGSITS Indore', 2001, 'Computer Science' UNION ALL
  SELECT 'hod.mca@sgsits.ac.in', 'MCA', 'SGSITS Indore', 1998, 'Computer Applications' UNION ALL

  SELECT 'hod.mba@sgsits.ac.in', 'Ph.D.', 'DAVV Indore', 2004, 'Strategic Management' UNION ALL
  SELECT 'hod.mba@sgsits.ac.in', 'MBA', 'IIM Indore', 1998, 'Finance & Strategy' UNION ALL
  SELECT 'hod.mba@sgsits.ac.in', 'B.Com.', 'Holkar Science College', 1996, 'Commerce'
) q ON u.email = q.em;

-- ─── 3. Faculty Publications ──────────────────────────────────────────────────
INSERT INTO faculty_publications
  (faculty_id, title, venue_type, journal_name, publication_year, authors, link, citations, status)
SELECT fp.id, p.title, p.venue_type, p.journal_name, p.pub_year, p.authors, p.link, p.citations, 'PUBLISHED'
FROM faculty_profiles fp
JOIN users u ON u.id = fp.user_id
JOIN (
  SELECT 'hod.ce@sgsits.ac.in' em,
    'A Hybrid Deep Learning Framework for Intrusion Detection in IoT Networks' title,
    'Journal' venue_type,
    'IEEE Transactions on Neural Networks and Learning Systems' journal_name,
    2023 pub_year,
    'Khunteta A., Nisha T., Singh S.' authors,
    'https://doi.org/10.1109/TNNLS.2023.001' link,
    42 citations
  UNION ALL
  SELECT 'hod.ce@sgsits.ac.in',
    'Optimised Federated Learning for Resource-Constrained Edge Devices',
    'Journal', 'Future Generation Computer Systems — Elsevier', 2022,
    'Khunteta A., Patel K.', 'https://doi.org/10.1016/j.future.2022.012', 28
  UNION ALL
  SELECT 'hod.ce@sgsits.ac.in',
    'Data Mining Techniques in Educational Analytics: A Systematic Review',
    'Journal', 'Expert Systems with Applications — Elsevier', 2021,
    'Khunteta A., Rathore S.', 'https://doi.org/10.1016/j.eswa.2021.045', 55
  UNION ALL
  SELECT 'nisha.thakur@sgsits.ac.in',
    'Plant Disease Detection Using Convolutional Neural Network with Transfer Learning',
    'Journal', 'Computers and Electronics in Agriculture', 2023,
    'Thakur N., Sharma V.', 'https://doi.org/10.1016/j.compag.2023.007', 31
  UNION ALL
  SELECT 'nisha.thakur@sgsits.ac.in',
    'Lightweight CNN Architecture for Real-Time Object Detection on Embedded Systems',
    'Conference', 'IEEE CVPR Workshop 2022', 2022,
    'Thakur N., Soni A.', 'https://doi.org/10.1109/CVPR2022.0234', 18
  UNION ALL
  SELECT 'seema.rathore@sgsits.ac.in',
    'Blockchain-Based Academic Credential Verification System for Indian Universities',
    'Journal', 'Journal of Information Security and Applications — Elsevier', 2023,
    'Rathore S., Khunteta A.', 'https://doi.org/10.1016/j.jisa.2023.103', 23
  UNION ALL
  SELECT 'seema.rathore@sgsits.ac.in',
    'Lightweight Post-Quantum Cryptography for Constrained Devices',
    'Conference', 'IEEE International Conference on Cryptography 2022', 2022,
    'Rathore S., Dubey M.', 'https://doi.org/10.1109/ICC2022.01', 12
  UNION ALL
  SELECT 'pooja.chouhan@sgsits.ac.in',
    'Predictive Modelling of Chronic Kidney Disease Using Ensemble Machine Learning',
    'Journal', 'IEEE Transactions on Biomedical Engineering', 2023,
    'Chouhan P., Jain K., Singh A.', 'https://doi.org/10.1109/TBME.2023.004', 37
  UNION ALL
  SELECT 'anjali.singh.it@sgsits.ac.in',
    'Sentiment Analysis of Hindi Social Media Text Using Transformer Models',
    'Journal', 'ACM Transactions on Asian Language Information Processing', 2022,
    'Singh A., Chouhan P.', 'https://doi.org/10.1145/TALIP.2022.01', 29
  UNION ALL
  SELECT 'hod.me@sgsits.ac.in',
    'CFD Analysis of Heat Transfer Enhancement in Solar Flat Plate Collectors',
    'Journal', 'Solar Energy — Elsevier', 2023,
    'Kasande P., Joshi N.', 'https://doi.org/10.1016/j.solener.2023.015', 19
  UNION ALL
  SELECT 'rakesh.chouksey@sgsits.ac.in',
    'Mechanical Properties of Carbon Fibre Reinforced Polymer Composites Made by FDM',
    'Journal', 'Composites Part A: Applied Science and Manufacturing', 2022,
    'Chouksey R., Agrawal A.', 'https://doi.org/10.1016/j.compositesa.2022.023', 24
  UNION ALL
  SELECT 'hod.civil@sgsits.ac.in',
    'Seismic Performance Evaluation of RC Buildings with Soft Storey using Pushover Analysis',
    'Journal', 'Structures — Elsevier', 2023,
    'Bajpai Y.K., Agrawal M.', 'https://doi.org/10.1016/j.istruc.2023.009', 16
  UNION ALL
  SELECT 'hod.ee@sgsits.ac.in',
    'Dynamic Voltage Stability Assessment of Smart Grid with High Penetration of Renewables',
    'Journal', 'Electric Power Systems Research — Elsevier', 2022,
    'Jain M.K., Patel A.', 'https://doi.org/10.1016/j.epsr.2022.018', 22
  UNION ALL
  SELECT 'hod.ec@sgsits.ac.in',
    'Low-Power SRAM Design for 7nm FinFET Technology Using VLSI CAD Tools',
    'Journal', 'Integration, the VLSI Journal — Elsevier', 2023,
    'Singh S.K., Bhatt D.', 'https://doi.org/10.1016/j.vlsi.2023.007', 15
  UNION ALL
  SELECT 'deepak.bhatt@sgsits.ac.in',
    'Compressive Sensing for MRI Reconstruction Using Sparse Bayesian Learning',
    'Journal', 'Signal Processing — Elsevier', 2022,
    'Bhatt D., Singh S.K.', 'https://doi.org/10.1016/j.sigpro.2022.031', 20
) p ON u.email = p.em;

-- ─── 4. Faculty Research Projects ────────────────────────────────────────────
INSERT INTO faculty_research
  (faculty_id, title, research_area, description, start_year, end_year, status, funding_agency, funding_amount)
SELECT fp.id, r.title, r.area, r.description, r.start_year, r.end_year, r.status, r.agency, r.amount
FROM faculty_profiles fp
JOIN users u ON u.id = fp.user_id
JOIN (
  SELECT 'hod.ce@sgsits.ac.in' em,
    'Privacy-Preserving Federated Learning for Healthcare Data' title,
    'Machine Learning & Privacy' area,
    'Development of federated learning algorithms that preserve patient data privacy while enabling collaborative model training across hospitals.' description,
    2022 start_year, 2025 end_year, 'Ongoing' status,
    'DST — Science & Engineering Research Board' agency,
    2500000.00 amount
  UNION ALL
  SELECT 'nisha.thakur@sgsits.ac.in',
    'Automated Crop Disease Detection using Multispectral Drone Imagery',
    'Computer Vision & Agriculture',
    'Building an end-to-end pipeline for real-time crop disease identification using UAV-mounted multispectral cameras and CNN-based classification.',
    2023, 2026, 'Ongoing',
    'ICAR — Indian Council of Agricultural Research', 1800000.00
  UNION ALL
  SELECT 'seema.rathore@sgsits.ac.in',
    'Quantum-Resistant Digital Identity Framework for Indian e-Governance',
    'Cryptography & Security',
    'Designing a post-quantum cryptography-based identity system compatible with India\'s Aadhaar infrastructure.',
    2022, 2025, 'Ongoing', 'MeitY — Ministry of Electronics & IT', 3200000.00
  UNION ALL
  SELECT 'hod.me@sgsits.ac.in',
    'Development of Phase Change Material Based Thermal Energy Storage for Solar Cooking',
    'Renewable Energy & Thermal Storage',
    'Experimental investigation and numerical simulation of PCM-based latent heat thermal energy storage integrated with a solar cooker for rural communities.',
    2021, 2024, 'Ongoing', 'MNRE — Ministry of New & Renewable Energy', 1500000.00
  UNION ALL
  SELECT 'hod.civil@sgsits.ac.in',
    'Seismic Vulnerability Assessment of Heritage Buildings in Indore',
    'Earthquake Engineering & Heritage Conservation',
    'Field investigation and analytical study of structural vulnerability of pre-independence era heritage buildings in Indore using non-destructive testing methods.',
    2022, 2024, 'Ongoing', 'MPCOST — MP Council of Science & Technology', 900000.00
  UNION ALL
  SELECT 'hod.ee@sgsits.ac.in',
    'Optimal Integration of Battery Energy Storage Systems in Distribution Network',
    'Smart Grid & Energy Storage',
    'Multi-objective optimisation of BESS placement and sizing in an active distribution network with high DER penetration.',
    2021, 2024, 'Ongoing', 'MPCOST — MP Council of Science & Technology', 1200000.00
  UNION ALL
  SELECT 'hod.ec@sgsits.ac.in',
    'FPGA Implementation of Post-Quantum Cryptographic Algorithms',
    'Hardware Security & VLSI',
    'High-speed hardware implementation of CRYSTALS-Kyber and CRYSTALS-Dilithium on Xilinx Virtex FPGA platforms with power analysis.',
    2023, 2026, 'Ongoing', 'DST — Science & Engineering Research Board', 2800000.00
  UNION ALL
  SELECT 'pooja.chouhan@sgsits.ac.in',
    'Early Warning System for Non-Communicable Diseases using Wearable IoT Data',
    'Health Informatics & IoT',
    'Developing ML-driven predictive models for cardiovascular and diabetes risk using continuous wearable sensor streams.',
    2022, 2025, 'Ongoing', 'ICMR — Indian Council of Medical Research', 2100000.00
) r ON u.email = r.em;

SET foreign_key_checks = 1;
