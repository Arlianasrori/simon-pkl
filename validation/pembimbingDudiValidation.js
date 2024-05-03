import joi from "joi"

const pembimbingDudiLogin = joi.object ({
    username : joi.string().max(255).required(),
    password : joi.string().max(255).required()
})

const updatePassword = joi.string().max(255).required()

const getIdValidation = joi.number().required()

const statusvalidation = joi.object({
    id_pembimbing_dudi : joi.number().required(),
    status : joi.valid('diterima','ditolak'),
    tanggal_masuk : joi.date().required(),
    tanggal_keluar : joi.date().required()
})

const statusCancelValidation = joi.valid("setuju","tidak_setuju")

const addLaporanPkl = joi.object({
    id : joi.number().required(),
    id_siswa : joi.number().required(),
    id_dudi : joi.number().required(),
    id_pembimbing_dudi : joi.number().required(),
    tanggal : joi.string().required(),
    keterangan : joi.string().max(1500).required(),
    file_laporan : joi.string().max(1500).optional()
})

const updateLaporanPkl = joi.object ({
    keterangan : joi.string().max(1500).optional(),
    file_laporan : joi.string().max(1500).optional()
})

// kuota Siswa
const addKuotaSiswaValidation = joi.object ({
    id : joi.number().required(), 
    id_dudi : joi.number().required(), 
    jumlah_pria : joi.number().required(), 
    jumlah_wanita : joi.number().required(), 
    total : joi.number().required(),
})
const updateKuotaSiswaValidation = joi.object ({
    jumlah_pria : joi.number().optional(), 
    jumlah_wanita : joi.number().optional(), 
    total : joi.number().required(),
})

export default {
    pembimbingDudiLogin,
    updatePassword,
    statusvalidation,
    getIdValidation,
    statusCancelValidation,
    addLaporanPkl,
    updateLaporanPkl,
    addKuotaSiswaValidation,
    updateKuotaSiswaValidation
}
