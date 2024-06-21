
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_batch`(IN p_batch_code CHAR(10), IN p_batch_name VARCHAR(100), IN p_course_id INT, IN p_year INT, IN p_semester INT, IN p_batch_size INT)
BEGIN
  INSERT INTO batch (batch_code, batch_name, course_id, year, semester, batch_size) VALUES (p_batch_code, p_batch_name, p_course_id, p_year, p_semester, p_batch_size);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_class`(IN p_lecturer_staffno INT, IN p_course_id INT, IN p_subject_code CHAR(10), IN p_room_num CHAR(10), IN p_batch_code CHAR(10), IN p_start_time TIME, IN p_end_time TIME, IN p_day_of_week CHAR(10))
BEGIN
  INSERT INTO class (lecturer_staffno, course_id, subject_code, room_num, batch_code, start_time, end_time, day_of_week) VALUES (p_lecturer_staffno, p_course_id, p_subject_code, p_room_num, p_batch_code, p_start_time, p_end_time, p_day_of_week);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_course`(IN p_course_name VARCHAR(35), IN p_department_id INT)
BEGIN
  INSERT INTO course (course_name, department_id) VALUES (p_course_name, p_department_id);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_department`( IN p_department_code varchar(10), IN p_department_name VARCHAR(100))
BEGIN
INSERT INTO department (department_code, department_name)
VALUES (p_department_code, p_department_name);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_lecturer`(
	IN p_staff_no varchar(35), IN p_first_name VARCHAR(255), IN p_last_name VARCHAR(255), IN p_user_name VARCHAR(255),
  IN p_department_id INT, IN p_preferred_days VARCHAR(255)
)
BEGIN
INSERT INTO lecturer (
	staff_no, first_name, last_name, user_name, department_id, preferred_days
)
VALUES (
	p_staff_no, p_first_name, p_last_name, p_user_name, p_department_id,p_preferred_days
);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_room`(IN p_room_num CHAR(60), IN p_room_name VARCHAR(80), IN p_room_type ENUM('Laboratory', 'Classroom', 'Workshop'), IN p_room_capacity INT)
BEGIN
  INSERT INTO room (room_num, room_name, room_type, room_capacity) VALUES (p_room_num, p_room_name, p_room_type, p_room_capacity);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_subject`(IN p_subject_code CHAR(10), IN p_subject_name VARCHAR(35), IN p_has_lab BOOLEAN, IN p_course_id INT)
BEGIN
  INSERT INTO subject (subject_code, subject_name, has_lab, course_id) VALUES (p_subject_code, p_subject_name, p_has_lab, p_course_id);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_batch_schedule`(IN batch_code CHAR(10))
BEGIN
    SELECT
        day_of_week,
        start_time,
        end_time,
        room.room_num,
        CASE
            WHEN TIMESTAMPDIFF(HOUR, start_time, end_time) = 3 THEN CONCAT(subject_name, ' (lab)')
            ELSE subject_name
        END AS subject_name
    FROM class
    INNER JOIN room ON class.room_num = room.room_num
    INNER JOIN course ON class.course_id = course.course_id
    INNER JOIN subject ON class.subject_code = subject.subject_code
    WHERE class.batch_code = batch_code
    ORDER BY day_of_week ASC, start_time;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_batch`(IN batchId INT)
BEGIN
  DELETE FROM batch WHERE batch_id = batchId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_class`(IN classId INT)
BEGIN
  DELETE FROM class WHERE class_id = classId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_course`(IN courseId INT)
BEGIN
  DELETE FROM course WHERE course_id = courseId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_department`(IN departmentId INT)
BEGIN
  DELETE FROM department WHERE department_id = departmentId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_lecturer`(IN lecturerId INT)
BEGIN
  DELETE FROM lecturer WHERE lecturer_id = lecturerId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_room`(IN roomId INT)
BEGIN
  DELETE FROM room WHERE room_id = roomId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_subject`(IN subjectId INT)
BEGIN
  DELETE FROM subject WHERE subject_ID = subjectId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_department_schedule`(IN Usr_dpt_name VARCHAR(35))
