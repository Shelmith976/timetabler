const { exec } = require("../helpers/db");
const Math = require("mathjs");

let data;
let generatedClass;

const getRoomDetails = (rooms) => {
	return rooms.reduce(
		(details, room) => {
			details.capacityMap[room.room_num] = room.room_capacity;
			details.typeMap[room.room_num] = room.room_type;
			return details;
		},
		{ capacityMap: {}, typeMap: {}, numRooms: rooms.length },
	);
};

const getBatchDetails = (batches) => {
	return batches.reduce(
		(details, batch) => {
			details.courseMap[batch.batch_code] = batch.course_id;
			details.yearSemesterMap[batch.batch_code] = [batch.year, batch.semester];
			details.batchSizeMap[batch.batch_code] = batch.batch_size;
			details.idCodeMap[batch.batch_id] = batch.batch_code;
			return details;
		},
		{
			courseMap: {},
			yearSemesterMap: {},
			batchSizeMap: {},
			idCodeMap: {},
			numBatches: batches.length,
		},
	);
};

const getLecturerDetails = (lecturers) => {
	return lecturers.reduce(
		(details, lecturer) => {
			details.staffNumMap[lecturer.lecturer_id] = lecturer.staff_no;
			details.daysMap[lecturer.staff_no] = lecturer.preferred_days.split(", ");
			details.departmentMap[lecturer.staff_no] = lecturer.department_id;
			return details;
		},
		{
			daysMap: {},
			departmentMap: {},
			staffNumMap: {},
			numLecturers: lecturers.length,
		},
	);
};

const getCourseDetails = (courses) => {
	return courses.reduce(
		(details, course) => {
			details.departmentMap[course.course_id] = course.department_id;
			return details;
		},
		{ departmentMap: {} },
	);
};

const getSubjectDetails = (subjects) => {
	return subjects.reduce(
		(details, subject) => {
			details.subjectMap[subject.subject_id] = subject.subject_code;
			details.courseMap[subject.subject_code] = subject.course_id;
			details.labMap[subject.subject_code] = subject.has_lab ? true : false;
			return details;
		},
		{ subjectMap: {}, courseMap: {}, labMap: {}, numSubjects: subjects.length },
	);
};

const getBatchSubjects = (batchsubjects, batchMap) => {
	return batchsubjects.reduce((map, batchsubject) => {
		const batchCode = batchMap[batchsubject.batch_id];
		if (!map[batchCode]) {
			map[batchCode] = [];
		}
		map[batchCode].push(batchsubject.subject_id);
		return map;
	}, {});
};

module.exports = {
	generateAndAddClass: async (req, res) => {
		try {
			const [rooms_response] = await exec("CALL sp_get_cs_rooms");
			const [lecturer_response] = await exec("CALL sp_get_cs_lecturers");
			const [batch_response] = await exec("CALL sp_get_cs_batches");
			const [subject_response] = await exec("CALL sp_get_cs_subjects");
			const [batch_subject_response] = await exec("CALL sp_get_cs_batch_subjects");

			const [course_response] = await exec("CALL sp_get_all_courses");

			const {
				capacityMap: roomCapacity,
				typeMap: roomType,
				numRooms,
			} = getRoomDetails(rooms_response);

			const {
				staffNumMap: lecturerStaffNum,
				daysMap: lecturerDays,
				departmentMap: lecturerDepartment,
				numLecturers,
			} = getLecturerDetails(lecturer_response);

			const {
				courseMap: batchCourse,
				yearSemesterMap: batchYearSemester,
				batchSizeMap,
				numBatches,
				idCodeMap,
			} = getBatchDetails(batch_response);

			const {
				subjectMap: classSubject,
				courseMap: subjectCourse,
				labMap: subjectLab,
				numSubjects,
			} = getSubjectDetails(subject_response);

			const { departmentMap: courseDepartment } =
				getCourseDetails(course_response);

			const batchSubjects = getBatchSubjects(batch_subject_response, idCodeMap);
			console.log(batchSubjects);

			data = {
				numClasses: 12,
				numRooms,
				numLecturers,
				numBatches,
				batchSizeMap,
				roomCapacity,
				roomType,
				classSubject,
				subjectCourse,
				courseDepartment,
				subjectLab,
				lecturerDepartment,
				lecturerDays,
				batchCourse,
				batchYearSemester,
				batchSubjects,
				lecturerStaffNum,
			};

			let totalSlots = 0;
			for (let batchCode in data.batchSizeMap) {
				const subjects = data.batchSubjects[batchCode];
				for (let subjectId of subjects) {
					const subjectCode = data.classSubject[subjectId];
					const hasLab = data.subjectLab[subjectCode];
					totalSlots += hasLab ? 2 : 1;
				}
			}

			data.numClasses = totalSlots;

			const rooms = generateMain(data);

			// Loop through the generated classes and add each one to the database
			for (let generatedClass of rooms) {
				const {
					staffno,
					subjectCode,
					roomNum,
					batchCode,
					startTime,
					endTime,
					dayOfWeek,
				} = generatedClass;

				console.log(generatedClass);

				const created_date = new Date().toISOString().split("T")[0];
				await exec("CALL sp_upsert_class(?,?,?,?,?,?,?,?)", [
					staffno,
					subjectCode,
					roomNum,
					batchCode,
					startTime,
					endTime,
					dayOfWeek,
					created_date,
				]);
			}
			res.status(200).json({
				status: 200,
				success: true,
				message: rooms,
			});
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},

	getClasses: async (req, res) => {
		try {
			const [response] = await exec("CALL sp_get_all_classes");
			return res.status(200).json({
				status: 200,
				success: true,
				data: response,
			});
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				status: 500,
				success: false,
				message: error.message,
			});
		}
	},
};

