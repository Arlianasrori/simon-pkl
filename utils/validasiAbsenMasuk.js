import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"


export const validasiAbsenMasuk = async (body) => {
    const Now = new Date()

    const dateNow = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    const hourNow = datelocal.split(" ")[1]

    // find absen
    const findSiswa = await db.siswa.findFirst({
        where : {
            id : parseInt(body.id_siswa)
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
                    absen_masuk : true,
                    absen_pulang : true,
                    status_absen_pulang : true                 
                }
            }
        }
    })
    
    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }
    if(findSiswa.absen[0].absen_masuk) {
        throw new responseError(400,"anda telah melakukan absen masuk")
    }

    const selisih_tanggal_on_day = parseInt(getselish(findSiswa.absen[0].jadwal_absen.tanggal_mulai,dateNow))
    console.log(findSiswa.absen[0].jadwal_absen);

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findSiswa.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    return {dateNow,hourNow,day : datelocal.split(" ")[0],absen : findSiswa.absen[0],jadwal : findSiswa.absen[0].jadwal_absen}
}