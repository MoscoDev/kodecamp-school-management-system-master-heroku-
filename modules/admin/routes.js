const express = require("express");
const router = express.Router();
const admin = require("./handler")
const {updateTeacher} = require("./handler");
const auth = require("../../middleware/auth")
const {teacher, createStudent,makeStudentATeacher } = require("../teacher/handler")
const authRole = require("../../middleware/superAdminAuth")
// console.log(authRole)

// @route   POST /admin/signin
router.post("/signin", admin.signin);
router.get("/getOneTeacher", auth,authRole, admin.getOneTeacher);
router.get("/getAllTeacher", auth,authRole, admin.getAllTeachers);
router.get("/getOneStudent",auth,authRole, admin.getOneStudent);
router.get("/getAllStudent",auth,authRole, admin.getAllStudent);
router.put("/updateTeacher",auth,authRole, updateTeacher);
router.post("/create-super-admin", admin.superAdmin);
router.post("/create-teacher",auth,authRole, teacher);
router.post("/create-student", auth,authRole, createStudent);
router.get("/dashboard", auth, authRole, admin.dashboard);
router.put("/makeStudentATeacher",auth, authRole, makeStudentATeacher)
// router.post()

module.exports = router;
