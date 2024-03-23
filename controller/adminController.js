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
const findSiswaHaventPkl = async (req,res,next) => {
    try {
        const result = await adminService.findSiswaHaventPkl()

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
const findGuruPembimbingFilter = async (req,res,next) => {
    try {
        const query = req.body
        const result = await adminService.findGuruPembimbingfilter(query)

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
const updateAlamatGuruPembimbing = async (req,res,next) => {
    try {
        const identify = parseInt(req.params.identify)
        const data = req.body
        const result = await adminService.updateAlamatGuruPembimbing(data,identify)

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
        const result = await adminService.findDudiById(id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findDudiFilter = async (req,res,next) => {
    try {
        const query = req.body
        const result = await adminService.findDudiFilter(query)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateDudi(data,id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateAlamatDudi(data,id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deleteDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.updateDudi(data,id)

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
const findAllPembimbingDudi = async (req,res,next) => {
    try {
        const result = await adminService.findAllPembimbingDudi()

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findPembimbingDudiById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        
        const result = await adminService.findPembimbingDudiById(id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findPembimbingDudiFilter = async (req,res,next) => {
    try {
        const query = req.body
        const result = await adminService.findPembimbingDudifilter(query)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updatePembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updatePembimbingDudi(data,id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const updateAlamatPembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const result = await adminService.updateAlamatPembimbiDudi(data,id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const deletePembimbingDudi = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)

        const result = await adminService.deletePembimbingDudi(id)

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}


// pengajuan pkl
const findAllPengajuanPkl = async (req,res,next) => {
    try {
        
        const result = await adminService.findAllPengajuanPkl()

        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findAllPengajuanPklFilter = async (req,res,next) => {
    try {
        const status = req.body.status
        const result = await adminService.findAllPengajuanPklFilter(status)

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
    findSiswaHaventPkl,


    // guru pembimbing
    addGuruPembimbing,
    findAllGuruPembimbing,
    updateGuruPembimbing,
    updateAlamatGuruPembimbing,
    deleteGuruPembimbing,
    findGuruPembimbingById,
    findGuruPembimbingFilter,


    // dudi
    addDudi,
    findAllDudi,
    findDudiById,
    updateDudi,
    updateAlamatDudi,
    deleteDudi,
    findDudiFilter,

    // pembimbing dudi
    addPembimbingDudi,
    findAllPembimbingDudi,
    findPembimbingDudiById,
    updatePembimbingDudi,
    updateAlamatPembimbingDudi,
    deletePembimbingDudi,
    findPembimbingDudiFilter,

    // pengajuan pkl
    findAllPengajuanPkl,
    findAllPengajuanPklFilter
}