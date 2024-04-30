import express from "express"
import adminDeveloperController from "../controller/adminDeveloperController.js"

export const adminDeveloperRouter = express.Router()

adminDeveloperRouter.post('/addAdmin', adminDeveloperController.addAdmin)
adminDeveloperRouter.put('/updateAdmin/:id', adminDeveloperController.updateAdmin)
adminDeveloperRouter.delete('/deleteAdmin/:id', adminDeveloperController.deleteAdmin)
adminDeveloperRouter.get('/getAdminById/:id', adminDeveloperController.getAdminById)
adminDeveloperRouter.get('/getAllAdmin', adminDeveloperController.getAllAdmin)