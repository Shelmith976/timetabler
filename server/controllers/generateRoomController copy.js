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
			const [rooms_response] = await exec("CALL sp_get_all_rooms");
			const [lecturer_response] = await exec("CALL sp_get_all_lecturers");
			const [batch_response] = await exec("CALL sp_get_all_batches");
			const [subject_response] = await exec("CALL sp_get_all_subjects");
			const [batch_subject_response] = await exec(
				"CALL sp_get_all_batch_subject",
			);
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
		const solution = seed();
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
			const improvedOffspring = localSearch(mutatedOffspring, data);
			population[j] = improvedOffspring;
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

			const roomNum = allocateRoom(
				batchCode,
				data.roomCapacity,
				data.batchSizeMap,
				data.roomType,
				hasLab,
			);

			let startHour;

			do {
				startHour = Math.floor(Math.random() * 9) + 8;
			} while (startHour === 12);

			const startTime = `${startHour}:00:00`;

			// Schedule the class for the subject
			const classObj = {
				classId: classId++,
				staffno: staffno,
				subjectCode: subjectCode,
				roomNum: roomNum.classroom,
				batchCode: batchCode,
				startTime: startTime,
				endTime: `${startHour + 2}:00:00`, // Class duration is 2 hours
				dayOfWeek: getRandomDay(),
			};

			solution.push(classObj);

			// Schedule an additional lab for the subject if it has a lab
			if (hasLab) {
				const labObj = {
					classId: classId++,
					staffno: staffno,
					subjectCode: subjectCode,
					roomNum: roomNum.laboratory,
					batchCode: batchCode,
					startTime: startTime,
					endTime: `${startHour + 3}:00:00`, // Lab duration is 3 hours
					dayOfWeek: getRandomDay(),
				};

				solution.push(labObj);
			}
		}
	}

	return solution;
};

function getRandomDay() {
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	return days[Math.floor(Math.random() * 5)];
}

const assignLecturer = function (subjectDept, lecturerDepartment) {
	const staffNumbers = Object.keys(lecturerDepartment);
	const suitableStaffNumbers = staffNumbers.filter(
		(staffNum) => lecturerDepartment[staffNum] === subjectDept,
	);
	const staffnum =
		suitableStaffNumbers[
			Math.floor(Math.random() * suitableStaffNumbers.length)
		];
	return staffnum;
};

const getRandomBatchCode = function (batchCourse) {
	const batchCodes = Object.keys(batchCourse);
	return batchCodes[Math.floor(Math.random() * batchCodes.length)];
};

const getRandomSubjectCode = function (subjectCourse) {
	const subjectCodes = Object.keys(subjectCourse);
	return subjectCodes[Math.floor(Math.random() * subjectCodes.length)];
};

/**
 * Allocates a room for a batch of students.
 *
 * @param {string} batchcode - The code of the batch.
 * @param {Object} roomCapacity - An object mapping room numbers to their capacities.
 * @param {Object} batchSizeMap - An object mapping batch codes to their sizes.
 * @param {Object} roomType - An object mapping room numbers to their types.
 * @param {boolean} hasLab - A boolean indicating whether the subject has a lab.
 * @returns {string} The number of the allocated room.
 */
const allocateRoom = function (
	batchcode,
	roomCapacity,
	batchSizeMap,
	roomType,
	hasLab,
) {
	const batchSize = batchSizeMap[batchcode];

	let suitableClassRooms = Object.keys(roomCapacity).filter(
		(roomNum) =>
			roomCapacity[roomNum] >= batchSize && roomType[roomNum] === "Classroom",
	);
	let suitableLabRooms = Object.keys(roomCapacity).filter(
		(roomNum) =>
			roomCapacity[roomNum] >= batchSize && roomType[roomNum] === "Laboratory",
	);

	if (suitableClassRooms.length === 0) {
		const roomCapacities = Object.values(roomCapacity).sort((a, b) => a - b);
		const closestCapacity = roomCapacities.find(
			(capacity) => capacity >= batchSize,
		);
		suitableClassRooms = Object.keys(roomCapacity).filter(
			(roomNum) =>
				roomCapacity[roomNum] === closestCapacity &&
				roomType[roomNum] === "Classroom",
		);
	}

	if (hasLab && suitableLabRooms.length === 0) {
		const roomCapacities = Object.values(roomCapacity).sort((a, b) => a - b);
		const closestCapacity = roomCapacities.find(
			(capacity) => capacity >= batchSize,
		);
		suitableLabRooms = Object.keys(roomCapacity).filter(
			(roomNum) =>
				roomCapacity[roomNum] === closestCapacity &&
				roomType[roomNum] === "Laboratory",
		);
	}

	let assignedRooms = {};
	if (hasLab) {
		assignedRooms = {
			classroom:
				suitableClassRooms[
					Math.floor(Math.random() * suitableClassRooms.length)
				],
			laboratory:
				suitableLabRooms[Math.floor(Math.random() * suitableLabRooms.length)],
		};
	} else {
		assignedRooms = {
			classroom:
				suitableClassRooms[
					Math.floor(Math.random() * suitableClassRooms.length)
				],
		};
	}

	return assignedRooms;
};
const isRoomAvailable = function(roomNum, dayOfWeek, startTime, endTime, currentClasses) {
    for (let cls of currentClasses) {
        if (cls.roomNum === roomNum && cls.dayOfWeek === dayOfWeek) {
            if (isOverlapping(cls.startTime, cls.endTime, startTime, endTime)) {
                return false;
            }
        }
    }
    return true;
};
const isClassValid = function (classObj, data) {
	const lecturerUnavailableTimes = getLecturerUnavailableTimes(
		classObj.staffno,
		data,
	);

	if (
		lecturerUnavailableTimes.includes(classObj.dayOfWeek) &&
		isTimeBetween(
			classObj.startTime,
			classObj.endTime,
			lecturerUnavailableTimes,
		)
	) {
		return false;
	}
	if (
		data.roomCapacity[classObj.roomNum] < data.batchSizeMap[classObj.batchCode]
	) {
		return false;
	}

	return true;
};

