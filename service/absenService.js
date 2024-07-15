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
import { getQueryAbsen } from "../utils/getQueryAbsen.js"
// deksripsi
const selectJadwalAbsen = {
    id : true,
    tanggal_mulai : true,
    tanggal_berakhir : true,
    selisih_tanggal_day : true,
    hari : {
        select : {
            nama : true,
            batas_absen_masuk : true,
            batas_absen_pulang : true
        }
    }
}

const addJadwalAbsen = async (body,day) => {
    body.selisih_tanggal_day = getselish(body.tanggal_mulai,body.tanggal_berakhir)
    body = await validate(absenValidation.addJadwalAbsen,body)
    day = await validate(absenValidation.dayValidation,day)

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

    if(body.tanggal_mulai > body.tanggal_berakhir) {
        throw new responseError(400,"kesalahan dalam memasukkan tanggal,harap periksa kembali")
    }

    const cekTanggal = await db.absen_jadwal.findFirst({
        where : {
            AND : [
                {
                    id_dudi : findPembimbingDudi.id_dudi
                },
                {
                    tanggal_berakhir : {
                        gte : body.tanggal_mulai
                    }
                }
            ]
        }
    })

    if(cekTanggal) {
        throw new responseError(400,"tanggal pada jadwal telah ditetapkan pada jadwal lain,mohon untuk mengecek kembali jadwal yang ada")
    }

    return db.$transaction(async tx => {
        const createJadwal = await tx.absen_jadwal.create({
            data : body
        })

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
        },
        select : selectJadwalAbsen
    })
}

