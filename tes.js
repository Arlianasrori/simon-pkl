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

console.log(await db.$queryRaw`SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir') as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir') as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat') as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin') as absen_masuk_izin,
COUNT(status_absen_keluar) filter (where status_absen_keluar = 'hadir') as absen_keluar_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'tidak_hadir') as absen_keluar_tidak_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'telat') as absen_keluar_telat,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'izin') as absen_keluar_izin,
id_siswa,siswa.nama
FROM absen
INNER JOIN siswa ON absen.id_siswa = siswa.id
WHERE? absen.id_siswa = 1616 AND absen.id = 2222
GROUP BY id_siswa,nama`);

// siswa.forEach(e => {
//     db.absen.count({
//        select : {

//        }
//     })
// })
