import adminService from "../service/adminService.js"

const addSiswa = async (req,res,next) => {
    try {
        const siswa = req.body.siswa
        const alamat = req.body.alamat

        const result = await adminService.addSiswa(siswa,alamat)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const addGuruPembimbing = async (req,res,next) => {
    try {
        const guru = req.body.guru
        const alamat = req.body.alamat

        const result = await adminService.addGuruPembimbing(guru,alamat)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export default {
    addSiswa,
    addGuruPembimbing
}