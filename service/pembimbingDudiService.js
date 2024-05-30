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
import fs from "fs"
import absenValidation from "../validation/absenValidation.js";
import puppeteer from "puppeteer"
import ejs from 'ejs'
import { selectPebimbingDudiObject } from "../utils/pembimbingDudiSelect.js";
import { getQueryAbsen } from "../utils/getQueryAbsen.js";
import { generatePdf } from "../utils/generatePdf.js";
import { selectAbsenObject } from "../utils/absenSelect.js";

const updatePassword = async (id, password) => {
  id = await validate(adminValidation.idValidation, id)
  password = await validate(pembimbingDudiValidation.updatePassword, password)

  const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
    where: {
      id: id
    }
  })

  if (!findPembimbingDudi) {
    throw new responseError (404, "Pembimbing dudi tidak ditemukan")
  }

  password = await bcrypt.hash(password,10)

  return db.pembimbing_dudi.update ({
    where: {
      id: id
    },
    data: {
      password : password
    },
    select: selectPebimbingDudiObject
  })
}

const getPembimbingDudiById = async (id) => {
  id = await validate(pembimbingDudiValidation.getIdValidation, id);

  const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
    where: {
      id: id,
    },
    select: selectPebimbingDudiObject
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
    throw new responseError(404,"Pengajuan PKL tidak ditemukan");
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
      const payload = {
        id : generateId(),
        id_siswa : findPengajuan.siswa.id,
        judul : "kabar Baik Untukmu",
        isi : `Ajuan pklmu telah ditolak oleh ${findPengajuan.dudi.nama_instansi_perusahaan}`
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
        token : ""
      }
      
      sendNotification(payloadPushNotif)

      return {pengajuan : updatePengajuan}
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

    const payload = {
      id : generateId(),
      id_siswa : findPengajuan.siswa.id,
      judul : "kabar Baik Untukmu",
      isi : `Ajuan pklmu telah di${body.status} oleh ${findPengajuan.dudi.nama_instansi_perusahaan}`
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
      token : ""
    }
    
    sendNotification(payloadPushNotif)

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
      id_siswa : true,
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
      const payload = {
        id : generateId(),
        id_siswa : findCancelPengajuan.id_siswa,
        judul : "proses dibatalkan",
        isi : `Ajuan cancel untuk pklmu tidak disetujui oleh ${findCancelPengajuan.dudi.nama_instansi_perusahaan}`
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
        token : ""
      }
      
      sendNotification(payloadPushNotif)

      return {pengajuan : updatePengajuan}
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

    const payload = {
      id : generateId(),
      id_siswa : findCancelPengajuan.id_siswa,
      judul : "kabar Baik Untukmu",
      isi : `Ajuan cancel untuk pklmu telah disetujui oleh ${findCancelPengajuan.dudi.nama_instansi_perusahaan}`
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
      token : ""
    }
    
    sendNotification(payloadPushNotif)

    return {pengajuan : updatePengajuan}
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

  if(!image) {
    throw new responseError(400,"file laporan is required")
  }

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
const findAllAbsen = async (pembimbingDudi,query) => {
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
      siswa : {
        id_pembimbing_dudi : pembimbingDudi.id
      }
    },
    select : selectAbsenObject
  }) 
}
const findAbsenById = async (pembimbingDudi,id) => {
  id = await validate(adminValidation.idValidation,id)
  console.log(pembimbingDudi);
  console.log(id);

  const absen = await db.absen.findFirst({
    where : {
      AND : [
        {
          id : id
        },
        {
          siswa : {
            id_pembimbing_dudi : pembimbingDudi.id
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
      keterangan_absen_pulang : true,
      foto : true,
      status : true,
      tanggal : true,
  }
  })
  console.log(absen);

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
                    id_pembimbing_dudi : query.id_pembimbing_dudi
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

  const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
  where: {
    id : query.id_pembimbing_dudi
  },
  })

  const content = fs.readFileSync("pdf-sample/absenDudi.ejs",{encoding : "utf-8"})
  const dataPdf = {data : data,nama : findPembimbingDudi.nama, bulan : query.month && bulan[query.month - 1],years : query.years}
  await generatePdf(content,dataPdf,"absen-pembimbingDudi","absen")

  return {data : dataPdf}
}

const cetakAnalisisAbsen = async (query) => {
  query = await validate(absenValidation.findAbsenFilterValidation,query)

  const dbQuery = getQueryAbsen(query)
  const data = await db.$queryRawUnsafe(dbQuery)

  const bulan = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"]

  const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
    where: {
      id : query.id_pembimbing_dudi
    },
  })
  const dataPdf = {data : data,nama : findPembimbingDudi.nama, bulan : query.month && bulan[query.month - 1],years : query.years}
  const content = fs.readFileSync("pdf-sample/analisisAbsendudi.ejs",{encoding : "utf-8"})

  await generatePdf(content,dataPdf,"analisis-pembimbingDudi","analisis")
  return {data : dataPdf}
}

