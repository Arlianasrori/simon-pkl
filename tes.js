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
import adminValidation from "./validation/adminValidation.js";
import { validate } from "./validation/validate.js";


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

// console.log(await db.$queryRaw`SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir') as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir') as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat') as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin') as absen_masuk_izin,
// COUNT(status_absen_keluar) filter (where status_absen_keluar = 'hadir') as absen_keluar_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'tidak_hadir') as absen_keluar_tidak_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'telat') as absen_keluar_telat,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'izin') as absen_keluar_izin,
// id_siswa,siswa.nama
// FROM absen
// INNER JOIN siswa ON absen.id_siswa = siswa.id
// WHERE? absen.id_siswa = 1616 AND absen.id = 2222
// GROUP BY id_siswa,nama`);

// console.log(await db.$queryRaw`SELECT COUNT(s.jenis_kelamin)::int as total_siswa,COUNT(s.jenis_kelamin)filter (where s.jenis_kelamin = 'laki')::int  as total_siswa_laki,COUNT(s.jenis_kelamin) filter (where s.jenis_kelamin = 'perempuan') as total_siswa_perempuan,
// s.nama,
// d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara
// FROM dudi as d
// LEFT JOIN siswa as s ON d.id = s.id_dudi
// LEFT JOIN alamat_dudi as ad ON d.id = ad.id_dudi
// GROUP BY d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,s.nama,ad.negara LIMIT 1 OFFSET 0`);


// console.log(await db.$queryRaw`SELECT COUNT(s)::int as total_siswa,COUNT(s.jenis_kelamin)filter (where s.jenis_kelamin = 'laki')::int  as total_siswa_laki,COUNT(s.jenis_kelamin) filter (where s.jenis_kelamin = 'perempuan')::int as total_siswa_perempuan,
// d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara
// FROM dudi as d
// LEFT JOIN siswa as s ON d.id = s.id_dudi
// LEFT JOIN alamat_dudi as ad ON d.id = ad.id_dudi
// WHERE d.id = 93
// GROUP BY d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara`);
// siswa.forEach(e => {
//     db.absen.count({
//        select : {

//        }
//     })
// })

// const j = await db.$queryRaw`SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir') as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir') as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat') as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin') as absen_masuk_izin,
//     COUNT(status_absen_pulang) filter (where status_absen_pulang = 'hadir') as absen_keluar_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'tidak_hadir') as absen_keluar_tidak_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'telat') as absen_keluar_telat,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'izin') as absen_keluar_izin,
//     id_siswa,siswa.nama
//     FROM absen
//     INNER JOIN siswa ON absen.id_siswa = siswa.id
//     WHERE absen.id_siswa = $1123 AND siswa.id_pembimbing_dudi = 2345
//     GROUP BY id_siswa,nama`

//     console.log(j);
// let query = {
//     nama : "Xl"
// }

// query = await validate(adminValidation.searchSiswaValidation,query)
// console.log(query);

// const findSiswa = await db.siswa.findMany({
//     where : {
//         AND : [
//             {
//                 AND : [
//                     {
//                         nama : {
//                             contains : query.nama,
//                             mode : 'insensitive'
//                         }
//                     },
//                     {
//                         id_jurusan : query.id_jurusan
//                     },
//                     {
//                         id_kelas : query.id_kelas
//                     },
//                     {
//                         jenis_kelamin : query.jenis_kelamin
//                     },
//                     {
//                         alamat : {
//                             AND : [
//                                 {
//                                     negara : {
//                                         contains : query.negara,
//                                         mode : "insensitive"
//                                     }
//                                 }
//                             ]
//                         }
//                     }
//                 ]

//             }
//         ]
//     }
// })

// console.log(await db.siswa.findMany({
//     where : {
//         id : undefined
//     }
// }))


// const haha = await db.$queryRawUnsafe(`SELECT COUNT(s)::int as total_siswa,COUNT(s.jenis_kelamin)filter (where s.jenis_kelamin = 'laki')::int  as total_siswa_laki,COUNT(s.jenis_kelamin) filter (where s.jenis_kelamin = 'perempuan')::int as total_siswa_perempuan,
// d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total as total_kouta,ks.jumlah_wanita as kouta_wanita,ks.jumlah_pria as kouta_pria
// FROM dudi as d
// LEFT JOIN siswa as s ON d.id = s.id_dudi
// LEFT JOIN alamat_dudi as ad ON d.id = ad.id_dudi
// LEFT JOIN kouta_siswa as ks ON d.id = ks.id_dudi
// WHERE (s.nama ILIKE $1 AND s.id_jurusan = $2 AND (1=1 AND (s.id IS NOT NULL)))
// GROUP BY d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total,ks.jumlah_wanita,ks.jumlah_pria`,undefined,54656)

// console.log(haha);








// const whereQuery = "1 = 1"

// const siswa = await db.$queryRawUnsafe(`select * from siswa as s
// where ${whereQuery}`)

// console.log(siswa);


console.log(await db.$queryRaw`SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir') as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir') as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat') as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin') as absen_masuk_izin,
COUNT(status_absen_pulang) filter (where status_absen_pulang = 'hadir') as absen_keluar_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'tidak_hadir') as absen_keluar_tidak_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'telat') as absen_keluar_telat,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'izin') as absen_keluar_izin,
id_siswa,siswa.nama
FROM absen
INNER JOIN siswa ON absen.id_siswa = siswa.id
GROUP BY id_siswa,nama`)


// absen.id_siswa = ${query.id_siswa} AND siswa.id_pembimbing_dudi = ${query.id_pembimbing_dudi} AND siswa.id_guru_pembimbing = ${query.id_guru_pembimbing} AND siswa.id_dudi = ${query.id_dudi} AND (absen.tanggal = ${query.tanggal} OR (absen.tanggal >= ${query.tanggal_start} AND absen.tanggal <= ${query.tanggal_end})) AND absen.tanggal = ?${query.month_ago}