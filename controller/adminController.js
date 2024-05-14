import { db } from "../config/prismaClient.js"
import responseError from "../error/responseError.js"
import adminService from "../service/adminService.js"
import jwt from "jsonwebtoken"


const addTahun = async (req,res,next) => {
    try {
        const body = req.body
        const admin = req.admin
        const result = await adminService.addTahun(body,admin)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteTahun = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const admin = req.admin
        const result = await adminService.deleteTahun(id,admin)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateTahun = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const admin = req.admin
        const body = req.body
        const result = await adminService.updateTahun(body,id,admin)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getAllTahun = async (req,res,next) => {
    try {
        const admin = req.admin
        const result = await adminService.getAllTahun(admin)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

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

const refreshToken = async (req,res,next) => {
    try {
        const admin = req.admin
        const payload = {
            username : admin.username,
        }
         
        const acces_token_admin = jwt.sign(payload,process.env.TOKEN_SECRET_ADMIN,{expiresIn : "60d"})
        const refresh_token_admin = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_ADMIN,{expiresIn : "120d"})

        res.status(201).cookie("acces_token",acces_token_admin,{
            maxAge : 24 * 60 * 60 * 60 * 60 * 60 * 60,
            httpOnly: true,
        }).cookie("refresh_token",refresh_token_admin,{
            maxAge : 24 * 60 * 60 * 60 * 60 * 60,
            httpOnly: true,
        }).json({
            msg : "succes",
            data : {
                acces_token : acces_token_admin,
                refresh_token : refresh_token_admin
            }
        })
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const id = req.params.id
        const body = req.body.password
        const result = await adminService.updatePassword(id, body)
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllSiswa(page,req.admin,id_tahun)

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
        const id_tahun = req.query.tahun
        const result = await adminService.findSiswaHaventPkl(req.admin,id_tahun)

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
        const page = req.query.page
        const result = await adminService.findSiswaFilter(queryFilter,req.admin,page)
       
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllJurusan(page,req.admin,id_tahun)

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
        const id_tahun = req.query.tahun
        const result = await adminService.findJurusanByName(nama,req.admin,id_tahun)

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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllkelas(page,req.admin,id_tahun)
    
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllGuruPembimbing(page,req.admin,id_tahun)

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
        dudi.add_by = req.admin.id_sekolah
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllDudi(page,req.admin,id_tahun)

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
        const page = req.query.page
        const result = await adminService.findDudiFilter(query,req.admin,page)

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
        pembimbingDudi.add_by = req.admin.id_sekolah
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllPembimbingDudi(req.admin,page,id_tahun)

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
        const page = req.querypage
        const result = await adminService.findAllPengajuanPkl(page,req.admin)

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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllLaporanPkl(page,req.admin,id_tahun)
    
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
        const page = req.query.page
        const result = await adminService.findLaporanPklFilter(query,page,req.admin)
    
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
        const page = req.query.page
        const id_tahun = req.query.tahun
        const result = await adminService.findAllLaporanSiswaPkl(page,req.admin,id_tahun)
    
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
        const page = req.query.page

        const result = await adminService.findLaporanPklSiswaFilter(query,page,req.admin)
    
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
        const id_tahun = req.query.tahun
        const result = await adminService.findAllAbsen(req.admin,id_tahun)
    
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
const cekToken = async (req, res, next) => {
    try {
        const username = req.admin.username

        const findToken = await db.admin.findFirst ({
            where: {
                username: username
            },
            select : {
                id: true,
                username: true
            }
        })

        if(!findToken) {
            throw new responseError(404, "Admin Belum Login")
        }
        res.status(200).json({
        msg : "succes",
        data: findToken

        })
    } catch (error) {
        next(error)
    }
}
const adminLogout = async (req, res, next) => {
    try {
      res.clearCookie("acces_token", "refresh_token")
      .status(200).json({
        msg : "succes",
    })
    } catch (error) {
      next(error)
    }
  }
export default {  
    // tahun
    addTahun, 
    deleteTahun,
    updateTahun,
    getAllTahun,

    // admin login
    adminLogin,
    updatePassword,
    
    // adminLogout 
    adminLogout,

    // token
    refreshToken,
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
    findAbsenFilter,
    findAbsenFilter,

    // cekToken
    cekToken,
}