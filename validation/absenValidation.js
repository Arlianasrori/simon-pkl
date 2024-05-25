import joi from "joi"


// jadwal absen
const addJadwalAbsen = joi.object({
    id_dudi : joi.number().required(),
    id_pembimbing_dudi : joi.number().required(),
    tanggal_mulai : joi.string().required(),
    tanggal_berakhir : joi.string().required(),
    selisih_tanggal_day : joi.string().required(),
})
const dayValidation = joi.array().items(joi.object({
    nama : joi.valid("senin","selasa","rabu","kamis","jumat","sabtu","minggu"),
    batas_absen_masuk : joi.string().required(),
    batas_absen_pulang : joi.string().required()
}))

// absen
const addAbsenMasukValidation = joi.object({
    id_absen_jadwal : joi.number().required(),
    id_siswa : joi.number().required(),
    tanggal : joi.string().required(),
    absen_masuk : joi.string().required(),
    status_absen_masuk : joi.valid("hadir","telat","tidak_hadir").required(),
    status : joi.string(),
    foto : joi.string().max(2500).required()
})
const addAbsenKeluarValidation = joi.object({
    id_siswa : joi.number().required(),
    absen_pulang : joi.string().required(),
    status_absen_pulang : joi.valid("hadir","telat","tidak_hadir").required()
})
const absenTidakMemenuhiJamValidation = joi.object({
    id : joi.number().required(),
    id_siswa : joi.number().required(),
    absen_pulang : joi.string().required(),
    note : joi.string().max(30000).required(),
    status_izin : joi.valid("sakit","acara"),
    status : joi.string().required()
})
const izinAbsenValidation = joi.object({
    id_siswa : joi.number().required(),
    keterangan : joi.string().required(),
    latitude : joi.string().required(),
    longtitude : joi.string().required(),
    status : joi.string().required()
})
const findAbsenFilterValidation = joi.object({
    id_Siswa : joi.number().optional(),
    id_pembimbing_dudi : joi.number().optional(),
    id_guru_pembimbing : joi.number().optional(),
    id_dudi : joi.number().optional(),
    month : joi.number().optional(),
    years : joi.number().optional(),
    tanggal : joi.string().optional(),
    tanggal_start : joi.string().optional(),
    tanggal_end : joi.string().optional(),
})
const absenDiluarRadiusValidation = joi.object({
    id_siswa : joi.number().required(),
    keterangan : joi.string().required()
})


// kordinat absen
const addKordinatAbsenValidation = joi.object({
    id : joi.number().required(),
    id_dudi : joi.number().required(),
    id_pembimbing_dudi : joi.number().required(),
    nama : joi.string().max(255).required(),
    latitude : joi.number().required(),
    longtitude : joi.number().required(),
    radius_absen_meter : joi.number().required(),
})
const cekRadiusKordinatAbsenValidation = joi.object({
    latitude : joi.number().required(),
    longtitude : joi.number().required(),
})
export default {
    // jadwal absen
    addJadwalAbsen,
    dayValidation,

    // absen
    addAbsenMasukValidation,
    addAbsenKeluarValidation,
    absenTidakMemenuhiJamValidation,
    findAbsenFilterValidation,
    izinAbsenValidation,
    absenDiluarRadiusValidation,


    // kordinat absen
    addKordinatAbsenValidation,
    cekRadiusKordinatAbsenValidation
}