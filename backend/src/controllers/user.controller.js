
const User = require("../models/user.model");

const userController = {
  // get All User
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();  // .find(): trả về tất cả các user trong DB
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // delete user
  deleteUser: async (req, res)  => {
    try {
      // v1/user/123 --> req.params.id = 123
      const user = User.findById(req.params.id);

      // Xóa trong database luôn
      // const user = await User.findByIdAndDelete(req.params.id);
      
      res.status(200).json("Delete successfully!");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  
}

module.exports = userController;
