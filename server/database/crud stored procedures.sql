CREATE TABLE `class` (
  `class_id` int NOT NULL,
  `lecturer_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `subject_code` char(10) DEFAULT NULL,
  `room_num` char(10) DEFAULT NULL,
  `batch_code` char(10) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_of_week` char(10) DEFAULT NULL,
  PRIMARY KEY (`class_id`),
  CONSTRAINT `check_day_of_week` CHECK ((`day_of_week` in (_utf8mb4'Monday',_utf8mb4'Tuesday',_utf8mb4'Wednesday',_utf8mb4'Thursday',_utf8mb4'Friday'))),
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `department` (
  `department_id` int NOT NULL,
  `department_name` varchar(35) DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lecturer` (
  `lecturer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(35) DEFAULT NULL,
  `last_name` varchar(35) DEFAULT NULL,
  `user_name` varchar(35) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(25) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`lecturer_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `lecturer_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `room` (
  `room_num` char(10) NOT NULL,
  `room_name` varchar(35) DEFAULT NULL,
  `room_type` enum('Laboratory','Classroom','Workshop') DEFAULT NULL,
  `room_capacity` int NOT NULL,
  PRIMARY KEY (`room_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `subject` (
  `subject_code` char(10) NOT NULL,
  `subject_name` varchar(35) DEFAULT NULL,
  `has_lab` tinyint(1) DEFAULT '0',
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`subject_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `batch` (
  `batch_code` char(10) NOT NULL,
  `batch_name` varchar(100) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  PRIMARY KEY (`batch_code`),
  CONSTRAINT `batch_chk_1` CHECK (((`year` >= 1) and (`year` <= 5))),
  CONSTRAINT `batch_chk_2` CHECK (((`semester` >= 1) and (`semester` <= 3)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