const options = {
	size: 100,
	crossover: 0.9,
	mutation: 0.1,
	iterations: 100,
	optimize: "maximize",
	select1: "roulette",
	select2: "roulette",
};

const generateMain = (data) => {
    const population = [];

    for (let i = 0; i < options.size; i++) {
        const solution = seed(data);
        population.push(solution);
    }

    let bestSolution = null;
    let bestFitness = null;

    for (let i = 0; i < options.iterations; i++) {
        const fitnessScores = [];

        for (let j = 0; j < population.length; j++) {
            const fitnessScore = fitness(population[j], data);
            fitnessScores.push(fitnessScore);

            bestSolution =
                bestSolution === null ||
                (options.optimize === "maximize" && fitnessScore > bestFitness) ||
                (options.optimize === "minimize" && fitnessScore < bestFitness)
                    ? population[j]
                    : bestSolution;
            bestFitness = bestSolution === population[j] ? fitnessScore : bestFitness;
        }

        const parents = selection(population, fitnessScores);

        const offspring = crossoverAll(parents);

        for (let j = 0; j < offspring.length; j++) {
            const mutatedOffspring = mutation(offspring[j]);
            const [improvedOffspring, improvedFitness] = localSearch(mutatedOffspring, data, bestFitness, bestSolution);
            population[j] = improvedOffspring;
            if (improvedFitness > bestFitness) {
                bestFitness = improvedFitness;
                bestSolution = improvedOffspring;
            }
        }
    }

    generatedClass = bestSolution;
    console.log(bestFitness);

    return generatedClass;
};
 



const seed = function () {
	const solution = [];
	let classId = 1;

	for (let batchCode in data.batchSizeMap) {
		const subjects = data.batchSubjects[batchCode];

		for (let subjectId of subjects) {
			const subjectCode = data.classSubject[subjectId];
			const hasLab = data.subjectLab[subjectCode];
			const subjectCourse = data.subjectCourse[subjectCode];
			const subjectDept = data.courseDepartment[subjectCourse];

			const staffno = assignLecturer(subjectDept, data.lecturerDepartment);

			// Generate normal class
			const normalClass = generateClass(
				classId++,
				batchCode,
				subjectCode,
				staffno,
				hasLab,
				false,
			);

			// Add normal class to the solution
			solution.push(normalClass);

			// Generate lab class if required
			if (hasLab) {
				const labClass = generateClass(classId++, batchCode, subjectCode, staffno, hasLab, true);
				solution.push(labClass);
			}
		}
	}
	return solution;
};

