import { validate } from "../validation/validate.js";
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";

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
    select: {
      id: true,
      nis: true,
      nama: true,
      jenis_kelamin: true,
      no_telepon: true,
      id_guru_pembimbing: true,
      id_dudi: true,
      id_pembimbing_dudi: true,
      tanggal_masuk: true,
      tanggal_keluar: true,
      id_jurusan: true,
      id_kelas: true,
    },
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};

const getAllPengajuanPkl = () => {
  return db.pengajuan_pkl.findMany ({
    select: {
      id_siswa : true,
      id_dudi : true,
      status : true,
      waktu_pengajuan : true
    }
  })
}

const getPengajuanPklById = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id)

  const findPengajuanPkl = await db.pengajuan_pkl.findUnique ({
    where : {
      id : id
    },
    select : {
      id_siswa : true,
      id_dudi : true,
      status : true,
      waktu_pengajuan : true
    }
  })

  if (!findPengajuanPkl) {
    throw new responseError (404, "Pengajuan PKL tidak ditemukan")
  }

  return findPengajuanPkl
}

export default {
  getPembimbingDudiById,
  getSiswaPembimbingDudi,
  getAllPengajuanPkl,
  getPengajuanPklById
};

// getpembimibng dudi by id,get siswa id_prmimb,get all pengajuan pkl,by id
