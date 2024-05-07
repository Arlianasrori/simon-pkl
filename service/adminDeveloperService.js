import { validate } from "../validation/validate.js"
import generateId from "../utils/generateIdUtils.js"
import bcrypt from "bcryptjs"
import responseError from "../error/responseError.js"
import { db } from "../config/prismaClient.js"
import adminDeveloperValidation from "../validation/adminDeveloperValidation.js"
import adminValidation from "../validation/adminValidation.js"
import { adminDeveloperSelect } from "../utils/adminSelect.js"
import { file } from "../utils/saveImagesLogo.js"
import fs from "fs"

const sekolahSelect = {
    id : true,
    nama : true,
    alamat : true,
    kepala_sekolah : true
}
// sekolah
const addSekolah = async (sekolah,alamat,kepalaSekolah,image,url) => {
    sekolah.id = generateId()

    const findSekolah = await db.sekolah.findFirst({
        where : {
            id : sekolah.id
        }
    })

    if(findSekolah) {
        throw new responseError(400,"something wrong")
    }

    if(image) {
        const { pathSaveFile, fullPath } = await file(image, url);
    
        await image.mv(pathSaveFile, async (err) => {
            if (err) {
              throw new responseError(500, err.message);
            }
        });
    
        sekolah.logo = fullPath
    }
    sekolah = await validate(adminDeveloperValidation.addSekolahValidation,sekolah)
    alamat.id_sekolah = sekolah.id
    alamat = await validate(adminDeveloperValidation.addAlamatValidation,alamat)
    kepalaSekolah.id_sekolah = sekolah.id
    kepalaSekolah = await validate(adminDeveloperValidation.addKepalaSekolahValidation,kepalaSekolah)

    return db.$transaction(async tx => {
        const addSekolah = await tx.sekolah.create({
            data : sekolah
        })

        const addAlamat = await tx.alamat_sekolah.create({
            data : alamat
        })

        const addKepalaSekolah = await tx.kepala_sekolah.create({
            data : kepalaSekolah
        })

        return {sekolah : addSekolah,alamat : addAlamat,sekolah : addKepalaSekolah}
    })
}

const updateSekolah = async (id,sekolah,alamat,kepala_sekolah,image,url) => {
    id = await validate(adminValidation.idValidation,id)

    if(image) {
        const { pathSaveFile, fullPath } = await file(image, url);
    
        await image.mv(pathSaveFile, async (err) => {
            if (err) {
              throw new responseError(500, err.message);
            }
        });
    
        sekolah.logo = fullPath
    }

    return db.$transaction(async tx => {
        if(sekolah) {
            sekolah = await validate(adminDeveloperValidation.updateSekolahValidation,sekolah)
            await tx.sekolah.update({
                where : {
                    id : id
                },
                data : sekolah
            })
        }
        if(alamat) {
            alamat = await validate(adminDeveloperValidation.updateAlamatSekolahValidation,alamat)
            await tx.alamat_sekolah.update({
                where : {
                    id_sekolah : id
                },
                data : alamat
            })
        }
        if(kepala_sekolah) {
            kepala_sekolah = await validate(adminDeveloperValidation.updateKepalaSekolahValidation,kepala_sekolah)
            await tx.kepala_sekolah.update({
                where : {
                    id_sekolah : id
                },
                data : kepala_sekolah
            })
        }

        return "success"
    })
}
const deleteSekolah = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findSekolah = await db.sekolah.findUnique({
        where : {
            id : id
        }
    })

    if(!findSekolah) {
        throw new responseError(404,"data sekolah tidak ditemukan")
    }
    const fileName = findSekolah.logo.split("/")[4]
    fs.unlinkSync(`./public/logo/${fileName}`,(err) => {
        console.log(err);
    })
    return db.sekolah.delete({
        where : {
            id : id
        }
    })
}
const getAllSekolah = async (page) => {
    page = await validate(adminValidation.idValidation,page)

    const findAllSekolah = await db.sekolah.findMany({
        skip : 10 * (page - 1),
        take : 10,
        select : sekolahSelect
    })

    return {sekolah : findAllSekolah,page : page,count : findAllSekolah.length}
}
const getSekolahById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findSekolah = await db.sekolah.findUnique({
        where : {
            id : id
        },
        select : sekolahSelect
    })

    if(!findSekolah) {
        throw new responseError(404,"data sekolah tidak ditemukan")
    }

    return findSekolah
}



// admin
const addAdmin = async (body) => {
    body.id = generateId()
    body = await validate (adminDeveloperValidation.addAdminValidation, body)
    
    body.password = await bcrypt.hash(body.password,10)

    const findAdmin = await db.admin.findFirst({
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
    updateSekolah,
    deleteSekolah,
    getAllSekolah,
    getSekolahById,


    // admin
    addAdmin,
    deleteAdmin,
    updateAdmin,
    getAllAdmin,
    getAdminById,
}