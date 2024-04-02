import { DateTime } from "luxon";
    const date = new Date('2023-04-10')
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const tanggal = date.toLocaleDateString("id",options)
    console.log(tanggal);
    	
// var tanggal1 = DateTime.fromISO('2023-04-17'); 
// var tanggal2 = DateTime.fromISO('2023-04-10'); 
// var durasi = tanggal2.diff(tanggal1);
// var selisih = durasi.as('days');

// console.log(selisih);
