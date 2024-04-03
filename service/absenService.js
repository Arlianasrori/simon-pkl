import { db } from "../config/prismaClient.js"
import absenValidation from "../validation/absenValidation.js"
import responseError from "../error/responseError.js"
import { validate } from "../validation/validate.js"
import { getselish } from "../utils/getSelishDatehour.js"
import adminValidation from "../validation/adminValidation.js"
import generateId from "../utils/generateIdUtils.js"
import { DateTime } from "luxon";



const addJadwalAbsen = async (body) => {
    body.selisih_tanggal_day = getselish(body.tanggal_mulai,body.tanggal_berakhir)
    body = await validate(absenValidation.addJadwalAbsen,body)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : body.id_pembimbing_dudi
        },
        select : {
            id : true,
            id_dudi : true
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }

    if(findPembimbingDudi.id_dudi != body.id_dudi) {
        throw new responseError(404,"invalid id dudi")
    }


    return db.absen_jadwal.create({
        data : body
    })
}

const findAllJadwalAbsen = async (id_pembimbing_dudi) => {
    id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)

    const findPembimbingDudi = await db.pembimbing_dudi.findMany({
        where : {
            id : id_pembimbing_dudi
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"pembimbing dudi tidka ditemukan")
    }

    return db.absen_jadwal.findMany({
        where : {
            id_pembimbing_dudi : id_pembimbing_dudi
        }
    })
}

const findJadwalAbsenById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJadwalAbsen = await db.absen_jadwal.findUnique({
        where : {
                id : id
        }
    })

    if(!findJadwalAbsen) {
        throw new responseError(404,"data jadwal absen tidak ditemukan")
    }
    return findJadwalAbsen
}


// absen
const addAbsenMasuk = async (body) => {
    body.id = generateId()
    const findJadwalAbsen = await db.absen_jadwal.findUnique({
        where : {
            id : body.id_absen_jadwal
        },
        select : {
            tanggal_mulai : true,
            tanggal_berakhir : true,
            batas_absen_masuk : true,
            batas_absen_pulang : true,
            selisih_tanggal_day : true,
        }
    })

    if(!findJadwalAbsen) {
        throw new responseError(404,"jadwal absen tidak ditemukan")
    }

    const Now = new Date()

    const hourNow = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit"}).split(" ")[1]
    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`
    const selisih_tanggal_on_day = parseInt(getselish(findJadwalAbsen.tanggal_mulai,dateNow))

    const reset = "00.00"
    body.tanggal = dateNow
    body.absen_masuk = hourNow

    if( reset == hourNow ) {
        throw new responseError(400,"invalid")
    }

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        },
        select : {
            absen : {
                where : {
                    tanggal : dateNow
                }
            }
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }

    if(findSiswa.absen[0]) {
        throw new responseError(400,"anda telah melakukan absen masuk")
    }

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findJadwalAbsen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

   if(hourNow > findJadwalAbsen.batas_absen_pulang) {
        body.status_absen_masuk = "tidak_hadir"
        await db.absen.create({
            data : body
        })
        throw new responseError(400,"anda dinyatakn tidak hadir karena telah melewati batas absen")
    }else if (hourNow > findJadwalAbsen.batas_absen_masuk) {
        body.status_absen_masuk = "telat"
        const adddAbsen = await db.absen.create({
            data : body
        })
        return {data : adddAbsen,msg : "anda telat dalam absen masuk,penuhi batas jam kerja anda sebelum absen pulang"}
    }

    body.status_absen_masuk = "hadir"
    return db.absen.create({
     data : body
    })
   
}

export default {
    addJadwalAbsen,
    findAllJadwalAbsen,
    findJadwalAbsenById,


    // absen
    addAbsenMasuk
}