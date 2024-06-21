CREATE TABLE `batch` (
  `batch_id` int NOT NULL AUTO_INCREMENT,
  `batch_code` char(10) NOT NULL,
  `batch_name` varchar(100) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `batch_size` int DEFAULT NULL,
  PRIMARY KEY (`batch_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `batch_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `batch_chk_1` CHECK (((`year` >= 1) and (`year` <= 5))),
  CONSTRAINT `batch_chk_2` CHECK (((`semester` >= 1) and (`semester` <= 3)))
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `lecturer_staffno` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `subject_code` char(10) DEFAULT NULL,
  `room_num` char(10) DEFAULT NULL,
  `batch_code` char(10) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_of_week` char(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`class_id`),
  CONSTRAINT `end_time_check` CHECK ((`end_time` <= TIME'17:00:00')),
  CONSTRAINT `start_time_check` CHECK ((`start_time` >= TIME'08:00:00'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(35) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_code` varchar(10) DEFAULT NULL,
  `department_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `lecturer` (
  `lecturer_id` int NOT NULL AUTO_INCREMENT,
  `staff_no` varchar(35) DEFAULT NULL,
  `first_name` varchar(35) DEFAULT NULL,
  `last_name` varchar(35) DEFAULT NULL,
  `user_name` varchar(35) DEFAULT NULL,
  `password` varchar(255) DEFAULT 'PASSWORD123',
  `department_id` int DEFAULT NULL,
  `preferred_days` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`lecturer_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `lecturer_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_num` char(10) NOT NULL,
  `room_name` varchar(35) DEFAULT NULL,
  `room_type` enum('Laboratory','Classroom','Workshop') DEFAULT NULL,
  `room_capacity` int NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `subject` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_code` char(10) NOT NULL,
  `subject_name` varchar(35) DEFAULT NULL,
  `has_lab` tinyint(1) DEFAULT '0',
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`subject_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(80) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
   [role] BIT NOT NULL DEFAULT 0
  PRIMARY KEY (`user_id`),
  )ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


  CREATE TABLE batch_subject (
  batch_subject_id int NOT NULL AUTO_INCREMENT,
  batch_id int,
  subject_id int,
  PRIMARY KEY (batch_subject_id),
  KEY batch_id (batch_id),
  KEY subject_id (subject_id),
  CONSTRAINT subject_batch_ibfk_1 FOREIGN KEY (batch_id) REFERENCES batch (batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT subject_batch_ibfk_2 FOREIGN KEY (subject_id) REFERENCES subject (subject_id) ON DELETE CASCADE ON UPDATE CASCADE
);
