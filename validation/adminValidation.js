import joi from "joi"


// siswa Validation 
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
const addAlamatSiswaValidation = joi.object({
  id_siswa : joi.number().required(),
  detail_tempat : joi.string().max(500).required(),
  desa : joi.string().max(255).required(),
  kecamatan : joi.string().max(255).required(),
  kabupaten : joi.string().max(255).required(),
  provinsi : joi.string().max(255).required(),
  negara : joi.string().max(255).required(),
})

const updateSiswaValidation = joi.object({
  nis : joi.number().optional(),
  nama : joi.string().max(255).optional(),
  kelas : joi.string().max(255).optional(),
  jurusan : joi.string().max(255).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  id_guru_pembimbing : joi.number().optional(),
  password : joi.string().max(255).optional()
}) 
const searchSiswaValidation = joi.object({
  nis : joi.number().optional(),
  nama : joi.string().max(255).optional(),
  kelas : joi.string().max(255).optional(),
  jurusan : joi.string().max(255).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  id_guur_pembimbing : joi.number().optional(),
}) 

const updateAlamatValidation = joi.object({
  detail_tempat : joi.string().max(500).optional(),
  desa : joi.string().max(255).optional(),
  kecamatan : joi.string().max(255).optional(),
  kabupaten : joi.string().max(255).optional(),
  provinsi : joi.string().max(255).optional(),
  negara : joi.string().max(255).optional(),
})

const idValidation = joi.number().required()


// guruPembimbing validation
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
const addAlamatGuruValidation = joi.object({
  id_guru_Pembimbing : joi.number().required(),
  detail_tempat : joi.string().max(500).required(),
  desa : joi.string().max(255).required(),
  kecamatan : joi.string().max(255).required(),
  kabupaten : joi.string().max(255).required(),
  provinsi : joi.string().max(255).required(),
  negara : joi.string().max(255).required(),
})
const searchGuruPembimbingValidation = joi.object({
  nip : joi.number().optional(),
  nama : joi.string().max(255).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  agama : joi.string().max(255).optional(),
  detail_tempat : joi.string().max(500).optional(),
  desa : joi.string().max(255).optional(),
  kecamatan : joi.string().max(255).optional(),
  kabupaten : joi.string().max(255).optional(),
  provinsi : joi.string().max(255).optional(),
  negara : joi.string().max(255).optional(),
})
const updateGuruPembimbingValidation = joi.object({
  nip : joi.number().optional(),
  nama : joi.string().max(255).optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  tempat_lahir : joi.string().max(255).optional(),
  tanggal_lahir : joi.string().max(255).optional(),
  agama : joi.string().max(255).optional(),
  password : joi.string().max(255).optional(),
})



// dudi validation
const addDudiValidation = joi.object({
  id : joi.number().required(),
  nama_instansi_perusahaan : joi.string().max(255).required(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).required(),
  bidang : joi.string().max(255).required(),
  catatan : joi.string().max(1500).required(),
})
const addAlamatDudiValidation = joi.object({
  id_dudi : joi.number().required(),
  detail_tempat : joi.string().max(500).required(),
  desa : joi.string().max(255).required(),
  kecamatan : joi.string().max(255).required(),
  kabupaten : joi.string().max(255).required(),
  provinsi : joi.string().max(255).required(),
  negara : joi.string().max(255).required(),
})
const updateDudiValidation = joi.object({
  nama_instansi_perusahaan : joi.string().max(255).optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  bidang : joi.string().max(255).optional(),
  catatan : joi.string().max(1500).optional(),
})
const searchDudiValidation = joi.object({
  nama_instansi_perusahaan : joi.string().max(255).optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  bidang : joi.string().max(255).optional(),
  catatan : joi.string().max(1500).optional(),
  detail_tempat : joi.string().max(500).optional(),
  desa : joi.string().max(255).optional(),
  kecamatan : joi.string().max(255).optional(),
  kabupaten : joi.string().max(255).optional(),
  provinsi : joi.string().max(255).optional(),
  negara : joi.string().max(255).optional(),
})



// pembimbing dudi validation
const addPembimbingDudiValidation = joi.object({
  id : joi.number().required(),
  id_dudi : joi.number().required(),
  nama : joi.string().max(255).required(),
  username : joi.string().max(255).required(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).required(),
  password : joi.string().max(255).required(),
  jenis_kelamin : joi.valid("laki","perempuan").required(),
  agama : joi.string().max(255).required()
})
const addAlamatPembimbingDudiValidation = joi.object({
  id_pembimbing_dudi : joi.number().required(),
  detail_tempat : joi.string().max(500).required(),
  desa : joi.string().max(255).required(),
  kecamatan : joi.string().max(255).required(),
  kabupaten : joi.string().max(255).required(),
  provinsi : joi.string().max(255).required(),
  negara : joi.string().max(255).required(),
})
const searchPembimbingDudiValidation = joi.object({
  nama : joi.string().max(255).optional(),
  username : joi.string().max(255).optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  password : joi.string().max(255).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  agama : joi.string().max(255).optional(),
  detail_tempat : joi.string().max(500).optional(),
  desa : joi.string().max(255).optional(),
  kecamatan : joi.string().max(255).optional(),
  kabupaten : joi.string().max(255).optional(),
  provinsi : joi.string().max(255).optional(),
  negara : joi.string().max(255).optional(),
})
const updatePembimbingDudiValidation = joi.object({
  nama : joi.string().max(255).optional(),
  username : joi.string().max(255).optional(),
  no_telepon : joi.string().max(12).regex(/^[0-9]{12}$/).messages({'string.pattern.base': `Nomor telepon harus terdiri dari 12 digit.`}).optional(),
  password : joi.string().max(255).optional(),
  jenis_kelamin : joi.valid("laki","perempuan").optional(),
  agama : joi.string().max(255).optional()
})

// pengajuan pkl

const PengajuanPklfilterValidation = joi.valid("proses","diterima","ditolak")
export default {
  // public
    idValidation,
    updateAlamatValidation,


    
  // siswa
    addSiswaValidation ,
    updateSiswaValidation,
    addAlamatSiswaValidation,
    searchSiswaValidation,


    // guru pembimbing
    addGuruPembimbingValidation,
    addAlamatGuruValidation,
    updateGuruPembimbingValidation,
    searchGuruPembimbingValidation,



    // dudi
    addAlamatDudiValidation,
    addDudiValidation,
    updateDudiValidation,
    searchDudiValidation,


    // pemibimbing dudi
    addAlamatPembimbingDudiValidation,
    addPembimbingDudiValidation,
    updatePembimbingDudiValidation,
    searchPembimbingDudiValidation,


    // pengajuan pkl
    PengajuanPklfilterValidation
}