import { db } from "../config/prismaClient.js"
import absenValidation from "../validation/absenValidation.js"
import responseError from "../error/responseError.js"
import { validate } from "../validation/validate.js"
import { getselish } from "../utils/getSelishDatehour.js"
import adminValidation from "../validation/adminValidation.js"
import generateId from "../utils/generateIdUtils.js"
import { file } from "../utils/absenSaveImages.js"
import { validasiAbsen } from "../utils/validasiAbsen.js"
import { validasiAbsenMasuk } from "../utils/validasiAbsenMasuk.js"
import axios from "axios"



const addJadwalAbsen = async (body,day) => {
    body.selisih_tanggal_day = getselish(body.tanggal_mulai,body.tanggal_berakhir)
    body = await validate(absenValidation.addJadwalAbsen,body)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : body.id_pembimbing_dudi
        },
        select : {
            id : true,
            id_dudi : true
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }

    if(findPembimbingDudi.id_dudi != body.id_dudi) {
        throw new responseError(404,"invalid id dudi")
    }

    return db.$transaction(async tx => {
        const createJadwal = await tx.absen_jadwal.create({
            data : body
        })
        console.log(day);

        for (let i = 0; i < day.length; i++) {
            day[i].id_jadwal = createJadwal.id
            if(i !== day.length - 1) {
                if(day[i].nama == day[i + 1].nama) {
                    throw new responseError(400,"duplicate day")
                }
            }
            
        }
    
        const createDay = await tx.hari_absen.createMany({
            data : day
        })

        return {jadwal : createJadwal,day : createDay}
    })
}

const findAllJadwalAbsen = async (id_pembimbing_dudi) => {
    id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)

    const findPembimbingDudi = await db.pembimbing_dudi.findMany({
        where : {
            id : id_pembimbing_dudi
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"pembimbing dudi tidka ditemukan")
    }

    return db.absen_jadwal.findMany({
        where : {
            id_pembimbing_dudi : id_pembimbing_dudi
        }
    })
}

const findJadwalAbsenById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJadwalAbsen = await db.absen_jadwal.findUnique({
        where : {
                id : id
        }
    })

    if(!findJadwalAbsen) {
        throw new responseError(404,"data jadwal absen tidak ditemukan")
    }
    return findJadwalAbsen
}


// absen
const addAbsenMasuk = async (body,image,url) => {
    const cekradius = await cekRadiusKoordinat({latitude : body.latitude,longtitude : body.longtitude},{id : body.id_siswa})

    if(!cekradius.insideRadius) {
        throw new responseError(400,"anda berada diluar radius,silahkan masuk kedalam radius untuk absen")
    }

    const findJadwalAbsen = await db.absen_jadwal.findUnique({
        where : {
            id : parseInt(body.id_absen_jadwal)
        },
        select : {
            id : true,
            tanggal_mulai : true,
            tanggal_berakhir : true,
            selisih_tanggal_day : true,
        }
    })

    if(!findJadwalAbsen) {
        throw new responseError(404,"jadwal absen tidak ditemukan")
    }

    const {dateNow,hourNow,day,absen} = await validasiAbsenMasuk(findJadwalAbsen,body)
    body.tanggal = dateNow
    body.absen_masuk = hourNow

    const {fullPath,pathSaveFile} = await file(image,url)
    image.mv(pathSaveFile,(err) => {
        if(err) {
            throw new responseError(500,err.message)
        }
    })
    body.foto = fullPath

    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : findJadwalAbsen.id
                },
                {
                    nama : {
                        equals : day,
                        mode : "insensitive"
                    }
                }
            ]
        }
    })

    if(!findDay) {
        throw new responseError(400,"jadwal absen untuk hari ini tidak ditemukan")
    }

    if(hourNow > findDay.batas_absen_pulang) {
            throw new responseError(400,"anda telah melewati batas absen")
    }else if (hourNow > findDay.batas_absen_masuk) {
            return {succes_absen : false,msg : "anda telat untuk absen masuk,silahkan isi keterangan anda untuk absen"}
    }

    body.status_absen_masuk = "hadir"
    body.status = "hadir"

    let data = {
        id_absen_jadwal : body.id_absen_jadwal,
        id_siswa : body.id_siswa,
        tanggal : body.tanggal,
        absen_masuk : body.absen_masuk,
        status_absen_masuk : body.status_absen_masuk,
        status : body.status,
        foto : body.foto
    }
    data = await validate(absenValidation.addAbsenMasukValidation,data)

    return db.absen.update({
    where : {
        id : absen.id
    },
    data : data
    })
}

