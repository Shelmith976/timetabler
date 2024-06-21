import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3005",
	headers: {
		Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
	}
});

/* Starting: Endpoints for Departments */
export const getDepartments = async () => {
	const response = await api.get("/dept/departments");
	return response.data;
};

export const getDepartmentById = async (id) => {
	const response = await api.get(`/dept/get-department/`, {
		params: { departmentId: id },
	});
	return response.data;
};

export const addDepartment = async (department) => {
	const response = await api.post("/dept/add-department", department);
	return response.data;
};

export const updateDepartment = async (id, department) => {
	const response = await api.put(
		`/dept/update-department/?departmentId=${id}`,
		department,
	);
	return response.data;
};

export const deleteDepartment = async (id) => {
	const response = await api.delete(
		`/dept/delete-department/?departmentId=${id}`,
	);
	return response.data;
};

/* Starting: Endpoints for Lecturers */
export const getLecturers = async () => {
	const response = await api.get("/lec/lecturers");
	return response.data;
};

export const getLecturerById = async (id) => {
	const response = await api.get(`/lec/get-lecturer/`, {
		params: { lec_id: id },
	});
	return response.data;
};

export const addLecturer = async (lecturer) => {
	const response = await api.post("/lec/add-lecturer", lecturer);
	return response.data;
};

export const updateLecturer = async (id, lecturer) => {
	const response = await api.put(
		`/lec/update-lecturer/?lecturerId=${id}`,
		lecturer,
	);
	return response.data;
};
export const deleteLecturer = async (id) => {
	const response = await api.delete(`/lec/delete-lecturer/?lecturerId=${id}`);
	return response.data;
};

/* Starting: Endpoints for Courses */
export const getCourses = async () => {
	const response = await api.get("/crs/courses");
	return response.data;
};

export const getCourseById = async (id) => {
	const response = await api.get(`/crs/get-course/`, {
		params: { courseId: id },
	});
	return response.data;
};

export const addCourse = async (course) => {
	const response = await api.post("/crs/add-course", course);
	return response.data;
};

export const updateCourse = async (id, course) => {
	const response = await api.put(`/crs/update-course/?courseId=${id}`, course);
	return response.data;
};

export const deleteCourse = async (id) => {
	const response = await api.delete(`/crs/delete-course/?courseId=${id}`);
	return response.data;
};

/* Starting: Endpoints for Batches */
export const getBatches = async () => {
	const response = await api.get("/bat/batches");
	return response.data;
};

export const getBatchById = async (id) => {
	const response = await api.get(`/bat/get-batch/`, {
		params: { batchCode: id },
	});
	return response.data;
};

export const addBatch = async (batch) => {
	const response = await api.post("/bat/add-batch", batch);
	return response.data;
};

export const updateBatch = async (id, batch) => {
	const response = await api.put(`/bat/update-batch/?batchId=${id}`, batch);
	return response.data;
};

export const deleteBatch = async (id) => {
	const response = await api.delete(`/bat/delete-batch/?batchId=${id}`);
	return response.data;
};

export const getCourseBatches = async (courseId) => {
	const response = await api.get(`/bat/batches/?course_id=${courseId}`);
	return response.data;
};



/* Starting: Endpoints for Subjects */
export const getSubjects = async () => {
	const response = await api.get("/sub/subjects");
	return response.data;
};

export const getSubjectById = async (id) => {
	const response = await api.get(`/sub/get-subject/`, {
		params: { subj_code: id },
	});
	return response.data;
};

export const addSubject = async (subject) => {
	const response = await api.post("/sub/add-subject", subject);
	return response.data;
};

export const updateSubject = async (id, subject) => {
	const response = await api.put(
		`/sub/update-subject/?subjectId=${id}`,
		subject,
	);
	return response.data;
};

export const deleteSubject = async (id) => {
	const response = await api.delete(`/sub/delete-subject/?subjectId=${id}`);
	return response.data;
};



/* Starting: Endpoints for Rooms */
export const getRooms = async () => {
	const response = await api.get("/rm/rooms");
	return response.data;
};

export const getRoomById = async (id) => {
	const response = await api.get(`/rm/get-room/`, {
		params: { roomId: id },
	});
	return response.data;
};

export const addRoom = async (room) => {
	const response = await api.post("/rm/add-room", room);
	return response.data;
};

export const updateRoom = async (id, room) => {
	const response = await api.put(`/rm/update-room/?roomId=${id}`, room);
	return response.data;
};

export const deleteRoom = async (id) => {
	const response = await api.delete(`/rm/delete-room/?roomId=${id}`);
	return response.data;
};

/* Starting endpoints for Classes */

export const generateClass = async () => {
	const response = await api.get("/cls/generate");
	return response.data;
};

export const getClasses = async () => {
	const response = await api.get("/cls/classes");
	return response.data;
};

export const userLogin = async (user) => {
	const response = await api.post("/user/login", user);
	return response.data;
};
export const getBatchesByCourse = async (courseId) => {
	const response = await api.get(`/bat/batchsubjects/?course_id=${courseId}`);
	return response;
};