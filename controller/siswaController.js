import siswaService from "../service/siswaService.js";

const getSiswaById = async (req, res, next) => {
  try {
    const result = await siswaService.getSiswaById(parseInt(req.params.id));
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
    const result = await siswaService.getDudi();
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
      req.body.nama_instansi_perusahaan
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
    const result = await siswaService.getDudiByAlamat(req.body);
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
    const result = await siswaService.addPengajuanPkl(body);
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
    const id = parseInt(req.params.id_siswa);
    const result = await siswaService.findAllPengajuanPkl(id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findPengajuanPklbyId = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await siswaService.findPengajuanPklById(id);
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const findPengajuanPklByStatus = async (req, res, next) => {
  try {
    const body = req.body;

    const result = await siswaService.findPengajuanPklByStatus(id);
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
    const id = parseInt(req.params.id_siswa);

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
    const id_siswa = parseInt(req.params.id_siswa);

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
    const result = await siswaService.updateLaporanSiswaPkl(parseInt(req.params.id),req.body)
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
    const result = await siswaService.findAllLaporanSiswaPkl(parseInt(req.params.id_siswa))
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

export default {
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,

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
  findLaporanSiswaPklById
};
