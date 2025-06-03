const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

let refreshTokens = [];

const authController = {
  // Register
  registerUser: async (req, res) => {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed
      });

      // Save to Database
      const user = await newUser.save();
      res.status(200).json(user);

    } catch (error) {
      res.status(500).json(err);
    }
  },

  // generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "30s"
      }
    )
  },

  // generate refresh token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "365d"
      }
    )
  },

  // Login
  loginUser: async (req, res) => {
    try {
      // Tìm user
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username!!!");
      }

      // So sánh password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword){
        res.status(404).json("Wrong password!!!");
      }

      // Đăng nhập thành công -> tạo json web token
      if (user  && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        // Lưu token vào local storage
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);

        // Lưu token vào cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,  // set true khi deploy
          path: "/",
          sameSite: "strict",
        })

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Thường dùng Redis để lưu refresh token
  // Refresh Token
  requestRefreshToken: async (req, res) => {
    //1) Lấy refresh token từ user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json("You\'re not authenticated!!!");
    }
    if (!refreshTokens.includes(refreshToken)) {
      res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
        res.status(403).json("Refresh token is not valid");
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // 2) Tạo access token mới
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      // 3) Lưu access token và refresh token vào cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,  // set true khi deploy
        path: "/",
        sameSite: "strict",
      })
      res.status(200).json({ accessToken: newAccessToken });
    })
  },

  // user logout
  userLogout: async (req, res) => {
    // 
    res.clearCookie("refreshToken");
    refreshTokens= refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json("Logout successfully!");
  }
}

// STORE TOKEN
// 1) LOCAL STORAGE: Dễ bị tấn công XSS
// 2) COOKIE: ít bị ảnh hưởng XSS, dễ bị tấn công CSRF --> KHẮC PHỤC BỞI SAMESITE.
// 3) REDUX STORE --> ACCESS TOKEN VÀ HTTPONLY COOKIE --> REFRESH TOKEN

// 4) BFF PATTERN: (BACK END FOR FRONT END)

module.exports = authController;
