import express from "express"
import { auth } from "../controller/authController.js"

export const authRouter = express.Router()

authRouter.post("/auth",auth)