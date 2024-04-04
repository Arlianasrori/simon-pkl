import absenService from "../service/absenService.js";
// jadwal absen 
const addJadwalAbsen = async (req,res,next) => {
    try {
        const body = req.body
        const result = await absenService.addJadwalAbsen(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllJadwalAbsen = async (req,res,next) => {
    try {
        const id_pembimbing_dudi = parseInt(req.params.id_pembimbing_dudi)
        const result = await absenService.findAllJadwalAbsen(id_pembimbing_dudi)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findJadwalAbsenById = async (req,res,next) => {
    try {
        const id_jadwal = parseInt(req.params.id_jadwal)
        const result = await absenService.findJadwalAbsenById(id_jadwal)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// absen
const addAbsenMasuk = async (req,res,next) => {
    try {
        const body = req.body
        const files = req.files.foto
        const url = `http://${req.hostname}:2008/images`
        console.log(files);

        const result = await absenService.addAbsenMasuk(body,files,url)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const addAbsenKeluar = async (req,res,next) => {
    try {
        const body = req.body

        const result = await absenService.addAbsenKeluar(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const absenTidakMemenuhiJam = async (req,res,next) => {
    try {
        const body = req.body

        const result = await absenService.absenTidakMemenuhiJam(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAbsen = async (req,res,next) => {
    try {
        const id_siswa = parseInt(req.params.id_siswa)

        const result = await absenService.findAbsen(id_siswa)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
export default {
    // absen jadawl
    addJadwalAbsen,
    findAllJadwalAbsen,
    findJadwalAbsenById,

    // absen
    addAbsenMasuk,
    addAbsenKeluar,
    absenTidakMemenuhiJam,
    findAbsen,
}