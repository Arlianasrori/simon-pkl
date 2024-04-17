import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import guruPembimbingValidation from "../validation/guruPembimbingValidation.js";

const guruPembimbingLogin = async (body) => {
  body = await validate(guruPembimbingValidation.guruPembimbingLogin, body)

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      nip : body.nip
    }
  })
  
  if (!findGuruPembimbing) {
    throw new responseError (404, "nip atau password salah")
  }

  const isPassowrd = bcrypt.compare(body.password, findGuruPembimbing.password)
  if(!isPassowrd) {
      throw new responseError(400,"nip atau password salah")
  }

  const payload = {
      id : findGuruPembimbing.id,
      nip : body.nip,
      password : body.password,
  }
   
  const acces_token_guru_pembimbing = jwt.sign(payload,process.env.TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "2d"})
  const refresh_token_guru_pembimbing = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "60d"})

  return {acces_token_guru_pembimbing,refresh_token_guru_pembimbing}
}

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

export default {

  // guru pembimbing login 
  guruPembimbingLogin,

  getGuruPembimbing,
  getSiswa,
  getAllSiswaGuruPembimbing,
};
