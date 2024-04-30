import adminDeveloperService from "../service/adminDeveloperService.js"

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
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    getAllAdmin
}