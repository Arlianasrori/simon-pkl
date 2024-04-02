import { db } from "../config/prismaClient.js"
import absenValidation from "../validation/absenValidation.js"
import responseError from "../error/responseError.js"
import { validate } from "../validation/validate.js"
import { getselish } from "../utils/getSelishDatehour.js"
import adminValidation from "../validation/adminValidation.js"
import generateId from "../utils/generateIdUtils.js"
import { DateTime } from "luxon";



const addJadwalAbsen = async (body) => {
    const getSelisih = getselish(body.tanggal_mulai,body.tanggal_berakhir,body.batas_absen_masuk,body.batas_absen_pulang)
    body.selisih_tanggal_day = getSelisih.selisih_tanggal_on_day
    body.selisih_absen_hour = getSelisih.selisih_absen_on_hour

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
    const options = {
        
    };
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
            selisih_absen_hour : true
        }
    })

    const Now = new Date()
    console.log(Now);

    const hourNow = Now.toLocaleDateString("id",{
        hour : "2-digit",
        minute : "2-digit"
    }).split(" ")[1]
    const dateNow = `${Now.getFullYear()}-${Now.getUTCMonth()}-${Now.getDay()}`
    
    console.log(hourNow);
    console.log(dateNow);

    const tanggal1 = DateTime.fromISO(dateNow); 
    const tanggal2 = DateTime.fromISO(findJadwalAbsen.tanggal_berakhir); 
    const durasi = tanggal2.diff(tanggal1);
    const selisih_tanggal_on_day = durasi.as('days');

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findJadwalAbsen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    body.tanggal = dateNow
   
    const selisiHours = parseFloat(hourNow) - findJadwalAbsen.selisih_absen_hour

    if(selisiHours < 0) {
        throw new responseError(400,"jam atau waktu tidak sesuai dengan jadawl")
    }else if(selisiHours > findJadwalAbsen.selisih_absen_hour) {
        body.status = "telat"
    }

    body.absen_masuk = hourNow

    body.id = generateId()
    // body = await validate(absenValidation.addAbsen,body)
    console.log(body);

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        }
    })

  

    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }

    return "hay"

}

export default {
    addJadwalAbsen,
    findAllJadwalAbsen,
    findJadwalAbsenById,


    // absen
    addAbsenMasuk
}