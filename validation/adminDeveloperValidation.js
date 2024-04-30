import joi from "joi"

const addAdminValidation = joi.object ({
    id : joi.number().required(),
    username: joi.string().max(255).required(),
    password: joi.string().max(255).required(),
    id_siswa : joi.number().required()
  })
  
  const updateAdminValidation = joi.object ({
    username: joi.string().max(255).optional(),
    password: joi.string().max(255).optional()
  })

export default {
    addAdminValidation,
    updateAdminValidation
}