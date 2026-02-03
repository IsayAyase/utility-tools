import envvars from "@/constants/envvars";
import mongoose from "mongoose";
import { DbError } from "./util";

let isConnected = false;

export default async function connectDB() {
    try {
        if (isConnected) {
            console.log("[DB] Using existing database connection");
            return
        };

        const MONGO_URI = envvars.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error("[DB] MONGO_URI is not defined");
        }
        const conn = await mongoose.connect(MONGO_URI as string, {
            dbName: "blade-tools",
        });

        isConnected = conn.connections[0].readyState === 1;
        console.log("[DB] Using new database connection");
        return;
    } catch (error) {
        throw new DbError(500, "[DB] Database connection error");
    }
};
