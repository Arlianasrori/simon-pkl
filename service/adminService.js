import adminValidation from "../validation/adminValidation.js"
import { validate } from "../validation/validate.js"
import { db } from "../config/prismaClient.js"
import responseError from "../error/responseError.js"
import generateId from "../utils/generateIdUtils.js"
import alamatValidation from "../utils/addalamatValidation.js"

const addSiswa = async (siswa,alamat) => {
    siswa.id = generateId()
    alamat.id_siswa = siswa.id
    siswa = await validate(adminValidation.addSiswaValidation,siswa)
    alamat = await alamatValidation("id_siswa",alamat)

    const findSiswa = await db.siswa.findUnique({
       where : {
        nis : siswa.nis
       }
    })

    if(findSiswa) {
        throw new responseError(400,"siswa sudah terdaftar")
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
const addGuruPembimbing = async (guru,alamat) => {
    guru.id = generateId()
    alamat.id_guru = guru.id
    guru = await validate(adminValidation.addGuruPembimbingValidation,guru)
    alamat = await alamatValidation("id_guru",alamat)

    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
       where : {
        nip : guru.nip
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
        const addAlamatGuruPembimbing= await tx.alamat_siswa.create({
            data : alamat
        })

        return {guru : addGuruPembimbimg,alamat : addAlamatGuruPembimbing}
    })
}
export default {
    addSiswa,
    addGuruPembimbing
}