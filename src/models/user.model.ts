import { Schema, Document, model, Types, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../configAndConstants.js';
import ms from 'ms';
import { tokenPayload } from '../payload';
import { IUser, Role } from '../user';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.active;
      },
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Member'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'companies',
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.checkPassword = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 13);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

userSchema.methods.generateAccessToken = function (this: IUser): string {
  const payload: tokenPayload = {
    _id: this._id,
    name: this.name,
    email: this.email,
    companyId: this.companyId.toString(),
  };
  return jwt.sign(payload, env.ACCESS_TOKEN_KEY as string, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as ms.StringValue,
  });
};

userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const payload: tokenPayload = { _id: this._id };
  return jwt.sign(payload, env.ACCESS_TOKEN_KEY as string, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as ms.StringValue,
  });
};

export const User = model('users', userSchema);
