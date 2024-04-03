import { notificationSelected } from "./notificationSelected.js"
import { validate } from "../validation/validate.js"
import { db } from "../config/prismaClient.js"
import adminValidation from "../validation/adminValidation.js"
import responseError from "../error/responseError.js"

export async function cekNotif (id_siswa) {
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

    notificationSelected.OR.push({
        id_siswa : id_siswa
    })

    if(findSiswa.pembimbing_dudi) {
        notificationSelected.OR.push(  {
            id_pembimbing_dudi : findSiswa.pembimbing_dudi.id
        })
    }

    if(findSiswa.guru_pembimbing) {
        notificationSelected.OR.push({
            id_guru_pembimbing : findSiswa.guru_pembimbing.id
        })
    }

    return notificationSelected
}