const generateClass = (classId, batchCode, subjectCode, staffno, hasLab, isLab = false, schedule) => {
    const roomNum = allocateRoom(
        batchCode,
        data.roomCapacity,
        data.batchSizeMap,
        data.roomType,
        isLab,
        schedule // Pass schedule to allocateRoom
    );

    let startTime, endTime, dayOfWeek;

    do {
        startTime = `${Math.floor(Math.random() * 9) + 8}:00:00`; // Random start hour between 8 and 16
        endTime = `${parseInt(startTime.split(":")[0]) + (isLab ? 2 : 1)}:00:00`; // End time based on start time and lab requirement
        dayOfWeek = Math.floor(Math.random() * 5) + 1; // Random day of week (1 to 5, assuming Monday to Friday)

        // Check for time collisions within the same batch
        const batchClasses = generatedClass.filter(cls => cls.batchCode === batchCode);
        const batchClassTimes = batchClasses.map(cls => ({
            startTime: cls.startTime,
            endTime: cls.endTime
        }));

        let isCollision = false;

        for (let batchClassTime of batchClassTimes) {
            const { startTime: existingStartTime, endTime: existingEndTime } = batchClassTime;
            const newStartHour = parseInt(startTime.split(":")[0]);
            const newEndHour = parseInt(endTime.split(":")[0]);
            const existingStartHour = parseInt(existingStartTime.split(":")[0]);
            const existingEndHour = parseInt(existingEndTime.split(":")[0]);

            if (
                (newStartHour >= existingStartHour && newStartHour < existingEndHour) ||
                (newEndHour > existingStartHour && newEndHour <= existingEndHour)
            ) {
                isCollision = true;
                break;
            }
        }

        if (!isCollision) {
            break; // Exit loop if no collision
        }

        console.log(`Time collision detected for batch ${batchCode}. Adjusting time slot...`);
    } while (true);

    return {
        classId,
        staffno,
        subjectCode,
        roomNum,
        batchCode,
        startTime,
        endTime,
        dayOfWeek,
        isLab
    };
};


const assignLecturer = (subjectDept, lecturerDepartment) => {
	const availableLecturers = Object.keys(lecturerDepartment).filter(
		(staffno) => lecturerDepartment[staffno] === subjectDept,
	);
	return availableLecturers[Math.floor(Math.random() * availableLecturers.length)];
};

const allocateRoom = (
    batchCode,
    roomCapacity,
    batchSizeMap,
    roomType,
    isLab,
    schedule // Add schedule parameter to check room availability
) => {
    const batchSize = batchSizeMap[batchCode];

    const suitableRooms = Object.keys(roomCapacity).filter(
        (roomNum) =>
            roomCapacity[roomNum] >= batchSize &&
            (!isLab || (isLab && roomType[roomNum] === "Laboratory")),
    );

    // Check for room availability
    const availableRooms = suitableRooms.filter(roomNum => {
        // Check if the room is available for the current batch's time slot
        const batchClasses = generatedClass.filter(cls => cls.batchCode === batchCode);
        const batchClassTimes = batchClasses.map(cls => ({
            startTime: cls.startTime,
            endTime: cls.endTime
        }));

        const roomSchedule = schedule[roomNum] || {};

        for (let dayOfWeek in roomSchedule) {
            const roomClasses = roomSchedule[dayOfWeek];
            for (let roomClass of roomClasses) {
                for (let batchClassTime of batchClassTimes) {
                    const { startTime, endTime } = batchClassTime;
                    const scheduledStartHour = parseInt(roomClass.startTime.split(":")[0]);
                    const scheduledEndHour = parseInt(roomClass.endTime.split(":")[0]);
                    
                    if (
                        (startTime >= scheduledStartHour && startTime < scheduledEndHour) ||
                        (endTime > scheduledStartHour && endTime <= scheduledEndHour)
                    ) {
                        return false; // Room is not available
                    }
                }
            }
        }

        return true; // Room is available
    });

    return availableRooms[Math.floor(Math.random() * availableRooms.length)];
};


const assignDay = (staffno, lecturerDays) => {
	const preferredDays = lecturerDays[staffno];

	return preferredDays[Math.floor(Math.random() * preferredDays.length)];
};

