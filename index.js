const express = require('express');
const app = express();
// const morgan = require('morgan');
// require('dotenv').config();
const auth = require("./middleware/auth")
const authRole = require("./middleware/adminAuth")
const {getAllTeachers} = require('./modules/admin/handler')
// const cors = require('cors')
// handles public assets
app.use(express.static('public'));
// app.use(cors());
app.use(express.json({urlEncoded: false}))
// ejs template engine -> for parsing and using javascript in the html files
app.set('view engine', 'ejs');
app.set('views', 'views');
const mongoose = require('mongoose')
// app.use(morgan('dev'));

// connect to mongodb
mongoose.connect("mongodb+srv://moscoworld:eneyeme1012@cluster0.bayok.mongodb.net/users?retryWrites=true&w=majority")

// mongoose.connect('mongodb://127.0.0.1:27017/users')

// routes component
const route = moduleName => require(`./modules/${moduleName}/routes`);

// routes -> for the modules
app.use("/", route("sample"));
app.use("/admin", route("admin"));
// app.use("/assignment", route("assignment"));
app.use("/teacher", route("teacher"));
app.use("/", route("user"));
app.get("/students",auth,authRole, getAllTeachers)

app.get("/teachers", auth, authRole,getAllTeachers)

app.get("/admins",auth,authRole)



// error handlers
const { notFoundErrorHandler, serverErrorHandler } = require('./utils/helper');
const { urlencoded } = require('express');
// const { serverErrorHandler } = require('./modules/sample/handler');
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

app.set("port", process.env.PORT || 3000);
app.listen(3000, ()=> console.log("server running on port "))
module.exports = app;
