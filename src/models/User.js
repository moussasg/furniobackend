
// The validator = 'library 'is  used in Node.js for data validation various types of data : number , string , url
const bcrypt = require('bcrypt'); // library in the Node.js for hashing passwords securely.
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({ //
  urname : {
    type: String
  },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    }
  });
  userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt);
    next();
  });
  userSchema.statics.login = async function(email, password , urname) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
const User = mongoose.model('user', userSchema)//user=collectoin dans dbatlas
module.exports = User

