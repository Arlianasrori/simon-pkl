import { db } from "../config/prismaClient.js"
import generateId from "../utils/generateIdUtils.js"
import absenValidation from "../validation/absenValidation.js"
import responseError from "../error/responseError.js"
import { validate } from "../validation/validate.js"

const addJadwalAbsen = async (body) => {
    console.log(body);
    body.id = generateId() 
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


    return db.absen_jadwal.create({
        data : body
    })
}

export default {
    addJadwalAbsen
}