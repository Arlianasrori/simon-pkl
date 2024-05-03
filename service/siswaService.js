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
import { selectCancelPkl } from "../utils/cancelPkl.js";
import { file } from "../utils/imageSaveUtilsLaporanPklSiswa.js";
import { selectLaporanSiswaPkl } from "../utils/LaporanSiswaPklUtil.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";

const siswaLogin = async (body) => {
  body = await validate(siswaValidation.siswaLogin, body)

  const findSiswa = await db.siswa.findUnique({
    where: {
      nis : body.nis
    }
  })
  
  if (!findSiswa) {
    throw new responseError (404, "nis atau password salah")
  }

  const isPassowrd = bcrypt.compare(body.password, findSiswa.password)
  if(!isPassowrd) {
      throw new responseError(400,"nis atau password salah")
  }

  const payload = {
      id : findSiswa.id,
      nis : body.nis,
      password : body.password,
  }
   
  const acces_token_siswa = jwt.sign(payload,process.env.TOKEN_SECRET_SISWA,{expiresIn : "2d"})
  const refresh_token_siswa = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_SISWA,{expiresIn : "60d"})

  return {acces_token_siswa,refresh_token_siswa}
}

const updatePassword = async (id, password) => {
  id = await validate (adminValidation.idValidation,id)
  password = await validate(pembimbingDudiValidation.updatePassword, password)

  const findSiswa = await db.siswa.findUnique ({
    where: {
      id: id
    }
  })

  if (!findSiswa) {
    throw new responseError(404, "Siswa tidak ditemukan");
  }

  password = await bcrypt.hash(password,10)

  return db.siswa.update ({
    where: {
      id: id
    },
    data: {
      password : password
    },
    select: selectSiswaObject
  })
}

const getSiswaById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findSiswa = await db.siswa.findUnique({
    where: {
      id: id,
    },
    select: selectSiswaObject
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};

const getDudi = () => {
  return db.dudi.findMany({
    select : {
      siswa : {
        where : {
          jenis_kelamin : "perempuan"
        }
      },
      siswa : {
        where : {
          jenis_kelamin : "laki"
        }
      }
    }
  })
};
const getDudiById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findDudi = await db.dudi.findUnique({
    where: {
      id: id,
    },
    select: selectDudiObject,
  });

  if (!findDudi) {
    throw new responseError(404, "data dudi tidak ditemukan");
  }
  return findDudi;
};

const getDudiByName = async (nama) => {
  nama = await validate(siswaValidation.NameValidation, nama);

  const getDudi = await db.dudi.findFirst({
    where: {
      nama_instansi_perusahaan: {
        contains: nama,
        mode: "insensitive",
      },
    },
    select: selectDudiObject,
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
      alamat: {
        AND: [
          {
            detail_tempat: {
              contains: alamat.detail_tempat,
              mode: "insensitive",
            },
          },
          {
            desa: {
              contains: alamat.desa,
              mode: "insensitive",
            },
          },
          {
            kecamatan: {
              contains: alamat.kecamatan,
              mode: "insensitive",
            },
          },
          {
            provinsi: {
              contains: alamat.provinsi,
              mode: "insensitive",
            },
          },
          {
            negara: {
              contains: alamat.negara,
              mode: "insensitive",
            },
          },
        ],
      },
    },
    select: selectDudiObject,
  });

  if (!findDudi[0]) {
    throw new responseError(404, "dudi tidak ditemukan");
  }
  return findDudi;
};

