import adminService from "../service/adminService.js"
import guruPembimbingService from "../service/guruPembimbingService.js"

const getGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getGuruPembimbing(req.guruPembimbing.id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const getSiswa = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getSiswa(req.params.id_siswa)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const getAllSiswaGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getAllSiswaGuruPembimbing(req.guruPembimbing.id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

// laporan siswa pkl
const findLaporanPklSiswaFilter = async (req, res, next) => {
    try {
        const query = req.query
        query.id_guru_pembimbing = req.guruPembimbing.id
        const result = await adminService.findLaporanPklSiswaFilter(query)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklSiswaById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findLaporanPklSiswaById(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

// laporan pkl
const findLaporanPklFilter = async (req, res, next) => {
    try {
        const query = req.query
        query.id_guru_pembimbing = req.guruPembimbing.id
        const result = await adminService.findLaporanPklFilter(query)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findLaporanPklById(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getLaporanPklSiswa = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id_guru_pembimbing)
        const result = await guruPembimbingService.getLaporanPklSiswa(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getAllLaporanPklSiswa = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id_guru_pembimbing)
        const result = await guruPembimbingService.getAllLaporanPklSiswa(id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next (error)
    }
}
export default {
    getGuruPembimbing,
    getSiswa,
    getAllSiswaGuruPembimbing,
    findLaporanPklSiswaFilter,
    findLaporanPklSiswaById,
    findLaporanPklFilter,
    findLaporanPklById,

    getLaporanPklSiswa,
    getAllLaporanPklSiswa
}
