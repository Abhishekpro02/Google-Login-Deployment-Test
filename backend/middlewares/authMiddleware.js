const isAuthnticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: "You have to login first",
  });
};

// export const isAuthnticated = (req, res, next) => {
//   const token = req.cookies["connect.sid"];
//   if (!token) {
//     return res.status(401).json({
//       message: "You have to login first",
//     });
//   }
//   next();
// };

export default isAuthnticated;
