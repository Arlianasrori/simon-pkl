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

  // sekolah
  const addSekolahValidation = joi.object({
    id : joi.number().required(),
    nama : joi.string().required(),
    npsn : joi.string().required(),
    logo : joi.string().optional()
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

  const addKepalaSekolahValidation = joi.object({
    id_sekolah : joi.number().required(),
    nama : joi.string().required(),
    nip : joi.string().required()
  })
  const updateSekolahValidation = joi.object({
    nama : joi.string().optional(),
    npsn : joi.string().optional(),
    logo : joi.string().optional()
  })

  const updateAlamatSekolahValidation = joi.object({
    detail_tempat : joi.string().max(500).optional(),
    desa : joi.string().max(255).optional(),
    kecamatan : joi.string().max(255).optional(),
    kabupaten : joi.string().max(255).optional(),
    provinsi : joi.string().max(255).optional(),
    negara : joi.string().max(255).optional(),
  })
  const updateKepalaSekolahValidation = joi.object({
    nama : joi.string().optional(),
    nip : joi.string().optional()
  })
export default {
    addAdminValidation,
    updateAdminValidation,

    // sekolah
    addSekolahValidation,
    addAlamatValidation,
    addKepalaSekolahValidation,
    updateSekolahValidation,
    updateAlamatSekolahValidation,
    updateKepalaSekolahValidation
}