const fitness = (solution, data) => {
	let fitnessScore = 0;
	let totalCollisions = 0;

	const schedule = {};

	for (let i = 0; i < solution.length; i++) {
		const { roomNum, startTime, dayOfWeek } = solution[i];

		if (!schedule[roomNum]) {
			schedule[roomNum] = {};
		}

		if (!schedule[roomNum][dayOfWeek]) {
			schedule[roomNum][dayOfWeek] = [];
		}

		const roomSchedule = schedule[roomNum][dayOfWeek];

		const startHour = parseInt(startTime.split(":")[0]);

		const endHour = parseInt(solution[i].endTime.split(":")[0]);

		let isAvailable = true;

		for (let j = 0; j < roomSchedule.length; j++) {
			const scheduledClass = roomSchedule[j];

			const scheduledStartHour = parseInt(
				scheduledClass.startTime.split(":")[0],
			);

			const scheduledEndHour = parseInt(scheduledClass.endTime.split(":")[0]);

			if (
				(startHour >= scheduledStartHour && startHour < scheduledEndHour) ||
				(endHour > scheduledStartHour && endHour <= scheduledEndHour)
			) {
				isAvailable = false;
				totalCollisions++;
				break;
			}
			console.log(totalCollisions)

		}

		if (isAvailable) {
			roomSchedule.push({
				startTime,
				endTime: solution[i].endTime,
			});
			fitnessScore++;
		}
	}

	// Penalize collisions by reducing the fitness score
	fitnessScore -= totalCollisions * 10;

	return fitnessScore;
};

const selection = (population, fitnessScores) => {
	const parents = [];
	const numParents = Math.floor(options.size * options.crossover);

	for (let i = 0; i < numParents; i++) {
		const parent1 = selectOne(population, fitnessScores);
		const parent2 = selectOne(population, fitnessScores);
		parents.push([parent1, parent2]);
	}

	return parents;
};

const selectOne = (population, fitnessScores) => {
	const totalFitness = fitnessScores.reduce((a, b) => a + b, 0);

	let randomValue = Math.random() * totalFitness;

	for (let i = 0; i < population.length; i++) {
		randomValue -= fitnessScores[i];

		if (randomValue <= 0) {
			return population[i];
		}
	}

	return population[population.length - 1];
};

const crossoverAll = (parents) => {
	const offspring = [];

	for (let i = 0; i < parents.length; i++) {
		const parent1 = parents[i][0];
		const parent2 = parents[i][1];

		const child1 = crossover(parent1, parent2);
		const child2 = crossover(parent2, parent1);

		offspring.push(child1);
		offspring.push(child2);
	}

	return offspring;
};

const crossover = (parent1, parent2) => {
	const numClasses = parent1.length;

	const crossoverPoint = Math.floor(Math.random() * numClasses);

	const child = [];

	for (let i = 0; i < numClasses; i++) {
		if (i < crossoverPoint) {
			child.push(parent1[i]);
		} else {
			child.push(parent2[i]);
		}
	}

	return child;
};

