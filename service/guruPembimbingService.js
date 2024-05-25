import { validate } from "../validation/validate.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import absenValidation from "../validation/absenValidation.js";
import fs from "fs"
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";
import bcrypt from "bcryptjs"
import { generatePdf } from "../utils/generatePdf.js";
import { getQueryAbsen } from "../utils/getQueryAbsen.js";
import { selectAbsenObject } from "../utils/absenSelect.js";


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
      alamat : true
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
const findAllAbsen = async (guruPembimbing,query) => {
  const Now = new Date()
  const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`

  query = await validate(absenValidation.findAbsenFilterValidation,query)

  let monthStart;
  let monthEnd;

  if(query.month) {
    if(!query.years) {
      query.years = dateNow.split("-")[0]
    }
     monthStart = `${query.years}-0${query.month}-01`
     monthEnd = `${query.years}-0${query.month}-31`
  }

  return db.absen.findMany({
    where : {
      AND : [
        {
          siswa : {
            id_guru_pembimbing : guruPembimbing.id
          }
        }
      ]
    },
    select : selectAbsenObject,
    orderBy : {
      tanggal : "asc"
    }
}) 
}

const findAbsenById = async (guruPembimbing,id) => {
  id = await validate(adminValidation.idValidation,id)

  const absen = await db.absen.findFirst({
    where : {
      AND : [
        {
          id : id
        },
        {
          siswa : {
            id_guru_pembimbing : guruPembimbing.id
          }
        }
      ]
    },
    select : {
      absen_masuk : true,
      status_absen_masuk : true,
      keterangan_absen_masuk : true,
      absen_pulang : true,
      status_absen_pulang : true,
      keterangan_absen_keluar : true,
      foto : true,
      status : true,
      tanggal : true,
  }
  })

  if(!absen) {
    throw new responseError(404,"data absen tidak ditemukan")
  }

  return absen
}

const cetakAbsen = async (query) => {
  const Now = new Date()
  const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`

  query = await validate(absenValidation.findAbsenFilterValidation,query)

  let monthStart;
  let monthEnd;

  if(query.month) {
    if(!query.years) {
      query.years = dateNow.split("-")[0]
    }
     monthStart = `${query.years}-0${query.month}-01`
     monthEnd = `${query.years}-0${query.month}-31`
  }

  const bulan = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"]

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
              AND : [
                {
                  tanggal : {
                    gte : monthStart
                  }
                },
                {
                  tanggal : {
                    lte : monthEnd
                  }
                }
              ]
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
        status_absen_pulang : true,
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

  const findGuruPembimbing = await db.guru_pembimbing.findFirst({
    where: {
      id : query.id_guru_pembimbing
    },
  })

  const content = fs.readFileSync("pdf-sample/absenPembimbingDudi.ejs",{encoding : "utf-8"})
  const dataPdf = {data : data,nama : findGuruPembimbing.nama, bulan : query.month && bulan[query.month - 1],years : query.years}
  await generatePdf(content,dataPdf,"absen-guruPembimbing","absen")

  return {data : dataPdf}
}

const cetakAnalisisAbsen = async (query) => {
  query = await validate(absenValidation.findAbsenFilterValidation,query)

  const dbQuery = getQueryAbsen(query)
  const data = await db.$queryRawUnsafe(dbQuery)

  const bulan = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"]

  const findGuruPembimbing = await db.guru_pembimbing.findFirst({
    where: {
      id : query.id_guru_pembimbing
    },
  })
  const dataPdf = {data : data,nama : findGuruPembimbing.nama, bulan : query.month && bulan[query.month - 1],years : query.years}
  const content = fs.readFileSync("pdf-sample/analisisAbsenGuruPembimbing.ejs",{encoding : "utf-8"})

  await generatePdf(content,dataPdf,"analisis-guruPembimbing","analisis")
  return {data : dataPdf}
}

export default {
  updatePassword,

  // guru pembimbing
  getGuruPembimbing,
  getSiswa,
  getAllSiswaGuruPembimbing,

  // laporan pkl 
  getLaporanPklSiswa,
  getAllLaporanPklSiswa,

  // cetakAbsen
  findAllAbsen,
  findAbsenById,
  cetakAbsen,
  cetakAnalisisAbsen
};