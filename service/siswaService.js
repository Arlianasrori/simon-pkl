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
import bcrypt from "bcryptjs"
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js";
import { getQuery } from "../utils/getQueryDudi.js";
import notificationService from "./notificationService.js";
import { sendNotification } from "../utils/sendNotification.js";

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
    select: {
      id : true,
      nama : true,
      nis : true,
      no_telepon : true,
      jurusan : true,
      kelas : true,
      alamat : true,
      status : true
    }
  });

  if (!findSiswa) {
    throw new responseError(404, "siswa tidak ditemukan");
  }
  return findSiswa;
};
const getProfile = async (id) => {
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

const getDudi = (siswa,id_tahun) => {
  return db.dudi.findMany({
    where : {
      AND : [
        {
          add_by : siswa.id_sekolah
        },
        {
          id_tahun : parseInt(id_tahun)
        }
      ]
    },
    select: selectDudiObject,
  });
};
const getDudiById = async (id,siswa) => {
  id = await validate(adminValidation.idValidation, id);

  const findDudi = await db.$queryRaw`SELECT COUNT(s)::int as total_siswa,COUNT(s.jenis_kelamin)filter (where s.jenis_kelamin = 'laki')::int  as total_siswa_laki,COUNT(s.jenis_kelamin) filter (where s.jenis_kelamin = 'perempuan')::int as total_siswa_perempuan,
  d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total as total_kouta,ks.jumlah_wanita as kouta_wanita,ks.jumlah_pria as kouta_pria
  FROM dudi as d
  LEFT JOIN siswa as s ON d.id = s.id_dudi
  LEFT JOIN alamat_dudi as ad ON d.id = ad.id_dudi
  LEFT JOIN kouta_siswa as ks ON d.id = ks.id_dudi
  WHERE d.id = ${id}
  GROUP BY d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total,ks.jumlah_wanita,ks.jumlah_pria`

  const dudi = findDudi[0]
  if (!dudi) {
    throw new responseError(404, "data dudi tidak ditemukan");
  }
   console.log(siswa);
  if(!dudi.total_kouta) {
    dudi.enabled = false
    return dudi;
  }

  if(dudi.total_siswa >= dudi.total_kouta) {
    dudi.enabled = false
    return dudi;
  }else if(siswa.jenis_kelamin == "laki") {
    if(dudi.total_siswa_laki >= dudi.kouta_pria) {
      dudi.enabled = false
      return dudi;
    }
  }else if(siswa.jenis_kelamin == "perempuan") {
    if(dudi.total_siswa_perempuan >= dudi.kouta_wanita) {
      dudi.enabled = false
      return dudi;
    }
  }

  dudi.enabled = true
  return dudi;
};

const getDudiFilter = async (query,page,siswa,id_tahun) => {
  query = await validate(adminValidation.searchDudiValidation,query)
  page = await validate(siswaValidation.pageValidation,page)
  const whereQuery = getQuery(query,page,id_tahun)
  console.log(whereQuery);

  if(!id_tahun) {
    throw new responseError(400,"tahun is required")
  }
  
  const findDudi = await db.$queryRawUnsafe(whereQuery)

  for (let index = 0; index < findDudi.length; index++) {
    findDudi[index].enabled = true
    if(!findDudi[index].total_kouta) {
      findDudi[index].enabled = false
    }else if(findDudi[index].total_siswa >= findDudi[index].total_kouta) {
      findDudi[index].enabled = false
    }else if(siswa.jenis_kelamin == "laki") {
      if(findDudi[index].total_siswa_laki >= findDudi[index].kouta_laki) {
        findDudi[index].enabled = false
      }
    }else if(siswa.jenis_kelamin == "perempuan") {
      if(findDudi[index].total_siswa_perempuan >= findDudi[index].kouta_perempuan) {
        findDudi[index].enabled = false
      }
    }
  }

  const count = await db.dudi.count({
    where : {
      AND : [
        {
          add_by : siswa.id_sekolah
        },
        {
          id_tahun : id_tahun
        }
      ]
    }
  })

  const countPage = Math.ceil(count / 10)
  return {dudi : findDudi,page : page,count : findDudi.length,countPage : countPage}
}

const getDudiByName = async (nama,siswa) => {
  nama = await validate(siswaValidation.stringValidation, nama);

  return db.dudi.findMany({
    where: {
      AND : [
        {
          add_by : siswa.id_sekolah
        },
        {
          nama_instansi_perusahaan: {
            contains: nama,
            mode: "insensitive",
          },
        }
      ]  
    },
    select: selectDudiObject,
  });
};

const getDudiByAlamat = async (alamat,siswa) => {
  alamat = await validate(siswaValidation.getDudiByAlamat, alamat);

  return db.dudi.findMany({
    where: {
      AND : [
        {
          add_by : siswa.id_sekolah
        },
        {
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
          }
        }
      ]
    },
    select: selectDudiObject,
  });
};

