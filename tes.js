// import { DateTime } from "luxon";
//     const date = new Date('2023-04-10')
//     const options = {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric"
//     };
//     const tanggal = date.toLocaleDateString("id",options)
//     console.log(tanggal);
    	
// var tanggal1 = DateTime.fromISO('2023-04-17'); 
// var tanggal2 = DateTime.fromISO('2023-04-10'); 
// var durasi = tanggal2.diff(tanggal1);
// var selisih = durasi.as('days');

// console.log(selisih);

import { db } from "./config/prismaClient.js";


// const siswa = await db.$queryRaw`SELECT COUNT(judul) filter (where judul = '3') as judul_3,COUNT(judul) filter (where judul = '1') as judul_1,COUNT(judul) filter (where judul = '5') as judul_5,siswa.nama, id_siswa
// FROM notification
// INNER JOIN siswa ON notification.id_siswa = siswa.id
// WHERE notification.isi = 'selamat anda tela\ diterimah untuk bekerja diperusahaan'
// GROUP BY id_siswa,nama`

// const absen = await db.$queryRaw`SELECT COUNT(judul) filter (where judul = '3') as judul_3,COUNT(judul) filter (where judul = '1') as judul_1,COUNT(judul) filter (where judul = '5') as judul_5,siswa.nama, id_siswa
// FROM notification
// INNER JOIN siswa ON notification.id_siswa = siswa.id
// WHERE notification.isi = 'selamat anda tela\ diterimah untuk bekerja diperusahaan'
// GROUP BY id_siswa,nama`

console.log(await db.$queryRaw`SELECT COUNT(siswa.id) as total_siswa,id
FROM dudi
INNER JOIN siswa ON siswa.id_dudi = dudi.id
GROUP BY id`);

// siswa.forEach(e => {
//     db.absen.count({
//        select : {

//        }
//     })
// })
