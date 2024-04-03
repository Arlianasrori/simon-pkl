import joi from "joi"

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
    tanggal : joi.date().required(),
    keterangan : joi.string().max(1500)
})
export default {
    statusvalidation,
    getIdValidation,
    statusCancelValidation,
    addLaporanPkl
}