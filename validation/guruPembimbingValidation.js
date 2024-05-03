import joi from "joi"

const guruPembimbingLogin = joi.object ({
    nip : joi.string().required(),
    password : joi.string().max(255).required()
})

export default {
    guruPembimbingLogin
}