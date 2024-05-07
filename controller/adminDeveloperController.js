import adminDeveloperService from "../service/adminDeveloperService.js"

// sekolah
const addSekolah = async (req,res,next) => {
    try {
        const body = req.body
        const sekolah = {
            nama : body.nama,
            npsn : body.npsn
        }
        const alamat = {
            detail_tempat : body.detail_tempat,
            desa : body.desa,
            kecamatan : body.kecamatan,
            kabupaten : body.kabupaten,
            provinsi : body.provinsi,
            negara : body.negara
        }
        const kepala_sekolah = {
            nama : body.nama,
            nip : body.nip
        }
        const files = req.files.logo
        const url = `http://${req.hostname}:2008/logo`;

        const result = await adminDeveloperService.addSekolah(sekolah,alamat,kepala_sekolah,files,url)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateSekolah = async (req,res,next) => {
    try {
        const id = req.params.id
        const body = req.body

        const sekolah = {
            nama : body.nama,
            npsn : body.npsn
        }
        const alamat = {
            detail_tempat : body.detail_tempat,
            desa : body.desa,
            kecamatan : body.kecamatan,
            kabupaten : body.kabupaten,
            provinsi : body.provinsi,
            negara : body.negara
        }
        const kepala_sekolah = {
            nama : body.nama_kepala,
            nip : body.nip
        }
        const files = req.files && req.files.logo
        const url = `http://${req.hostname}:2008/logo`;

        const result = await adminDeveloperService.addSekolah(id,sekolah,alamat,kepala_sekolah,files,url)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteSekolah = async (req,res,next) => {
    try {
        const id = req.params.id

        const result = await adminDeveloperService.deleteSekolah(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getAllSekolah = async (req,res,next) => {
    try {
        const page = req.query.page

        const result = await adminDeveloperService.getAllSekolah(page)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getSekolahById = async (req,res,next) => {
    try {
        const id = req.params.id

        const result = await adminDeveloperService.getSekolahById(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

// admin
const addAdmin = async (req, res, next) => {
    try {
        const result = await adminDeveloperService.addAdmin(req.body)

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
        const result = await adminDeveloperService.updateAdmin(id, body)
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
        const result = await adminDeveloperService.deleteAdmin(req.params.id)
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
        const result = await adminDeveloperService.getAdminById(req.params.id)
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
        const result = await adminDeveloperService.getAllAdmin()

        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    // sekolah
    addSekolah,
    updateSekolah,
    deleteSekolah,
    getAllSekolah,
    getSekolahById,
    // admin
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    getAllAdmin
}