import { Schema, model,models } from "mongoose";
const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
});
const User = models.User || model('User', userSchema)
export default User;