import joi from "joi"

const getIdValidation = joi.number().required()

const statusvalidation = joi.valid('diterima','ditolak')
const statusCancelValidation = joi.valid("setuju","tidak_setuju")

export default {
    statusvalidation,
    getIdValidation,
    statusCancelValidation
}