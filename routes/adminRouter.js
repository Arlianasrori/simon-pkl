import express from "express"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

// siswa router
adminRouter.post('/addSiswa',adminController.addSiswa)
adminRouter.get('/allSiswa',adminController.findAllSiswa)
adminRouter.put('/updateSiswa/:identify',adminController.updateSiswa)
adminRouter.delete('/deleteSiswa/:id',adminController.deleteSiswa)
adminRouter.put('/updateSiswa/alamat/:id',adminController.updateAlamatSiswa)

// guru pembimbing router
adminRouter.post('/addGuruPembimbing',adminController.addGuruPembimbing)

// dudi router
adminRouter.post('/addDudi',adminController.addDudi)

// pembimbing dudi router
adminRouter.post('/addPembimbingDudi',adminController.addPembimbingDudi)