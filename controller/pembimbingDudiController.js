import pembimbingDudiService from "../service/pembimbingDudiService.js";

const getPembimbingDudiById = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getPembimbingDudiById(
      parseInt(req.body.id)
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
    const result = await pembimbingDudiService.getSiswaPembimbingDudi(parseInt(req.body.id_pembimbing_dudi)
    );
    res.status(200).json({
      msg: "succes",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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

// const getPengajuanPklById = async (req, res, next) => {
//   try {
//     const result = await pembim
//   } catch (error) {
//     next(error)
//   }
// }

export default {
  getPembimbingDudiById,
  getSiswaPembimbingDudi,
  getAllPengajuanPkl
};
