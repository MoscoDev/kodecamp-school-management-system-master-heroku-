const { Schema, model } = require("mongoose");
let date = new Date();

// users Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
      tirm: true,
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "teacher", "student"],
      default: "student",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "activated"],
      default: "pending",
      trim: true,
    },
    verificationCode: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//user profile schema
const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "permissions",
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: Number,
      min: [10, "Must be at least 10, got {VALUE}"],
      max: 14,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const permissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "teacher", "student"],
      default: "student",
      trim: true,
    },
  },
  { timestamps: true }
);

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  email: {
    type: String,
    required: true,
    tirm: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});
const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      tirm: true,
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "teacher", "student"],
      default: "student",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "activated"],
      default: "pending",
      trim: true,
    },
    verificationCode: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    stage: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const assignmentSchema = new Schema({
  teacher: {
    type: String,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
    enum: ["nodejs", "python", "frontend", "ui/ux"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  deadline: {
    type: Date,
    default: date.setDate(date.getDate() + 6),
    expires: 3600,
  },
});
exports.studentModel = model("student", studentSchema);

exports.assignmentModel = model("assignment", assignmentSchema);

exports.userModel = model("users", userSchema);
exports.profileModel = model("profiles", profileSchema);
exports.permissionModel = model("permissions", permissionSchema);
exports.tokenModel = model("tokens", tokenSchema);
