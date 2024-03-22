import express from "express"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

// siswa router
adminRouter.post('/addSiswa',adminController.addSiswa)
adminRouter.get('/allSiswa',adminController.findAllSiswa)
adminRouter.get('/findSiswaFilter',adminController.findsiswafilter)
adminRouter.put('/updateSiswa/:identify',adminController.updateSiswa)
adminRouter.delete('/deleteSiswa/:id',adminController.deleteSiswa)
adminRouter.put('/updateSiswa/alamat/:id',adminController.updateAlamatSiswa)

// guru pembimbing router
adminRouter.post('/addGuruPembimbing',adminController.addGuruPembimbing)
adminRouter.get('/findAllGuruPembimbing',adminController.findAllGuruPembimbing)
adminRouter.get('/findGuruPembimbing/:id',adminController.findGuruPembimbingById)
adminRouter.put('/updateGuruPembimbing/:identify',adminController.updateGuruPembimbing)
adminRouter.delete('/deleteGuruPembimbing/:identify',adminController.deleteGuruPembimbing)

// dudi router
adminRouter.post('/addDudi',adminController.addDudi)
adminRouter.get('/findAllDudi',adminController.findAllDudi)


// pembimbing dudi router
adminRouter.post('/addPembimbingDudi',adminController.addPembimbingDudi)