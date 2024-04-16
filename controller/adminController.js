import adminService from "../service/adminService.js"

// admin controller 
const addAdmin = async (req, res, next) => {
    try {
        const result = await adminService.addAdmin(req.body)
        res.status(200).json({
        msg : "succes",
        data : result
        })
    } catch (error) {
        next(error)
    }
}

const updateAdmin = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const body = req.body
        const result = await adminService.updateAdmin(id, body)
        res.status(200).json({
            msg : "succes",
            data : result
            })
    } catch (error) {
        next(error)
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
        const result = await adminService.deleteAdmin(req.params.id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const getAdminById = async (req, res, next) => {
    try {
        const result = await adminService.getAdminById(req.params.id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getAllAdmin = async (req,res,next) => {
    try {
        const result = await adminService.getAllAdmin()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
// siswa controller
const addSiswa = async (req,res,next) => {
    try {
        const siswa = req.body.siswa
        const alamat = req.body.alamat

        const result = await adminService.addSiswa(siswa,alamat)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findSiswaById = async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await adminService.findSiswaById(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllSiswa = async (req,res,next) => {
    try {
        const result = await adminService.findAllSiswa()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findSiswaHaventPkl = async (req,res,next) => {
    try {
        const result = await adminService.findSiswaHaventPkl()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findsiswafilter = async (req,res,next) => {
    try {
        const queryFilter = req.query
        const result = await adminService.findSiswaFilter(queryFilter)
       
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateSiswa = async (req,res,next) => {
    try {
        const data = req.body
        const identify = parseInt(req.params.identify)
        const result = await adminService.updateSiswa(data,identify)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteSiswa = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.deleteSiswa(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatSiswa = async (req,res,next) => {
    try {
        const data = req.body
        const id = parseInt(req.params.id)
        const result = await adminService.updateAlamatSiswa(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// jurusan
const addJurusan = async (req,res,next) => {
    try {
        const body = req.body
        const result = await adminService.addJurusan(body)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteJurusan = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const result = await adminService.deleteJurusan(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllJurusan = async (req,res,next) => {
    try {
        const result = await adminService.findAllJurusan()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findJurusanById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const result = await adminService.findJurusanById(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findJurusanByNama = async (req,res,next) => {
    try {
        const nama = req.query.nama
        const result = await adminService.findJurusanByName(nama)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateJurusan = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const nama = req.body.nama
        const result = await adminService.updateJurusan(id,nama)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// kelas
const addKelas = async (req,res,next) => {
    try {
        const body = req.body
        const result = await adminService.addKelas(body)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllKelas = async (req,res,next) => {
    try {
        const result = await adminService.findAllkelas()
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findKelasById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const result = await adminService.findKelasById(id)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findKelasFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findKelasFilter(query)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateKelas = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const body = req.body
        const result = await adminService.updateKelas(id,body)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteKelas = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id) 
        const result = await adminService.deleteKelas(id)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}



// guru pembimbing controller
const addGuruPembimbing = async (req,res,next) => {
    try {
        const guru = req.body.guru
        const alamat = req.body.alamat

        const result = await adminService.addGuruPembimbing(guru,alamat)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const findAllGuruPembimbing = async (req,res,next) => {
    try {
        const result = await adminService.findAllGuruPembimbing()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findGuruPembimbingById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findGuruPembimbingById(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findGuruPembimbingFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findGuruPembimbingfilter(query)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const updateGuruPembimbing = async (req,res,next) => {
    try {
        const identify = parseInt(req.params.identify)
        const data = req.body
        const result = await adminService.updateGuruPembimbing(identify,data)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatGuruPembimbing = async (req,res,next) => {
    try {
        const identify = parseInt(req.params.identify)
        const data = req.body
        const result = await adminService.updateAlamatGuruPembimbing(data,identify)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteGuruPembimbing = async (req,res,next) => {
    try {
        const identify = parseInt(req.params.identify)
        const result = await adminService.deleteGuruPembimbing(identify)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}



// dudi controller
const addDudi = async (req,res,next) => {
    try {
        const dudi = req.body.dudi
        const alamat = req.body.alamat

        const result = await adminService.addDudi(dudi,alamat)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllDudi = async (req,res,next) => {
    try {
        const result = await adminService.findAllDudi()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findDudiById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findDudiById(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findDudiFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findDudiFilter(query)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateDudi(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateAlamatDudi(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.updateDudi(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// pembimbing dudi controller
const addPembimbingDudi = async (req,res,next) => {
    try {
        const pembimbingDudi = req.body.pembimbing_dudi
        const alamat = req.body.alamat

        const result = await adminService.addPembimbingDudi(pembimbingDudi,alamat)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllPembimbingDudi = async (req,res,next) => {
    try {
        const result = await adminService.findAllPembimbingDudi()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findPembimbingDudiById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        
        const result = await adminService.findPembimbingDudiById(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findPembimbingDudiFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findPembimbingDudifilter(query)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updatePembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updatePembimbingDudi(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatPembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateAlamatPembimbiDudi(data,id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deletePembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)

        const result = await adminService.deletePembimbingDudi(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// pengajuan pkl
const findAllPengajuanPkl = async (req,res,next) => {
    try {
        
        const result = await adminService.findAllPengajuanPkl()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllPengajuanPklFilter = async (req,res,next) => {
    try {
        const status = req.query.status
        const result = await adminService.findAllPengajuanPklFilter(status)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findPengajuanPklById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findPengajuanPklById(id)

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// laporan pkl
const findAllLaporanPkl = async (req,res,next) => {
    try {
        const result = await adminService.findAllLaporanPkl()
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklById = async (req,res,next) => {
    try {
        const id = req.params.id
        const result = await adminService.findLaporanPklById(id)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findLaporanPklFilter(query)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}



// laporan pkl siswa
const findAllLaporanPklSiswa = async (req,res,next) => {
    try {
        const result = await adminService.findAllLaporanSiswaPkl()
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklSiswaById = async (req,res,next) => {
    try {
        const id = req.params.id
        const result = await adminService.findLaporanPklSiswaById(id)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklSiswaFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findLaporanPklSiswaFilter(query)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// absen
const findAllAbsen = async (req,res,next) => {
    try {
        const result = await adminService.findAllAbsen()
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAbsenById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findAbsenById(id)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAbsenFilter = async (req,res,next) => {
    try {
        const query = req.query
        const result = await adminService.findAbsenFilter(query)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export default {

     // admin 
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    getAllAdmin,
    
    // siswa
    addSiswa,
    findSiswaById,
    findAllSiswa,
    updateSiswa,
    deleteSiswa,
    updateAlamatSiswa,
    findsiswafilter,
    findSiswaHaventPkl,


    // jurusan
    addJurusan,
    deleteJurusan,
    findAllJurusan,
    findJurusanById,
    findJurusanByNama,
    updateJurusan,


    // kelas
    addKelas,
    findAllKelas,
    findKelasById,
    findKelasFilter,
    updateKelas,
    deleteKelas,


    // guru pembimbing
    addGuruPembimbing,
    findAllGuruPembimbing,
    updateGuruPembimbing,
    updateAlamatGuruPembimbing,
    deleteGuruPembimbing,
    findGuruPembimbingById,
    findGuruPembimbingFilter,


    // dudi
    addDudi,
    findAllDudi,
    findDudiById,
    updateDudi,
    updateAlamatDudi,
    deleteDudi,
    findDudiFilter,

    // pembimbing dudi
    addPembimbingDudi,
    findAllPembimbingDudi,
    findPembimbingDudiById,
    updatePembimbingDudi,
    updateAlamatPembimbingDudi,
    deletePembimbingDudi,
    findPembimbingDudiFilter,

    // pengajuan pkl
    findAllPengajuanPkl,
    findAllPengajuanPklFilter,
    findPengajuanPklById,


    // laporan pkl
    findAllLaporanPkl,
    findLaporanPklById,
    findLaporanPklFilter,


    // laporan pkl siswa
    findAllLaporanPklSiswa,
    findLaporanPklSiswaById,
    findLaporanPklSiswaFilter,


    // absen
    findAllAbsen,
    findAbsenById,
    findAbsenFilter
}