// const { Schema, model } = require("mongoose");
// // users Schema
// const studentSchema = new Schema(
//   {
//     name: {
//       type: String,
//       // required: true,
//       tirm: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       tirm: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: ["superAdmin", "admin", "teacher", "student"],
//       default: "student",
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "activated"],
//       default: "pending",
//       trim: true,
//     },
//     verificationCode: {
//       type: String,
//     },
//     isAdmin:{
//       type: Boolean,
//       default: false,
//     },
//     stage:{
//       type: Number,
//       default: 1,
//     }
//   },
//   { timestamps: true }
// );

// exports.studentModel = model("student",studentSchema);
