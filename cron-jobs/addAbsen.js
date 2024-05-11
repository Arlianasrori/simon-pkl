import cron from "node-cron"
import { db } from "../config/prismaClient.js";
import generateId from "../utils/generateIdUtils.js";

export async function addAbsen () {
    cron.schedule('00 12 * * *', async () => {
        const Now = new Date()

        const dateNow = Now.toISOString().substring(0, 10)
        const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")

        const findAllSiswa = await db.siswa.findMany({
            select : {
                id : true,
                dudi : {
                    select : {
                        absen_jadwal : {
                            where : {
                                AND : [
                                    {
                                        tanggal_mulai : {
                                            lte : dateNow
                                        },
                                        tanggal_berakhir : {
                                            gte : dateNow
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        })

        findAllSiswa.forEach(async siswa => {
            
        console.log("gas");
            if(siswa.dudi) {
                if(siswa.dudi.absen_jadwal[0]) {
                    const findDay = await db.hari_absen.findFirst({
                        where : {
                            AND : [
                                {
                                    id_jadwal : siswa.dudi.absen_jadwal[0].id
                                },
                                {
                                    nama : {
                                            equals : datelocal[0],
                                            mode : "insensitive"
                                    }
                                }
                            ]
                        }
                    })

                    if(findDay) {
                        await db.absen.create({
                            data : {
                                id : generateId(),
                                id_siswa : siswa.id,
                                id_absen_jadwal : siswa.dudi.absen_jadwal[0].id,
                                tanggal : dateNow
                            }
                        })
                    }
                }
            }
        })
    });
}