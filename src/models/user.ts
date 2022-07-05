import mongoose from 'mongoose';

interface IUser {
  email: string
  emailCode?: string
  emailCodeDate?: Date
  emailVerified: boolean
  password: string
}

interface UserDoc extends mongoose.Document {
  email: string
  emailCode?: string
  emailCodeDate?: Date
  emailVerified: boolean
  password: string
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  emailCode: String,
  emailCodeDate: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  }

}, { timestamps: true });

const User = mongoose.model<UserDoc, UserModelInterface>('User', UserSchema);

UserSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

export { User, UserDoc, UserSchema };