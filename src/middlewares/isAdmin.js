const isAdmin = (req, res, next) => {
  const { isAdmin } = req.user;

  if (!isAdmin) return res.json({ message: "Permission Denied" });

  next();
};

module.exports = isAdmin;