const addAbsenPulang = async (body) => {
    const cekradius = await cekRadiusKoordinat({latitude : body.latitude,longtitude : body.longtitude},{id : body.id_siswa})

    if(!cekradius.insideRadius) {
        throw new responseError(400,"anda berada diluar radius,silahkan masuk kedalam radius untuk absen,atau absen diluar radius")
    }
    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    const validasi = await validasiAbsen(body)

    body.absen_pulang = validasi.hourNow
    body.status_absen_pulang = "hadir"

    let data = {
        id_siswa : body.id_siswa,
        absen_pulang : body.absen_pulang,
        status_absen_pulang : body.status_absen_pulang
    }

    data = await validate(absenValidation.addAbsenKeluarValidation,data)

    return db.absen.update({
        where : {
            id : validasi.id
        },
        data : data
    })
}



const absenTidakMemenuhiJam = async (body) => {
    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }

    const findAbsen = await db.absen.findUnique({
        where : {
            id : body.id
        },
        select : {
            jadwal_absen : true,
            absen_masuk : true,
            absen_pulang : true
        }
    })

    if(!findAbsen) {
        throw new responseError(404,"data absen tidak ditemukan")
    }

    if(findAbsen.absen_pulang) {
        throw new responseError(400,"anda telah melakukan absen keluar")
    }


    const validasi = await validasiAbsen(findAbsen.jadwal_absen.tanggal_mulai,findAbsen.jadwal_absen.selisih_tanggal_day,findAbsen.jadwal_absen.batas_absen_masuk)

    body.absen_pulang = validasi
    body.status = "izin"

    body = await validate(absenValidation.absenTidakMemenuhiJamValidation,body)

    return db.$transaction(async (tx) => {
        const updateAbsen = await tx.absen.update({
            where : {
                id : body.id
            },
            data : {
                absen_pulang : body.absen_pulang,
                status_absen_pulang : body.status
            }
        })

        const addIzin = await tx.izin_absen.create({
            data : {
                id : generateId(),
                note : body.note,
                id_absen : body.id,
                status_izin : body.status_izin
            }
        })

        return {absen : updateAbsen,izin : addIzin}
    })
}


// izin telat
const absenIzinTelat = async (body) => {
    body = await validate(absenValidation.izinAbsenValidation,body)
    const cekradius = await cekRadiusKoordinat({latitude : body.latitude,longtitude : body.longtitude},{id : body.id_siswa})
    const data = {}

    if(!cekradius.insideRadius) {
        throw new responseError(400,"anda berada diluar radius,silahkan masuk kedalam radius untuk absen,atau absen diluar radius")
    }

    const Now = new Date()

    const dateNow = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        },
        select : {
            id : true,
            absen : {
                where : {
                    tanggal : dateNow
                },
                select : {
                    jadwal_absen : true,
                    id : true,
                    status_absen_masuk : true,
                    status_absen_pulang : true                 
                }
            }
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    const hourNow = datelocal[1]
    const selisih_tanggal_on_day = parseInt(getselish(findSiswa.absen[0].jadwal_absen.tanggal_mulai,dateNow))

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findSiswa.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(!findSiswa.absen[0]) {
        throw new responseError(400,"something went wrong")
    }

    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : findSiswa.absen[0].jadwal_absen.id
                },
                {
                    nama : {
                        equals : datelocal[0],
                        mode : "insensitive"
                    },
                    
                }
            ]
        }
    })

    

    if(!findDay) {
        throw  new responseError(400,"jadwal absen untuk hari ini tidak ditemukan")
    }
   
    if(findSiswa.absen[0].status_absen_masuk) { 
        if(findSiswa.absen[0].status_absen_pulang) {
            throw new responseError(400,"anda sudah melakukan absen pulang")
        } 

        data.absen_pulang = hourNow
        data.status_absen_pulang = body.status
        data.status = "hadir"

        return db.$transaction(async tx => {
            const updateAbsen = await tx.absen.update({
                where : {
                    id : findSiswa.absen[0].id
                },
                data : data
            })
            await tx.izin_absen_keluar.create({
                data : {
                    id : parseInt(generateId()),
                    note : body.keterangan,
                    status_izin : body.status,
                    id_absen : updateAbsen.id
                }
            })
    
            return "succes"
        })
    }else {
        if(hourNow > findDay.batas_absen_pulang) {
            throw new responseError(400,"anda telah melewati batas absen masuk")
        }

        data.absen_masuk = hourNow
        data.status_absen_masuk = body.status
    
        return db.$transaction(async tx => {
            const updateAbsen = await tx.absen.update({
                where : {
                    id : findSiswa.absen[0].id
                },
                data : data
            })
            await tx.izin_absen_masuk.create({
                data : {
                    id : parseInt(generateId()),
                    note : body.keterangan,
                    status_izin : body.status,
                    id_absen : updateAbsen.id
                }
            })
    
            return "success"
        })
    }

}


