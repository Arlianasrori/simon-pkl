import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"
import { pembimbingDudiMiddleware } from "../middleware/pembimbingDudiMiddleware.js"

export const pembimbingDudiRouter = express.Router()

// middleware
pembimbingDudiRouter.use(pembimbingDudiMiddleware)

// pembimbing dudi login 
pembimbingDudiRouter.post("/pembimbingDudiLogin",pembimbingDudiController.pembimbingDudiLogin)

pembimbingDudiRouter.get('/getPembimbingDudiById/:id', pembimbingDudiController.getPembimbingDudiById)
pembimbingDudiRouter.get('/getSiswaPembimbingDudi/:id', pembimbingDudiController.getSiswaPembimbingDudi)
pembimbingDudiRouter.get('/getAllSiswaPembimbingDudi/:id', pembimbingDudiController.getAllSiswaPembimbingDudi)


// pengajuan pkl
pembimbingDudiRouter.get('/getAllPengajuanPkl/id', pembimbingDudiController.getAllPengajuanPkl)
pembimbingDudiRouter.get('/getPengajuanPklById/:id', pembimbingDudiController.getPengajuanPklById)
pembimbingDudiRouter.put('/updateStatusPengajuanpkl/:id_pengajuan', pembimbingDudiController.updateStatusPengajuanPkl)


// cancel pkl
pembimbingDudiRouter.get('/getAllCancelPkl/:id_pembimbing_dudi', pembimbingDudiController.getAllCancelPkl)
pembimbingDudiRouter.get('/getCancelPklById/:id', pembimbingDudiController.getCancelPklById)
pembimbingDudiRouter.put('/updateStatusCancelPkl/:id', pembimbingDudiController.updateStatusCancelPkl)


// laporan pkl
pembimbingDudiRouter.post("/AddLaporanPkl",pembimbingDudiController.AddLaporanPkl)
pembimbingDudiRouter.put("/updateLaporanPkl/:id",pembimbingDudiController.updateLaporanPkl)
pembimbingDudiRouter.delete("/deleteLaporanPkl/:id",pembimbingDudiController.deleteLaporanPkl)
pembimbingDudiRouter.get("/findAllLaporanPkl/:id_pembimbing_dudi",pembimbingDudiController.findAllLaporanPkl)
pembimbingDudiRouter.get("/findLaporanPklById/:id",pembimbingDudiController.findLaporanPklById)
pembimbingDudiRouter.get("/findLaporanPklFilter/:id_dudi",pembimbingDudiController.findLaporanPklById)
