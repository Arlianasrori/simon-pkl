import express from "express"
import siswaController from "../controller/siswaController.js"

export const siswaRouter = express.Router()

siswaRouter.get('/getSiswaById/:id', siswaController.getSiswaById)
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudi/:id', siswaController.getDudiById)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)
siswaRouter.get('/findAllPengajuanPkl/:id_siswa', siswaController.findAllPengajuanPkl)
siswaRouter.get('/findPengajuanPklByStatus', siswaController.findPengajuanPklByStatus)
siswaRouter.get('/findPengajuanPkl/:id', siswaController.findPengajuanPklbyId)
siswaRouter.post('/pengajuanPkl', siswaController.addPengajuanPkl)
siswaRouter.post('/cancelPengajuanPkl', siswaController.cancelPengajuanPkl)