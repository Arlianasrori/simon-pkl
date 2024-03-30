import { validate } from "../validation/validate.js";
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import { selectCancelPkl } from "../utils/cancelPkl.js";

const getPembimbingDudiById = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id);

  const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
    where: {
      id: id,
    },
    select: {
      id_dudi: true,
      nama: true,
      username: true,
      no_telepon: true,
      jenis_kelamin: true,
      agama: true,
    },
  });

  if (!findPembimbingDudi) {
    throw new responseError(404, "Pembimbing dudi tidak ditemukan");
  }
  return findPembimbingDudi;
};

const getSiswaPembimbingDudi = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id);
  const findSiswa = await db.siswa.findFirst({
    where: {
      id_pembimbing_dudi: parseInt(id),
    },
    select: selectSiswaObject
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};

const getAllSiswaPembimbingDudi = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)
  return db.siswa.findMany({
    where : {
      id_pembimbing_dudi : id_pembimbing_dudi
    },
    select: selectSiswaObject
  });
};

const getAllPengajuanPkl = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)

  const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
    where : {
      id : id_pembimbing_dudi
    },
    select : {
      dudi : {
        select : {
          id : true
        }
      }
    }
  })

  if(!findPembimbingDudi) {
    throw new responseError(404,"pembimbing dudi tidak ditemukan")
  }

  return db.pengajuan_pkl.findMany({
    where : {
      id_dudi : findPembimbingDudi.dudi.id
    },
    select: {
      id : true,
      siswa : {
        select : {
          id : true,
          nama : true,
          nis : true,
          no_telepon : true
        }
      },
      dudi : {
        select : {
          id : true,
          nama_instansi_perusahaan : true,
          bidang : true
        }
      },
      status: true,
      waktu_pengajuan: true,
    },
  });
};

const getPengajuanPklById = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id);

  const findPengajuanPkl = await db.pengajuan_pkl.findUnique({
    where: {
      id: id,
    },
    select: {
      id : true,
      id_siswa: true,
      id_dudi: true,
      status: true,
      waktu_pengajuan: true,
    },
  });

  if (!findPengajuanPkl) {
    throw new responseError(404, "Pengajuan PKL tidak ditemukan");
  }

  return findPengajuanPkl;
};

const AccDcnPengajuanPkl = async (id,status,id_pembimbing_dudi) => {
  id = await validate(adminValidation.idValidation,id)
  status = await validate(pembimbingDudiValidation.statusvalidation,status)

  const findPengajuan = await db.pengajuan_pkl.findUnique({
    where : {
      id : id
    },
    select : {
      id : true,
      status : true,
      dudi : {
        select : {
          id : true,
          nama_instansi_perusahaan : true,
          pembimbing_dudi : true
        }
      },
      siswa : true
    }
  })

  if(!findPengajuan) {
    throw new responseError(404,"pengajuan tidak ditemukan")
  }
  if(findPengajuan.status != "proses") {
    throw new responseError(400,"pengajuan ini telah diproses")
  }
  if(findPengajuan.dudi.pembimbing_dudi[0].id != id_pembimbing_dudi) {
    throw new responseError(401,"kesalahan hak akses")
  }

  return db.$transaction(async (tx) => {
   const updatePengajuan = await tx.pengajuan_pkl.update({
      where : {
        id : id
      },
      data : {
        status : status
      }
    })

    if(updatePengajuan.status == "ditolak") {
      return {pengajuan : updatePengajuan,msg : `mohon maaf anda ditolak oleh ${findPengajuan.dudi.nama_instansi_perusahaan}`}
    }

    await tx.siswa.update({
      where : {
        id : findPengajuan.siswa.id
      },
      data : {
        id_dudi : findPengajuan.dudi.id,
        id_pembimbing_dudi : id_pembimbing_dudi,
        status : "pkl"
      }
    })

    return {pengajuan : updatePengajuan,msg : `selamat anda diterimah oleh ${findPengajuan.dudi.nama_instansi_perusahaan}`}
  })
}


// cancel pkl
const getAllCancelPkl = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)

  return db.pengajuan_cancel_pkl.findMany({
    where : {
      id_pembimbing_dudi : id_pembimbing_dudi
    },
    select : selectCancelPkl
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

const updateStatusCancelPkl = async (id,status,id_pembimbing_dudi) => {
  id = await validate(adminValidation.idValidation,id)
  status = await validate(pembimbingDudiValidation.statusCancelValidation,status)

  const findCancelPengajuan = await db.pengajuan_cancel_pkl.findUnique({
    where : {
      id : id
    },
    select : {
      id : true,
      status : true,
      dudi : {
        select : {
          id : true,
          nama_instansi_perusahaan : true,
          pembimbing_dudi : true
        }
      },
      siswa : true
    }
  })

  if(!findCancelPengajuan) {
    throw new responseError(404,"pengajuan cancel pkl tidak ditemukan")
  }
  if(findCancelPengajuan.status != "proses") {
    throw new responseError(400,"pengajuan ini telah diproses")
  }
  if(findCancelPengajuan.dudi.pembimbing_dudi[0].id != id_pembimbing_dudi) {
    throw new responseError(401,"kesalahan hak akses")
  }

  return db.$transaction(async (tx) => {
   const updatePengajuan = await tx.pengajuan_cancel_pkl.update({
      where : {
        id : id
      },
      data : {
        status : status
      }
    })

    if(updatePengajuan.status == "tidak_setuju") {
      return {pengajuan : updatePengajuan,msg : `mohon maaf permintaan anda untuk mengundurkan diri di ${findCancelPengajuan.dudi.nama_instansi_perusahaan} ditolak`}
    }

    await tx.siswa.update({
      where : {
        id : findCancelPengajuan.siswa.id
      },
      data : {
        id_dudi : null,
        id_pembimbing_dudi : null,
        status : "belum_pkl"
      }
    })

    return {pengajuan : updatePengajuan,msg : `selamat permintaan anda untuk mengundurkan diri di ${findCancelPengajuan.dudi.nama_instansi_perusahaan} diterimah,silahkan mencari tempat pkl baru`}
  })
}
export default {
  getPembimbingDudiById,
  getSiswaPembimbingDudi,
  getAllSiswaPembimbingDudi,

  // pengajuan pkl
  getAllPengajuanPkl,
  getPengajuanPklById,
  AccDcnPengajuanPkl,


  // cancel pkl
  getAllCancelPkl,
  getCancelPklById,
  updateStatusCancelPkl
};

