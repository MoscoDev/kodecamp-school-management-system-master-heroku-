const { info, error, success } = require("consola");
module.exports = async (req, res, next) => {
    if (req.user.role !== "superAdmin") {
      error({ message: "only super admin are allowed", badge: true });
      return res.status(401).json({ ok: false, message: "only super admins are  allowed" });
    }
    info({message: 'Super admin access granted...', badge: true})
    success({message: 'processing dashboard...', badge: true})
    next();
};
