import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"

export const pembimbingDudiRouter = express.Router()

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
