import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"


export const validasiAbsenMasuk = async (findJadwalAbsen,body) => {
    const Now = new Date()

    const hourNow = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit"}).split(" ")[1]
    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`
    const selisih_tanggal_on_day = parseInt(getselish(findJadwalAbsen.tanggal_mulai,dateNow))

    const reset = "00.00"

    if( reset == hourNow ) {
        throw new responseError(400,"invalid")
    }

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : parseInt(body.id_siswa)
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

    return {dateNow,hourNow}
}