const getLecturerUnavailableTimes = function (staffno, data) {
	return data.lecturerDays[staffno] || [];
};

const isOverlapping = function (start1, end1, start2, end2) {
	return (
		(start1 <= start2 && end1 >= start2) ||
		(start1 <= end2 && end1 >= end2) ||
		(start1 >= start2 && end1 <= end2)
	);
};

const isTimeBetween = function (startTime, endTime, unavailableTimes) {
	return unavailableTimes.every(
		(unavailableTime) =>
			!isOverlapping(
				startTime,
				endTime,
				unavailableTime.start,
				unavailableTime.end,
			),
	);
};

const fitness = function (solution, data) {
	let score = 0;

	for (let i = 0; i < solution.length; i++) {
		const classObj = solution[i];
		const staffno = classObj.staffno;

		const preferredDays = data.lecturerDays[staffno] || [];
		if (preferredDays.includes(classObj.dayOfWeek)) {
			score += 50;
		}

		if (!isClassValid(classObj, data)) {
			score -= 1000;
		}
	}

	return score;
};

const selection = function (population, fitnessScores) {
	const parents = [];
	for (let i = 0; i < options.size; i++) {
		const parent1 = roulette(population, fitnessScores);
		const parent2 = roulette(population, fitnessScores);
		parents.push(parent1, parent2);
	}
	return parents;
};

const crossoverAll = function (parents) {
	const offspring = [];
	for (let j = 0; j < parents.length; j += 2) {
		if (parents[j] && parents[j + 1]) {
			const children = crossover(parents[j], parents[j + 1]);
			offspring.push(...children);
		}
	}
	return offspring;
};
const crossover = function (parent1, parent2) {
	const offspring = [];
	for (let i = 0; i < data.numClasses; i++) {
		const rand = Math.random();
		if (rand < options.crossover) {
			const point1 = Math.floor(Math.random() * data.numClasses);
			const point2 = Math.floor(Math.random() * data.numClasses);
			const start = Math.min(point1, point2);
			const end = Math.max(point1, point2);
			if (parent1 && parent2) {
				const child1 = parent1
					.slice(0, start)
					.concat(parent2.slice(start, end), parent1.slice(end));
				const child2 = parent2
					.slice(0, start)
					.concat(parent1.slice(start, end), parent2.slice(end));
				offspring.push(child1, child2);
			}
		} else {
			if (parent1 && parent2) {
				offspring.push(parent1, parent2);
			}
		}
	}
	return offspring;
};

