import type mongoose from "mongoose";

export const feedbackTypes = ['general', 'feature-request', 'suggestions', 'bug-report', 'other'] as const

export type FeedbackTypesType = typeof feedbackTypes[number]

export interface IFeedback {
    id: string | mongoose.Types.ObjectId;
    name: string;
    email: string;
    type: FeedbackTypesType;
    message: string;
    markAsRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAddFeedbackInput {
    name: string;
    email: string;
    type: FeedbackTypesType;
    message: string;
}

export interface IGetFeedbackInput {
    id?: string | mongoose.Types.ObjectId;
    type?: FeedbackTypesType;
    markAsRead?: boolean;
    limit?: number;
    page?: number;
}