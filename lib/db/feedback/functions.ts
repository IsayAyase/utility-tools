"use server";

import type mongoose from "mongoose";
import connectDB from "../connect";
import { DbError } from "../util";
import FeedBackModel from "./model";
import type { IAddFeedbackInput, IFeedback, IGetFeedbackInput } from "./types";

async function addFeedback(f: IAddFeedbackInput) {
    try {
        await connectDB();

        if (!f.name || !f.email || !f.type || !f.message) {
            throw new DbError(400, "Missing required fields!");
        }

        const feedback = new FeedBackModel(f);

        await feedback.save();

        return feedback;
    } catch (error) {
        console.error("[DB] [feedback:addFeedback]", error)
        throw new DbError(500, "Something went wrong!");
    }
}

async function getFeedback(d: IGetFeedbackInput) {
    try {
        await connectDB();

        const limit = d.limit || 10;
        const skip = (d.page || 1) * limit - limit;

        // Build match condition
        const matchConditions: any[] = [];
        if (d.id) matchConditions.push({ _id: { $eq: d.id } });
        if (d.type) matchConditions.push({ type: { $eq: d.type } });
        matchConditions.push({ markAsRead: { $eq: d.markAsRead || false } });

        const feedbacks = await FeedBackModel.aggregate([
            {
                $match: matchConditions.length > 0 ? { $and: matchConditions } : {},
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 1,
                    id: "$_id",
                    name: 1,
                    email: 1,
                    type: 1,
                    message: 1,
                    markAsRead: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            }
        ]);

        return feedbacks as IFeedback[];
    } catch (error) {
        console.error("[DB] [feedback:getFeedback]", error)
        throw new DbError(500, "Something went wrong!");
    }
}

async function markAsRead(id: string | mongoose.Types.ObjectId | "all") {
    try {
        await connectDB();
        if (id === "all") {
            await FeedBackModel.updateMany({}, { $set: { markAsRead: true } });
            return;
        }
        await FeedBackModel.updateOne({ _id: id }, { $set: { markAsRead: true } });
    } catch (error) {
        console.error("[DB] [feedback:markAsRead]", error)
        throw new DbError(500, "Something went wrong!");
    }
}

async function deleteFeedback(id: string | mongoose.Types.ObjectId | "all") {
    try {
        await connectDB();
        if (id === "all") {
            await FeedBackModel.deleteMany({});
            return;
        }
        await FeedBackModel.deleteOne({ _id: id });
    } catch (error) {
        console.error("[DB] [feedback:deleteFeedback]", error)
        throw new DbError(500, "Something went wrong!");
    }
}

export { addFeedback, deleteFeedback, getFeedback, markAsRead };

