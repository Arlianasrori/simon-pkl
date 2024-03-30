import joi from "joi"

const getGuruPembimbing = joi.number().required()

const getSiswa = joi.number().required()

export default {
    getGuruPembimbing,
    getSiswa
}