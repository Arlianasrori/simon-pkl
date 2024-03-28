import adminValidation from "../validation/adminValidation.js"
import { validate } from "../validation/validate.js"
import responseError from "../error/responseError.js"
import generateId from "../utils/generateIdUtils.js"
import notificationValidation from "../validation/notificationValidation.js"
import { db } from "../config/prismaClient.js"

const addNotification = async (body) => {
    body.id = generateId()
    body = await validate(notificationValidation.addNotificationValidation,body)

    return db.notification.create({
        data : body
    })
}

const getNotification = async (id_siswa) => {
    id_siswa = await validate(adminValidation.idValidation,id_siswa)

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : id_siswa
        },
        select : {
            id : true,
            guru_pembimbing : {
                select : {
                    id : true
                }
            },
            pembimbing_dudi : {
                select : {
                    id : true
                }
            },
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    const where =  [
        {
            id_siswa : id_siswa
        },
        {
            id_siswa : null
        }
    ]

    if(findSiswa.guru_pembimbing) {
        where.push({id_guru_pembimbing : findSiswa.guru_pembimbing.id})
    }

    if(findSiswa.pembimbing_dudi) {
        where.push({id_pembimbing_dudi : findSiswa.pembimbing_dudi.id})
    }

    return db.notification.findMany({
        where : {
            OR :where
        }
    })
}
export default {
    addNotification,
    getNotification
}