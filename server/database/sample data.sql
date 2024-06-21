INSERT INTO department (department_code, department_name) VALUES
('EEE', 'Electrical and Electronic Engineering'),
('TIE', 'Telecommunication and Information Engineering'),
('MEC', 'Mechatronic Engineering'),
('CS', 'Computer Science'),
('STAT', 'Mathematics and Statistics'),
('CHEM', 'Chemistry');

INSERT INTO course (course_name, department_id) VALUES
('Bachelor of Science in Electrical and Electronic Engineering', 1),
('Bachelor of Science in Telecommunication and Information Engineering', 2),
('Bachelor of Science in Mechatronic Engineering', 3),
('Bachelor of Education in Technology (Electrical and Electronic Engineering)', 1),
('Bachelor of Science in Computer Science', 4),
('Bachelor of Science in Information Technology', 4),
('Bachelor of Business Information Technology', 4),
('Bachelor of Science in Statistics', 5),
('Bachelor of Science in Mathematics',5),
('Bachelor of Science in Chemistry', 6);

INSERT INTO lecturer (staff_no, first_name, last_name, user_name, password, phone_number, email_address, department_id, preferred_days) VALUES
('DS-L001', 'John', 'Mwangi', 'john.mwangi', 'password123', '+254712345678', 'john.mwangi@yahoo.com', 1, 'Monday, Wednesday, Friday'),
('DS-L002', 'Abdul', 'Rahman', 'abdul.rahman', 'password123', '+971123456789', 'abdul.rahman@dkut.ac.ke', 6, 'Monday, Thursday'),
('DS-L003', 'Peter', 'Wachira', 'peter.wachira', 'password123', '+254734567890', 'peter.wachira@gmail.com', 3, 'Monday, Wednesday'),
('DS-L004', 'Linda', 'Odhiambo', 'linda.odhiambo', 'password123', '+254745678901', 'linda.odhiambo@hotmail.com', 4, 'Tuesday, Thursday'),
('DS-L005', 'Olga', 'Ivanova', 'olga.ivanova', 'password123', '+74991234567', 'olga.ivanova@hotmail.com', 5, 'Wednesday, Friday'),
('DS-L006', 'Faith', 'Omondi', 'faith.omondi', 'password123', '+254767890123', 'faith.omondi@academia.com', 6, 'Monday, Thursday'),
('DS-L007', 'Brian', 'Musyoka', 'brian.musyoka', 'password123', '+254778901234', 'brian.musyoka@ameritech.ke', 7, 'Tuesday, Friday'),
('DS-L008', 'Mikhail', 'Sokolov', 'mikhail.sokolov', 'password123', '+74957654321', 'mikhail.sokolov@yahoo.com', 9, 'Tuesday, Thursday'),
('DS-L009', 'Charles', 'Owiti', 'charles.owiti', 'password123', '+254790123456', 'charles.owiti@googlemail.com', 9, 'Tuesday, Thursday'),
('DS-L010', 'Amina', 'Ali', 'amina.ali', 'password123', '+254701234567', 'amina.ali@hotmail.com', 10, 'Wednesday, Friday'),
('DS-L011', 'Michael', 'Andersen', 'michael.andersen', 'password123', '+4523456789', 'michael.andersen@yahoo.com', 1, 'Monday, Wednesday, Friday'),
('DS-L012', 'Sophie', 'Martinez', 'sophie.martinez', 'password123', '+34612345678', 'sophie.martinez@ameritech.ke', 2, 'Tuesday, Thursday'),
('DS-L013', 'Grace', 'Kimani', 'grace.kimani', 'password123', '+254723456789', 'grace.kimani@googlemail.com', 2, 'Tuesday, Thursday'),
('DS-L014', 'Chen', 'Li', 'chen.li', 'password123', '+861234567890', 'chen.li@academia.com', 3, 'Monday, Wednesday'),
('DS-L015', 'Juan', 'Rodriguez', 'juan.rodriguez', 'password123', '+529876543210', 'juan.rodriguez@dkut.ac.ke', 4, 'Tuesday, Thursday'),
('DS-L016', 'David', 'Kiptoo', 'david.kiptoo', 'password123', '+254756789012', 'david.kiptoo@dkut.ac.ke', 5, 'Wednesday, Friday'),
('DS-L017', 'Yuki', 'Tanaka', 'yuki.tanaka', 'password123', '+819012345678', 'yuki.tanaka@ameritech.ke', 7, 'Tuesday, Friday'),
('DS-L018', 'Elena', 'Petrova', 'elena.petrova', 'password123', '+74951234567', 'elena.petrova@googlemail.com', 8, 'Monday, Wednesday, Friday'),
('DS-L019', 'Sandra', 'Nyambura', 'sandra.nyambura', 'password123', '+254789012345', 'sandra.nyambura@yahoo.com', 8, 'Monday, Wednesday, Friday'),
('DS-L020', 'Aya', 'Kawasaki', 'aya.kawasaki', 'password123', '+81345678901', 'aya.kawasaki@gmail.com', 10, 'Wednesday, Friday');