const cekKoordinat = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)
  const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
    where : {
      id : id_pembimbing_dudi
    }
  })

  if(!findPembimbingDudi) {
    throw new responseError(404,"pembimbing dudi tidak ditemukan")
  }

  const findKoordinat = await db.kordinat_absen.findMany({
    where : {
      id_dudi : findPembimbingDudi.id_dudi
    }
  })

  if(!findKoordinat[0]) {
    return {koordinat : false}
  }

  return {koordinat : true}
}
const cekJadwalAbsen = async (id_pembimbing_dudi) => {
  id_pembimbing_dudi = await validate(adminValidation.idValidation,id_pembimbing_dudi)

  const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
    where : {
      id : id_pembimbing_dudi
    }
  })

  if(!findPembimbingDudi) {
    throw new responseError(404,"data dudi tidak ditemukan")
  }

  const Now = new Date()

  const dateNow = Now.toISOString().substring(0, 10)

  const findJadwaAbsen = await db.absen_jadwal.findMany({
    where : {
      AND : [
        {
          tanggal_mulai : {
            lte : dateNow
          }
        },
        {
          tanggal_berakhir : {
            gte : dateNow
          }
        }
      ]
    }
  })

  if(!findJadwaAbsen[0]) {
    return {jadwalAbsen : false}
  }

  return {jadwalAbsen : true}
}

// Kuota SISWA 
const addKuotaSiswa = async (body) => {
  body.id = generateId()
  body.total = body.jumlah_pria + body.jumlah_wanita
  body = await validate(pembimbingDudiValidation.addKuotaSiswaValidation, body)

  const findDudi = await db.dudi.findUnique ({
    where: {
      id: body.id_dudi
    }
  })

  if(!findDudi) {
    throw new responseError(404, "Dudi tidak ditemukan")
  }

  const findKouta = await db.kouta_siswa.findFirst({
    where : { 
      id_dudi : body.id_dudi
    }
  })

  if(findKouta) {
    throw new responseError (400, "Kuota untuk dudi ini sudah ditambahkan,jika ingin merubah silahkan melakukan update")
  }
  return db.$transaction(async tx => {
    const addkouta = await tx.kouta_siswa.create ({
      data: body,
      select : {
        id : true,
        id_dudi : true,
        jumlah_pria: true,
        jumlah_wanita: true,
        total: true
      }
    })
    await tx.dudi.update({
      where: {
        id: body.id_dudi
      },
      data : {
        tersedia : true
      }
    })

    return {kouta : addkouta,tersedia : true}
  })
}

const updateKuotaSiswa = async (id,body) => {
  id = await validate(adminValidation.idValidation,id)
  const findKuotaSiswa = await db.kouta_siswa.findUnique ({
    where: {
      id: id
    }
  })

  if(!findKuotaSiswa) {
    throw new responseError (404, "Kuota siswa di dudi ini tidak ditemukan")
  }

  if(body.jumlah_pria && body.jumlah_wanita) {
    body.total = body.jumlah_pria + body.jumlah_wanita
  }else if(body.jumlah_pria) {
    body.total = body.jumlah_pria + findKuotaSiswa.jumlah_wanita
  }else if(body.jumlah_wanita) {
    body.total = body.jumlah_wanita + findKuotaSiswa.jumlah_pria
  }

  body = await validate(pembimbingDudiValidation.updateKuotaSiswaValidation, body)

  return db.kouta_siswa.update({
    where: {
      id: id
    },
    data: body,
    select: {
      id : true,
      id_dudi : true,
      jumlah_pria: true,
      jumlah_wanita: true,
      total: true
    }
  })
}

const deleteKuotaSiswa = async (id) => {
  id = await validate(adminValidation.idValidation, id) 

  const findkuotaSiswa = await db.kouta_siswa.findUnique({
    where : {
      id: id
    },
  })

  if(!findkuotaSiswa) {
    throw new responseError(404, "Kuota siswa di dudi ini telah dihapus")
  }

  return db.$transaction(async tx => {
    const deleteKouta = await tx.kouta_siswa.delete({
      where: {
        id: id
      },
      select : {
        id : true,
        dudi : true,
        jumlah_pria : true,
        jumlah_wanita : true
      }
    })

    await tx.dudi.update({
      where : {
        id : deleteKouta.dudi.id
      },
      data : {
        tersedia : false
      }
    })

    return {kouta : deleteKouta}
  })
}
const findAllKouta = async (id_dudi) => {
  id_dudi = await validate(adminValidation.idValidation,id_dudi)

  return db.kouta_siswa.findMany({
    where : {
      id_dudi : id_dudi
    }
  })
}
const findKoutabyid = async (id,id_dudi) => {
  id_dudi = await validate(adminValidation.idValidation,id_dudi)
  id = await validate(adminValidation.idValidation,id)

  const findKouta = await db.kouta_siswa.findFirst({
    where : {
      AND : [
        {
          id_dudi : id_dudi
        },
        {
          id : id
        }
      ]
    }
  })

  if(!findKouta) {
    throw new responseError(404,"data kouta tidak ditemukan")
  }
  return findKouta
}

export default {
  updatePassword,
   
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
  findAllAbsen,
  findAbsenById,
  cetakAbsen,
  cetakAnalisisAbsen,
  cekKoordinat,
  cekJadwalAbsen,

  // Kuota Siswa 
  addKuotaSiswa,
  updateKuotaSiswa,
  deleteKuotaSiswa,
  findAllKouta,
  findKoutabyid
};

