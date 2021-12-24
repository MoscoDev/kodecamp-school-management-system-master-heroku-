// require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const { tokenModel} = require("../modules/admin/model");


module.exports = async (req, res, next) => {

  const authHeader = (req.headers.authorization) ;

  // If token doesn't Exit
  if (!authHeader) {
    res.status(401).json({
      status: 401,
      message: "no token, authorization denied",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    await jwt.verify(token, "Jesus_secret", (err, user) => {
      if (err) {
        res.status(403).json({
          status: 403,
          message: "Token is not valid",
        });
        return;
      }

      req.user = user;

      next();
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
