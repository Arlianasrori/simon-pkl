import responseError from "../error/responseError.js";
import absenService from "../service/absenService.js";
import adminService from "../service/adminService.js";
import notificationService from "../service/notificationService.js";
import siswaService from "../service/siswaService.js";

const getSiswaById = async (req, res, next) => {
  try {
    const result = await siswaService.getSiswaById(req.siswa.id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const result = await siswaService.getProfile(req.siswa.id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
const refreshToken = async (req, res, next) => {
  try {
    const siswa = req.siswa
    const payload = {
      id : siswa.id,
      nis : siswa.nis,
      jenis_kelamin : siswa.jenis_kelamin,
      id_sekolah : siswa.id_sekolah
    }

  const acces_token_siswa = jwt.sign(payload,process.env.TOKEN_SECRET_SISWA,{expiresIn : "60d"})
  const refresh_token_siswa = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_SISWA,{expiresIn : "120d"})

  res.status(200).json({
    msg : "succes",
    acces_token : acces_token_siswa,
    refresh_token : refresh_token_siswa,
    auth : "siswa"
  })
  } catch (error) {
    next(error);
  }
};

const getDudi = async (req, res, next) => {
  try {
    const result = await siswaService.getDudi(req.siswa,req.siswa.id_tahun);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getDudiFilter = async (req, res, next) => {
  try {
    const query = req.query
    const page = req.query.page
    const siswa = req.siswa
    const tahun = req.siswa.id_tahun
    const result = await siswaService.getDudiFilter(query,page,siswa,tahun);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDudiByName = async (req, res, next) => {
  try {
    const result = await siswaService.getDudiByName(
      req.body.nama_instansi_perusahaan,req.siswa
    );
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDudiByAlamat = async (req, res, next) => {
  try {
    const result = await siswaService.getDudiByAlamat(req.body,req.siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getDudiById = async (req, res, next) => {
  try {
    const siswa = req.siswa
    const result = await siswaService.getDudiById(req.params.id,siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// pengajuan pkl
const addPengajuanPkl = async (req, res, next) => {
  try {
    const body = req.body;
    body.id_siswa = req.siswa.id
    const result = await siswaService.addPengajuanPkl(body,req.siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const cancelPengajuanPkl = async (req, res, next) => {
  try {
    const body = req.body;
    body.id_siswa = req.siswa.id
    const result = await siswaService.cancelPengajuanPkl(body,req.siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findAllPengajuanPkl = async (req, res, next) => {
  try {
    const id = req.siswa.id
    const result = await siswaService.findAllPengajuanPkl(id,req.siswa);
    res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findPengajuanPklbyId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await siswaService.findPengajuanPklById(id,req.siswa);
    res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findPengajuanPklByStatus = async (req, res, next) => {
  try {
    const body = req.body;

    const result = await siswaService.findPengajuanPklByStatus(body,req.siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findPengajuanPending = async (req, res, next) => {
  try {
    const siswa = req.siswa
    const result = await siswaService.findPengajuanPending(siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// cancel pkl
const addCancelPkl = async (req, res, next) => {
  try {
    const id = req.siswa.id

    const result = await siswaService.addCancelPkl(id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getCancelPklBySiswa = async (req, res, next) => {
  try {
    const id_siswa = req.siswa.id

    const result = await siswaService.getCancelPklBySiswa(id_siswa);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getCancelPklById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await siswaService.getCancelPklById(id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const cancelPengajuanCancelPkl = async (req, res, next) => {
  try {
    const body = req.body;

    const result = await siswaService.cancelPengajuanCancelPkl(body);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const AddLaporanSiswaPkl = async (req, res, next) => {
  try {
    const body = req.body;
    body.id_siswa = req.siswa.id
    body.id_dudi = req.siswa.id_dudi
    body.id_pembimbing_dudi = req.siswa.id_pembimbing_dudi
    const image = req.files && req.files.dokumentasi;
    const url = `http://${req.hostname}:2008/laporan_siswa_pkl`;

    const sult = await siswaService.AddLaporanSiswaPkl(body, image, url);
    res.status(200).json({
      msg: "succes",
      data: sult
    });
  } catch (error) {
    next(error);
  }
};

const updateLaporanSiswaPkl = async (req, res, next) => {
  try {
    const image = req.files.file_laporan;
    const url = `http://${req.hostname}:2008/laporan_siswa_pkl`;
    const result = await siswaService.updateLaporanSiswaPkl(parseInt(req.params.id),req.body, image, url)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const deleteLaporanSiswaPkl = async (req, res, next) => {
  try {
    const result = await siswaService.deleteLaporanSiswaPkl(parseInt(req.params.id))
    res.status(200).json({
      msg: "Laporan Anda Telah Dihapus",
      data: result,
    })
  } catch (error) { 
   next(error) 
  }
}

const findAllLaporanSiswaPkl = async (req, res, next) => {
  try {
    const result = await siswaService.findAllLaporanSiswaPkl(req.siswa.id)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const findLaporanSiswaPklById = async (req, res, next) => {
try {
  const result = await siswaService.findLaporanSiswaPklById(parseInt(req.params.id))
  res.status(200).json({
    msg: "Success",
    data: result,
  })
} catch (error) {
  next(error)
}
}
const findLaporanSiswaPklFilter = async (req, res, next) => {
try {
  const query = req.query
  query.id_siswa = req.siswa.id
  const siswaBody = {id_sekolah : req.siswa.id_sekolah}
  const page = req.query.page
  const result = await adminService.findLaporanPklSiswaFilter(query,page,siswaBody)
  res.status(200).json({
    msg: "Success",
    data: result,
  })
} catch (error) {
  next(error)
}
}

const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body.password
    const result = await siswaService.updatePasswordSiswa(id,body)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}


// notification
const getAllNotification = async (req, res, next) => {
  try {
    const result = await notificationService.getNotification(req.siswa.id)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
const getNotificationByID = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const result = await notificationService.getNotificationById(id)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
const notificationRead = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const id_siswa = req.siswa.id
    const result = await notificationService.readNotification(id,id_siswa)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
const getCountNotificationNotRead = async (req, res, next) => {
  try {
    const id_siswa = req.siswa.id
    const result = await notificationService.getCountNotificationNotRead(id_siswa)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}


// absen
const cekRadiusKoordinat = async (req, res, next) => {
  try {
    const body = req.body
    const siswa = req.siswa
    const result = await absenService.cekRadiusKoordinat(body,siswa)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const cekAbsen = async (req,res,next) => {
  try {
      const body = {id_siswa : req.siswa.id}

      const result = await absenService.cekAbsen(body)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const addAbsenMasuk = async (req,res,next) => {
  try {
      const body = req.body
      body.id_siswa = req.siswa.id
      const files = req.files && req.files.foto
      const url = `http://${req.hostname}:2008/absen`

      const result = await absenService.addAbsenMasuk(body,files,url)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const addAbsenPulang = async (req,res,next) => {
  try {
      const body = req.body
      body.id_siswa = req.siswa.id

      const result = await absenService.addAbsenPulang(body)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const absenIzintelat = async (req,res,next) => {
  try {
      const body = req.body
      body.id_siswa = req.siswa.id

      const result = await absenService.absenIzinTelat(body)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const absenDiluarRadius = async (req,res,next) => {
  try {
      const body = req.body
      body.id_siswa = req.siswa.id

      const result = await absenService.absendiluarRadius(body)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}
const findAllKordinatAbsen = async (req,res,next) => {
  try {
      const id_pembimbing_dudi = req.siswa.id_pembimbing_dudi
      if(!id_pembimbing_dudi) {
        throw new responseError(400,"siswa belum memiliki dudi")
      }
      const result = await absenService.findAllKordinatAbsen(id_pembimbing_dudi)

      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}
const findAbsen = async (req,res,next) => {
  try {
      const id_siswa = req.siswa.id

      const result = await absenService.findAbsen(id_siswa)
      res.status(201).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}
const findAbsenById = async (req,res,next) => {
  try {  
      const id = parseInt(req.params.id)
      const result = await adminService.findAbsenById(id,req.siswa)
  
      res.status(200).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const findAllJadwalAbsen = async (req,res,next) => {
  try {
      const id_pembimbing_dudi = req.siswa.id_pembimbing_dudi
      if(!id_pembimbing_dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      }
      const result = await absenService.findAllJadwalAbsen(id_pembimbing_dudi)
      res.status(200).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const findJadwalAbsenById = async (req,res,next) => {
  try {
      const id_jadwal = parseInt(req.params.id_jadwal)
      const result = await absenService.findJadwalAbsenById(id_jadwal)
      res.status(200).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

const statustokenFCM = async (req,res,next) => {
  try {
    const id_siswa = req.siswa.id
    const result = await siswaService.statusTokenFCM(id_siswa)
    res.status(200).json({
        msg : "succes",
        data : result
    })
  } catch (error) {
    next(error)
  }
}

const addTokenFCM = async (req,res,next) => {
  try {
    const id_siswa = req.siswa.id
    const token = req.body.tokenFCM
    const result = await siswaService.addTokenFCM(id_siswa,token)
    res.status(200).json({
        msg : "succes",
        data : result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  updatePassword,
  getProfile,
  // token
  refreshToken,

  // get siswa & dudi 
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
  findPengajuanPklbyId,
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
  findLaporanSiswaPklFilter,


  // notification
  getAllNotification,
  getNotificationByID,
  notificationRead,
  getCountNotificationNotRead,
  findPengajuanPending,


  // absen
  cekRadiusKoordinat,
  cekAbsen,
  addAbsenMasuk,
  addAbsenPulang,
  absenIzintelat,
  absenDiluarRadius,
  findAllKordinatAbsen,
  findAbsen,
  findAbsenById,
  findAllJadwalAbsen,
  findJadwalAbsenById,

  // token
  statustokenFCM,
  addTokenFCM
};
