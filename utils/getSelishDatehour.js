import { DateTime } from "luxon";

export const getselish = (tanggal_mulai,tanggal_berakhir) => {
    console.log(tanggal_mulai);
    console.log(tanggal_berakhir);
    const tanggal1 = DateTime.fromISO(tanggal_mulai); 
    const tanggal2 = DateTime.fromISO(tanggal_berakhir); 
    const durasi = tanggal2.diff(tanggal1);
    const selisih_tanggal_on_day = durasi.as('days');

    return  selisih_tanggal_on_day.toString()
}