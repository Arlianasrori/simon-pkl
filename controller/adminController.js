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
const findAllSiswa = async (req,res,next) => {
    try {
        const result = await adminService.findAllSiswa()

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findsiswafilter = async (req,res,next) => {
    try {
        const queryFilter = req.body
        const result = await adminService.findSiswaFilter(queryFilter)
       
        res.status(201).json({
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
        const result = await adminService.updateSiswa(data,identify)

        res.status(201).json({
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
        const result = await adminService.deleteSiswa(id)

        res.status(201).json({
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
        const result = await adminService.updateAlamatSiswa(data,id)

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

const findAllGuruPembimbing = async (req,res,next) => {
    try {
        const result = await adminService.findAllGuruPembimbing()

        res.status(201).json({
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
        const result = await adminService.findGuruPembimbingById(id)

        res.status(201).json({
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
        const result = await adminService.updateGuruPembimbing(identify,data)

        res.status(201).json({
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
        const result = await adminService.deleteGuruPembimbing(identify)

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
const findAllDudi = async (req,res,next) => {
    try {
        const result = await adminService.findAllDudi()

        res.status(201).json({
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
        const result = await adminService.findAllDudi(id)

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
    // siswa
    addSiswa,
    findAllSiswa,
    updateSiswa,
    deleteSiswa,
    updateAlamatSiswa,
    findsiswafilter,


    // guru pembimbing
    addGuruPembimbing,
    findAllGuruPembimbing,
    updateGuruPembimbing,
    deleteGuruPembimbing,
    findGuruPembimbingById,


    // dudi
    addDudi,
    findAllDudi,
    findDudiById,


    // pembimbing dudi
    addPembimbingDudi,
}