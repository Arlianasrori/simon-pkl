import joi from 'joi'

const addNotificationValidation = joi.object({
    id : joi.number().required(),
    id_siswa : joi.number().optional(),
    id_pembimbing_dudi : joi.number().optional(),
    id_guru_pembimbing : joi.number().optional(),
    judul : joi.string().max(255),
    isi : joi.string().max(255)
})

export default {
    addNotificationValidation
}