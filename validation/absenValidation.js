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
    id : joi.number().required(),
    id_absen_jadwal : joi.number().required(),
    id_siswa : joi.number().required(),
    tanggal : joi.string().required(),
    absen_masuk : joi.string().required(),
    status_absen_masuk : joi.valid("hadir","telat","tidak_hadir").required(),
    foto : joi.string().max(2500).required()
})
const addAbsenKeluarValidation = joi.object({
    id : joi.number().required(),
    id_siswa : joi.number().required(),
    absen_keluar : joi.string().required(),
    status_absen_keluar : joi.valid("hadir","telat","tidak_hadir").required()
})
const absenTidakMemenuhiJamValidation = joi.object({
    id : joi.number().required(),
    id_siswa : joi.number().required(),
    absen_keluar : joi.string().required(),
    note : joi.string().max(30000).required(),
    status_izin : joi.valid("sakit","acara"),
    status : joi.string().required()
})
export default {
    addJadwalAbsen,
    addAbsenMasukValidation,
    addAbsenKeluarValidation,
    absenTidakMemenuhiJamValidation
}