const mutation = function (solution) {
	for (let i = 0; i < data.numClasses; i++) {
		const rand = Math.random();
		if (rand < options.mutation) {
			const attributes = [
				"classId",
				// "courseId",
				"staffno",
				"subjectCode",
				"roomNum",
				"batchCode",
				"startTime",
				"endTime",
				"dayOfWeek",
			];
			const attribute =
				attributes[Math.floor(Math.random() * attributes.length)];
			let startHour;

			switch (attribute) {
				case "classId":
					solution[i].classId = Math.floor(Math.random() * data.numClasses) + 1;
					break;
				case "roomNum":
					solution[i].roomNum = allocateRoom(
						solution[i].batchCode,
						data.roomCapacity,
						data.batchSizeMap,
						data.roomType,
						data.subjectLab[
							data.classSubject[data.batchSubjects[solution[i].batchCode]]
						],
					);
					break;
				case "staffno":
					solution[i].staffno = assignLecturer(
						data.courseDepartment[data.subjectCourse[solution[i].subjectCode]],
						data.lecturerDepartment,
					);
					break;
				case "batchCode":
					solution[i].batchCode = getRandomBatchCode(data.batchCourse);
					break;
				case "subjectCode":
					solution[i].subjectCode = getRandomSubjectCode(data.subjectCourse);
					break;
				case "startTime":
					do {
						startHour = Math.floor(Math.random() * 9) + 8;
					} while (startHour === 12);
					solution[i].startTime = `${startHour}:00:00`;
					const classDuration = data.subjectLab[
						data.classSubject[solution[i].classId]
					]
						? 3
						: 2;
					const endHour = startHour + classDuration;
					solution[i].endTime = `${endHour}:00:00`;
					break;
				case "dayOfWeek":
					solution[i].dayOfWeek = getRandomDay();
					break;
			}
		}
	}
	return solution;
};

// Implement local search heuristics to improve the solution
const localSearch = function (solution, data) {
	for (let i = 0; i < solution.length; i++) {
		for (let j = i + 1; j < solution.length; j++) {
			const sameDay = solution[i].dayOfWeek === solution[j].dayOfWeek;
			const sameTime =
				(solution[i].startTime <= solution[j].startTime &&
					solution[i].endTime > solution[j].startTime) ||
				(solution[i].startTime < solution[j].endTime &&
					solution[i].endTime >= solution[j].endTime);

			// Check if two classes have the same room, lecturer, or batch
			const sameRoom = solution[i].roomNum === solution[j].roomNum;
			const sameLecturer = solution[i].staffno === solution[j].staffno;
			const sameBatch = solution[i].batchCode === solution[j].batchCode;

			if (sameDay && sameTime && sameRoom) {
				solution[i].roomNum = allocateRoom(
					solution[i].batchCode,
					data.roomCapacity,
					data.batchSizeMap,
					data.roomType,
					data.subjectLab[solution[i].subjectCode],
				);
			}
			if (sameDay && sameTime && sameLecturer) {
				solution[i].staffno = assignLecturer(
					data.courseDepartment[data.subjectCourse[solution[i].subjectCode]],
					data.lecturerDepartment,
				);
			}
			if (sameDay && sameTime && sameBatch) {
				solution[i].batchCode = getRandomBatchCode(data.batchCourse);
				const startTimeAdjustment = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
				const startHour =
					parseInt(solution[i].startTime.split(":")[0]) + startTimeAdjustment;
				solution[i].startTime = Math.max(8, Math.min(16, startHour)) + ":00:00";

				// Adjust the end time based on the class duration
				const classDuration = data.subjectLab[
					data.classSubject[solution[i].classId]
				]
					? 3
					: 2;
				const endHour =
					parseInt(solution[i].startTime.split(":")[0]) + classDuration;
				solution[i].endTime = endHour + ":00:00";
			}

			if (sameDay && sameTime && (sameRoom || sameLecturer || sameBatch)) {
				// Adjust the start time within the same day
				const startTimeAdjustment = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
				const startHour =
					parseInt(solution[i].startTime.split(":")[0]) + startTimeAdjustment;
				solution[i].startTime = Math.max(8, Math.min(16, startHour)) + ":00:00";

				// Adjust the end time based on the class duration
				const classDuration = data.subjectLab[
					data.classSubject[solution[i].classId]
				]
					? 3
					: 2;
				const endHour =
					parseInt(solution[i].startTime.split(":")[0]) + classDuration;
				solution[i].endTime = endHour + ":00:00";
			}
		}
	}

	// Heuristic 1: Randomly swap the positions of two classes
	const index1 = Math.floor(Math.random() * solution.length);
	const index2 = Math.floor(Math.random() * solution.length);

	// Swap the positions of the two classes
	const tempClass = solution[index1];
	solution[index1] = solution[index2];
	solution[index2] = tempClass;

	// Heuristic 4: Randomly change the day of the week for a class
	const classToMoveDay = solution[Math.floor(Math.random() * solution.length)];
	classToMoveDay.dayOfWeek = getRandomDay();

	return solution;
};

const roulette = function (population, fitnessScores) {
	const totalFitness = Math.sum(fitnessScores);
	const rand = Math.random() * totalFitness;
	let cumFitness = 0;

	for (let i = 0; i < population.length; i++) {
		cumFitness += fitnessScores[i];
		if (cumFitness >= rand) {
			return population[i];
		}
	}
};
