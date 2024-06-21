const math = require("mathjs");

const classController = require("./controllers/classController"); // Update the path accordingly


const options = {
	size: 100,
	crossover: 0.85,
	mutation: 0.15,
	iterations: 100,
	optimize: "maximize",
	select1: "roulette",
	select2: "roulette",
};


const generateMain =  (data) =>{
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

		console.log(
			`Iteration ${
				i + 1
			}: Best fitness = ${bestFitness}, Violated Constraints = ${countViolatedConstraints(
				population,
				data,
			)}`,
		);
	}

	console.log(`Final solution: ${JSON.stringify(bestSolution)}`);
	console.log(`Final fitness: ${bestFitness}`);

	insertSolutionIntoDatabase(bestSolution);
};

const insertSolutionIntoDatabase = async (solution) => {
	console.log(solution)
	// Iterate through your solution and insert each class into the database
	for (const classObj of solution) {
		const {
			course_id,
			subject_code,
			room_num,
			batch_code,
			start_time,
			end_time,
			day_of_week,
		} = classObj;

		// Call the addClass method from classController
		await classController.addClass({
			body: {
				course_id,
				subject_code,
				room_num,
				batch_code,
				start_time,
				end_time,
				day_of_week,
			},
		});
	}

	console.log("Solution inserted into the database successfully");
};

const seed = function () {
	const solution = [];
	for (let i = 0; i < data.numClasses; i++) {
		const classId = i + 1;
		const roomNum = allocateRoom(classId, data.numRooms, data.roomCapacity);
		const lecturerId = Math.floor(Math.random() * data.numLecturers) + 1;
		const batchCode = getRandomBatchCode(data.batchCourse);

		let startHour;

		do {
			startHour = Math.floor(Math.random() * 9) + 8;
		} while (startHour === 12);

		const startTime = `${startHour}:00:00`;

		const classDuration = data.subjectLab[data.classSubject[classId]] ? 3 : 2;
		const endHour = startHour + classDuration;
		const endTime = `${endHour}:00:00`;

		const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		const dayOfWeek = days[Math.floor(Math.random() * 5)];

		const classObj = {
			classId: classId,
			roomNum: roomNum,
			lecturerId: lecturerId,
			batchCode: batchCode,
			startTime: startTime,
			endTime: endTime,
			dayOfWeek: dayOfWeek,
		};

		solution.push(classObj);
	}

	return solution;
};

const getRandomBatchCode = function (batchCourse) {
	const batchCodes = Object.keys(batchCourse);
	return batchCodes[Math.floor(Math.random() * batchCodes.length)];
};

const allocateRoom = function (classId, numRooms, roomCapacity) {
	const classSize = Math.ceil(Math.random() * 50);
	const suitableRooms = Object.keys(roomCapacity).filter(
		(roomNum) => roomCapacity[roomNum] >= classSize,
	);
	return suitableRooms[Math.floor(Math.random() * suitableRooms.length)];
};

const countViolatedConstraints = function (population, data) {
	let violatedConstraints = 0;
	for (const solution of population) {
		for (const classObj of solution) {
			if (!isClassValid(classObj, data)) {
				violatedConstraints++;
			}
		}
	}
	return violatedConstraints;
};

const isClassValid = function (classObj, data) {
	const lecturerUnavailableTimes = getLecturerUnavailableTimes(
		classObj.lecturerId,
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
	// hard-coded value: 50
	if (data.roomCapacity[classObj.roomNum] < 50) {
		return false;
	}

	return true;
};

const getLecturerUnavailableTimes = function (lecturerId, data) {
	return data.lecturerDays[lecturerId] || [];
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

const isOverlapping = function (start1, end1, start2, end2) {
	return (
		(start1 <= start2 && end1 >= start2) ||
		(start1 <= end2 && end1 >= end2) ||
		(start1 >= start2 && end1 <= end2)
	);
};

const fitness = function (solution, data) {
	let score = 0;

	for (let i = 0; i < solution.length; i++) {
		const classObj = solution[i];
		const lecturerId = classObj.lecturerId;

		const preferredDays = data.lecturerDays[lecturerId] || [];
		if (preferredDays.includes(classObj.dayOfWeek)) {
			score += 20;
		}

		if (!isClassValid(classObj, data)) {
			score -= 50;
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
				"roomNum",
				"lecturerId",
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
						solution[i].classId,
						data.numRooms,
						data.roomCapacity,
					);
					break;
				case "lecturerId":
					solution[i].lecturerId =
						Math.floor(Math.random() * data.numLecturers) + 1;
					break;
				case "batchCode":
					solution[i].batchCode = getRandomBatchCode(data.batchCourse);
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
				case "endTime":
					// Removed the endTime block from here
					break;
				case "dayOfWeek":
					const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
					solution[i].dayOfWeek = days[Math.floor(Math.random() * 5)];
					break;
			}
		}
	}
	return solution;
};

const localSearch = function (solution, data) {
	// Implement local search heuristics to improve the solution

	// Heuristic 1: Randomly swap the positions of two classes
	const index1 = Math.floor(Math.random() * solution.length);
	const index2 = Math.floor(Math.random() * solution.length);

	// Swap the positions of the two classes
	const tempClass = solution[index1];
	solution[index1] = solution[index2];
	solution[index2] = tempClass;

	// Heuristic 2: Move a class to a different room
	const classToMove = solution[Math.floor(Math.random() * solution.length)];
	const newRoomNum = "R" + (Math.floor(Math.random() * data.numRooms) + 1);
	classToMove.roomNum = newRoomNum;

	// Heuristic 3: Adjusting class start times and end times
	for (let i = 0; i < solution.length; i++) {
		const currentClass = solution[i];

		// Adjust the start time within the same day
		const startTimeAdjustment = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
		const startHour =
			parseInt(currentClass.startTime.split(":")[0]) + startTimeAdjustment;
		currentClass.startTime = Math.max(8, Math.min(16, startHour)) + ":00:00";

		// Adjust the end time based on the class duration
		const classDuration = data.subjectLab[
			data.classSubject[currentClass.classId]
		]
			? 3
			: 2;
		const endHour =
			parseInt(currentClass.startTime.split(":")[0]) + classDuration;
		currentClass.endTime = endHour + ":00:00";
	}

	// Heuristic 4: Randomly change the day of the week for a class
	const classToMoveDay = solution[Math.floor(Math.random() * solution.length)];
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	classToMoveDay.dayOfWeek = days[Math.floor(Math.random() * 5)];

	// Heuristic 5: Swap classes between rooms
	const room1Classes = solution.filter((c) => c.roomNum === "R1");
	const room2Classes = solution.filter((c) => c.roomNum === "R2");

	if (room1Classes.length > 0 && room2Classes.length > 0) {
		// Swap a class between the two rooms
		const classToSwap1 =
			room1Classes[Math.floor(Math.random() * room1Classes.length)];
		const classToSwap2 =
			room2Classes[Math.floor(Math.random() * room2Classes.length)];

		const tempRoom = classToSwap1.roomNum;
		classToSwap1.roomNum = classToSwap2.roomNum;
		classToSwap2.roomNum = tempRoom;
	}

	return solution;
};

const roulette = function (population, fitnessScores) {
	const totalFitness = math.sum(fitnessScores);
	const rand = Math.random() * totalFitness;
	let cumFitness = 0;

	for (let i = 0; i < population.length; i++) {
		cumFitness += fitnessScores[i];
		if (cumFitness >= rand) {
			return population[i];
		}
	}
};

// Run the main function