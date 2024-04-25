import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"
export const validasiAbsen = async (tanggal_mulai,selisih_tanggal_day,absen_masuk,jadwal_absen_pulang,jadwal_absen_masuk,body) => {
    const Now = new Date()

    const hourNow = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit"}).split(" ")[1]
    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`
    const selisih_tanggal_on_day = parseInt(getselish(tanggal_mulai,dateNow))

    const cekWaktu = await db.siswa.findFirst({
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

    if(!cekWaktu.absen) {
        throw new responseError(400,"")
    }

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(parseFloat(hourNow) - parseFloat(absen_masuk) < parseFloat(jadwal_absen_pulang) - parseFloat(jadwal_absen_masuk)) {
        throw new responseError(400,"anda belum memenuhi waktu jam kerja")
    }

    if(parseFloat(hourNow) < jadwal_absen_masuk) {
        throw new responseError(400,"anda dinyatakan tidak hadir karena telah melewati batas dalam absen pulang")
    }

    return hourNow
}