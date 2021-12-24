
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel, permissionModel, assignmentModel } = require("./model");
const mailService = require("../../utils/email");
const { log } = require("console");
const {success, error, info} = require('consola')
log("admin handler loaded");
const mongoose = require('mongoose')


exports.superAdmin = async (req, res) => {
  try {
    let { name, password, email } = {
      name: "moses",
      password: "admin1234",
      email: "moses@mail.com",
    };
    password = await bcrypt.hash(password, 10);

      // check if admin exists
      const ifEmailExists = await userModel.findOne({ email });
      if (ifEmailExists) {
        log(ifEmailExists, "admin already exists");
        res.status(400).json({
          message: "Admin already exists",
        });
      }
    const admin = {
      name,
      email,
      password,
      status: "activated",
      isAdmin: true,
      role: "superAdmin"
    };
    const ifUser = await userModel.create(admin);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
      type: "superAdmin",
    };
    const ifPermission = await permissionModel.create(permission);
    // create profile
    const profile = {
      ...admin,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);
    log("super admin created successfully");
    res.status(201).json({
      ok: true,
      profile,
      message: "Super Admin Registration Successful",
    });
  } catch (err) {
    log(err, "error in super admin creation");
    return(res.status(500).json({ ok: false, message: err.message }));
  }
};


exports.signin = async (req, res) => {
  const objSchema = joi.object({

    password: joi.string().required(),

    email: joi.string().email().required()
})
  try {
    let data = await objSchema.validateAsync(req.body);
    let email = data.email;
    let password = data.password
    info({email, password, badge: true});
    let user = await userModel.findOne({ email });
    if (user) {
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        console.log(false, "failed");
        return res.status(400).json({
          ok: false,
          message: "Incorrect Password, User Login failed",
        });
      }
      log("password: %d", true);

      if (user.status != "activated") {
        console.log("pending verification");
        return res.status(401).json({
          ok: false,
          message: "Pending account. Please verify your email",
        });
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: "superAdmin"  
      };

      const token = jwt.sign(payload, "Jesus_secret", { expiresIn: 86400 });
      return res.status(200).json({
        ok: true,
        message: `You are loggedIn as a ${user.role}`,
          token: `Bearer ${token}`,
        id: user.id,
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Email, user not found" });
    }
  } catch (err) {
    

    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.dashboard = (req, res) => {
  try {
    console.log("dashboard loading");
    res.render("dashboard", {});
  } catch (err) {
    console.log(err.message);
  }
};
// create Teacher



// get all teachers
exports.getAllTeachers = async (req, res) =>{
  let users = await userModel.find({ role: "teacher" });
  if (users) {
    
    return res.status(200).json({
      ok: true,
      message: "all users",
      users
    });
  } else {
    res
      .status(404)
      .json({ ok: false, message: "Incorrect Email, user not found" });
  } 
}

// get single Teacher by email
exports.getOneTeacher = async (req, res) =>{
  let email = req.body.email;
  let users = await userModel.find({ email });
  if (users) {
    
    return res.status(200).json({
      ok: true,
      message: "Teacher found",
      users
    });
  } else {
    res
      .status(404)
      .json({ ok: false, message: "Incorrect Email, user not found" });
  } 
}


// Update Teacher

exports.updateTeacher = async (req, res) => {
 let update = req.body;
 let filter = {name : "moses"}
  let doc = await userModel.findOneAndUpdate(filter, update, {
    new: true
  });
  res.status(200).json({
    ok: true,
    message: "Teacher found"
  })
}


// delete Teacher
// 
// create Admin
// Read Admin 
// Update Admin
// delete Admin


// create Student
// Read Student 
exports.getAllStudent = async (req, res) =>{
  let users = await userModel.find({ role: "student" });
  if (users) {
    
    return res.status(200).json({
      ok: true,
      message: "all students found",
      users
    });
  } else {
    res
      .status(404)
      .json({ ok: false, message: "Incorrect Email, user not found" });
  } 
}

// get single student by name

exports.getOneStudent = async (req, res) =>{
  let email = req.body.email;
  let users = await userModel.find({ email });
  if (users) {
    
    return res.status(200).json({
      ok: true,
      message: "student found",
      users
    });
  } else {
    res
      .status(404)
      .json({ ok: false, message: "Incorrect Email, user not found" });
  } 
}

