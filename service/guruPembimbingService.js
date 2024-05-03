import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import guruPembimbingValidation from "../validation/guruPembimbingValidation.js";

const getGuruPembimbing = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      id: id,
    },
    select: {
      nip: true,
      nama: true,
      no_telepon: true,
      jenis_kelamin: true,
      tempat_lahir: true,
      tanggal_lahir: true,
      agama: true,
    },
  });

  if (!findGuruPembimbing) {
    throw new responseError(404, "Guru pembimbing tidak ditemukan");
  }
  return findGuruPembimbing;
};

const getSiswa = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findSiswa = await db.siswa.findFirst({
    where: {
      id: id,
    },
    select: selectSiswaObject,
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};

const getAllSiswaGuruPembimbing = async (id_guru_pembimbing) => {
  id_guru_pembimbing = await validate( adminValidation.idValidation,id_guru_pembimbing);

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      id: id_guru_pembimbing,
    },
  });

  if (!findGuruPembimbing) {
    throw new responseError(404, "Guru pembimbing tidak ditemukan");
  } else {
    return db.siswa.findMany({
      where: {
        id_guru_pembimbing: id_guru_pembimbing,
      },
      select: selectSiswaObject,
    });
  }
};

const getLaporanPklSiswa = async (id_guru_pembimbing) => {
  id_guru_pembimbing = await validate( adminValidation.idValidation,id_guru_pembimbing);

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      id: id_guru_pembimbing,
    },
  });

  if (!findGuruPembimbing) {
    throw new responseError(404, "Guru pembimbing tidak ditemukan");
  }else {
    return db.laporan_siswa_pkl.findFirst({
      where: {
        siswa : {
          id_guru_pembimbing : id_guru_pembimbing
        }
      }
    })
  }
}

const getAllLaporanPklSiswa = async (id_guru_pembimbing) => {
  id_guru_pembimbing = await validate( adminValidation.idValidation,id_guru_pembimbing);

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      id: id_guru_pembimbing,
    },
  });

  if (!findGuruPembimbing) {
    throw new responseError(404, "Guru pembimbing tidak ditemukan");
  } else {
    return db.laporan_siswa_pkl.findMany({
      where: {
        siswa : {
          id_guru_pembimbing : id_guru_pembimbing
        }
      },
    });
  }
}

export default {

  getGuruPembimbing,
  getSiswa,
  getAllSiswaGuruPembimbing,

  // laporan pkl 
  getLaporanPklSiswa,
  getAllLaporanPklSiswa
};