INSERT INTO room (room_num, room_name, room_type, room_capacity) VALUES
('BCW01', 'Chemistry Lab', 'Laboratory', 30),
('RC02', 'Computer Lab', 'Laboratory', 40),
('RB03', 'Physics Lab', 'Laboratory', 25),
('BCW04', 'Statistics Lab', 'Laboratory', 35),
('RC05', 'Machine Shop', 'Workshop', 20),
('RB06', 'Math Classroom', 'Classroom', 50),
('BCW07', 'Programming Lab', 'Laboratory', 30),
('RC08', 'Electronics Lab', 'Laboratory', 35),
('RB09', 'Mechatronics Lab', 'Laboratory', 25),
('BCW10', 'Design Studio', 'Workshop', 15),
('RC11', 'Network Lab', 'Laboratory', 30),
('RB12', 'Robotics Lab', 'Laboratory', 25),
('BCW13', 'Business Computing Lab', 'Laboratory', 40),
('RC14', 'Data Science Lab', 'Laboratory', 35),
('RB15', 'AI Workshop', 'Workshop', 20),
('BCW16', 'Telecom Lab', 'Laboratory', 30),
('RC17', 'Renewable Energy Lab', 'Laboratory', 25),
('RB18', 'Chemical Lab', 'Laboratory', 35),
('BCW19', 'Digital Marketing Lab', 'Laboratory', 30),
('RC20', 'Microprocessor Lab', 'Laboratory', 25);


-- Subjects for Bachelor of Science in Electrical and Electronic Engineering
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('EEE101', 'Introduction to Electrical Engineering', 1, 1),
('EEE102', 'Circuit Analysis', 1, 1),
('EEE201', 'Digital Electronics', 1, 1),
('EEE202', 'Signals and Systems', 0, 1),
('EEE301', 'Power Systems', 1, 1),
('EEE302', 'Control Systems', 1, 1),
('EEE401', 'Communication Systems', 1, 1),
('EEE402', 'Power Electronics', 1, 1),
('EEE501', 'Renewable Energy', 1, 1),
('EEE502', 'VLSI Design', 1, 1);

-- Subjects for Bachelor of Science in Telecommunication and Information Engineering
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('TIE101', 'Introduction to Telecommunication Engineering', 1, 2),
('TIE102', 'Analog and Digital Communication', 1, 2),
('TIE201', 'Wireless Communication', 1, 2),
('TIE202', 'Network Protocols', 0, 2),
('TIE301', 'Mobile Communication', 1, 2),
('TIE302', 'Satellite Communication', 1, 2),
('TIE401', 'Information Theory', 1, 2),
('TIE402', 'Optical Communication', 1, 2),
('TIE501', 'Internet of Things', 1, 2),
('TIE502', '5G Technology', 1, 2);

-- Subjects for Bachelor of Science in Mechatronic Engineering
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('ME101', 'Introduction to Mechatronics', 1, 3),
('ME102', 'Mechanical Systems', 1, 3),
('ME201', 'Control Systems in Mechatronics', 1, 3),
('ME202', 'Digital Control Systems', 0, 3),
('ME301', 'Robotics', 1, 3),
('ME302', 'Sensors and Instrumentation', 1, 3),
('ME401', 'Automated Manufacturing Systems', 1, 3),
('ME402', 'Hydraulic and Pneumatic Systems', 1, 3),
('ME501', 'Mechatronic Design', 1, 3),
('ME502', 'Embedded Systems', 1, 3);

