import siswaService from "../service/siswaService.js";

const getSiswaById = async (req, res, next) => {
  try {
    const result = await siswaService.getSiswaById(parseInt(req.body.id));
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSiswaByName = async (req, res, next) => {
  try {
    const result = await siswaService.getSiswaByName(req.body.nama);
    res.status(200).json({
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
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSiswaById,
  getSiswaByName,
  getDudi,
  getDudiByName,
  getDudiByAlamat,
};