// diluar radius
const absendiluarRadius = async (body) => {
    body = await validate(absenValidation.izinAbsenValidation,body)
    const data = {}

    const Now = new Date()

    const dateNow = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : body.id_siswa
        },
        select : {
            id : true,
            absen : {
                where : {
                    tanggal : dateNow
                },
                select : {
                    jadwal_absen : true,
                    id : true,
                    status_absen_masuk : true,
                    status_absen_pulang : true                 
                }
            }
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    const hourNow = datelocal[1]
    const selisih_tanggal_on_day = parseInt(getselish(findSiswa.absen[0].jadwal_absen.tanggal_mulai,dateNow))

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findSiswa.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(!findSiswa.absen[0]) {
        throw new responseError(400,"something went wrong")
    }

    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : findSiswa.absen[0].jadwal_absen.id
                },
                {
                    nama : {
                        equals : datelocal[0],
                        mode : "insensitive"
                    },
                    
                }
            ]
        }
    })

    

    if(!findDay) {
        throw  new responseError(400,"jadwal absen untuk hari ini tidak ditemukan")
    }
   
    if(findSiswa.absen[0].status_absen_masuk) {   
        if(findSiswa.absen[0].status_absen_pulang) {
            throw new responseError(400,"anda sudah melakukan absen pulang")
        }   
        data.absen_pulang = hourNow
        data.status_absen_pulang = "diluar_radius"
        data.status = "hadir"

        return db.$transaction(async tx => {
            const updateAbsen = await tx.absen.update({
                where : {
                    id : findSiswa.absen[0].id
                },
                data : data
            })
            await tx.izin_absen_keluar.create({
                data : {
                    id : parseInt(generateId()),
                    note : body.keterangan,
                    status_izin : "diluar_radius",
                    id_absen : updateAbsen.id
                }
            })
    
            return "succes"
        })
    }else {
        if(hourNow > findDay.batas_absen_pulang) {
            throw new responseError(400,"anda telah melewati batas absen masuk")
        }

        data.absen_masuk = hourNow
        data.status_absen_pulang = "diluar_radius"
    
        return db.$transaction(async tx => {
            const updateAbsen = await tx.absen.update({
                where : {
                    id : findSiswa.absen[0].id
                },
                data : data
            })
            await tx.izin_absen_masuk.create({
                data : {
                    id : parseInt(generateId()),
                    note : body.keterangan,
                    status_izin : "diluar_radius",
                    id_absen : updateAbsen.id
                }
            })
    
            return "succes"
        })
    }

}


const findAbsen = async (id_siswa) => {
    id_siswa = await validate(adminValidation.idValidation,id_siswa)

    return db.absen.findMany({
        where : {
            id_siswa : id_siswa
        },
        select : {
            id : true,
            absen_masuk : true,
            absen_pulang : true,
            jadwal_absen : true,
            status_absen_masuk : true,
            status_absen_keluar : true,
            foto : true,
            izin : {
                select : {
                    note : true,
                    status_izin : true
                }
            }
        }
    })
}

