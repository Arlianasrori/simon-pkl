<<<<<<< HEAD
import pembimbingDudiService from "../service/pembimbingDudiService.js"
=======
import pembimbingDudiService from "../service/pembimbingDudiService.js";

const getPembimbingDudiById = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getPembimbingDudiById(
      parseInt(req.params.id)
    );
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSiswaPembimbingDudi = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getSiswaPembimbingDudi(parseInt(req.params.id_pembimbing_dudi)
    );
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSiswaPembimbingDudi = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getAllSiswaPembimbingDudi()
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next (error)
  }
}

const getAllPengajuanPkl = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getAllPengajuanPkl();
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};

const getPengajuanPklById = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getPengajuanPklById(parseInt(req.params.id))
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next(error)
  }
}
>>>>>>> pembimbing_dudi_api

export default {
  getPembimbingDudiById,
  getSiswaPembimbingDudi,
  getAllPengajuanPkl,
  getPengajuanPklById,
  getAllSiswaPembimbingDudi
};
