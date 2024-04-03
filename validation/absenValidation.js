import joi from "joi"


// jadwal absen
const addJadwalAbsen = joi.object({
    id_dudi : joi.number().required(),
    id_pembimbing_dudi : joi.number().required(),
    tanggal_mulai : joi.string().required(),
    tanggal_berakhir : joi.string().required(),
    batas_absen_masuk : joi.string().required(),
    batas_absen_pulang : joi.string().required(),
    selisih_tanggal_day : joi.string().required(),
})


// absen
const addAbsenMasukValidation = joi.object({
    id_absen_jadwal : joi.number().required(),
    id_siswa : joi.number().required(),
    tanggal : joi.string().required(),
    absen_masuk : joi.string().required(),
    status_absen_masuk : joi.valid("hadir","telat").optional(),
    foto : joi.string().required()
})
export default {
    addJadwalAbsen,
    addAbsenMasukValidation
}