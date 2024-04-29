import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"
import { pembimbingDudiMiddleware } from "../middleware/pembimbingDudiMiddleware.js"

export const pembimbingDudiRouter = express.Router()


// pembimbing dudi login 
pembimbingDudiRouter.post("/login",pembimbingDudiController.pembimbingDudiLogin)

// middleware
pembimbingDudiRouter.use(pembimbingDudiMiddleware)

pembimbingDudiRouter.get('/getPembimbingDudi', pembimbingDudiController.getPembimbingDudiById)
pembimbingDudiRouter.get('/getSiswaPembimbingDudi/:id', pembimbingDudiController.getSiswaPembimbingDudi)
pembimbingDudiRouter.get('/getAllSiswaPembimbingDudi', pembimbingDudiController.getAllSiswaPembimbingDudi)


// pengajuan pkl
pembimbingDudiRouter.get('/getAllPengajuanPkl', pembimbingDudiController.getAllPengajuanPkl)
pembimbingDudiRouter.get('/getPengajuanPklById/:id', pembimbingDudiController.getPengajuanPklById)
pembimbingDudiRouter.put('/updateStatusPengajuanpkl/:id_pengajuan', pembimbingDudiController.updateStatusPengajuanPkl)


// cancel pkl
pembimbingDudiRouter.get('/getAllCancelPkl', pembimbingDudiController.getAllCancelPkl)
pembimbingDudiRouter.get('/getCancelPklById/:id', pembimbingDudiController.getCancelPklById)
pembimbingDudiRouter.put('/updateStatusCancelPkl/:id', pembimbingDudiController.updateStatusCancelPkl)


// laporan pkl
pembimbingDudiRouter.post("/AddLaporanPkl",pembimbingDudiController.AddLaporanPkl)
pembimbingDudiRouter.put("/updateLaporanPkl/:id",pembimbingDudiController.updateLaporanPkl)
pembimbingDudiRouter.delete("/deleteLaporanPkl/:id",pembimbingDudiController.deleteLaporanPkl)
pembimbingDudiRouter.get("/findAllLaporanPkl",pembimbingDudiController.findAllLaporanPkl)
pembimbingDudiRouter.get("/findLaporanPklById/:id",pembimbingDudiController.findLaporanPklById)
pembimbingDudiRouter.get("/findLaporanPklFilter",pembimbingDudiController.findLaporanPklFilter)


// absen
pembimbingDudiRouter.get("/cetakAbsen",pembimbingDudiController.cetakAbsen)
