import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"
export const validasiAbsen = async (body) => {
    const Now = new Date()

    const dateNow = Now.toISOString().substring(0, 10)

    const cekWaktu = await db.siswa.findFirst({
        where : {
            id : body.id_siswa
        },
        select : {
            id : true,
            absen : {
                where : {
                    tanggal : dateNow
                },
                select : {
                    jadwal_absen : true,
                    id : true,
                    status_absen_masuk : true,
                    status_absen_pulang : true                 
                }
            }
        }
    })

    if(!cekWaktu.absen) {
        throw new responseError(400,"")
    if(cekWaktu.absen[0].status_absen_pulang) {
        throw new responseError(400,"anda telah melakukan absen pulang")
    }

    if(!cekWaktu.absen[0]) {
        throw new responseError(400,"invalid")
    }
    if(!cekWaktu.absen[0].status_absen_masuk) {
        throw new responseError(400,"anda belum melakukan absen masuk")
    }

    
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")
    const hourNow = datelocal[1]
    const selisih_tanggal_on_day = parseInt(getselish(cekWaktu.absen[0].jadwal_absen.tanggal_mulai,dateNow))
    
    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : cekWaktu.absen[0].jadwal_absen.id
                },
                {
                    nama : {
                        equals : datelocal[0],
                        mode : "insensitive"
                    },
                    
                }
            ]
        }
    })

    if(!findDay) {
        throw  new responseError(400,"jadwal absen untuk hari ini tidak ditemukan")
    }

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > cekWaktu.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(parseFloat(hourNow) - parseFloat(findDay.batas_absen_masuk) < parseFloat(findDay.batas_absen_pulang) - parseFloat(findDay.batas_absen_masuk)) {
        throw new responseError(400,"anda belum memenuhi waktu jam kerja")
    }

    return {hourNow,id : cekWaktu.absen[0].id}
}