const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const joi = require("joi");
const { v4: uuid } = require("uuid");
const {
  userModel,
  profileModel,
  permissionModel,
  tokenModel,
  studentModel,assignmentModel
} = require("../admin/model");
// const { studentModel } = require("../user/model");
const mailService = require("../../utils/email");
const { log } = require("console");
const { success, error, info } = require("consola");
log("teacher handler loaded");
const mongoose = require("mongoose");

exports.teacher = async (req, res) => {
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  try {
    let { name, password, email } = req.body;
    password = await bcrypt.hash(password, 10);

    // check if teacher exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists) {
      log(ifEmailExists, "teacher already exists");
      res.status(400).json({
        message: "teacher already exists",
      });
    }
    const teacher = {
      name,
      email,
      password,
      status: "activated",
      isAdmin: false,
      role: "teacher",
    };
    const ifUser = await userModel.create(teacher);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
      type: "teacher",
    };
    const ifPermission = await permissionModel.create(permission);
    // create profile
    const profile = {
      ...teacher,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);
    log("Teacher created successfully");
    res.status(201).json({
      ok: true,
      profile,
      message: `${teacher.role} Registration Successful`,
    });
  } catch (err) {
    log(err, "error in teacher creation");
    return res.status(500).json({ ok: false, message: err.message });
  }
};

// create Student Account
exports.createStudent = async (req, res) => {
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  try {
    let { name, password, email } = req.body;
    password = await bcrypt.hash(password, 10);

    // check if student exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists) {
      log(ifEmailExists, "teacher already exists");
      res.status(400).json({
        message: "user with this Email already exists",
      });
    }
    const student = {
      name,
      email: email.toLowerCase(),
      password,
      status: "activated",
      isAdmin: false,
      role: "student",
      stage: 1,
    };
    const ifUser = await studentModel.create(student);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
      type: "student",
    };
    const ifPermission = await permissionModel.create(permission);
    // create profile
    const profile = {
      ...student,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);
    log("Student created successfully");
    res.status(201).json({
      ok: true,
      profile,
      message: `student Registration Successful`,
    });
  } catch (err) {
    log(err, "error in student creation");
    return res.status(500).json({ ok: false, message: err.message });
  }
};

// teacher signIn
exports.signin = async (req, res) => {
  const objSchema = joi.object({
    password: joi.string().required(),

    email: joi.string().email().required(),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let email = data.email;
    let password = data.password;

    let type = "teacher";
    info({ email, password, badge: true });
    let user = await userModel.findOne({ email });
    if ((user && user.role === type) || "superAdmin") {
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
        role: user.role,
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
    res.status(500).json({ ok: false, message: err.message });
  }
};

//signin
//  promote student

exports.promoteStudent = async (req, res) => {
  try {
    let studentName = req.body.name;
    let user = await studentModel.findOne({ name: studentName });
    if (user) {
      await studentModel.updateOne(
        { name: studentName },
        { name: studentName }
      );
      if (user.stage < 9) {
        user.stage = user.stage + 1;
        await user.save();
        res.status(200).json({
          ok: true,
          message: `${user.name} has been promoted to stage ${user.stage}`,
        });
      } else {
        res.status(200).json({
          okay: true,
          message: "user cannot be promoted to stage higher than stage 9",
        });
      }
    } else {
      res.status(404).json({
        ok: false,
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      okay: false,
      message: err.message,
    });
  }
};

//  demote student
exports.demoteStudent = async (req, res) => {
  try {
    let studentName = req.body.name;
    let user = await studentModel.findOne({ name: studentName });
    if (user) {
      await studentModel.updateOne(
        { name: studentName },
        { name: studentName }
      );
      if (user.stage > 1) {
        user.stage = user.stage - 1;
        await user.save();
        res.status(200).json({
          ok: true,
          message: `${user.name} has been demoted to stage ${user.stage}`,
        });
      } else {
        res.status(200).json({
          okay: true,
          message: "user cannot be demoted to an lesser than stage 1",
        });
      }
    } else {
      res.status(404).json({
        ok: false,
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      okay: false,
      message: err.message,
    });
  }
};

//  demote student
exports.demoteStudent = async (req, res) => {
  try {
    let studentName = req.body.name;
    let user = await studentModel.findOne({ name: studentName });
    if (user) {
      await studentModel.updateOne(
        { name: studentName },
        { name: studentName }
      );
      if (user.stage > 1) {
        user.stage = user.stage - 1;
        await user.save();
        res.status(200).json({
          ok: true,
          message: `${user.name} has been demoted to stage ${user.stage}`,
        });
      } else {
        res.status(200).json({
          okay: true,
          message: "user cannot be demoted to an lesser than stage 1",
        });
      }
    } else {
      res.status(404).json({
        ok: false,
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      okay: false,
      message: err.message,
    });
  }
};

// make student an admin
exports.makeStudentATeacher = async (req, res) => {
  try {
    let studentName = req.body.name;
    let user = await studentModel.findOne({ name: studentName });
    console.log(user, studentName);
    if (user) {
      await studentModel.updateOne(
        { name: studentName },
        { name: studentName }
      );
      user.role = "teacher";
      await user.save();
      res.status(200).json({
        ok: true,
        message: `${user.name} made a ${user.role}`,
      });
    } else {
      res.status(404).json({
        ok: false,
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      okay: false,
      message: err.message,
    });
  }
};
exports.createAssignment = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email().required(),

    track: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required(),
  });
  try {
    const data = await objSchema.validateAsync(req.body);
    console.log(data)
    let {email, password} = data
    let user = await userModel.findOne({ email: data.email });
    if (user && user.role === "teacher") {
      const assignment = {
        teacher: user.name,
        track: data.track,
        title: data.title,
        description: "data.description"
      }
      await assignmentModel.create(assignment)
      res
        .json({ ok: true, message: "assignment successfully created" })
        .status(200);
    } else {
      {
        res
          .json({
            ok: false,
            message: "only registered teacher can create assignments",
          })
          .status(404);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      okay: false,
      message: err.message,
    });
  }
};

// 