const mutation = (solution) => {
	const numClasses = solution.length;

	const mutationPoint = Math.floor(Math.random() * numClasses);

	const mutatedClass = solution[mutationPoint];

	const mutatedSolution = [...solution];

	mutatedSolution[mutationPoint] = {
		...mutatedClass,
		roomNum: allocateRoom(
			mutatedClass.batchCode,
			data.roomCapacity,
			data.batchSizeMap,
			data.roomType,
			mutatedClass.isLab,
		),
		startTime: `${Math.floor(Math.random() * 9) + 8}:00:00`,
		endTime: data.subjectLab[mutatedClass.subjectCode]
			? `${parseInt(mutatedClass.startTime.split(":")[0]) + 2}:00:00`
			: `${parseInt(mutatedClass.startTime.split(":")[0]) + 1}:00:00`,
		dayOfWeek: assignDay(
			mutatedClass.staffno,
			data.lecturerDays,
		),
	};

	return mutatedSolution;
};
const localSearch = (solution, data, bestFitness, bestSolution) => {
    const schedule = {};
    const dailyClassCounts = {}; // Track number of classes per batch per day

    // Determine existing days with classes for each batch
    const existingDays = {};
    for (let i = 0; i < solution.length; i++) {
        const { batchCode, dayOfWeek } = solution[i];
        if (!existingDays[batchCode]) {
            existingDays[batchCode] = {};
        }
        existingDays[batchCode][dayOfWeek] = true;
    }

    for (let i = 0; i < solution.length; i++) {
        const { batchCode, roomNum, startTime, endTime, dayOfWeek } = solution[i];

        // Initialize room schedule if not exists
        if (!schedule[roomNum]) {
            schedule[roomNum] = {};
        }

        // Initialize day schedule for the room if not exists
        if (!schedule[roomNum][dayOfWeek]) {
            schedule[roomNum][dayOfWeek] = [];
        }

        // Check for room availability
        const roomSchedule = schedule[roomNum][dayOfWeek];
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = parseInt(endTime.split(":")[0]);
        let isAvailable = true;

        for (let j = 0; j < roomSchedule.length; j++) {
            const scheduledClass = roomSchedule[j];
            const scheduledStartHour = parseInt(scheduledClass.startTime.split(":")[0]);
            const scheduledEndHour = parseInt(scheduledClass.endTime.split(":")[0]);

            if (
                (startHour >= scheduledStartHour && startHour < scheduledEndHour) ||
                (endHour > scheduledStartHour && endHour <= scheduledEndHour)
            ) {
                isAvailable = false;
                break;
            }
        }

        // Check daily class count for the batch
        if (isAvailable) {
            if (!dailyClassCounts[batchCode]) {
                dailyClassCounts[batchCode] = {};
            }
            if (!dailyClassCounts[batchCode][dayOfWeek]) {
                dailyClassCounts[batchCode][dayOfWeek] = 0;
            }

            if (dailyClassCounts[batchCode][dayOfWeek] >= 2) {
                isAvailable = false;
            }
        }

        // Handle collision or exceed class limit
        if (!isAvailable) {
            console.log(`Collision or class limit exceeded for batch ${batchCode} on day ${dayOfWeek}. Trying to adjust...`);

            let newStartHour = startHour;
            let newEndHour = endHour;
            let newDayOfWeek = dayOfWeek;

            // Attempt to find an alternative day with no existing classes for the batch
            let tries = 0;
            const maxTries = 5; // Max attempts to find an alternative day

            do {
                newStartHour = Math.floor(Math.random() * 9) + 8; // Generate new start hour (between 8 and 16)
                newEndHour = newStartHour + (data.subjectLab[solution[i].subjectCode] ? 2 : 1); // Adjust end hour accordingly
                newDayOfWeek = Math.floor(Math.random() * 5) + 1; // Generate new day of week (1 to 5, assuming Monday to Friday)

                tries++;
            } while (
                (tries <= maxTries) && (
                    (newStartHour === 12 || newEndHour > 17) || // Ensure valid time slot (not during lunch break and within working hours)
                    existingDays[batchCode][newDayOfWeek] || // Ensure the new day does not have existing classes for the batch
                    dailyClassCounts[batchCode][newDayOfWeek] >= 2 // Ensure batch does not exceed two classes per day
                )
            );

            // Update the class with adjusted time slot and day
            solution[i].startTime = `${newStartHour}:00:00`;
            solution[i].endTime = `${newEndHour}:00:00`;
            solution[i].dayOfWeek = newDayOfWeek;

            // Recalculate fitness score after adjusting
            const fitnessScore = fitness(solution, data);
            if (fitnessScore > bestFitness) {
                bestFitness = fitnessScore;
                bestSolution = solution;
            }

            // Update schedule and daily class count
            if (!schedule[roomNum][newDayOfWeek]) {
                schedule[roomNum][newDayOfWeek] = [];
            }
            schedule[roomNum][newDayOfWeek].push({
                startTime: solution[i].startTime,
                endTime: solution[i].endTime,
            });

            dailyClassCounts[batchCode][newDayOfWeek]++;
        } else {
            // If no collision, add class to schedule and update daily class count
            roomSchedule.push({
                startTime,
                endTime,
            });

            if (!dailyClassCounts[batchCode][dayOfWeek]) {
                dailyClassCounts[batchCode][dayOfWeek] = 0;
            }
            dailyClassCounts[batchCode][dayOfWeek]++;
        }
    }

    return [solution, fitness(solution, data)];
};

