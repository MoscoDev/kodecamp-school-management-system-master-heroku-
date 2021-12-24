const { info, error, success } = require("consola");
module.exports = async (req, res, next) => {
    if (req.user.role !== "teacher") {
      error({ message: "only Teachers are allowed", badge: true });
      return res.status(401).json({ ok: false, message: "only Teachers are  allowed" });
    }
    info({message: 'Teacher access granted...', badge: true})
    success({message: 'processing dashboard...', badge: true})
    next();
};
