import adminService from "../service/adminService.js";
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
};

const getDudi = async (req, res, next) => {
  try {
    const result = await siswaService.getDudi(req.siswa);
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
    const result = await siswaService.getDudiFilter(query,page,siswa);
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
    const result = await siswaService.getDudiById(req.params.id);
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
    const result = await siswaService.cancelPengajuanPkl(body);
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
    const result = await siswaService.findAllPengajuanPkl(id);
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
    const image = req.files.dokumentasi;
    const url = `http://${req.hostname}:2008/laporan_siswa_pkl`;

    const result = await siswaService.AddLaporanSiswaPkl(body, image, url);
    res.status(200).json({
      msg: "Success",
      data: result,
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
  const result = await adminService.findLaporanPklSiswaFilter(query,siswaBody)
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

export default {
  updatePassword,


  getProfile,

  // get siswa & dudi 
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,
  getDudiFilter,

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
};
