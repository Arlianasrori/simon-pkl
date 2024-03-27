import siswaService from "../service/siswaService.js";

const getSiswaById = async (req, res, next) => {
  try {
    const result = await siswaService.getSiswaById(parseInt(req.params.id));
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};


const getDudi = async (req, res, next) => {
  try {
    const result = await siswaService.getDudi();
    res.status(200).json({
      msg : "succes",
      data : result
  })
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
      msg : "succes",
      data : result
  });
  } catch (error) {
    next(error);
  }
};

const getDudiByAlamat = async (req, res, next) => {
  try {
    const result = await siswaService.getDudiByAlamat(req.body);
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};
const getDudiById = async (req, res, next) => {
  try {
    const result = await siswaService.getDudiById(req.params.id);
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};
const addPengajuanPkl = async (req, res, next) => {
  try {
    const body = req.body
    const result = await siswaService.addPengajuanPkl(body);
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};
const cancelPengajuanPkl = async (req, res, next) => {
  try {
    const body = req.body
    const result = await siswaService.cancelPengajuanPkl(body);
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};

export default {
  getSiswaById,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
  getDudiById,
  addPengajuanPkl,
  cancelPengajuanPkl
};