const findAbsenFilter = async (query) => {
    query = await validate(absenValidation.findAbsenFilterValidation,query)

    if(query.month_ago) {
        query.month_ago = new Date().setMonth(new Date().getMonth() - query.month_ago + 1)
    }

    return db.absen.findMany({
        where : {
            AND : [
                {
                    id_siswa : query.id_siswa
                },
                {
                    siswa : {
                        id_pembimbing_dudi : query.id_pembimbing_dudi
                    }
                },
                {
                    siswa : {
                        id_guru_pembimbing : query.id_guru_pembimbing
                    }
                },
                {
                    siswa : {
                        id_dudi : query.id_dudi
                    }
                },
                {
                    OR : [
                        {
                            tanggal : query.tanggal
                        },
                        {
                            AND : [
                                {
                                    tanggal : {
                                        gte : query.tanggal_start
                                    }
                                },
                                {
                                    tanggal : {
                                        lte : query.tanggal_end
                                    }
                                },
                            ]
                        }
                    ]
                },
                {
                    tanggal : query.month_ago
                }
            ]
        },
        orderBy : {
            tanggal : "desc",
        },
        select : {
            id : true,
            tanggal : true,
            absen_masuk : true,
            absen_pulang : true,
            status_absen_masuk : true,
            status_absen_keluar : true,
            foto : true,
            jadwal_absen : true,
            siswa : {
                select : {
                    id : true,
                    nama : true,
                    nis : true
                }
            }
        }
    })
}
const analisisAbsen = async (query) => {
    query = await validate(absenValidation.findAbsenFilterValidation,query)

    if(query.month_ago) {
        query.month_ago = new Date().setMonth(new Date().getMonth() - query.month_ago + 1)
    }
    console.log(query);

    return db.$queryRaw`SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir') as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir') as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat') as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin') as absen_masuk_izin,
    COUNT(status_absen_keluar) filter (where status_absen_keluar = 'hadir') as absen_keluar_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'tidak_hadir') as absen_keluar_tidak_hadir,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'telat') as absen_keluar_telat,COUNT(status_absen_keluar) filter (where status_absen_keluar = 'izin') as absen_keluar_izin,
    id_siswa,siswa.nama
    FROM absen
    INNER JOIN siswa ON absen.id_siswa = siswa.id
    WHERE absen.id_siswa = ${query.id_siswa} AND siswa.id_pembimbing_dudi = ${query.id_pembimbing_dudi} AND siswa.id_guru_pembimbing = ${query.id_guru_pembimbing} AND siswa.id_dudi = ${query.id_dudi} AND (absen.tanggal = ${query.tanggal} OR (absen.tanggal >= ${query.tanggal_start} AND absen.tanggal <= ${query.tanggal_end})) AND absen.tanggal = ${query.month_ago}
    GROUP BY id_siswa,nama`
    // return db.absen.findMany({
    //     where : {
    //         AND : [
    //             {
    //                 id_siswa : query.id_siswa
    //             },
    //             {
    //                 siswa : {
    //                     id_pembimbing_dudi : query.id_pembimbing_dudi
    //                 }
    //             },
    //             {
    //                 siswa : {
    //                     id_guru_pembimbing : query.id_guru_pembimbing
    //                 }
    //             },
    //             {
    //                 siswa : {
    //                     id_dudi : query.id_dudi
    //                 }
    //             },
    //             {
    //                 OR : [
    //                     {
    //                         tanggal : query.tanggal
    //                     },
    //                     {
    //                         AND : [
    //                             {
    //                                 tanggal : {
    //                                     gte : query.tanggal_start
    //                                 }
    //                             },
    //                             {
    //                                 tanggal : {
    //                                     lte : query.tanggal_end
    //                                 }
    //                             },
    //                         ]
    //                     }
    //                 ]
    //             },
    //             {
    //                 tanggal : query.month_ago
    //             }
    //         ]
    //     },
    //     orderBy : {
    //         tanggal : "desc"
    //     },
    //     select : {
    //         id : true,
    //         tanggal : true,
    //         absen_masuk : true,
    //         absen_pulang : true,
    //         status_absen_masuk : true,
    //         status_absen_keluar : true,
    //         foto : true,
    //         jadwal_absen : true,
    //         siswa : {
    //             select : {
    //                 id : true,
    //                 nama : true,
    //                 nis : true
    //             }
    //         }
    //     }
    // })
}


