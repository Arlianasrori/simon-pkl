import { db } from "./config/prismaClient.js";

await db.absen.create({
    data : {
        id : 3434343,
        id_absen_jadwal : 1,
        id_siswa : 4940,
        tanggal : "2024-04-25"
    }
})