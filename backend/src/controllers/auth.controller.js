const bcrypt = require("bcrypt");

const User = require("../models/user.model")


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

      if (user  && validPassword) {
        res.status(200).json(user);
      }


    } catch (error) {
      res.status(500).json(error);
    }
  }

}

module.exports = authController;