// kordinat absen
const addKordinatAbsen = async (body) => {
    body.id = generateId()
    body = await validate(absenValidation.addKordinatAbsenValidation,body)

    const findDudi = await db.dudi.findUnique({
        where : {
            id : body.id_dudi
        }
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : body.id_pembimbing_dudi
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidka ditemukan")
    }

    const findPlace = await axios({
        method : "GET",
        url : `https://api.geoapify.com/v1/geocode/reverse?lat=${body.latitude}&lon=${body.longtitude}&format=json&apiKey=3b91d0d360394a938332fa466ce17de8`
    })

    if(findPlace.status != 200) {
        throw new responseError(400,"invalid cordinate")
    }
    return db.kordinat_absen.create({
        data : body
    })
}

const findAllKordinatAbsen = async (id_pembimbing) => {
    id_pembimbing = await validate(adminValidation.idValidation,id_pembimbing)

    const findKordinat = await db.kordinat_absen.findMany({
        where : {
            id_pembimbing_dudi : id_pembimbing
        },
        select : {
            id : true,
            latitude : true,
            longtitude : true,
            radius_absen_meter : true,
            pembimbing_dudi : {
                select : {
                    id : true,
                    nama : true,                  
                }
            },
            dudi : {
                select : {
                    id : true,
                    nama_instansi_perusahaan : true
                }
            }
        }
    })

    if(!findKordinat) {
        throw new responseError(404,"kordinat tidak ditemukan")
    }

    return findKordinat
}
async function cekRadiusKoordinat (body,siswa) {
    body = await validate(absenValidation.cekRadiusKordinatAbsenValidation,body)

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : parseInt(siswa.id)
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    if(!findSiswa.id_dudi) {
        throw new responseError(400,"siswa belum memiliki tampat pkl")
    }

    const findKordinat = await db.kordinat_absen.findMany({
        where : {
            id_dudi : findSiswa.id_dudi
        }
    })

    if(!findKordinat[0]) {
        throw new responseError(404,"kordinat tidak ditemukan")
    }

    for (let index = 0; index < findKordinat.length; index++) {
        const e = findKordinat[index];
        
        const cekDistance = await axios({
            method : "GET",
            url : `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${e.latitude},${e.longtitude}&destinations=${body.latitude},${body.longtitude}&key=AE8YE06HZ7XeZEcOsDR4SiShL8zPocpQ7XpgdctgGrECYiA1nLg09ffJxxa1n9M3`,
        })
        
        if(cekDistance.status !== 200) {
                throw new responseError(400,"invalid koordinat")
        }
        const distance = cekDistance.data.rows[0].elements[0].distance.value
    
        if(e.radius_absen_meter > distance) {
            return {insideRadius : true,msg : "anda berada didalam radius"}
        }
    }

    return {insideRadius : false,msg : "anda berada diluar radius kordinat absen"}
}

const deleteKoordinatAbsen = async (id_koordinat) => {
    id_koordinat = await validate(adminValidation.idValidation,id_koordinat)

    const findKordinat = await db.kordinat_absen.findUnique({
        where : {
            id : id_koordinat
        }
    })

    if(!findKordinat) {
        throw new responseError(404,"data kordinat tidak ditemmukan")
    }

    return db.kordinat_absen.delete({
        where : {
            id : id_koordinat
        }
    })
}

export default {
    addJadwalAbsen,
    findAllJadwalAbsen,
    findJadwalAbsenById,


    // absen
    addAbsenMasuk,
    addAbsenPulang,
    findAbsen,
    absenTidakMemenuhiJam,
    findAbsenFilter,
    analisisAbsen,
    absenIzinTelat,
    absendiluarRadius,


    // kordinat absen
    addKordinatAbsen,
    findAllKordinatAbsen,
    cekRadiusKoordinat,
    deleteKoordinatAbsen
}