BEGIN
    DECLARE new_department_id INT;
    
    -- Get the department_id for the provided department_name
    SELECT department_id INTO new_department_id
    FROM department
    WHERE department_name = Usr_dpt_name
    LIMIT 1;
    
    IF new_department_id IS NOT NULL THEN
        SELECT
            day_of_week,
            start_time,
            end_time,
            room.room_name,
            lecturer.first_name,
            lecturer.last_name,
            course.course_name,
            subject.subject_name
        FROM class
        INNER JOIN room ON class.room_num = room.room_num
        INNER JOIN lecturer ON class.lecturer_id = lecturer.lecturer_id
        INNER JOIN course ON class.course_id = course.course_id
        INNER JOIN subject ON class.subject_code = subject.subject_code
        WHERE course.department_id = new_department_id
        ORDER BY day_of_week, start_time;
    ELSE
        -- Handle the case when the department is not found
        SELECT 'Department not found' AS Error;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_batches`()
BEGIN
  SELECT * FROM batch;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_classes`()
BEGIN
  SELECT * FROM class;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_courses`()
BEGIN
  SELECT * FROM course;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_departments`()
BEGIN
  SELECT * FROM department;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_lecturers`()
BEGIN
  SELECT * FROM lecturer;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_rooms`()
BEGIN
  SELECT * FROM room;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_subjects`()
BEGIN
  SELECT * FROM subject;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_batch_by_code`(IN batchCode CHAR(10))
BEGIN
  SELECT * FROM batch WHERE batch_code = batchCode;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_batch_details`()
BEGIN
    SELECT batch_code, course_id, year, semester FROM batch;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_class_by_Id`(IN classId INT)
BEGIN
  SELECT * FROM class WHERE class_id = classId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_class_subject_mapping`()
BEGIN
    SELECT class_id, subject_code FROM class;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_course_by_Id`(IN courseId INT)
BEGIN
  SELECT * FROM course WHERE course_id = courseId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_department_by_Id`(IN departmentId INT)
BEGIN
  SELECT * FROM department WHERE department_id = departmentId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_lecturer_by_Id`(IN lecturerId INT)
BEGIN 
  SELECT * FROM lecturer WHERE lecturer_id = lecturerId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_lecturer_departments`()
BEGIN
    SELECT lecturer_id, department_id FROM lecturer;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_lecturer_preferred_days`()
BEGIN
    SELECT lecturer_id, day_preferences FROM (
        SELECT lecturer_id, GROUP_CONCAT(day_of_week ORDER BY day_of_week) AS day_preferences
        FROM class
        GROUP BY lecturer_id
    ) AS preferred_days;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_num_batches`()
BEGIN
  SELECT COUNT(*) AS numBatches FROM batch;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_num_classes`()
BEGIN
  SELECT COUNT(*) AS numClasses FROM class;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_num_lecturers`()
BEGIN
  SELECT COUNT(*) AS numLecturers FROM lecturer;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_num_rooms`()
BEGIN
  SELECT COUNT(*) AS numRooms FROM room;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_room_by_id`(IN roomId CHAR(10))
BEGIN
  SELECT * FROM room WHERE room_id = roomId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_room_types_capacities`()
BEGIN
    SELECT room_num, room_type, room_capacity FROM room;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_subject_by_code`(IN subjectCode CHAR(10))
BEGIN
  SELECT * FROM subject WHERE subject_code = subjectCode;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_subject_information`()
BEGIN
    SELECT subject_code, course_id, has_lab FROM subject;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getdepartment_byid`(IN dept_id INT)
BEGIN
	SELECT department_name FROM department WHERE department_id = dept_id;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_lecturer_schedule`(IN lecturer_id INT)
