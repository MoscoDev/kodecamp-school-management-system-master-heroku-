const express = require("express");
const router = express.Router();
const {
  teacher,
  signin,
  createStudent,
  promoteStudent,
  demoteStudent,
  makeStudentATeacher,
  createAssignment,
} = require("./handler");
const {
  getOneStudent,
  getAllStudent,
  getOneTeacher,
  getAllTeachers,
} = require("../admin/handler");
const auth = require("../../middleware/auth");
const authRole = require("../../middleware/teacherAuth");
// console.log(authRole)

// @route   POST /admin/signin
router.post("/signin", signin);
router.post("/create-teacher", auth, authRole, teacher);
router.post("/create-student", auth, authRole, createStudent);
router.get("/getOneStudent", auth, authRole, getOneStudent);
router.get("/getAllStudent", auth, authRole, getAllStudent);
router.get("/getOneTeacher", auth, authRole, getOneTeacher);
router.get("/getAllTeacher", auth, authRole, getAllTeachers);
router.put("/promotestudent", auth, authRole, promoteStudent);
router.put("/demotestudent", auth, authRole, demoteStudent);
router.post("/createAssignment", auth, authRole,  createAssignment);
router.put("/makeStudentATeacher",auth, authRole, makeStudentATeacher);
// router.get("/dashboard", auth, authRole, admin.dashboard);

module.exports = router;
