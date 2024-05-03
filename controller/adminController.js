import adminService from "../service/adminService.js"

const adminLogin = async (req,res,next) => {
    try {
        const body = req.body
        const result = await adminService.adminLogin(body)
        res.status(201).cookie("acces_token",result.acces_token_admin,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly: true,
        }).cookie("refresh_token",result.refresh_token_admin,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly: true,
        }).json({
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
        siswa.id_sekolah = req.admin.id_sekolah
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
        const result = await adminService.findSiswaById(id,req.admin)
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
        const result = await adminService.findAllSiswa(req.admin)

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
        const result = await adminService.findSiswaHaventPkl(req.admin)

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
        const result = await adminService.findSiswaFilter(queryFilter,req.admin)
       
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
        const result = await adminService.updateSiswa(data,identify,req.admin)

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
        const result = await adminService.deleteSiswa(id,req.admin)

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
        const result = await adminService.updateAlamatSiswa(data,id,req.admin)

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
        body.id_sekolah = req.admin.id_sekolah
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
        const result = await adminService.deleteJurusan(id,req.admin)

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
        const result = await adminService.findAllJurusan(req.admin)

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
        const result = await adminService.findJurusanById(id,req.admin)

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
        const result = await adminService.findJurusanByName(nama,req.admin)

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
        const result = await adminService.updateJurusan(id,nama,req.admin)

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
        const result = await adminService.findAllkelas(req.admin)
    
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
        const result = await adminService.findKelasById(id,req.admin)
    
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
        const result = await adminService.findKelasFilter(query,req.admin)
    
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
        const result = await adminService.updateKelas(id,body,req.admin)
    
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
        const result = await adminService.deleteKelas(id,req.admin)
    
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
        guru.id_sekolah = req.admin.id_sekolah
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
        const result = await adminService.findAllGuruPembimbing(req.admin)

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
        const result = await adminService.findGuruPembimbingById(id,req.admin)

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
        const result = await adminService.findGuruPembimbingfilter(query,req.admin)

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
        const result = await adminService.updateGuruPembimbing(identify,data,req.admin)

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
        const result = await adminService.updateAlamatGuruPembimbing(data,identify,req.admin)

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
        const result = await adminService.deleteGuruPembimbing(identify,req.admin)

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
        dudi.id_sekolah = req.admin.id_sekolah
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
        const result = await adminService.findAllDudi(req.admin)

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
        const result = await adminService.findDudiById(id,req.admin)

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
        const result = await adminService.findDudiFilter(query,req.admin)

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
        const result = await adminService.updateDudi(data,id,req.admin)

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
        const result = await adminService.updateAlamatDudi(data,id,req.admin)

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
        const result = await adminService.deleteDudi(data,id)

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
        pembimbingDudi.id_sekolah = req.admin.id_sekolah
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
        const result = await adminService.findAllPembimbingDudi(req.admin)

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
        
        const result = await adminService.findPembimbingDudiById(id,req.admin)

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
        const result = await adminService.findPembimbingDudifilter(query,req.admin)

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
        const result = await adminService.updatePembimbingDudi(data,id,req.admin)

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
        const result = await adminService.updateAlamatPembimbiDudi(data,id,req.admin)

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

        const result = await adminService.deletePembimbingDudi(id,req.admin)

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
        
        const result = await adminService.findAllPengajuanPkl(req.admin)

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
        const result = await adminService.findAllPengajuanPklFilter(status,req.admin)

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
        const result = await adminService.findPengajuanPklById(id,req.admin)

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
        const result = await adminService.findAllLaporanPkl(req.admin)
    
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
        const result = await adminService.findLaporanPklById(id,req.admin)
    
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
        const result = await adminService.findLaporanPklFilter(query,req.admin)
    
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
        const result = await adminService.findAllLaporanSiswaPkl(req.admin)
    
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
        const result = await adminService.findLaporanPklSiswaById(id,req.admin)
    
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
        const result = await adminService.findLaporanPklSiswaFilter(query,req.admin)
    
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
        const result = await adminService.findAllAbsen(req.admin)
    
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
        const result = await adminService.findAbsenById(id,req.admin)
    
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
        const result = await adminService.findAbsenFilter(query,req.admin)
    
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const adminLogout = async (req, res, next) => {
    try {
      res.clearCookie("acces_token", "refresh_token")
      .status(200).json({
        msg : "succes"
    })
    } catch (error) {
      next(error)
    }
  }
export default {   
    // admin login
    adminLogin,
    // adminLogout 
    adminLogout,


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