import express from "express"
import path from "path";
import { config } from "dotenv";
import { initiateApp } from "./Src/Utils/InitiateApp.js";
config({ path: path.resolve("./config/config.env") });

const app=express();

initiateApp(app,express)


