import joi from "joi"

const addJadwalAbsen = joi.object({
    id : joi.number().required(),
    id_dudi : joi.number().required(),
    id_pembimbing_dudi : joi.number().required(),
    tanggal_mulai : joi.string().required(),
    tanggal_berakhir : joi.string().required(),
    batas_absen_masuk : joi.number().optional(),
    batas_absen_pulang : joi.number().optional(),
})

export default {
    addJadwalAbsen
}