-- Subjects for Bachelor of Education in Technology (Electrical and Electronic Engineering)
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('EDU101', 'Introduction to Teaching Technology', 0, 4),
('EDU102', 'Educational Psychology', 0, 4),
('EDU201', 'Curriculum Development', 0, 4),
('EDU202', 'Teaching Methods in Technology', 1, 4),
('EDU301', 'Assessment and Evaluation', 0, 4),
('EDU302', 'Classroom Management', 0, 4),
('EDU401', 'ICT in Education', 1, 4),
('EDU402', 'Technology Integration in Teaching', 1, 4),
('EDU501', 'Professional Development for Technology Teachers', 0, 4),
('EDU502', 'Practicum in Technology Teaching', 1, 4);

-- Subjects for Bachelor of Science in Computer Science
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('CS101', 'Introduction to Computer Science', 1, 5),
('CS102', 'Programming Fundamentals', 1, 5),
('CS201', 'Data Structures and Algorithms', 1, 5),
('CS202', 'Database Management Systems', 1, 5),
('CS301', 'Operating Systems', 0, 5),
('CS302', 'Computer Networks', 1, 5),
('CS401', 'Software Engineering', 1, 5),
('CS402', 'Artificial Intelligence', 1, 5),
('CS501', 'Web Development', 1, 5),
('CS502', 'Cybersecurity', 1, 5);

-- Subjects for Bachelor of Science in Information Technology
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('IT101', 'Introduction to Information Technology', 1, 6),
('IT102', 'IT Infrastructure', 1, 6),
('IT201', 'Systems Analysis and Design', 1, 6),
('IT202', 'Database Systems', 1, 6),
('IT301', 'Network Security', 1, 6),
('IT302', 'Mobile App Development', 1, 6),
('IT401', 'Cloud Computing', 1, 6),
('IT402', 'Data Science', 1, 6),
('IT501', 'E-Commerce', 1, 6),
('IT502', 'IT Project Management', 1, 6);

-- Subjects for Bachelor of Business Information Technology
INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES
('BIT101', 'Introduction to Business IT', 0, 7),
('BIT102', 'Business Communication', 0, 7),
('BIT201', 'Business Analytics', 1, 7),
('BIT202', 'Enterprise Resource Planning', 1, 7),
('BIT301', 'IT Governance and Compliance', 0, 7),
('BIT302', 'Business Process Management', 1, 7),
('BIT401', 'Strategic IT Management', 0, 7),
('BIT402', 'Business Intelligence', 1, 7),
('BIT501', 'IT Ethics and Social Responsibility', 0, 7),
('BIT502', 'Capstone Project in Business IT', 1, 7);


-- Batches for Bachelor of Science in Electrical and Electronic Engineering
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('EEE1.1', 'Electrical Eng. 1.1', 1, 1, 1),
    ('EEE1.2', 'Electrical Eng. 1.2', 1, 1, 2),
    ('EEE2.1', 'Electrical Eng. 2.1', 1, 2, 1),
    ('EEE2.2', 'Electrical Eng. 2.2', 1, 2, 2),
    ('EEE3.1', 'Electrical Eng. 3.1', 1, 3, 1),
    ('EEE3.2', 'Electrical Eng. 3.2', 1, 3, 2),
    ('EEE4.1', 'Electrical Eng. 4.1', 1, 4, 1),
    ('EEE4.2', 'Electrical Eng. 4.2', 1, 4, 2),
    ('EEE5.1', 'Electrical Eng. 5.1', 1, 5, 1),
    ('EEE5.2', 'Electrical Eng. 5.2', 1, 5, 2);
-- Batches for Bachelor of Science in Telecommunication and Information Engineering
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('TIE1.1', 'Telecom. Eng. 1.1', 2, 1, 1),
    ('TIE1.2', 'Telecom. Eng. 1.2', 2, 1, 2),
    ('TIE2.1', 'Telecom. Eng. 2.1', 2, 2, 1),
    ('TIE2.2', 'Telecom. Eng. 2.2', 2, 2, 2),
    ('TIE3.1', 'Telecom. Eng. 3.1', 2, 3, 1),
    ('TIE3.2', 'Telecom. Eng. 3.2', 2, 3, 2),
    ('TIE4.1', 'Telecom. Eng. 4.1', 2, 4, 1),
    ('TIE4.2', 'Telecom. Eng. 4.2', 2, 4, 2),
    ('TIE5.1', 'Telecom. Eng. 5.1', 2, 5, 1),
    ('TIE5.2', 'Telecom. Eng. 5.2', 2, 5, 2);
