import joi from "joi";

const getSiswaValidation = joi.number().required();

const getSiswaByNameValidation = joi.string().max(255).required();

const getDudiByName = joi.string().max(255).required();

const getDudiByAlamat = joi.object({
  detail_tempat: joi.string().max(255).optional(),
  desa: joi.string().max(255).optional(),
  kecamatan: joi.string().max(255).optional(),
  provinsi: joi.string().max(255).optional(),
  negara: joi.string().max(255).optional(),
});

export default {
  getSiswaValidation,
  getSiswaByNameValidation,
  getDudiByName,
  getDudiByAlamat,
};