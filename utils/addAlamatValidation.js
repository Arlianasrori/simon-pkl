import joi from "joi"
import { validate } from "../validation/validate.js"

async function alamatValidation(fields,object) {
    const addAlamatValidation = joi.object({
        fields : joi.number().required(),
        detail_tempat : joi.string().max(500).required(),
        desa : joi.string().max(255).required(),
        kecamatan : joi.string().max(255).required(),
        provinsi : joi.string().max(255).required(),
        negara : joi.string().max(255).required(),
    })

    return validate(addAlamatValidation,object)
}

export default alamatValidation