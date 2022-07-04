import mongoose from 'mongoose';

interface IUser {
  email: string,
  password: string
}

interface UserDoc extends mongoose.Document {
  email: string,
  password: string
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
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