import adminService from "../service/adminService.js"


// siswa controller
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


// guru pembimbing controller
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


// dudi controller
const addDudi = async (req,res,next) => {
    try {
        const dudi = req.body.dudi
        const alamat = req.body.alamat

        const result = await adminService.addDudi(dudi,alamat)

        res.status(201).json({
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
        const pembimbingDudi = req.body.pembimbingDudi
        const alamat = req.body.alamat

        const result = await adminService.addPembimbingDudi(pembimbingDudi,alamat)

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
    addGuruPembimbing,
    addDudi,
    addPembimbingDudi
}