BEGIN
    SELECT
        day_of_week,
        start_time,
        end_time,
        room.room_name,
        batch.batch_code,
        CASE
            WHEN TIMESTAMPDIFF(HOUR, start_time, end_time) = 3 THEN CONCAT(subject_name, ' (lab)')
            ELSE subject_name
        END AS subject_name
    FROM class
    INNER JOIN room ON class.room_num = room.room_num
    INNER JOIN batch ON class.batch_code = batch.batch_code
    INNER JOIN subject ON class.subject_code = subject.subject_code
    WHERE class.lecturer_staffno = lecturer_staffno
    ORDER BY day_of_week, start_time;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_room_schedule`(IN room_num CHAR(10))
BEGIN
    SELECT
        day_of_week,
        start_time,
        end_time,
        CONCAT(lecturer.first_name, ' ',lecturer.last_name) AS 'lecturer',
        course_name,
        batch_code,
        CASE
            WHEN TIMESTAMPDIFF(HOUR, start_time, end_time) = 3 THEN CONCAT(subject_name, ' (lab)')
            ELSE subject_name
        END AS subject_name
    FROM class
    INNER JOIN lecturer ON class.lecturer_id = lecturer.lecturer_id
    INNER JOIN course ON class.course_id = course.course_id
    INNER JOIN Subject ON class.subject_code = subject.subject_code
    WHERE class.room_num = room_num
    ORDER BY day_of_week, start_time;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_batch`(IN batchId INT, IN batchCode CHAR(10), IN batchName VARCHAR(100), IN courseId INT, IN year INT, IN semester INT, IN batchSize INT)
BEGIN
  UPDATE batch SET batch_code = batchCode, batch_name = batchName, course_id = courseId, year = year, semester = semester,batch_size = batch_size WHERE batch_id = batchId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_class`(IN classId INT, IN lecturerId INT, IN courseId INT, IN subjectCode CHAR(10), IN roomNum CHAR(10), IN batchCode CHAR(10), IN startTime TIME, IN endTime TIME, IN dayOfWeek CHAR(10))
BEGIN
  UPDATE class SET lecturer_id = lecturerId, course_id = courseId, subject_code = subjectCode, room_num = roomNum, batch_code = batchCode, start_time = startTime, end_time = endTime, day_of_week = dayOfWeek WHERE class_id = classId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_course`(IN courseId INT, IN courseName VARCHAR(100), IN departmentId INT)
BEGIN
  UPDATE course SET course_name = courseName, department_id = departmentId WHERE course_id = courseId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_department`(IN departmentId INT, IN departmentCode VARCHAR(10), IN departmentName VARCHAR(100))
BEGIN
  UPDATE department SET department_code = departmentCode, department_name = departmentName WHERE department_id = departmentId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_lecturer`( IN lecturerId INT, IN firstName VARCHAR(35), IN lastName VARCHAR(35), IN departmentID INT, IN preferredDays VARCHAR(255))
BEGIN
  UPDATE lecturer SET first_name = firstName, last_name = lastName, department_id = departmentID, preferred_days = preferredDays WHERE lecturer_id = lecturerId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_room`(IN roomId INT, IN roomNum CHAR(10), IN roomName VARCHAR(35), IN roomType ENUM('Laboratory', 'Classroom', 'Workshop'), IN roomCapacity INT)
BEGIN
  UPDATE room SET room_num = roomNum, room_name = roomName, room_type = roomType, room_capacity = roomCapacity WHERE room_id = roomId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_subject`(IN subjectId INT, IN subjectCode CHAR(10), IN subjectName VARCHAR(100), IN hasLab BOOLEAN, IN courseId INT)
BEGIN
  UPDATE subject SET subject_name = subjectName, has_lab = hasLab, course_id = courseId WHERE subject_id = subjectId;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verify_exists`(IN tableName VARCHAR(64), IN columnName VARCHAR(64), IN valueToCheck VARCHAR(64))
BEGIN
    SET @s = CONCAT('SELECT * FROM ', tableName, ' WHERE ', columnName, ' = \'', valueToCheck, '\'');
    PREPARE stmt FROM @s;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
      
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verify_staffnum_exists`(
  IN p_staff VARCHAR(255)
)
BEGIN
	SELECT *
    FROM lecturer
    WHERE staff_no = p_staff;
END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_all_users`()
BEGIN
  SELECT * FROM users;
END$$
DELIMITER ;

DELIMITER $$
CREATE  DEFINER=`root`@`localhost` PROCEDURE `sp_authenticate_user` (IN p_username VARCHAR(255), IN p_password VARCHAR(255))
BEGIN
    DECLARE user_count INT;
    
    -- Check if the user with the provided credentials exists
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE username = p_username AND password = p_password;
    
    -- Return the user if found
    IF user_count > 0 THEN
        SELECT *
        FROM users
        WHERE username = p_username AND password = p_password;
    ELSE
        SELECT NULL AS username, NULL AS role; -- Return null if user not found
    END IF;
END$$

DELIMITER ;
