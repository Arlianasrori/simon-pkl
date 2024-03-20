import express from "express"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

// siswa router
adminRouter.post('/addSiswa',adminController.addSiswa)

// guru pembimbing router
adminRouter.post('/addGuruPembimbing',adminController.addGuruPembimbing)

// dudi router
adminRouter.post('/addDudi',adminController.addDudi)

// pembimbing dudi router
adminRouter.post('/addPembimbingDudi',adminController.addPembimbingDudi)