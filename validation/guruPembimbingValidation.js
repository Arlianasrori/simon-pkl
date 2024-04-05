import joi from "joi"

const guruPembimbingLogin = joi.object ({
    nip : joi.number().required(),
    password : joi.string().max(255).required()
})

export default {
    guruPembimbingLogin
}