-- Batches for Bachelor of Science in Mechatronic Engineering
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('ME1.1', 'Mechatronic Eng. 1.1', 3, 1, 1),
    ('ME1.2', 'Mechatronic Eng. 1.2', 3, 1, 2),
    ('ME2.1', 'Mechatronic Eng. 2.1', 3, 2, 1),
    ('ME2.2', 'Mechatronic Eng. 2.2', 3, 2, 2),
    ('ME3.1', 'Mechatronic Eng. 3.1', 3, 3, 1),
    ('ME3.2', 'Mechatronic Eng. 3.2', 3, 3, 2),
    ('ME4.1', 'Mechatronic Eng. 4.1', 3, 4, 1),
    ('ME4.2', 'Mechatronic Eng. 4.2', 3, 4, 2),
    ('ME5.1', 'Mechatronic Eng. 5.1', 3, 5, 1),
    ('ME5.2', 'Mechatronic Eng. 5.2', 3, 5, 2);
-- Batches for Bachelor of Education in Technology (Electrical and Electronic Engineering)
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('EDU1.1', 'Tech. Ed. 1.1', 4, 1, 1),
    ('EDU1.2', 'Tech. Ed. 1.2', 4, 1, 2),
    ('EDU2.1', 'Tech. Ed. 2.1', 4, 2, 1),
    ('EDU2.2', 'Tech. Ed. 2.2', 4, 2, 2),
    ('EDU3.1', 'Tech. Ed. 3.1', 4, 3, 1),
    ('EDU3.2', 'Tech. Ed. 3.2', 4, 3, 2),
    ('EDU4.1', 'Tech. Ed. 4.1', 4, 4, 1),
    ('EDU4.2', 'Tech. Ed. 4.2', 4, 4, 2),
    ('EDU5.1', 'Tech. Ed. 5.1', 4, 5, 1),
    ('EDU5.2', 'Tech. Ed. 5.2', 4, 5, 2);
-- Batches for Bachelor of Science in Computer Science
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('CS1.1', 'Comp. Sci. 1.1', 5, 1, 1),
    ('CS1.2', 'Comp. Sci. 1.2', 5, 1, 2),
    ('CS2.1', 'Comp. Sci. 2.1', 5, 2, 1),
    ('CS2.2', 'Comp. Sci. 2.2', 5, 2, 2),
    ('CS3.1', 'Comp. Sci. 3.1', 5, 3, 1),
    ('CS3.2', 'Comp. Sci. 3.2', 5, 3, 2),
    ('CS4.1', 'Comp. Sci. 4.1', 5, 4, 1),
    ('CS4.2', 'Comp. Sci. 4.2', 5, 4, 2),
    ('CS5.1', 'Comp. Sci. 5.1', 5, 5, 1),
    ('CS5.2', 'Comp. Sci. 5.2', 5, 5, 2);
-- Batches for Bachelor of Science in Information Technology
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('IT1.1', 'Info. Tech. 1.1', 6, 1, 1),
    ('IT1.2', 'Info. Tech. 1.2', 6, 1, 2),
    ('IT2.1', 'Info. Tech. 2.1', 6, 2, 1),
    ('IT2.2', 'Info. Tech. 2.2', 6, 2, 2),
    ('IT3.1', 'Info. Tech. 3.1', 6, 3, 1),
    ('IT3.2', 'Info. Tech. 3.2', 6, 3, 2),
    ('IT4.1', 'Info. Tech. 4.1', 6, 4, 1),
    ('IT4.2', 'Info. Tech. 4.2', 6, 4, 2),
    ('IT5.1', 'Info. Tech. 5.1', 6, 5, 1),
    ('IT5.2', 'Info. Tech. 5.2', 6, 5, 2);
-- Batches for Bachelor of Business Information Technology
INSERT INTO batch (batch_code,batch_name,course_id,year,semester) VALUES
    ('BIT1.1', 'Bus. IT 1.1', 7, 1, 1),
    ('BIT1.2', 'Bus. IT 1.2', 7, 1, 2),
    ('BIT2.1', 'Bus. IT 2.1', 7, 2, 1),
    ('BIT2.2', 'Bus. IT 2.2', 7, 2, 2),
    ('BIT3.1', 'Bus. IT 3.1', 7, 3, 1),
    ('BIT3.2', 'Bus. IT 3.2', 7, 3, 2),
    ('BIT4.1', 'Bus. IT 4.1', 7, 4, 1),
    ('BIT4.2', 'Bus. IT 4.2', 7, 4, 2),
    ('BIT5.1', 'Bus. IT 5.1', 7, 5, 1),
    ('BIT5.2', 'Bus. IT 5.2', 7, 5, 2);