import {
    CallbackError,
    HydratedDocument,
    Schema,
    model,
    models,
} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    email: string;
    username: string;
    password: string;
    name?: string;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
});

// Hash passwords before adding new document when save call run on UserSchema
UserSchema.pre("save", async function (next) {
    const user = this as HydratedDocument<IUser>;

    // Do nothing if the password is not being updated
    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

const User = models.User || model<IUser>("User", UserSchema);
export default User;
