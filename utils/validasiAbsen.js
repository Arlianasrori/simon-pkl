import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"
export const validasiAbsen = async (body) => {
    const Now = new Date()

    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")
    const hourNow = datelocal[1]

    const cekWaktu = await db.siswa.findFirst({
        where : {
            id : body.id_siswa
        },
        select : {
            absen : {
                where : {
                    tanggal : dateNow
                },
                select : {
                    jadwal_absen : true,
                    id : true,
                    status_absen_masuk : true,
                    status_absen_keluar : true                 
                }
            }
        }
    })

    if(!cekWaktu.absen[0]) {
        throw new responseError(400,"invalid time")
    }
    if(!cekWaktu.absen[0].status_absen_masuk) {
        throw new responseError(400,"anda belum melakukan absen masuk")
    }
    
    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : cekWaktu.absen[0].jadwal_absen.id
                },
                {
                    nama : datelocal[0]
                }
            ]
        }
    })

    console.log(findDay);

    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`
    const selisih_tanggal_on_day = parseInt(getselish(cekWaktu.absen[0].jadwal_absen.tanggal_mulai,dateNow))

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > cekWaktu.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    // if(parseFloat(hourNow) - parseFloat(findDay.batas_absen_masuk) < parseFloat(jadwal_absen_pulang) - parseFloat(jadwal_absen_masuk)) {
    //     throw new responseError(400,"anda belum memenuhi waktu jam kerja")
    // }

    // if(parseFloat(hourNow) < jadwal_absen_masuk) {
    //     throw new responseError(400,"anda dinyatakan tidak hadir karena telah melewati batas dalam absen pulang")
    // }

    return {hourNow,id : cekWaktu.absen[0].id}
}