// pengajuan pkl
const addPengajuanPkl = async (body) => {
  body.id = generateId();
  body = await validate(siswaValidation.addPengjuanPklValidation, body);

  const findSiswa = await db.siswa.findUnique({
    where: {
      id: body.id_siswa,
    },
    select: {
      status: true,
      dudi: true,
      pengajuan_pkl: true,
      jenis_kelamin : true
    },
  });

  if (!findSiswa) {
    throw new responseError(404, "data siswa tidak ditemukan");
  }

  if (findSiswa.dudi || findSiswa.status == "pkl") {
    throw new responseError(
      400,
      "siswa sedang pkl,tidak dapat mengajukan permintaan pkl"
    );
  }
  const statusPengajuan = ["dibatalkan", "ditolak", "diterima"];

  if (findSiswa.pengajuan_pkl.length >= 1) {
    const pengajuanPklLastIndex = findSiswa.pengajuan_pkl.length - 1;
    if (!statusPengajuan.includes(findSiswa.pengajuan_pkl[pengajuanPklLastIndex].status)) {
      throw new responseError(400,"siswa hanya dapat mengajukan satu pengajuan,jika ingin mengajukan pengajuan harap membatalkan pengajuan sebelumnya")
    }
  }

  const findDudi = await db.dudi.findUnique({
    where: {
      id: body.id_dudi,
    },
    select : {
      tersedia : true,
      kouta : true,
      siswa : {
        where : {
          jenis_kelamin : findSiswa.jenis_kelamin
        }
      },
      _count : {
        select : {
          siswa : true,
        }
      },
    }
  });
  console.log(findDudi);

  if (!findDudi) {
    throw new responseError(404, "data dudi tidak ditemukan");
  }

  if(!findDudi.tersedia) {
    throw new responseError(400,"pengajuan untuk dudi ini tidak tersedia")
  }

  if(findDudi.kouta.total == findDudi._count.siswa) {
    throw new responseError(400,"kouta sudah penuh")
  }

  if(findSiswa.jenis_kelamin == "perempuan") {
    if(findDudi.siswa.length == findDudi.kouta.jumlah_wanita) {
      throw new responseError(400,"kouta untuk perempuan sudah penuh")
    }
  }

  if(findSiswa.jenis_kelamin == "pria") {
    if(findDudi.siswa.length == findDudi.kouta.jumlah_pria) {
      throw new responseError(400,"kouta untuk pria sudah penuh")
    }
  }

  return db.pengajuan_pkl.create({
    data: body,
    select: selectPengajuanPklObject,
  });
};

const cancelPengajuanPkl = async (body) => {
  body = await validate(siswaValidation.cancelPengjuanPklValidation, body);

  const findPengajuanPkl = await db.pengajuan_pkl.findFirst({
    where: {
      AND: [
        {
          id: body.id,
        },
        {
          id_siswa: body.id_siswa,
        },
      ],
    },
    select: selectPengajuanPklObject,
  });

  if (!findPengajuanPkl) {
    throw new responseError(404, "data pengajuan pkl tidak ditemukan");
  }

  if (findPengajuanPkl.status != "proses") {
    throw new responseError(
      400,
      "pengajuan hanya bisa dibatalkan jika status pengajuan masih dalam proses"
    );
  }

  return db.pengajuan_pkl.update({
    where: {
      id: body.id,
    },
    data: {
      status: "dibatalkan",
    },
    select: selectPengajuanPklObject,
  });
};

const findAllPengajuanPkl = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  return db.pengajuan_pkl.findMany({
    where: {
      id_siswa: id,
    },
  });
};
const findPengajuanPklById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findPengajuan = await db.pengajuan_pkl.findUnique({
    where: {
      id: id,
    },
  });

  if (!findPengajuan) {
    throw new responseError(404, "data pengajuan pkl tidak ditemukan");
  }

  return findPengajuan;
};

const findPengajuanPklByStatus = async (body) => {
  body = await validate(siswaValidation.findPengajuanByStatus, body);
  return db.pengajuan_pkl.findMany({
    where: {
      AND: [
        {
          id_siswa: body.id_siswa,
        },
        {
          status: body.status,
        },
      ], 
    },
  });
};

const addCancelPkl = async (id_siswa) => {
  id_siswa = await validate(adminValidation.idValidation, id_siswa);

  const findsiswa = await db.siswa.findFirst({
    where: {
      id: id_siswa,
    },
    select: selectSiswaObject,
  });

  if (!findsiswa) {
    throw new responseError(404, "data siswa tidak ditemukan");
  }

  checkPklSiswa(findsiswa);
  const body = {
    id: generateId(),
    id_siswa: findsiswa.id,
    id_dudi: findsiswa.dudi.id,
    id_pembimbing_dudi: findsiswa.pembimbing_dudi.id,
  };
  return db.pengajuan_cancel_pkl.create({
    data: body,
    select: selectCancelPkl,
  });
};

