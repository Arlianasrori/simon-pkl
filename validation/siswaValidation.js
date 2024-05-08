import joi from "joi";

const siswaLogin = joi.object ({
  nis : joi.string().required(),
  password : joi.string().max(255).required()
})

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
const addLaporanSiswaPkl = joi.object ({
  id : joi.number().required(),
  id_siswa : joi.number().required(),
  id_dudi : joi.number().required(),
  id_pembimbing_dudi : joi.number().required(),
  tanggal : joi.string().required(),
  topik_pekerjaan : joi.string().max(255).required(),
  rujukan_kompetensi_dasar : joi.string().max(255).required(),
  dokumentasi : joi.string().max(1500).required()
})
const UpdateLaporanSiswaPkl = joi.object ({
  topik_pekerjaan : joi.string().max(255).optional(),
  rujukan_kompetensi_dasar : joi.string().max(255).optional(),
  dokumentasi : joi.string().max(1500).optional()
})
const stringValidation = joi.string().required()
const pageValidation = joi.number().required()
export default {
  siswaLogin,
  getDudiByAlamat,
  addPengjuanPklValidation,
  cancelPengjuanPklValidation,
  findPengajuanByStatus,
  addLaporanSiswaPkl,
  UpdateLaporanSiswaPkl,
  pageValidation,
  stringValidation
};