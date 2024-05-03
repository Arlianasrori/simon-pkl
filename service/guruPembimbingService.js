import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import absenValidation from "../validation/absenValidation.js";
import jwt from "jsonwebtoken"
import fs from "fs"
import bcrypt from "bcryptjs"
import puppeteer from "puppeteer"
import ejs from 'ejs'
import guruPembimbingValidation from "../validation/guruPembimbingValidation.js";
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";

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

const updatePassword = async (id, password) => {
  id = await validate(adminValidation.idValidation, id)
  password = await validate(pembimbingDudiValidation.updatePassword, password)

  const findGuruPembimbing = await db.guru_pembimbing.findUnique({
    where: {
      id: id
    }
  })

  if (!findGuruPembimbing) {
    throw new responseError (404, "Guru Pembimbing tidak ditemukan")
  }

  password = await bcrypt.hash(password,10)

  return db.guru_pembimbing.update ({
    where: {
      id: id
    },
    data: {
      password : password
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
  })
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

// absen
const cetakAbsen = async (query) => {
  query = await validate(absenValidation.findAbsenFilterValidation,query)

  if(query.month_ago) {
    query.month_ago = new Date().setMonth(new Date().getMonth() - query.month_ago + 1)
}

  const data = await db.absen.findMany({
    where : {
        AND : [
            {
                id_siswa : query.id_siswa
            },
            {
                siswa : {
                    id_guru_pembimbing : query.id_guru_pembimbing
                }
            },
            {
                siswa : {
                    id_dudi : query.id_dudi
                }
            },
            {
                OR : [
                    {
                        tanggal : query.tanggal
                    },
                    {
                        AND : [
                            {
                                tanggal : {
                                    gte : query.tanggal_start
                                }
                            },
                            {
                                tanggal : {
                                    lte : query.tanggal_end
                                }
                            },
                        ]
                    }
                ]
            },
            {
                tanggal : query.month_ago
            }
        ]
    },
    orderBy : {
        tanggal : "desc",
    },
    select : {
        tanggal : true,
        absen_masuk : true,
        absen_pulang : true,
        status_absen_masuk : true,
        status_absen_keluar : true,
        status : true,
        siswa : {
            select : {
                nama : true,
                jurusan : true,
                dudi : {
                  select : {
                    nama_instansi_perusahaan : true
                  }
                }
            }
        }
    }
  })

  const html = fs.readFileSync("index.ejs",{encoding : "utf-8"})
  console.log(html);

  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();
  await page.setContent(ejs.render(html,{data : data}))
  const pdf = await page.pdf({ format : "a4",path : "p.pdf"});

  await browser.close();

  return data
}

export default {

  // guru pembimbing login 
  guruPembimbingLogin,
  updatePassword,

  getGuruPembimbing,
  getSiswa,
  getAllSiswaGuruPembimbing,

  // laporan pkl 
  getLaporanPklSiswa,
  getAllLaporanPklSiswa,

  // cetakAbsen
  cetakAbsen 
};