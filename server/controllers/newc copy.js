const { exec } = require("../helpers/db");

let data;

const getRoomDetails = (rooms) => {
    return rooms.reduce(
        (details, room) => {
            details.capacityMap[room.room_num] = room.room_capacity;
            details.typeMap[room.room_num] = room.room_type;
            return details;
        },
        { capacityMap: {}, typeMap: {}, numRooms: rooms.length }
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
            numBatches: batches.length
        }
    );
};

const getLecturerDetails = (lecturers) => {
    return lecturers.reduce(
        (details, lecturer) => {
            details.staffNumMap[lecturer.lecturer_id] = lecturer.staff_no;
            details.userNameMap[lecturer.staff_no] = lecturer.user_name;
            details.daysMap[lecturer.staff_no] = lecturer.preferred_days.split(", ");
            details.departmentMap[lecturer.staff_no] = lecturer.department_id;
            return details;
        },
        {
            daysMap: {},
            userNameMap: {},
            departmentMap: {},
            staffNumMap: {},
            numLecturers: lecturers.length
        }
    );
};

const getSubjectDetails = (subjects) => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
        console.error("Subjects is not an array or is empty.");
        return {
            subjectMap: {},
            courseMap: {},
            labMap: {},
            numSubjects: 0
        };
    }

    return subjects.reduce(
        (details, subject) => {
            details.subjectMap[subject.subject_id] = subject.subject_code;
            details.courseMap[subject.subject_code] = subject.course_id;
            details.labMap[subject.subject_code] = !!subject.has_lab;
            return details;
        },
        { subjectMap: {}, courseMap: {}, labMap: {}, numSubjects: subjects.length }
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
    trial: async (req, res) => {
        try {
            const [rooms_response] = await exec("CALL sp_get_all_rooms");
            const [lecturer_response] = await exec("CALL sp_get_all_lecturers");
            const [batch_response] = await exec("CALL sp_get_all_batches");
            const [subject_response] = await exec("CALL sp_get_all_subjects");
            const [batch_subject_response] = await exec("CALL sp_get_all_batch_subject");

            const {
                capacityMap: roomCapacity,
                typeMap: roomType,
                numRooms
            } = getRoomDetails(rooms_response);

            const {
                daysMap: lecturerDays,
                departmentMap: lecturerDepartment,
                staffNumMap: lecturerStaffNum,
                userNameMap: lecturerUserName,
                numLecturers
            } = getLecturerDetails(lecturer_response);

            const {
                courseMap: batchCourse,
                yearSemesterMap: batchYearSemester,
                batchSizeMap,
                numBatches,
                idCodeMap
            } = getBatchDetails(batch_response);

            const {
                subjectMap: classSubject,
                courseMap: subjectCourse,
                labMap: subjectLab,
                numSubjects
            } = getSubjectDetails(subject_response);
            const batchSubjects = getBatchSubjects(batch_subject_response, idCodeMap);

            data = {
                numClasses: 24,
                numRooms,
                numLecturers,
                numBatches,
                lecturerUserName,
                batchSizeMap,
                roomCapacity,
                roomType,
                classSubject,
                subjectCourse,
                subjectLab,
                lecturerDepartment,
                lecturerDays,
                batchCourse,
                batchYearSemester,
                batchSubjects,
                lecturerStaffNum
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

            const Finalsolution = generateMain(data);
            res.status(200).json({
                status: 200,
                success: true,
                message: Finalsolution
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message
            });
        }
    }
};

const options = {
    size: 100,
    crossover: 0.85,
    mutation: 0.15,
    iterations: 10,
    optimize: "maximize",
    select1: "roulette",
    select2: "roulette"
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

            if (
                bestSolution === null ||
                (options.optimize === "maximize" && fitnessScore > bestFitness) ||
                (options.optimize === "minimize" && fitnessScore < bestFitness)
            ) {
                bestSolution = population[j];
                bestFitness = fitnessScore;
            }
        }

        const parents = selection(population, fitnessScores);

        const offspring = crossoverAll(parents);

        for (let j = 0; j < offspring.length; j++) {
            const mutatedOffspring = mutation(offspring[j]);
            const improvedOffspring = localSearch(mutatedOffspring, data);
            population[j] = improvedOffspring;
        }
    }

    let newSolution = bestSolution.map((item) => {
        if (item && item.staffno) {
            const staffUserName = data.lecturerUserName[item.staffno]; // Use lecturerUserName map
            if (staffUserName) {
                return { ...item, staffno: staffUserName };
            } else {
                return item;
            }
        } else {
            return item;
        }
    });

    console.log(`Final solution: ${JSON.stringify(newSolution)}`);
    console.log(`Final fitness: ${bestFitness}`);

    return newSolution;
};

