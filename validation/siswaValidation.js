import joi from "joi";

const NameValidation = joi.string().max(255).required();

const getDudiByAlamat = joi.object({
  detail_tempat: joi.string().max(255).optional(),
  desa: joi.string().max(255).optional(),
  kecamatan: joi.string().max(255).optional(),
  provinsi: joi.string().max(255).optional(),
  negara: joi.string().max(255).optional(),
});

export default {
  NameValidation,
  getDudiByAlamat,
};