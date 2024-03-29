import joi from "joi"

const getIdValidation = joi.number().required()

export default {
    getIdValidation
}