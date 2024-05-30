import adminService from "../service/adminService.js"
import guruPembimbingService from "../service/guruPembimbingService.js"
import notificationService from "../service/notificationService.js"

  const updatePassword = async (req, res, next) => {
    try {
        const id = req.guruPembimbing.id
        const body = req.body.password
        const result = await guruPembimbingService.updatePassword(id, body)
        res.status(200).json({
            msg : "Success",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }
  const refreshToken = async (req, res, next) => {
    try {
        const guruPembimbing = req.guruPembimbing
        const payload = {
            id : guruPembimbing.id,
            nip : guruPembimbing.nip,
        }

        const acces_token_guru_pembimbing = jwt.sign(payload,process.env.TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "60d"})
        const refresh_token_guru_pembimbing = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "120d"})

        return res.status(200).json({
            msg : "succes",
            acces_token : acces_token_guru_pembimbing,
            refresh_token : refresh_token_guru_pembimbing,
        })
    } catch (error) {
        next(error)
    }
  }

const getGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getGuruPembimbing(req.guruPembimbing.id)
        res.status(200).json({
            msg : "Success",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getProfile = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getGuruPembimbing(req.guruPembimbing.id)
        res.status(200).json({
            msg : "Success",
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
            msg : "Success",
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
            msg : "Success",
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
        const page = parseInt(req.query.page)
        const result = await adminService.findLaporanPklSiswaFilter(query,page,req.guruPembimbing)
        res.status(200).json({
            msg : "Success",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklSiswaById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findLaporanPklSiswaById(id,req.guruPembimbing)
        res.status(200).json({
            msg : "Success",
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
        query.tahun = req.guruPembimbing.id_tahun
        const page = parseInt(req.query.page)
        const result = await adminService.findLaporanPklFilter(query,page,req.guruPembimbing)
        res.status(200).json({
            msg : "Success",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const findLaporanPklById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await adminService.findLaporanPklById(id,req.guruPembimbing)
        res.status(200).json({
            msg : "Success",
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
            msg : "Success",
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
            msg : "Success",
            data : result
        })
    } catch (error) {
        next (error)
    }
}
const findAllAbsen = async (req, res, next) => {
        try {
          const query = req.query
          const result = await guruPembimbingService.findAllAbsen(req.guruPembimbing,query)
          res.status(200).json({
            msg: "Success",
            data: result,
          })
        } catch (error) {
          next(error)
        }
}
const findAbsenById = async (req, res, next) => {
        try {
          const id = parseInt(req.params.id)
          const result = await guruPembimbingService.findAbsenById(req.guruPembimbing,id)
          res.status(200).json({
            msg: "Success",
            data: result,
          })
        } catch (error) {
          next(error)
        }
}
const cetakAbsen = async (req, res, next) => {
        try {
          const query = req.query
          query.id_guru_pembimbing = req.guruPembimbing.id
          const result = await guruPembimbingService.cetakAbsen(query)
          res.status(200).json({
            msg: "Success",
            data: result,
          })
        } catch (error) {
          next(error)
        }
}
const cetakAnalisAbsen = async (req, res, next) => {
        try {
          const query = req.query
          query.id_guru_pembimbing = req.guruPembimbing.id
          const result = await guruPembimbingService.cetakAnalisisAbsen(query)
          res.status(200).json({
            msg: "Success",
            data: result,
          })
        } catch (error) {
          next(error)
        }
}


// notification
const addNotification = async (req,res,next) => {
    try {
      const body = req.body
      body.id_guru_pembimbing = req.guruPembimbing.id
      const result = await notificationService.addNotification(body)
      res.status(200).json({
        msg: "Success",
        data: result,
        })
    } catch (error) {
      next(error)
    }
  }
export default {
    getProfile,
    refreshToken,
    updatePassword,
    getGuruPembimbing,
    getSiswa,
    getAllSiswaGuruPembimbing,

    findLaporanPklSiswaFilter,
    findLaporanPklSiswaById,

    findLaporanPklFilter,
    findLaporanPklById,

    getLaporanPklSiswa,
    getAllLaporanPklSiswa,

    cetakAbsen,
    cetakAnalisAbsen,
    findAllAbsen,
    findAbsenById,

    addNotification
}