// pengajuan pkl
const addPengajuanPkl = async (body,siswa) => {
  body.id = generateId();
  body = await validate(siswaValidation.addPengjuanPklValidation, body);

  const findSiswa = await db.siswa.findUnique({
    where: {
      id: body.id_siswa,
    },
    select: {
      id : true,
      tahun : true,
      status: true,
      dudi: true,
      pengajuan_pkl: true,
      jenis_kelamin : true,
      token_FCM : true
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
      throw new responseError(400,"siswa hanya dapat mengajukan satu pengajuan,jika ingin mengajukan pengajuan harap membatalkan pengajuan sebelumnya");
    }
  }

  const findDudi = await db.dudi.findFirst({
    where: {
      AND : [
        {
          add_by : siswa.id_sekolah
        },
        {
          id: body.id_dudi,
        }
      ]
    },
    select : {
      id : true,
      tersedia : true,
      tahun : true,
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

  if (!findDudi) {
    throw new responseError(404, "data dudi tidak ditemukan");
  }

  if((findSiswa.tahun.id != findDudi.tahun.id) || (findSiswa.tahun.tahun !== findDudi.tahun.tahun)) {
    throw new responseError(400,"tahun pkl anda tidak sesuai dengan tahun dudi")
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
  return db.$transaction(async tx => {
    const createpengajuan = await tx.pengajuan_pkl.create({
      data: body,
      select: selectPengajuanPklObject,
    });

    await tx.siswa.update({
      where : {
        id : findSiswa.id
      },
      data : {
        status : "pending"
      }
    })
  
    const payload = {
      id : generateId(),
      id_siswa : findSiswa.id,
      judul : "Menunggu proses...",
      isi : "Ajuan pkl mu sedang diproses, tunggu verifikasi dari dudi yang kamu ajukan"
    }

    const Now = new Date()

    payload.tanggal = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    payload.time = datelocal.split(" ")[1]
    
    await tx.notification.create({
      data : payload
    })

    const payloadPushNotif = {
      notification : {
          body : payload.isi,
          title : payload.judul
      },
      token : findSiswa.token_FCM
    }
    if (payloadPushNotif.token) {
      sendNotification(payloadPushNotif)
    }
    return createpengajuan
  })
};
const cancelPengajuanPkl = async (body,siswa) => {
  body = await validate(siswaValidation.cancelPengjuanPklValidation, body);

  const findPengajuanPkl = await db.pengajuan_pkl.findFirst({
    where: {
      AND: [
        {
          siswa : {
            id_sekolah : siswa.id_sekolah
          }
        },
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

  return db.$transaction(async tx => {
    
    const pengajun_pkl = await tx.pengajuan_pkl.update({
      where: {
        id: body.id,
      },
      data: {
        status: "dibatalkan",
      },
      select: selectPengajuanPklObject,
    });

    const payload = {
      id : generateId(),
      id_siswa : pengajun_pkl.siswa.id,
      judul : "Kabar Baik Untukmu!",
      isi : "Ajuan pklmu telah dibatalkan"
    }

    const Now = new Date()

    payload.tanggal = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    payload.time = datelocal.split(" ")[1]
    
    await tx.siswa.update({
      where : {
        id : pengajun_pkl.siswa.id
      },
      data : {
        status : "belum_pkl"
      }
    })

    await tx.notification.create({
      data : payload
    })

    const payloadPushNotif = {
      notification : {
          body : payload.isi,
          title : payload.judul
      },
      token : pengajun_pkl.siswa.token_FCM
    }

    if (payloadPushNotif.token) {
      try {
        await sendNotification(payloadPushNotif)
      }catch (e) {
        console.log("p");
      }
    }
    return pengajun_pkl
  })
};

const findAllPengajuanPkl = async (id,siswa) => {
  id = await validate(adminValidation.idValidation, id);

  return db.pengajuan_pkl.findMany({
    where: {
      AND : [
        {
          siswa : {
            id_sekolah : siswa.id_sekolah
          }
        },
        {
          id_siswa: id,
        }
      ]
    },
  });
};
const findPengajuanPending = async (siswa) => {
  return db.pengajuan_pkl.findFirst({
    where: {
      AND : [
        {
          AND : [
            {
              siswa : {
                id_sekolah : siswa.id_sekolah
              }
            },
            {
              id_siswa: siswa.id,
            }
          ]
        },
        {
          AND : [
            {
              status : "proses"
            }
          ]
        }
      ]
    },
    select : {
      id : true,
      status : true,
      dudi : {
        select : {
          id : true,
          nama_instansi_perusahaan : true,
          alamat : true,
          no_telepon : true,
        }
      }
    }
  });
};
const findPengajuanPklById = async (id,siswa) => {
  id = await validate(adminValidation.idValidation, id);

  const findPengajuan = await db.pengajuan_pkl.findFirst({
    where: {
      AND : [
        {
          siswa : {
            id_sekolah : siswa.id_sekolah
          }
        },
        {
          id: id,
        }
      ]
    },
  });

  if (!findPengajuan) {
    throw new responseError(404, "data pengajuan pkl tidak ditemukan");
  }

  return findPengajuan;
};

const findPengajuanPklByStatus = async (body,siswa) => {
  body = await validate(siswaValidation.findPengajuanByStatus, body);
  return db.pengajuan_pkl.findMany({
    where: {
      AND : [
        {
          siswa : {
            id_sekolah : siswa.id_sekolah
          }
        },
        {
          AND: [
            {
              id_siswa: body.id_siswa,
            },
            {
              status: body.status,
            },
          ],
        }
      ]
    },
  });
};

const addCancelPkl = async (id_siswa) => {
  id_siswa = await validate(adminValidation.idValidation, id_siswa);

  const findsiswa = await db.siswa.findFirst({
    where: {
      id: id_siswa,
    },
    select: {
      id : true,
      token_FCM : true,
      dudi : true,
      pembimbing_dudi : true
    },
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

  return db.$transaction(async tx => {
    const addCancelPkl = await tx.pengajuan_cancel_pkl.create({
      data: body,
      select: selectCancelPkl,
    });

    const payload = {
      id : generateId(),
      id_siswa : body.id_siswa,
      judul : "Menunggu proses...",
      isi : "Ajuan cancel pklmu sedang diproses, tunggu verifikasi dari dudi yang kamu ajukan"
    }

    const Now = new Date()

    payload.tanggal = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    payload.time = datelocal.split(" ")[1]

    const payloadPushNotif = {
      notification : {
          body : payload.isi,
          title : payload.judul
      },
      token : findsiswa.token_FCM
    }
    if (payloadPushNotif.token) {
      sendNotification(payloadPushNotif)
    }

    await tx.notification.create({
      data : payload
    })
    return {pengajanCancelPkl : addCancelPkl}
  })
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

  return db.$transaction(async tx => {
    const cancel_pengajuan = await tx.pengajuan_cancel_pkl.update({
      where: {
        id: body.id,
      },
      data: {
        status: "dibatalkan",
      },
      select: selectCancelPkl,
    });

    const payload = {
      id : generateId(),
      id_siswa : findPengajuanPkl.siswa.id,
      judul : "Kabar Baik Untukmu!",
      isi : "Pengajuan cancel pkl mu telah dibatalkan"
    }

    const Now = new Date()

    payload.tanggal = Now.toISOString().substring(0, 10)
    const datelocal = Now.toLocaleDateString("id",{hour : "2-digit",minute : "2-digit",weekday : "long"})
    payload.time = datelocal.split(" ")[1]

    const payloadPushNotif = {
      notification : {
          body : payload.isi,
          title : payload.judul
      },
      token : findPengajuanPkl.siswa.token_FCM
    }
    if (payloadPushNotif.token) {
      sendNotification(payloadPushNotif)
    }
    return cancel_pengajuan
  })
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

  if(!image) {
    throw new responseError(400,"dokumtasi is required")
  }

  if(!body.id_dudi || !body.id_pembimbing_dudi) {
    throw new responseError(400,"siswa belum memiliki tempat pkl")
  }

  const { pathSaveFile, fullPath } = await file(image, url);
  body.dokumentasi = fullPath;

  const tanggal = date.toLocaleDateString("id", options);
  body.tanggal = tanggal;
  console.log(body);
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

  return db.laporan_siswa_pkl.create({
    data : body
  })
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

const statusTokenFCM = async (id_siswa) => {
  const findSiswa = await db.siswa.findUnique({
    where : {
      id : id_siswa
    },
    select : {
      token_FCM : true
    }
  })

  if(!findSiswa) {
    throw new responseError(404,"siswa tidak ditemukan")
  }

  if(findSiswa.token_FCM) {
    return {token_FCM : true}
  }
  return {token_FCM : false} 
}

const addTokenFCM = async (id_siswa,tokenFCM) =>{
  const findSiswa = await db.siswa.findUnique({
    where : {
      id : id_siswa
    },
    select : {
      token_FCM : true
    }
  })

  if(!findSiswa) {
    throw new responseError(404,"siswa tidak ditemukan")
  }

  return db.siswa.update({
    where : {
      id : id_siswa
    },
    data : {
      token_FCM : tokenFCM
    },
    select : {
      id : true,
      nama : true
    }
  })
}
export default {
  updatePassword,
  // Get DUDI & Siswa
  getProfile,
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,
  getDudiFilter,

  getProfile,

  // pengajuan pkl
  addPengajuanPkl,
  cancelPengajuanPkl,
  findAllPengajuanPkl,
  findPengajuanPklById,
  findPengajuanPklByStatus,
  findPengajuanPending,

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

  // token
  statusTokenFCM,
  addTokenFCM
};