const getCancelPklBySiswa = async (id_siswa) => {
  id_siswa = await validate(adminValidation.idValidation, id_siswa);
  return db.pengajuan_cancel_pkl.findMany({
    where: {
      id_siswa: id_siswa,
    },
  });
};
const getCancelPklById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findCancelPkl = await db.pengajuan_cancel_pkl.findUnique({
    where: {
      id: id,
    },
  });

  if (!findCancelPkl) {
    throw new responseError(404, "data pengjuan cancel pkl tidak ditemukan");
  }

  return findCancelPkl;
};
const cancelPengajuanCancelPkl = async (body) => {
  body = await validate(siswaValidation.cancelPengjuanPklValidation, body);

  const findPengajuanPkl = await db.pengajuan_cancel_pkl.findFirst({
    where: {
      AND: [
        {
          id: body.id,
        },
        {
          id_siswa: body.id_siswa,
        },
      ],
    },
    select: selectCancelPkl,
  });

  if (!findPengajuanPkl) {
    throw new responseError(404, "data pengajuan pkl tidak ditemukan");
  }

  if (findPengajuanPkl.status != "proses") {
    throw new responseError(
      400,
      "pengajuan hanya bisa dibatalkan jika status pengajuan masih dalam proses"
    );
  }

  return db.pengajuan_cancel_pkl.update({
    where: {
      id: body.id,
    },
    data: {
      status: "dibatalkan",
    },
    select: selectCancelPkl,
  });
};

const AddLaporanSiswaPkl = async (body, image, url) => {
  body.id = generateId();
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const { pathSaveFile, fullPath } = await file(image, url);
  body.dokumentasi = fullPath;

  const tanggal = date.toLocaleDateString("id", options);
  body.tanggal = tanggal;
  body = await validate(siswaValidation.addLaporanSiswaPkl, body);

  await image.mv(pathSaveFile, async (err) => {
    if (err) {
      throw new responseError(500, err.message);
    }
  });

  const FindLaporanPkl = await db.laporan_siswa_pkl.findUnique({
    where: {
      id: body.id,
    },
  });

  if (FindLaporanPkl) {
    throw new responseError(404, "Laporan Pkl Sudah Di Tambahkan");
  }

  return db.laporan_siswa_pkl.create
};

const updateLaporanSiswaPkl = async (id, body, image, url) => {
  id = await validate(adminValidation.idValidation, id);
  body = await validate(siswaValidation.UpdateLaporanSiswaPkl, body);

  const findLaporan = await db.laporan_siswa_pkl.findUnique({
    where: {
      id: id,
    },
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan tidak ditemukan");
  }

  if(image) {
    const { pathSaveFile, fullPath } = await fileLaporaPkl(image, url);
    body.file_laporan = fullPath;
    await image.mv(pathSaveFile, async (err) => {
      if (err) {
        console.log(err);
        throw new responseError(500, err.message);
      }
    });
  }

  return db.laporan_siswa_pkl.update({
    where: {
      id: id,
    },
    data: body,
    select : selectLaporanSiswaPkl
  });
};

const deleteLaporanSiswaPkl = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findLaporan = await db.laporan_siswa_pkl.findFirst({
    where: {
      id: id,
    },
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan PKL tidak ditemukan");
  }
  const filename = findLaporan.file_laporan.split("/")[4]
  const pathDelete = `./public/laporan_siswa_pkl/${filename}`
  fs.unlinkSync(pathDelete,(err) => {
    if(err) {
      throw new responseError(500,err.message)
    }
  })
  return db.laporan_siswa_pkl.delete({
    where: {
      id: id,
    },
  });
};

const findAllLaporanSiswaPkl = async (id_siswa) => {
  id_siswa = await validate(adminValidation.idValidation, id_siswa);

  return db.laporan_siswa_pkl.findMany({
    where: {
      id_siswa: id_siswa,
    },
    select: selectLaporanSiswaPkl,
  });
};

const findLaporanSiswaPklById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findLaporan = await db.laporan_siswa_pkl.findUnique({
    where: {
      id: id,
    },
    select: selectLaporanSiswaPkl,
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan tidak ditemukan");
  }

  return findLaporan;
};

export default {

  // siswa login 
  siswaLogin,
  updatePassword,

  // Get DUDI & Siswa
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,

  // pengajuan pkl
  addPengajuanPkl,
  cancelPengajuanPkl,
  findAllPengajuanPkl,
  findPengajuanPklById,
  findPengajuanPklByStatus,

  // cancel pkl
  addCancelPkl,
  getCancelPklBySiswa,
  getCancelPklById,
  cancelPengajuanCancelPkl,

  //Laporan Pkl
  AddLaporanSiswaPkl,
  updateLaporanSiswaPkl,
  deleteLaporanSiswaPkl,
  findAllLaporanSiswaPkl,
  findLaporanSiswaPklById,
};
