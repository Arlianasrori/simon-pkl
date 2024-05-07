import express from "express"
import adminDeveloperController from "../controller/adminDeveloperController.js"

export const adminDeveloperRouter = express.Router()

// sekolah
adminDeveloperRouter.post("/addSekolah",adminDeveloperController.addSekolah)
adminDeveloperRouter.put("/updateSekolah/:id",adminDeveloperController.updateSekolah)
adminDeveloperRouter.delete("/deleteSekolah/:id",adminDeveloperController.deleteSekolah)
adminDeveloperRouter.get("/getAllSekolah",adminDeveloperController.getAllSekolah)
adminDeveloperRouter.get("/getSekolah/:id",adminDeveloperController.getSekolahById)


// admin
adminDeveloperRouter.post('/addAdmin', adminDeveloperController.addAdmin)
adminDeveloperRouter.put('/updateAdmin/:id', adminDeveloperController.updateAdmin)
adminDeveloperRouter.delete('/deleteAdmin/:id', adminDeveloperController.deleteAdmin)
adminDeveloperRouter.get('/getAdminById/:id', adminDeveloperController.getAdminById)
adminDeveloperRouter.get('/getAllAdmin', adminDeveloperController.getAllAdmin)