import { validate } from "../validation/validate.js"
import generateId from "../utils/generateIdUtils.js"
import bcrypt from "bcryptjs"
import responseError from "../error/responseError.js"
import { db } from "../config/prismaClient.js"
import adminDeveloperValidation from "../validation/adminDeveloperValidation.js"
import adminValidation from "../validation/adminValidation.js"
import { adminDeveloperSelect } from "../utils/adminSelect.js"

// sekolah
const addSekolah = async (sekolah,alamat) => {
    console.log(sekolah);
    sekolah.id = generateId()
    sekolah = await validate(adminDeveloperValidation.addSekolahValidation,sekolah)
    alamat.id_sekolah = sekolah.id
    alamat = await validate(adminDeveloperValidation.addAlamatValidation,alamat)

    const findSekolah = await db.sekolah.findFirst({
        where : {
            id : sekolah.id
        }
    })

    if(findSekolah) {
        throw new responseError(400,"something wrong")
    }

    return db.$transaction(async tx => {
        const addSekolah = await tx.sekolah.create({
            data : sekolah
        })

        const addAlamat = await tx.alamat_sekolah.create({
            data : alamat
        })

        return {sekolah : addSekolah,alamat : addAlamat}
    })
}



// admin
const addAdmin = async (body) => {
    body.id = generateId()
    body = await validate (adminDeveloperValidation.addAdminValidation, body)
    
    body.password = await bcrypt.hash(body.password,10)

    const findAdmin = await db.admin.findUnique ({
        where: {
            username : body.username
        }
    })

    if (findAdmin) {
        throw new responseError (400, "Admin telah dibuat")
    }

    const findSekolah = await db.sekolah.findUnique({
        where : {
            id : body.id_sekolah
        }
    })

    if(!findSekolah) {
        throw new responseError(404,"sekolah tidak ditemukan")
    }

    return db.admin.create ({
            data: body,
            select: adminDeveloperSelect
        })
}

const updateAdmin = async (id, body) => {
    id = await validate(adminValidation.idValidation, id)
    body = await validate(adminDeveloperValidation.updateAdminValidation, body)

    const findAdmin = await db.admin.findUnique({
        where: {
            id: id
        }
    })

    if (!findAdmin) {
        throw new responseError (404, "Admin tidak ditemukan")
    }

    return db.admin.update({
      where: {
        id: id
    },
    data: body,
    select: adminDeveloperSelect
    })
    
}

const deleteAdmin = async (id) => {
    id = await validate(adminValidation.idValidation, id)

    const findAdmin = await db.admin.findUnique ({
        where: {
            id: id
        }
    })

    if (!findAdmin) {
        throw new responseError(404, "Admin tidak ditemukan")
    }

    return db.admin.delete({
        where: {
            id: id
        },
        select : adminDeveloperSelect
    })
}

const getAdminById = async (id) => {
    id = await validate(adminValidation.idValidation, id)

    const findAdmin = await db.admin.findUnique ({
        where: {
            id: id
        },
        select: adminDeveloperSelect
    })

    if (!findAdmin) {
        throw new responseError(404, "Admin tidak ditemukan")
    }
    return findAdmin
}

const getAllAdmin = async () => {
    return db.admin.findMany ({
        select: adminDeveloperSelect
    })
}

export default {
    // sekolah
    addSekolah,


    // admin
    addAdmin,
    deleteAdmin,
    updateAdmin,
    getAllAdmin,
    getAdminById,
}