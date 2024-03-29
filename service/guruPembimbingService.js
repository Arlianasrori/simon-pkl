import guruPembimbingValidation from "../validation/guruPembimbingValidation.js";
import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";

const getGuruPembimbing = async (id) => {
  id = await validate(guruPembimbingValidation.getGuruPembimbing, id);

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
  id = await validate(guruPembimbingValidation.getSiswa, id)

  const findSiswa = await db.siswa.findFirst ({
    where: {
      id_guru_pembimbing : parseInt(id)
    },
    select: {
      nis : true,
      nama : true,
      kelas : true,
      jurusan : true,
      jenis_kelamin : true,
      no_telepon : true,
      id_guru_pembimbing : true,
      id_dudi : true,
      id_pembimbing_dudi : true,
      tanggal_masuk : true,
      tanggal_keluar : true
    }
  })

  if(!findSiswa) {
    throw new responseError (404, "siswa tidak ditemukan")
  }
  return findSiswa
}

export default {
  getGuruPembimbing,
  getSiswa
};