import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
import { db } from "../config/prismaClient.js"


export const validasiAbsenMasuk = async (findJadwalAbsen,body) => {
    const Now = new Date()
    console.log({findJadwalAbsen});

    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    const hourNow = datelocal.split(" ")[1]

    const dateNow = Now.toISOString().substring(0, 10)
    console.log({dateNow});
    const selisih_tanggal_on_day = parseInt(getselish(findJadwalAbsen.tanggal_mulai,dateNow))
    console.log({selisih_tanggal_on_day});

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : parseInt(body.id_siswa)
        },
        select : {
            id : true,
            absen : {
                where : {
                    tanggal : dateNow
                }
            }
        }
    })
    console.log({dateNow});

    console.log({findSiswa});
    
    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }

    // if(findSiswa.absen[0].absen_masuk) {
    //     throw new responseError(400,"anda telah melakukan absen masuk")
    // }

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findJadwalAbsen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    return {dateNow,hourNow,day : datelocal.split(" ")[2],absen : findSiswa.absen}
}