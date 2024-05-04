import express from "express"
import siswaController from "../controller/siswaController.js"
import { siswaMiddleware } from "../middleware/siswaMiddleware.js"

export const siswaRouter = express.Router()

// siswa login 
siswaRouter.post("/login",siswaController.siswaLogin)

// middlewarew
siswaRouter.use(siswaMiddleware)


siswaRouter.get('/getSiswa', siswaController.getSiswaById)
siswaRouter.get('/getProfile', siswaController.getProfile)

// dudi
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudi/:id', siswaController.getDudiById)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)

// pengajuan pkl
siswaRouter.post('/pengajuanPkl', siswaController.addPengajuanPkl)
siswaRouter.get('/findAllPengajuanPkl', siswaController.findAllPengajuanPkl)
siswaRouter.get('/findPengajuanPklByStatus', siswaController.findPengajuanPklByStatus)
siswaRouter.get('/findPengajuanPkl/:id', siswaController.findPengajuanPklbyId)
siswaRouter.post('/cancelPengajuanPkl', siswaController.cancelPengajuanPkl)


// cancel pkl siswa
siswaRouter.post('/addCancelPkl/:id_siswa', siswaController.addCancelPkl)
siswaRouter.put('/cancelPkl/cancel', siswaController.cancelPengajuanCancelPkl)
siswaRouter.get('/getCancelPkl', siswaController.getCancelPklBySiswa)
siswaRouter.get('/getCancelPklById/:id', siswaController.getCancelPklById)

// Laporan Pkl Siswa 
siswaRouter.post("/AddLaporanSiswaPkl",siswaController.AddLaporanSiswaPkl)
siswaRouter.put("/updateLaporanSiswaPkl/:id",siswaController.updateLaporanSiswaPkl)
siswaRouter.delete("/deleteLaporanSiswaPkl/:id",siswaController.deleteLaporanSiswaPkl)
siswaRouter.get("/findAllLaporanSiswaPkl",siswaController.findAllLaporanSiswaPkl)
siswaRouter.get("/findLaporanSiswaPklById/:id",siswaController.findLaporanSiswaPklById)
siswaRouter.get("/findLaporanSiswaPklFilter",siswaController.findLaporanSiswaPklFilter)
