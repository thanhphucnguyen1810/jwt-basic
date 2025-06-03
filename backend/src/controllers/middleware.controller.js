const jwt = require("jsonwebtoken");

const middlewareController = {
  // verify Token (xác nhận token)
  verifyToken: (req, res, next) => {
    const token = req.headers.token;   // lấy token từ người dùng
    if (token) {
      // Header: Bearer "123456"
      const accessToken = token.split(" ")[1];
      // Verify token
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next(); // đủ các điều kiện mới được đi tiếp
      });
    } else {
      res.status(401).json("You're not authenticated!!!");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin){
        next()
      } else {
        res.status(403).json('You\'re not allowed to delete other')
      }
    })
  }

}

module.exports = middlewareController;