const findJadwalAbsenById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJadwalAbsen = await db.absen_jadwal.findUnique({
        where : {
                id : id
        },
        select : selectJadwalAbsen
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

    const {dateNow,hourNow,day,absen,jadwal} = await validasiAbsenMasuk(body)
    body.tanggal = dateNow
    body.absen_masuk = hourNow

    if(!image) {
        throw new responseError(400,"foto is required")
    }
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
                    id_jadwal : jadwal.id
                },
                {
                    nama : day.toLowerCase()
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
        id_absen_jadwal : jadwal.id,
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
        throw new responseError(400,"anda telah melakukan absen pulang")
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
const absenIzinTelat = async (body,image,url) => {
    body = await validate(absenValidation.izinAbsenValidation,body)
    const cekradius = await cekRadiusKoordinat({latitude : body.latitude,longtitude : body.longtitude},{id : body.id_siswa})
    const data = {}

    if(!cekradius.insideRadius) {
        throw new responseError(400,"anda berada diluar radius,silahkan masuk kedalam radius untuk absen,atau absen diluar radius")
    }

    const Now = new Date()

    const dateNow = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"}).split(" ")

    if(!image) {
        throw new responseError(400,"foto is required")
    }

    const {fullPath,pathSaveFile} = await file(image,url)
    image.mv(pathSaveFile,(err) => {
        if(err) {
            throw new responseError(500,err.message)
        }
        body.foto = fullPath
    })

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
                    nama : datelocal[0].toLowerCase()
                    
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

        if(parseFloat(hourNow) - parseFloat(findDay.batas_absen_masuk) < parseFloat(findDay.batas_absen_pulang) - parseFloat(findDay.batas_absen_masuk)) {
            if(body.status == "telat") {
                throw new responseError(400,"anda belum memenuhi waktu jam kerja,lakukan izin jika ingin melakukan absen")
            }
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
            await tx.izin_absen_pulang.create({
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
        data.status = "hadir"
    
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
    body = await validate(absenValidation.absenDiluarRadiusValidation,body)
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

    if(!findSiswa.absen[0]) {
        throw new responseError(404,"something wrong")
    }

    const hourNow = datelocal[1]
    const selisih_tanggal_on_day = parseInt(getselish(findSiswa.absen[0].jadwal_absen.tanggal_mulai,dateNow))

    if(selisih_tanggal_on_day < 0) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadwal")
    }else if(selisih_tanggal_on_day > findSiswa.absen[0].jadwal_absen.selisih_tanggal_day) {
        throw new responseError(400,"tanggal absen tidak sesuai dengan jadawal")
    }

    if(!findSiswa.absen[0].status_absen_masuk) {
        throw new responseError(400,"anda belum melakukan absen masuk")
    }

    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : findSiswa.absen[0].jadwal_absen.id
                },
                {
                    nama : datelocal[0].toLowerCase()
                    
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
            await tx.izin_absen_pulang.create({
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
        data.status = "hadir"
    
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
const cekAbsen = async (body,location) => {
    const cekradius = await cekRadiusKoordinat({latitude : location.latitude,longtitude : location.longitude},{id : body.id_siswa})
    const Now = new Date()
    console.log({body});

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
            },
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

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    if(!findSiswa.dudi) {
        return {absen : false,jenis_absen : null,msg : "anda belum memiliki tempat pkl,segera cari tempat pkl"}
    }

    const findDay = await db.hari_absen.findFirst({
        where : {
            AND : [
                {
                    id_jadwal : findSiswa.dudi.absen_jadwal[0].id //kasi id sy hapus kemarin
                },
                {
                    nama : datelocal[0].toLowerCase()
                }
            ]
        }
    })

    if(!findSiswa.absen[0]) {
        if(!findSiswa.dudi.absen_jadwal[0]) {
            return {absen : false,jenis_absen : null,msg : "jadwal absen tidak ditemukan hari ini"}
        }
        if(!cekradius.insideRadius) {
            return {absen : false,jenis_absen : null,msg : "anda berada diluar radius"}  
        }

        if(findDay) {
            await db.absen.create({
                data : {
                    id : generateId(),
                    id_siswa : body.id_siswa,
                    id_absen_jadwal : findSiswa.dudi.absen_jadwal[0].id,
                    tanggal : dateNow
                }
            })
            if(dateNow > findDay.batas_absen_masuk) {
                return {absen : true,jenis_absen : "absen telat",msg : "anda telat dalam melakukan absen masuk, silahkan melakukan absen telat"}
            }
            return {absen : true,jenis_absen : "absen masuk",msg : "silahkan melakukan absen masuk"}
        }

        return {absen : false,jenis_absen : null,msg : "jadwal absen hari ini tidak ditemukan"}
    }
    if(findDay) {
        if(datelocal[1] > findDay.batas_absen_pulang) {
            return {absen : true,jenis_absen : "absen telat",msg : "anda telat dalam melakukan absen pulang, silahkan melakukan absen telat"}
        }
    }

    if(findSiswa.absen[0].status_absen_masuk) {
        if(!cekradius.insideRadius) {
            return {absen : true,jenis_absen : "absen diluar radius",msg : "silahkan melakukan absen diluar radius"}
        }
        return {absen : true,jenis_absen : "absen pulang",msg : "silahkan melakukan absen pulang"}
    }else {
        return {absen : true,jenis_absen : "absen masuk",msg : "silahkan melakukan absen masuk"}
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
            status_absen_pulang : true,
            keterangan_absen_masuk : true,
            keterangan_absen_pulang : true,
            foto : true,
        },
        orderBy : {
            tanggal : "asc"
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
            status_absen_pulang : true,
            keterangan_absen_masuk : true,
            keterangan_absen_pulang : true,
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
    const dbQuery = getQueryAbsen(query)

    return db.$queryRawUnsafe(dbQuery)
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

    if(!findKordinat[0]) {
        throw new responseError(404,"kordinat tidak ditemukan")
    }

    return findKordinat
}
async function cekRadiusKoordinat (body,siswa) {
    body = await validate(absenValidation.cekRadiusKordinatAbsenValidation,body)
    console.log({koor : body});

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : parseInt(siswa.id)
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    if(!findSiswa.id_dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
    }

    const findKordinat = await db.kordinat_absen.findMany({
        where : {
            id_dudi : findSiswa.id_dudi
        }
    })

    if(!findKordinat[0]) {
        throw new responseError(404,"kordinat tidak ditemukan,pembimbing dudi belum memasukkan kordinat untuk absen")
    }

    for (let index = 0; index < findKordinat.length; index++) {
        const e = findKordinat[index];
        // console.log(e);

        const cekDistance = await axios({
            method : "GET",
            url : `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${e.latitude},${e.longtitude}&destinations=${body.latitude},${body.longtitude}&key=AE8YE06HZ7XeZEcOsDR4SiShL8zPocpQ7XpgdctgGrECYiA1nLg09ffJxxa1n9M3`,
        })
        // console.log(cekDistance.data.rows[0]);
        if(cekDistance.status == 200) {
            if(!cekDistance.data.rows[0].elements[0].distance) {
                return {insideRadius : false,msg : "anda berada diluar radius kordinat absen"}
            }
            const distance = cekDistance.data.rows[0].elements[0].distance.value
        
            if(e.radius_absen_meter > distance) {
                return {insideRadius : true,msg : "anda berada didalam radius"}
            }
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

const findkoordinatById = async (id_koordinat) => {
    id_koordinat = await validate(adminValidation.idValidation,id_koordinat)

    const findKordinat = await db.kordinat_absen.findUnique({
        where : {
            id : id_koordinat
        }
    })

    if(!findKordinat) {
        throw new responseError(404,"data kordinat tidak ditemmukan")
    }

    return findKordinat
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
    cekAbsen,


    // kordinat absen
    addKordinatAbsen,
    findAllKordinatAbsen,
    cekRadiusKoordinat,
    deleteKoordinatAbsen,
    findkoordinatById
}