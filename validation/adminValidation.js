import joi from "joi"

const addSiswaValidation = joi.object({
  id : joi.number().required(),
  nis : joi.number().required(),
  nama : joi.string().max(255).required(),
  kelas : joi.string().max(255).required(),
  jurusan : joi.string().max(255).required(),
  jenis_kelamin : joi.valid("laki","perempuan").required(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).required(),
  id_guru_pembimbing : joi.number().required(),
  password : joi.string().max(255).required()
}) 

const addGuruPembimbingValidation = joi.object({
    id : joi.number().required(),
    nip : joi.number().required(),
    nama : joi.string().max(255).required(),
    no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).required(),
    jenis_kelamin : joi.valid("laki","perempuan").required(),
    tempat_lahir : joi.string().max(255).required(),
    tanggal_lahir : joi.string().max(255).required(),
    agama : joi.string().max(255).required(),
    password : joi.string().max(255).required(),
})
export default {
    addSiswaValidation ,
    addGuruPembimbingValidation
}