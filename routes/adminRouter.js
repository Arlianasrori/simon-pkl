import express from "express"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

// siswa router
adminRouter.post('/addSiswa',adminController.addSiswa)
adminRouter.get('/findSiswa/:id',adminController.findSiswaById)
adminRouter.get('/findAllSiswa',adminController.findAllSiswa)
adminRouter.get('/findSiswaFilter',adminController.findsiswafilter)
adminRouter.get('/findSiswaHaventPkl',adminController.findSiswaHaventPkl)
adminRouter.put('/updateSiswa/:identify',adminController.updateSiswa)
adminRouter.delete('/deleteSiswa/:id',adminController.deleteSiswa)
adminRouter.put('/updateSiswa/alamat/:id',adminController.updateAlamatSiswa)

// jurusan
adminRouter.post('/addJurusan',adminController.addJurusan)
adminRouter.delete('/deleteJurusan/:id',adminController.deleteJurusan)
adminRouter.put('/updateJurusan/:id',adminController.updateJurusan)
adminRouter.get('/findAllJurusan',adminController.findAllJurusan)
adminRouter.get('/findJurusan/:id',adminController.findJurusanById)
adminRouter.get('/findJurusanFilter',adminController.findJurusanByNama)

// kelas
adminRouter.post('/addKelas',adminController.addKelas)
adminRouter.get('/findAllKelas',adminController.findAllKelas)
adminRouter.get('/findKelas/:id',adminController.findKelasById)
adminRouter.get('/findKelasFilter',adminController.findKelasFilter)
adminRouter.put('/updateKelas/:id',adminController.updateKelas)
adminRouter.delete('/deleteKelas/:id',adminController.deleteKelas)

// guru pembimbing router
adminRouter.post('/addGuruPembimbing',adminController.addGuruPembimbing)
adminRouter.get('/findAllGuruPembimbing',adminController.findAllGuruPembimbing)
adminRouter.get('/findGuruPembimbing/:id',adminController.findGuruPembimbingById)
adminRouter.get('/findGuruPembimbingFilter',adminController.findGuruPembimbingFilter)
adminRouter.put('/updateGuruPembimbing/:identify',adminController.updateGuruPembimbing)
adminRouter.put('/updateGuruPembimbing/alamat/:identify',adminController.updateAlamatGuruPembimbing)
adminRouter.delete('/deleteGuruPembimbing/:identify',adminController.deleteGuruPembimbing)

// dudi router
adminRouter.post('/addDudi',adminController.addDudi)
adminRouter.get('/findAllDudi',adminController.findAllDudi)
adminRouter.get('/findDudi/:id',adminController.findDudiById)
adminRouter.get('/findDudiFilter',adminController.findDudiFilter)
adminRouter.put('/updateDudi/:id',adminController.updateDudi)
adminRouter.put('/updateDudi/alamat/:id',adminController.updateAlamatDudi)
adminRouter.delete('/deleteDudi/:id',adminController.deleteDudi)


// pembimbing dudi router
adminRouter.post('/addPembimbingDudi',adminController.addPembimbingDudi)
adminRouter.get('/findallPembimbingDudi',adminController.findAllPembimbingDudi)
adminRouter.get('/findPembimbingDudi/:id',adminController.findPembimbingDudiById)
adminRouter.get('/findPembimbingDudiFilter',adminController.findPembimbingDudiFilter)
adminRouter.put('/updatePembimbingDudi/:id',adminController.updatePembimbingDudi)
adminRouter.put('/updatePembimbingDudi/alamat/:id',adminController.updateAlamatPembimbingDudi)
adminRouter.delete('/deletePembimbingDudi/:id',adminController.deletePembimbingDudi)


// pengajuan pkl
adminRouter.get('/findAllPengajuanPkl',adminController.findAllPengajuanPkl)
adminRouter.get('/findAllPengajuanPklFilter',adminController.findAllPengajuanPklFilter)
adminRouter.get('/findPengajuanPkl/:id',adminController.findPengajuanPklById)


// laporan Pkl
adminRouter.get('/findAllLaporanPkl',adminController.findAllLaporanPkl)
adminRouter.get('/findLaporanPkl/:id',adminController.findLaporanPklById)
adminRouter.get('/findLaporanPklFilter',adminController.findLaporanPklFilter)


// laporan Pkl siswa
adminRouter.get('/findAllLaporanPklSiswa',adminController.findAllLaporanPklSiswa)
adminRouter.get('/findLaporanPklSiswa/:id',adminController.findLaporanPklSiswaById)
adminRouter.get('/findLaporanPklSiswaFilter',adminController.findLaporanPklSiswaFilter)


// absen
adminRouter.get('/findAllAbsen',adminController.findAllAbsen)
adminRouter.get('/findAbsenById/:id',adminController.findAbsenById)
adminRouter.get('/findAbsenFilter',adminController.findAbsenFilter)