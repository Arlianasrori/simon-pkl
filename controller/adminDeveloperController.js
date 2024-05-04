import adminDeveloperService from "../service/adminDeveloperService.js"

// sekolah
const addSekolah = async (req,res,next) => {
    try {
        const sekolah = req.body.sekolah
        const alamat = req.body.alamat

        const result = await adminDeveloperService.addSekolah(sekolah,alamat)
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
    // admin
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    getAllAdmin
}