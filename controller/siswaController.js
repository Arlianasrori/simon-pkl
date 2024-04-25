import adminService from "../service/adminService.js";
import siswaService from "../service/siswaService.js";

const siswaLogin = async (req,res,next) => {
  try {
      const body = req.body
      const result = await siswaService.siswaLogin(body)
      res.status(201).cookie("acces_token",result.acces_token_siswa,{
          maxAge : 24 * 60 * 60 * 60,
          httpOnly: true,
      }).cookie("refresh_token",result.refresh_token_siswa,{
          maxAge : 24 * 60 * 60 * 60,
          httpOnly: true,
      }).json({
          msg : "succes",
          data : result
      })
  } catch (error) {
      next(error)
  }
}

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
    const id = req.siswa.id
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
  const result = await adminService.findLaporanPklSiswaFilter(query)
  res.status(200).json({
    msg: "Success",
    data: result,
  })
} catch (error) {
  next(error)
}
}

export default {

  // siswa login 
  siswaLogin,

  // get siswa & dudi 
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
  findLaporanSiswaPklById,
  findLaporanSiswaPklFilter,
};
