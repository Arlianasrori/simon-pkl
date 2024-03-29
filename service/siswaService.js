import siswaValidation from "../validation/siswaValidation.js";
import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import adminValidation from "../validation/adminValidation.js";
import generateId from "../utils/generateIdUtils.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import { selectDudiObject } from "../utils/dudiSelect.js";
import { selectPengajuanPklObject } from "../utils/pengjuanPklSelect.js";
import { checkPklSiswa } from "../utils/checkPklSiswa.js";

const getSiswaById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findSiswa = await db.siswa.findUnique({
    where: {
      id: id,
    },
    select: {
      nis: true,
      nama: true,
      kelas: true,
      jurusan: true,
      jenis_kelamin: true,
      no_telepon: true,
      tanggal_masuk: true,
      tanggal_keluar: true,
      alamat: true,
      pengajuan_pkl: true,
      guru_pembimbing: true,
      pembimbing_dudi: true,
    },
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};


const getDudi = () => {
  return db.dudi.findMany({
    select: selectDudiObject,
  });
};
const getDudiById = async (id) => {
  id = await validate(adminValidation.idValidation,id)

  const findDudi = await db.dudi.findUnique({
    where : {
      id : id
    },
    select : selectDudiObject
  })
  console.log(findDudi);

  if(!findDudi) {
    throw new responseError(404,"data dudi tidak ditemukan")
  }
  return findDudi
};

const getDudiByName = async (nama) => {
  nama = await validate(siswaValidation.NameValidation, nama);

  const getDudi = await db.dudi.findFirst({
    where: {
      nama_instansi_perusahaan: {
        contains: nama,
        mode : "insensitive"
      },
    },
    select: selectDudiObject
  });

  if (!getDudi) {
    throw new responseError(404, "DUDI tidak ditemukan");
  }
  return getDudi;
};

const getDudiByAlamat = async (alamat) => {
  alamat = await validate(siswaValidation.getDudiByAlamat, alamat);

  const findDudi = await db.dudi.findMany({
    where: {
      alamat : {
        AND : [
          {
            detail_tempat: {
              contains : alamat.detail_tempat,
              mode : 'insensitive'
            },
          },
          {
            desa: {
              contains : alamat.desa,
              mode: "insensitive"
            }
          },
          {
            kecamatan: {
              contains: alamat.kecamatan,
              mode: "insensitive"
            },
          },
          {
            provinsi: {
              contains : alamat.provinsi,
              mode: "insensitive"
            },
          },
          {
            negara: {
              contains: alamat.negara,
              mode: "insensitive"
            },
          },
        ] 
      } 
    },
    select: selectDudiObject
  });

  if (!findDudi[0]) {
    throw new responseError(404, "dudi tidak ditemukan");
  }
  return findDudi;
};


// pengajuan pkl
const addPengajuanPkl = async (body) => {
  body.id = generateId()
  body = await validate(siswaValidation.addPengjuanPklValidation,body)

  const findSiswa = await db.siswa.findUnique({
    where : {
      id : body.id_siswa
    },
    select : {
      pengajuan_pkl : true
    }
  })

  if(!findSiswa) {
    throw new responseError(404,"data siswa tidak ditemukan")
  }
  const statusPengajuan = ['dibatalkan','ditolak']

  if(findSiswa.pengajuan_pkl.length >= 1) {
    if(!statusPengajuan.includes(findSiswa.pengajuan_pkl[0].status) ) {
      throw new responseError(400,"siswa hanya dapat mengajukan satu pengjuan saja,jika ingin melanjutkan pengajuan silahkan cancel pengajuan sebelumnya")
    }
  }

  const findDudi = await db.dudi.findUnique({
    where : {
      id : body.id_dudi
    }
  })

  if(!findDudi) {
    throw new responseError(404,"data dudi tidak ditemukan")
  }

  return db.pengajuan_pkl.create({
    data : body,
    select : selectPengajuanPklObject
  })
}

const cancelPengajuanPkl = async (body) => {
  body = await validate(siswaValidation.cancelPengjuanPklValidation,body)

  const findPengajuanPkl = await db.pengajuan_pkl.findFirst({
    where : {
      AND : [
        {
          id : body.id
        },
        {
          id_siswa : body.id_siswa
        }
      ]
    },
    select : selectPengajuanPklObject
  })

  if(!findPengajuanPkl) {
    throw new responseError(404,"data pengajuan pkl tidak ditemukan")
  }
  
  if(findPengajuanPkl.status != "proses") {
    throw new responseError(400,"pengajuan hanya bisa dibatalkan jika status pengajuan masih dalam proses")
  }

  return db.pengajuan_pkl.update({
    where : {
      id : body.id
    },
    data : {
      status : "dibatalkan"
    },
    select : selectPengajuanPklObject
  })
}

const findAllPengajuanPkl = async (id) => {
  id = await validate(adminValidation.idValidation,id)

  return db.pengajuan_pkl.findMany({
    where : {
      id_siswa : id
    }
  })
}
const findPengajuanPklById = async (id) => {
  id = await validate(adminValidation.idValidation,id)

  const findPengajuan = await db.pengajuan_pkl.findUnique({
    where : {
      id : id
    }
  })

  if(!findPengajuan) {
    throw new responseError(404,"data pengajuan pkl tidak ditemukan")
  }

  return findPengajuan
}

const findPengajuanPklByStatus = async (body) => {
  body = await validate(siswaValidation.findPengajuanByStatus,body)
  return db.pengajuan_pkl.findMany({
    where : {
      AND : [
        {
          id_siswa : body.id_siswa
        },
        {
          status : body.status
        }
      ]
    }
  })
}

const addCancelPkl = async (body) => {
  body.id = generateId()
  body = await validate(siswaValidation.cancelPklValidation,body)

  const findsiswa = await db.siswa.findFirst({
    where : {
     id : body.id_siswa
    },
    select : selectSiswaObject
  })

  if(!findsiswa) {
    throw new responseError(404,"data siswa tidak ditemukan")
  }

  checkPklSiswa(findsiswa)

  if(findsiswa.dudi.id != body.id_dudi) {
    throw new responseError(400,"dudi tempat siswa pkl tidak ditemukan")
  }

  if(findsiswa.pembimbing_dudi.id != body.id_pembimbing_dudi) {
    throw new responseError(400,"pembimbing dudi siswa pkl tidak ditemukan")
  }

  return db.pengajuan_cancel_pkl.create({
    data : body,
    select : {
      id : true,
      siswa : {
        select : {
          nama : true
        }
      },
      dudi : {
        select : {
          nama_instansi_perusahaan : true
        }
      },
      pembimbing_dudi : {
        select : {
          nama : true
        }
      }
    }
  })
}

const getCancelPklBySiswa = async (id_siswa) => {
  id_siswa = await validate(adminValidation.idValidation,id_siswa)
  return db.pengajuan_cancel_pkl.findMany({
    where : {
      id_siswa : id_siswa
    }
  })
} 
const getCancelPklById = async (id) => {
  id = await validate(adminValidation.idValidation,id)
  
  const findCancelPkl = await db.pengajuan_cancel_pkl.findUnique({
    where : {
      id : id
    }
  })

  if(!findCancelPkl) {
    throw new responseError(404,"data pengjuan cancel pkl tidak ditemukan")
  }

  return findCancelPkl
} 
export default {
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,
  addPengajuanPkl,
  cancelPengajuanPkl,
  findAllPengajuanPkl,
  findPengajuanPklById,
  findPengajuanPklByStatus,
  addCancelPkl,
  getCancelPklBySiswa,
  getCancelPklById
};
