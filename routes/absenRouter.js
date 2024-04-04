import express from "express"
import absenController from "../controller/absenController.js"

export const absenRouter = express.Router()


// jadwal absen
absenRouter.post("/addJadwalAbsen",absenController.addJadwalAbsen)
absenRouter.get("/findAllJadwalAbsen/:id_pembimbing_dudi",absenController.findAllJadwalAbsen)
absenRouter.get("/findJadwalById/:id_jadwal",absenController.findJadwalAbsenById)


// absen
absenRouter.post("/absenMasuk",absenController.addAbsenMasuk)
absenRouter.post("/absenKeluar",absenController.addAbsenKeluar)
absenRouter.post("/absenIzin",absenController.absenTidakMemenuhiJam)
absenRouter.get("/findAbsen/:id_siswa",absenController.findAbsen)