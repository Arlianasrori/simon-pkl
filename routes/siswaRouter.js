import express from "express"
import siswaController from "../controller/siswaController.js"

export const siswaRouter = express.Router()

siswaRouter.get('/getSiswaById/:id', siswaController.getSiswaById)

// dudi
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudi/:id', siswaController.getDudiById)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)

// pengajuan pkl
siswaRouter.post('/pengajuanPkl', siswaController.addPengajuanPkl)
siswaRouter.get('/findAllPengajuanPkl/:id_siswa', siswaController.findAllPengajuanPkl)
siswaRouter.get('/findPengajuanPklByStatus', siswaController.findPengajuanPklByStatus)
siswaRouter.get('/findPengajuanPkl/:id', siswaController.findPengajuanPklbyId)
siswaRouter.post('/cancelPengajuanPkl', siswaController.cancelPengajuanPkl)


// cancel pkl siswa
siswaRouter.post('/addCancelPkl/:id_siswa', siswaController.addCancelPkl)
siswaRouter.put('/cancelPkl/cancel', siswaController.cancelPengajuanCancelPkl)
siswaRouter.get('/getCancelPklBySiswa/:id_siswa', siswaController.getCancelPklBySiswa)
siswaRouter.get('/getCancelPklById/:id', siswaController.getCancelPklById)