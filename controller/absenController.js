import absenService from "../service/absenService.js";
// jadwal absen 
const addJadwalAbsen = async (req,res,next) => {
    try {
        const body = req.body.jadwal
        const day = req.body.day
        const result = await absenService.addJadwalAbsen(body,day)
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

        const result = await absenService.addAbsenMasuk(body,files,url)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const addAbsenPulang = async (req,res,next) => {
    try {
        const body = req.body

        const result = await absenService.addAbsenPulang(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const absenIzintelat = async (req,res,next) => {
    try {
        const body = req.body

        const result = await absenService.absenIzinTelat(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const absenDiluarRadius = async (req,res,next) => {
    try {
        const body = req.body

        const result = await absenService.absendiluarRadius(body)
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
const findAbsenFilter = async (req,res,next) => {
    try {
        const query = req.query

        const result = await absenService.findAbsenFilter(query)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const analisisAbsen = async (req,res,next) => {
    try {
        const query = req.query

        const result = await absenService.analisisAbsen(query)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// kordinat absen
const addKordinatAbsen = async (req,res,next) => {
    try {
        const body = req.body
        const result = await absenService.addKordinatAbsen(body)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteKoordinat = async (req,res,next) => {
    try {
        const id_koordinat = parseInt(req.params.id_koordinat)
        const result = await absenService.deleteKoordinatAbsen(id_koordinat)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllKordinatAbsen = async (req,res,next) => {
    try {
        const id_pembimbing_dudi = parseInt(req.params.id_pembimbing_dudi)
        const result = await absenService.findAllKordinatAbsen(id_pembimbing_dudi)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const cekRadiusKordinatAbsen = async (req,res,next) => {
    try {
        const body = req.body.body
        const siswa = req.body.siswa
        const result = await absenService.cekRadiusKoordinat(body,siswa)

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
    addAbsenPulang,
    absenTidakMemenuhiJam,
    findAbsen,
    findAbsenFilter,
    analisisAbsen,
    absenIzintelat,
    absenDiluarRadius,

    // kordinat absen
    addKordinatAbsen,
    findAllKordinatAbsen,
    cekRadiusKordinatAbsen,
    deleteKoordinat
}