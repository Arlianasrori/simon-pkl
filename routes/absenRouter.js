import express from "express"
import absenController from "../controller/absenController.js"

export const absenRouter = express.Router()


// jadwal absen
absenRouter.post("/addJadwalAbsen",absenController.addJadwalAbsen)
absenRouter.get("/findAllJadwalAbsen/:id_pembimbing_dudi",absenController.findAllJadwalAbsen)
absenRouter.get("/findJadwalById/:id_jadwal",absenController.findJadwalAbsenById)


// absen
absenRouter.post("/absenMasuk",absenController.addAbsenMasuk)
absenRouter.post("/absenKeluar",absenController.addAbsenPulang)
absenRouter.post("/absenIzin",absenController.absenTidakMemenuhiJam)
absenRouter.get("/findAbsen/:id_siswa",absenController.findAbsen)
absenRouter.get("/findAbsenFilter",absenController.findAbsenFilter)
absenRouter.get("/analisisAbsen",absenController.analisisAbsen)
absenRouter.post("/izinTelat",absenController.absenIzintelat)
absenRouter.post("/absenDiLuarRadius",absenController.absenDiluarRadius)
absenRouter.post("/cekStatusAbsen",absenController.cekAbsen)


// kordinat absen
absenRouter.post("/addKordinatAbsen",absenController.addKordinatAbsen)
absenRouter.get("/findAllKordinatAbsen/:id_pembimbing_dudi",absenController.findAllKordinatAbsen)
absenRouter.post("/cekKordinat",absenController.cekRadiusKordinatAbsen)
absenRouter.delete("/deleteKordinat/:id_koordinat",absenController.deleteKoordinat)