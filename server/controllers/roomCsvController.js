const { exec } = require("../helpers/db");

let data;

// Define a function to filter allocated rooms based on a specific time
const filterAllocatedRooms = (timetable, targetTime) => {
  return timetable.filter(classObj => {
      const classStartTime = new Date(`2000-01-01 ${classObj.startTime}`);
      const classEndTime = new Date(`2000-01-01 ${classObj.endTime}`);
      const targetTimeDate = new Date(`2000-01-01 ${targetTime}`);
      return targetTimeDate >= classStartTime && targetTimeDate < classEndTime;
  }).map(classObj => classObj.roomNum);
};

// Define a function to filter unallocated rooms
const filterUnallocatedRooms = (allocatedRooms, allRooms) => {
  return allRooms.filter(roomNum => !allocatedRooms.includes(roomNum));
};

// Controller function to get allocated and unallocated rooms
const getAllocatedAndUnallocatedRooms = (req, res) => {
  try {
      const targetTime = req.query.targetTime; // Assuming the client sends the target time as a query parameter
      const allocatedRooms = filterAllocatedRooms(data, targetTime);
      const allRooms = [...new Set(data.map(classObj => classObj.roomNum))];
      const unallocatedRooms = filterUnallocatedRooms(allocatedRooms, allRooms);

      res.status(200).json({
          status: 200,
          success: true,
          allocatedRooms: allocatedRooms,
          unallocatedRooms: unallocatedRooms
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error"
      });
  }
};

module.exports = {
  getAllocatedAndUnallocatedRooms: getAllocatedAndUnallocatedRooms
};

// const filterAllocatedRooms = (timetable) => {
//   const allocatedRooms = new Set();

//   for (const classObj of timetable) {
//       allocatedRooms.add(classObj.roomNum);
//   }

//   return Array.from(allocatedRooms);
// };

// const filterUnallocatedRooms = (allocatedRooms, roomNumMap) => {
//   const allRooms = Object.values(roomNumMap);
//   const unallocatedRooms = allRooms.filter(room => !allocatedRooms.includes(room));
//   return unallocatedRooms;
// };