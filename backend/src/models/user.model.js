
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    unique: true    // trả về lỗi khi trùng username
  },
  email: {
    type: String,
    require: true,
    minlength: 10, 
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 8
  },
  admin: {
    type: Boolean,
    default: false  // ban đầu các user không phải admin
  }
}, { timestamps:true })

module.exports = mongoose.model("User", userSchema)
