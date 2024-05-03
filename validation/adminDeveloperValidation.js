import joi from "joi"

const addAdminValidation = joi.object ({
    id : joi.number().required(),
    username: joi.string().max(255).required(),
    password: joi.string().max(255).required(),
    id_sekolah : joi.number().required()
  })
  
  const updateAdminValidation = joi.object ({
    username: joi.string().max(255).optional(),
    password: joi.string().max(255).optional()
  })

  const addSekolahValidation = joi.object({
    id : joi.number().required(),
    nama : joi.string().required(),
    npsn : joi.number().required()
  })

  const addAlamatValidation = joi.object({
    id_sekolah : joi.number().required(),
    detail_tempat : joi.string().max(500).required(),
    desa : joi.string().max(255).required(),
    kecamatan : joi.string().max(255).required(),
    kabupaten : joi.string().max(255).required(),
    provinsi : joi.string().max(255).required(),
    negara : joi.string().max(255).required(),
  })
export default {
    addAdminValidation,
    updateAdminValidation,
    addSekolahValidation,
    addAlamatValidation
}