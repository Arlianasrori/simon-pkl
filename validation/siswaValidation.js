import joi from "joi";

const getDudiByAlamat = joi.object({
  detail_tempat: joi.string().max(255).optional(),
  desa: joi.string().max(255).optional(),
  kecamatan: joi.string().max(255).optional(),
  provinsi: joi.string().max(255).optional(),
  negara: joi.string().max(255).optional(),
});
const addPengjuanPklValidation = joi.object({
  id  : joi.number().required(),
  id_siswa  : joi.number().required(),
  id_dudi : joi.number().required()
});
const cancelPengjuanPklValidation = joi.object({
  id  : joi.number().required(),
  id_siswa  : joi.number().required()
});
const findPengajuanByStatus = joi.object({
  id_siswa  : joi.number().required(),
  status : joi.valid("proses","diterima","ditolak","dibatalkan").required()
}) 
const cancelPklValidation = joi.object({
  id : joi.number().required(),
  id_siswa : joi.number().required(),
  id_dudi : joi.number().required(),
  id_pembimbing_dudi : joi.number().required(),
  status : joi.valid("setuju","tidak_setuju")
})

export default {
  getDudiByAlamat,
  addPengjuanPklValidation,
  cancelPengjuanPklValidation,
  findPengajuanByStatus,
  cancelPklValidation
};