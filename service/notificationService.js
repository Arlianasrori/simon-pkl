import adminValidation from "../validation/adminValidation.js"
import { validate } from "../validation/validate.js"
import responseError from "../error/responseError.js"
import generateId from "../utils/generateIdUtils.js"
import notificationValidation from "../validation/notificationValidation.js"
import { db } from "../config/prismaClient.js"
import { cekNotif } from "../utils/ceknotif.js"
import { sendNotification } from "../utils/sendNotification.js"
// deksripsi

const addNotification = async (body) => {
    body.id = generateId()

    const Now = new Date()

    body.tanggal = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    body.time = datelocal.split(" ")[1]

    body = await validate(notificationValidation.addNotificationValidation,body)

    const payloadPush = {}

    if(body.id_siswa)  {
        const findSiswa = await db.siswa.findFirst({
            where : {
                id : body.id_siswa
            }
        })

        if(!findSiswa) {
            throw new responseError(404,"siswa tidak ditemukan")
        }

        payloadPush = {
            notification : {
                body : body.isi,
                title : payload.judul
            },
            token : findSiswa.token_FCM
        }

        sendNotification(payloadPush)
    }else if (body.id_pembimbing_dudi) {
        const findSiswa = await db.siswa.findMany({
            where : {
                id_pembimbing_dudi : body.id_pembimbing_dudi
            },
            select : {
                token_FCM : true
            }
        })
        const token = []
        findSiswa.forEach(e => {
            if (e.token_FCM) {
                token.push(e.token_FCM)
            }
        })

        payloadPush = {
            notification : {
                body : body.isi,
                title : payload.judul
            },
            token : token
        }

        sendNotification(payloadPush)
    }else if(body.id_guru_pembimbing) {
        const findSiswa = await db.siswa.findMany({
            where : {
                id_guru_pembimbing : body.id_guru_pembimbing
            }
        })

        const token = []
        findSiswa.forEach(e => {
            if (e.token_FCM) {
                token.push(e.token_FCM)
            }
        })

        payloadPush = {
            notification : {
                body : body.isi,
                title : payload.judul
            },
            token : token
        }

        sendNotification(payloadPush)
    }

    return db.notification.create({
        data : body
    })
}

const getNotification = async (id_siswa) => {
    const selected = await cekNotif(id_siswa)

    return db.notification.findMany({
        where : selected,
        select : {
            id : true,
            id_siswa : true,
            id_guru_pembimbing : true,
            id_pembimbing_dudi : true,
            judul : true,
            isi : true,
            read : {
                where : {
                    id_siswa : id_siswa
                }
            }
        }
    })
}

const getNotificationById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findNotification = await db.notification.findUnique({
        where : {
            id : id
        }
    })

    if(!findNotification) {
        throw new responseError(404,"notifikasi tidak ditemukan")
    }

    return findNotification
}



const readNotification = async (id,id_siswa) => {
    id = await validate(adminValidation.idValidation,id)
    const findNotif = await db.notification.findUnique({
        where :{
            id : id
        },
        select : {
            id : true,
            judul : true,
            isi : true,
            read : true     
        }            
    })
    if(!findNotif){
        throw new responseError(400,"notif tidak ditemukan")
    }

    const findIsRead = await db.notification_read.findFirst({
        where : {
            AND : [
                {
                    notification_id : id
                },
                {
                    id_siswa : id_siswa
                }
            ]
        }
    })

    if(findIsRead) {
        throw new responseError(400,"notif sudah dibaca")
    }

    const findSiswa = await db.siswa.findUnique({
        where : {
            id : id_siswa
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"data siswa tidak ditemukan")
    }
    return db.notification_read.create({
        data : {
            id : generateId(),
            id_siswa : id_siswa,
            notification_id : id,
            is_read : true
        }
    })
}
const getCountNotificationNotRead = async (id_siswa) => {
    const selected = await cekNotif(id_siswa)

    const countNotifNotRead = await db.notification.count({
        where : {  
            AND : [
                selected,
                {
                    read : {
                        none : {
                            is_read : true
                        }
                    }
                }
            ]      
        }
    })

    return countNotifNotRead
}
export default {
    addNotification,
    getNotification,
    getNotificationById,
    readNotification,
    getCountNotificationNotRead
}