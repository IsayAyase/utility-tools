import mongoose from "mongoose";
import type { IFeedback } from "./types";

const feedbackSchema = new mongoose.Schema<IFeedback>({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    type: {
        type: String,
        required: true,
        minLength: 5,
        maxlength: 50
    },
    message: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 1000
    },
    markAsRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

feedbackSchema.index(
    {
        email: 1
    },
    {
        expireAfterSeconds: 60 * 60 * 24 * 90
    }
)

export default (
    mongoose?.models?.Feedback as mongoose.Model<IFeedback>
    || mongoose.model<IFeedback>("Feedback", feedbackSchema)
);