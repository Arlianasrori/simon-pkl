import { validate } from "../validation/validate.js";
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";
import { db } from "../config/prismaClient.js";
import responseError from "../error/responseError.js";
import { selectSiswaObject } from "../utils/siswaSelect.js";
import adminValidation from "../validation/adminValidation.js";
import { selectCancelPkl } from "../utils/cancelPkl.js";
import { selectPengajuanPklObject } from "../utils/pengjuanPklSelect.js";
import generateId from "../utils/generateIdUtils.js";
import { fileLaporaPkl } from "../utils/imageSaveUtilsLaporanPkl.js";
import { selectLaporanPkl } from "../utils/LaporanSiswaPklUtil.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import fs from "fs"
import absenValidation from "../validation/absenValidation.js";
import puppeteer from "puppeteer"
import ejs from 'ejs'

const pembimbingDudiLogin = async (body) => {
  body = await validate(pembimbingDudiValidation.pembimbingDudiLogin, body)

  const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
    where: {
      username : body.username
    }
  })
  
  if (!findPembimbingDudi) {
    throw new responseError (404, "username atau password salah")
  }

  const isPassowrd = bcrypt.compare(body.password, findPembimbingDudi.password)
  if(!isPassowrd) {
      throw new responseError(400,"username atau password salah")
  }

  const payload = {
      id : findPembimbingDudi.id,
      username : body.username,
      password : body.password,
  }
   
  const acces_token_pembimbing_dudi = jwt.sign(payload,process.env.TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "2d"})
  const refresh_token_pembimbing_dudi = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "60d"})

  return {acces_token_pembimbing_dudi,refresh_token_pembimbing_dudi}
}

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
      id: parseInt(id),
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
    select: selectPengajuanPklObject
  });
};

const getPengajuanPklById = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id);

  const findPengajuanPkl = await db.pengajuan_pkl.findUnique({
    where: {
      id: id,
    },
    select: selectPengajuanPklObject
  });

  if (!findPengajuanPkl) {
    throw new responseError(404, "Pengajuan PKL tidak ditemukan");
  }

  return findPengajuanPkl;
};

const AccDcnPengajuanPkl = async (body,id_pengajuan) => {
  body = await validate(pembimbingDudiValidation.statusvalidation,body)
  id_pengajuan = await validate(adminValidation.idValidation,id_pengajuan)

  const findPengajuan = await db.pengajuan_pkl.findUnique({
    where : {
      id : id_pengajuan
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

  console.log(findPengajuan.dudi.pembimbing_dudi[0]);

  if(!findPengajuan) {
    throw new responseError(404,"pengajuan tidak ditemukan")
  }
  if(findPengajuan.status != "proses") {
    throw new responseError(400,"pengajuan ini telah diproses")
  }
  if(findPengajuan.dudi.pembimbing_dudi[0].id != body.id_pembimbing_dudi) {
    throw new responseError(401,"kesalahan hak akses")
  }

  return db.$transaction(async (tx) => {
   const updatePengajuan = await tx.pengajuan_pkl.update({
      where : {
        id : id_pengajuan
      },
      data : {
        status : body.status
      },
      select : selectPengajuanPklObject
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
        id_pembimbing_dudi : body.id_pembimbing_dudi,
        status : "pkl",
        tanggal_masuk : body.tanggal_masuk,
        tanggal_keluar : body.tanggal_keluar
      }
    })

    return {pengajuan : updatePengajuan,msg : `selamat anda diterima oleh ${findPengajuan.dudi.nama_instansi_perusahaan}`}
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
    },
    select : selectCancelPkl
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
        status : "belum_pkl",
        tanggal_masuk : null,
        tanggal_keluar : null
      }
    })

    return {pengajuan : updatePengajuan,msg : `selamat permintaan anda untuk mengundurkan diri di ${findCancelPengajuan.dudi.nama_instansi_perusahaan} diterimah,silahkan mencari tempat pkl baru`}
  })
}


// // laporan pkl
const AddLaporanPkl = async (body, image, url) => {
  body.id = generateId();
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const { pathSaveFile, fullPath } = await fileLaporaPkl(image, url);
  body.file_laporan = fullPath;

  const tanggal = date.toLocaleDateString("id", options);
  body.tanggal = tanggal;
  body = await validate(pembimbingDudiValidation.addLaporanPkl, body);

  await image.mv(pathSaveFile, async (err) => {
    if (err) {
      console.log(err);
      throw new responseError(500, err.message);
    }
  });

  const FindLaporanPkl = await db.laporan_pkl.findUnique({
    where: {
      id: body.id,
    },
  });

  if (FindLaporanPkl) {
    throw new responseError(404, "Laporan Pkl Sudah Di Tambahkan");
  }

  const addLaporan = await db.laporan_pkl.create({
    data: body,
    select: selectLaporanPkl,
  });
  return addLaporan;
};

const updateLaporanPkl = async (id, body, image, url) => {
  id = await validate(adminValidation.idValidation, id);
  body = await validate(pembimbingDudiValidation.updateLaporanPkl, body);

  const findLaporan = await db.laporan_pkl.findUnique({
    where: {
      id: id,
    },
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan tidak ditemukan");
  }

  if(image) {
    console.log("hay");
    const { pathSaveFile, fullPath } = await fileLaporaPkl(image, url);
    body.file_laporan = fullPath;
    await image.mv(pathSaveFile, async (err) => {
      if (err) {
        console.log(err);
        throw new responseError(500, err.message);
      }
    });
  }

  return db.laporan_pkl.update({
    where: {
      id: id,
    },
    data: body,
    select: selectLaporanPkl
  });
};

const deleteLaporanPkl = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findLaporan = await db.laporan_pkl.findFirst({
    where: {
      id: id,
    },
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan PKL tidak ditemukan");
  }
  const filename = findLaporan.file_laporan.split("/")[4]
  const p = `./public/laporan_pkl/${filename}`
  fs.unlinkSync(p,(err) => {
    if(err) {
      throw new responseError(500,err.message)
    }
  })
  return db.laporan_pkl.delete({
    where: {
      id: id,
    },
  });
};

const findAllLaporanPkl = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation, id_pembimbing_dudi);

  return db.laporan_pkl.findMany({
    where: {
      id_pembimbing_dudi: id_pembimbing_dudi,
    },
    orderBy : {
      tanggal : "desc"
    },
    select: selectLaporanPkl,
  });
};

const findLaporanPklById = async (id) => {
  id = await validate(adminValidation.idValidation, id);

  const findLaporan = await db.laporan_pkl.findUnique({
    where: {
      id: id,
    },
    select: selectLaporanPkl,
  });

  if (!findLaporan) {
    throw new responseError(404, "Laporan tidak ditemukan");
  }

  return findLaporan;
};

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
                    id_pembimbing_dudi : query.id_pembimbing_dudi
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
  const pdf = await page.pdf({ format : "a4",path : "pdf.pdf"});

  await browser.close();

  return data
}
export default {

  // pembimbing dudi login 
  pembimbingDudiLogin,
   

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
  updateStatusCancelPkl,


  // laporan pkl
  AddLaporanPkl,
  updateLaporanPkl,
  deleteLaporanPkl,
  findAllLaporanPkl,
  findLaporanPklById,


  // absen
  cetakAbsen
};

