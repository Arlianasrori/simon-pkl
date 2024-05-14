import express from "express"
import { auth, authAdminDeveloper } from "../controller/authController.js"

export const authRouter = express.Router()

authRouter.post("/auth",auth)
authRouter.post("/authAdminDeveloper",authAdminDeveloper)