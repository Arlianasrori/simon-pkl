import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"
import { pembimbingDudiMiddleware } from "../middleware/pembimbingDudiMiddleware.js"
import { refreshPembimbingDudiMiddleware } from "../middleware/refreshPembimbingDudiMiddleware.js"

export const pembimbingDudiRouter = express.Router()

// token
pembimbingDudiRouter.get("/refreshToken",refreshPembimbingDudiMiddleware,pembimbingDudiController.refreshToken)

// middleware
pembimbingDudiRouter.use(pembimbingDudiMiddleware)

// updatePasswordSiswa
// pembimbingDudiRouter.put("/updatePassword/:id",pembimbingDudiController.updatePassword)

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

// absen jadwal
pembimbingDudiRouter.post("/addJadwalAbsen",pembimbingDudiController.addJadwalAbsen)
pembimbingDudiRouter.get("/findAllAbsenjadwal",pembimbingDudiController.findAllJadwalAbsen)
pembimbingDudiRouter.get("/findJadwalAbsenById/:id",pembimbingDudiController.findJadwalAbsenById)
pembimbingDudiRouter.get("/cekJadwalAbsen",pembimbingDudiController.cekJadwalAbsen)


// add kordinat
pembimbingDudiRouter.post("/addKoordinat",pembimbingDudiController.addKordinat)
pembimbingDudiRouter.get("/findAllKoordinat",pembimbingDudiController.findAllKordinat)
pembimbingDudiRouter.get("/findKoordinatById/:id_koordinat",pembimbingDudiController.findKoordinatById)
pembimbingDudiRouter.delete("/deleteKoordinat/:id_koordinat",pembimbingDudiController.deleteKoordinat)
pembimbingDudiRouter.get("/cekKoordinat",pembimbingDudiController.cekKoordinat)

// absen
pembimbingDudiRouter.get("/findAllAbsen",pembimbingDudiController.findAllAbsen)
pembimbingDudiRouter.get("/findAbsenById/:id",pembimbingDudiController.findAbsenById)
pembimbingDudiRouter.get("/cetakAbsen",pembimbingDudiController.cetakAbsen)
pembimbingDudiRouter.get("/cetakAlisisAbsen",pembimbingDudiController.cetakAnalisisAbsen)

// Kuota Siswa
pembimbingDudiRouter.post("/addKuotaSiswa",pembimbingDudiController.addKuotaSiswa)
pembimbingDudiRouter.put("/updateKuotaSiswa/:id",pembimbingDudiController.updateKuotaSiswa)
pembimbingDudiRouter.delete("/deleteKuotaSiswa/:id",pembimbingDudiController.deleteKuotaSiswa)
pembimbingDudiRouter.get("/findAllKouta",pembimbingDudiController.findAllKouta)
pembimbingDudiRouter.get("/findKoutaById/:id",pembimbingDudiController.findKoutaById)


// notification
pembimbingDudiRouter.post("/addNotification",pembimbingDudiController.addNotification)

