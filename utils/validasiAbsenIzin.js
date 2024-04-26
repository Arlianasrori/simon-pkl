import responseError from "../error/responseError.js"
import { getselish } from "./getSelishDatehour.js"
export const validasiAbsen = async (tanggal_mulai,selisih_tanggal_day,jadwal_absen_masuk) => {
    const Now = new Date()

    const hourNow = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit"}).split(" ")[1]
    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`
    const selisih_tanggal_on_day = parseInt(getselish(tanggal_mulai,dateNow))

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(parseFloat(hourNow) < jadwal_absen_masuk) {
        throw new responseError(400,"anda dinyatakan tidak hadir karena telah melewati batas dalam absen pulang")
    }

    return hourNow
}