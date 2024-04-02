import { DateTime } from "luxon";

export const getselish = (tanggal_mulai,tanggal_berakhir,absen_masuk,absen_keluar) => {
    const tanggal1 = DateTime.fromISO(tanggal_mulai); 
    const tanggal2 = DateTime.fromISO(tanggal_berakhir); 
    const durasi = tanggal2.diff(tanggal1);
    const selisih_tanggal_on_day = durasi.as('days');

    const selisih_absen_on_hour = parseFloat(absen_keluar) - parseFloat(absen_masuk)


    return {selisih_tanggal_on_day,selisih_absen_on_hour}
}