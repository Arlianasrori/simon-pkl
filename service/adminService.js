import adminValidation from "../validation/adminValidation.js"
import { validate } from "../validation/validate.js"
import { db } from "../config/prismaClient.js"
import responseError from "../error/responseError.js"
import generateId from "../utils/generateIdUtils.js"
import bcrypt from "bcryptjs"



// siswa service
const addSiswa = async (siswa,alamat) => {
    siswa.id = generateId()
    alamat.id_siswa = siswa.id
    siswa = await validate(adminValidation.addSiswaValidation,siswa)
    alamat = await validate(adminValidation.addAlamatSiswaValidation,alamat)

    siswa.password = await bcrypt.hash(siswa.password,10)

    const findSiswa = await db.siswa.findFirst({
       where : {
        OR : [
            {
                id : siswa.id
            },
            {
                nis : siswa.nis
            }
        ]
       }
    })

    if(findSiswa) {
        throw new responseError(400,"siswa sudah terdaftar")
    }
    
    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
            id : siswa.id_guru_pembimbing
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"guru pembimbing tidak ditemukan")
    }

    return db.$transaction(async (tx) => {
        const addSiswa = await tx.siswa.create({
            data : siswa,
            select : {
                nama : true,
                nis : true,
                guru_pembimbing : true,
                jurusan : true,
                kelas : true,
            }
        })
        const addAlamatSiswa = await tx.alamat_siswa.create({
            data : alamat
        })

        return {siswa : addSiswa,alamat : addAlamatSiswa}
    })
}


// guru pembimbing service
const addGuruPembimbing = async (guru,alamat) => {
    guru.id = generateId()
    alamat.id_guru_Pembimbing = guru.id
    guru = await validate(adminValidation.addGuruPembimbingValidation,guru)
    alamat = await validate(adminValidation.addAlamatGuruValidation,alamat)

    guru.password = await bcrypt.hash(guru.password,10)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
       where : {
        OR : [
            {
                id : guru.id
            },
            {
                nip : guru.nip
            }
        ]
       }
    })

    if(findGuruPembimbing) {
        throw new responseError(400,"guru pemimbing sudah terdaftar")
    }
    
    return db.$transaction(async (tx) => {
        const addGuruPembimbimg = await tx.guru_pembimbing.create({
            data : guru,
            select : {
                nama : true,
                nip : true,
                agama : true,
                jenis_kelamin : true,
                tanggal_lahir : true,
                tempat_lahir : true,
            }
        })
        const addAlamatGuruPembimbing= await tx.alamat_guru_Pembimbing.create({
            data : alamat
        })

        return {guru : addGuruPembimbimg,alamat : addAlamatGuruPembimbing}
    })
}


// dudi service
const addDudi = async (dudi,alamat) => {
    dudi.id = generateId()
    alamat.id_dudi = dudi.id

    dudi = await validate(adminValidation.addDudiValidation,dudi)
    alamat = await validate(adminValidation.addAlamatDudiValidation,alamat)

    const findDudi = await db.dudi.findFirst({
        where : {
            OR : [
                {
                    id : dudi.id
                },
                {
                    nama_instansi_perusahaan : dudi.nama_instansi_perusahaan
                }
            ]
        }
    })

    if(findDudi) {
        throw new responseError(400,"data dudi telah ditambahkan")
    }

    return db.$transaction(async (tx) => {
        const addDudi = await tx.dudi.create({
            data : dudi,
            select : {
                id : true,
                nama_instansi_perusahaan : true,
                no_telepon : true,
                bidang : true,
                catatan : true
            }
        })
        const addAlamatDudi= await tx.alamat_dudi.create({
            data : alamat
        })

        return {dudi : addDudi,alamat : addAlamatDudi}
    })
}


// pembimbing dudi service
const addPembimbingDudi = async (PembimbingDudi,alamat) => {
    console.log(PembimbingDudi);
    PembimbingDudi.id = generateId()
    alamat.id_pembimbing_dudi = PembimbingDudi.id

    PembimbingDudi = await validate(adminValidation.addPembimbingDudiValidation,PembimbingDudi)
    alamat = await validate(adminValidation.addAlamatPembimbingDudiValidation,alamat)
    console.log(PembimbingDudi);
    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            OR : [
                {
                    id : PembimbingDudi.id
                },
                {
                    username : PembimbingDudi.username
                }
            ]
        }
    })

    if(findPembimbingDudi) {
        throw new responseError(400,"data pembimbing dudi telah ditambahkan")
    }

    const findDudi = await db.dudi.findUnique({
        where : {
            id : PembimbingDudi.id_dudi
        }
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    return db.$transaction(async (tx) => {
        const addPembimbingDudi = await tx.pembimbing_dudi.create({
            data : PembimbingDudi,
            select : {
                id : true,
                nama : true,
                username : true,
                agama : true,
                jenis_kelamin : true,
                no_telepon : true,
                siswa : true,
                dudi : true
            }
        })
        const addAlamatDudi= await tx.alamat_pembimbing_dudi.create({
            data : alamat
        })

        return {pembimbingDudi : addPembimbingDudi,alamat : addAlamatDudi}
    })
}
export default {
    addSiswa,
    addGuruPembimbing,
    addDudi,
    addPembimbingDudi
}