import express from "express"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

adminRouter.post('/addSiswa',adminController.addSiswa)
adminRouter.post('/addGuruPembimbing',adminController.addGuruPembimbing)
adminRouter.post('/addDudi',adminController.addDudi)