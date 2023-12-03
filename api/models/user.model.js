import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'a user must have an unique username'],
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'please enter a email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'please provide a valid email address'],
    },
    avatar: {
      type: String,
    },

    password: {
      type: String,
      required: [true, 'password cannot be empty'],
      minlength: [8, 'password must contain minimum 8 character'],
      //to hide password in every req
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      validate: {
        //if become false then it will show error message
        //This will only works on SAVE or CREATE !! not work for findOneandUpdate this type of method
        validator: function (pass) {
          return pass === this.password;
        },
        message: 'password does not match , try again',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTtimestamps) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimestamps < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;