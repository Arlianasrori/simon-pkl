import siswaValidation from "../validation/siswaValidation.js";
import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";

const getSiswaById = async (id) => {
  id = await validate(siswaValidation.getSiswaValidation, id);

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

const getSiswaByName = async (nama) => {
  nama = await validate(siswaValidation.getSiswaByNameValidation, nama);

  const getSiswa = await db.siswa.findFirst({
    where: {
      nama: nama,
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

  if (!getSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return getSiswa;
};

const getDudi = () => {
  return db.dudi.findMany({
    select: {
      nama_instansi_perusahaan: true,
      bidang: true,
      catatan: true,
      alamat: true,
    },
  });
};

const getDudiByName = async (nama) => {
  nama = await validate(siswaValidation.getDudiByName, nama);

  const getDudi = await db.dudi.findFirst({
    where: {
      nama_instansi_perusahaan: {
        contains: nama,
        mode : "insensitive"
      },
    },
    select: {
      nama_instansi_perusahaan: true,
      no_telepon: true,
      bidang: true,
      catatan: true,
    },
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
    select: {
      id : true,
      nama_instansi_perusahaan : true,
      bidang : true,
      catatan : true,
      alamat : true
    },
  });

  if (!findDudi[0]) {
    throw new responseError(404, "dudi tidak ditemukan");
  }
  return findDudi;
};

export default {
  getSiswaById,
  getSiswaByName,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
};
