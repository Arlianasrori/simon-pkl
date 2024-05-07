import adminDeveloperService from "../service/adminDeveloperService.js"

// sekolah
const addSekolah = async (req,res,next) => {
    try {
        const sekolah = req.body.sekolah
        const alamat = req.body.alamat
        const kepala_sekolah = req.body.kepala_sekolah

        const result = await adminDeveloperService.addSekolah(sekolah,alamat,kepala_sekolah)
        res.status(200).json({
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
        const sekolah = req.body.sekolah
        const alamat = req.body.alamat
        const kepala_sekolah = req.body.kepala_sekolah

        const result = await adminDeveloperService.addSekolah(id,sekolah,alamat,kepala_sekolah)
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