const seed = (data) => {
    const solution = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let classId = 1;

    const scheduledClasses = {};

    for (let batchCode in data.batchSizeMap) {
        scheduledClasses[batchCode] = {};
        const subjects = data.batchSubjects[batchCode];

        for (let subjectId of subjects) {
            const subjectCode = data.classSubject[subjectId];
            const hasLab = data.subjectLab[subjectCode];
            const staffno = getRandomStaffNum(data.lecturerStaffNum);

            const roomNum = allocateRoom(batchCode, data.roomCapacity, data.batchSizeMap, scheduledClasses);

            if (!roomNum) {
                console.error(`No room found for batch ${batchCode} with size ${data.batchSizeMap[batchCode]}`);
                continue; // Skip this class if no room is found
            }

            let lectureStartHour;
            let lectureStartTime;
            let lectureEndTime;
            let lectureDay;

            do {
                lectureStartHour = Math.floor(Math.random() * 9) + 8; // Lecture can start between 8 AM to 4 PM
                lectureStartTime = `${lectureStartHour}:00:00`;
                lectureEndTime = `${lectureStartHour + 1}:00:00`; // Lecture duration is 1 hour
                lectureDay = getRandomElement(days);
            } while (
                (lectureStartHour + 1 > 13 && lectureStartHour + 1 < 14) || // Ensure lecture ends before 1 PM and not during lunch break
                (scheduledClasses[batchCode][lectureDay] &&
                    scheduledClasses[batchCode][lectureDay].includes(lectureStartTime))
            );

            // Add the scheduled lecture class to the solution
            const lectureClass = {
                id: classId,
                batchcode: batchCode,
                coursename: subjectCode,
                staffno: staffno,
                classroom: roomNum,
                day: lectureDay,
                starttime: lectureStartTime,
                endtime: lectureEndTime
            };
            solution.push(lectureClass);
            classId++;

            // Mark the lecture class as scheduled
            if (!scheduledClasses[batchCode][lectureDay]) {
                scheduledClasses[batchCode][lectureDay] = [];
            }
            scheduledClasses[batchCode][lectureDay].push(lectureStartTime);

            // Schedule the lab class if the subject has a lab component
            if (hasLab) {
                let labStartHour;
                let labStartTime;
                let labEndTime;
                let labDay;

                do {
                    labStartHour = Math.floor(Math.random() * 9) + 8; // Lab can start between 8 AM to 12 PM and 2 PM to 5 PM
                    labStartTime = `${labStartHour}:00:00`;
                    labEndTime = `${labStartHour + 3}:00:00`; // Lab class duration is 3 hours
                    labDay = getRandomElement(days);
                } while (
                    (labStartHour + 3 > 13 && labStartHour + 3 < 14) || // Ensure lab ends before 1 PM and not during lunch break
                    (scheduledClasses[batchCode][labDay] &&
                        scheduledClasses[batchCode][labDay].includes(labStartTime))
                );

                // Add the scheduled lab class to the solution
                const labClass = {
                    classid: classId,
                    batchcode: batchCode,
                    coursename: subjectCode,
                    staffno: staffno,
                    classroom: roomNum,
                    day: labDay,
                    starttime: labStartTime,
                    endtime: labEndTime
                };
                solution.push(labClass);
                classId++;

                // Mark the lab class as scheduled
                if (!scheduledClasses[batchCode][labDay]) {
                    scheduledClasses[batchCode][labDay] = [];
                }
                scheduledClasses[batchCode][labDay].push(labStartTime);
            }
        }
    }

    return solution;
};

