const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const joi = require("joi");
const { v4: uuid } = require("uuid");
const {
  userModel,
  profileModel,
  permissionModel,
  studentModel,
  assignmentModel,
} = require("../admin/model");
const { log } = require("console");

exports.signup = async (req, res) => {
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    cpassword: joi.ref("password"),
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

exports.signin = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    let { email, password } = data;
    let user = await studentModel.findOne({ email });
    if (user) {
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        console.log(false, "failed");
        return res.status(400).json({
          ok: false,
          message: "Incorrect Password, User Login failed",
        });
      }
      console.log("password: %d", true);

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
      };

      const token = jwt.sign(payload, "Jesus_secret", { expiresIn: 86400 });
      // create storeSessionToken
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        return res.status(200).json({
          ok: true,
          message: "User loggedIn",
          token,
          id: user.id,
        });
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

exports.verify = async (req, res) => {
  let verificationCode = { verificationCode: req.query.token };
  try {
    userModel.findOne(verificationCode, async (err, user) => {
      if (!user) {
        console.log({ ok: false, message: err + "user not found" });
        return res.status(404).json({ ok: false, message: "User not found" });
      }
      let getURl = jwt.verify(user.verificationCode, SECRET);
      console.log(getURl);
      let Url = await getURl.Url;
      let name = await getURl.name;
      user.status = "activated";
      user.verificationCode = "";
      await user.save((err) => {
        if (err) {
          res.status(500).json({ ok: false, message: err.message });
          return;
        }
        // account verification confirmation notification
        mailService.sendEmail({
          email: user.email,
          subject: "Account Activated",
          body: pageWelcome(name, Url),
        });
        res.status(200).render("activated", { message: "account activated" });
      });
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

// get assignment

exports.getOneAssignment = async (req, res) => {
  try {
    let title = req.body.title;
    let assignment = await assignmentModel.find({ title });
    if (assignment) {
      return res.status(200).json({
        ok: true,
        assignment,
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Title, assignment not found" });
    }
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
};