// Function to allocate a room for a given batch and subject
const allocateRoom = (batchCode, roomCapacity, batchSizeMap, scheduledClasses) => {
    const batchSize = batchSizeMap[batchCode];
    const suitableRooms = Object.keys(roomCapacity).filter((roomNum) => roomCapacity[roomNum] >= batchSize);

    if (suitableRooms.length === 0) {
        console.error(`No suitable room found for batch ${batchCode} with size ${batchSize}`);
        return null;
    }

    const availableRooms = suitableRooms.filter((roomNum) => {
        for (let day in scheduledClasses[batchCode]) {
            for (let time of scheduledClasses[batchCode][day]) {
                if (scheduledClasses[batchCode][day].includes(time)) {
                    return false;
                }
            }
        }
        return true;
    });

    if (availableRooms.length === 0) {
        console.error(`No available room found for batch ${batchCode} with size ${batchSize}`);
        return null;
    }

    return getRandomElement(availableRooms);
};

// Utility function to get a random element from an array
const getRandomElement = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

// Utility function to get a random staff number from the staff numbers map
const getRandomStaffNum = (lecturerStaffNum) => {
    const staffNumbers = Object.values(lecturerStaffNum);
    return getRandomElement(staffNumbers);
};

function fitness(solution, data) {
    const numClasses = data.numClasses;

    const lecturerDayMap = {}; // To track lecturer assignments by day
    const roomDayMap = {}; // To track room assignments by day

    let roomCount = {}; // Track the number of times each room is assigned

    for (let i = 0; i < numClasses; i++) {
        const currentClass = solution[i];

        // Update room assignment count
        if (roomCount[currentClass.classroom]) {
            roomCount[currentClass.classroom]++;
        } else {
            roomCount[currentClass.classroom] = 1;
        }

        // Check for lecturer constraints
        if (lecturerDayMap[currentClass.staffno]) {
            if (lecturerDayMap[currentClass.staffno][currentClass.day]) {
                return 0;
            } else {
                lecturerDayMap[currentClass.staffno][currentClass.day] = true;
            }
        } else {
            lecturerDayMap[currentClass.staffno] = {
                [currentClass.day]: true
            };
        }

        // Check for room constraints
        if (!roomDayMap[currentClass.classroom]) {
            roomDayMap[currentClass.classroom] = {};
        }

        if (roomDayMap[currentClass.classroom][currentClass.day]) {
            if (
                roomDayMap[currentClass.classroom][currentClass.day].includes(
                    currentClass.starttime
                )
            ) {
                return 0;
            }
            roomDayMap[currentClass.classroom][currentClass.day].push(
                currentClass.starttime
            );
        } else {
            roomDayMap[currentClass.classroom][currentClass.day] = [
                currentClass.starttime
            ];
        }
    }

    // Penalize the solution if any room is assigned more than 3 times
    for (let room in roomCount) {
        if (roomCount[room] > 3) {
            return 0;
        }
    }

    return 1;
}

function selection(population, fitnessScores) {
    const selected = [];

    for (let i = 0; i < population.length; i++) {
        const index = Math.floor(Math.random() * population.length);
        selected.push(population[index]);
    }

    return selected;
}

function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);

    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));

    return [child1, child2];
}

function crossoverAll(parents) {
    const offspring = [];

    for (let i = 0; i < parents.length; i += 2) {
        const [child1, child2] = crossover(parents[i], parents[i + 1]);
        offspring.push(child1);
        offspring.push(child2);
    }

    return offspring;
}

function mutation(solution) {
    const mutationPoint = Math.floor(Math.random() * solution.length);

    const mutatedSolution = solution.slice();
    mutatedSolution[mutationPoint] = seed()[mutationPoint];

    return mutatedSolution;
}

function localSearch(solution, data) {
    // Implement a local search algorithm here, if desired
    return solution;
}
