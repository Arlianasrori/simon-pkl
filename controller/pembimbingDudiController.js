import pembimbingDudiService from "../service/pembimbingDudiService.js"


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
    const id_pembimbing_dudi = parseInt(req.params.id)
    const result = await pembimbingDudiService.getAllSiswaPembimbingDudi(id_pembimbing_dudi)
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next (error)
  }
}



// pengajuan pkl
const getAllPengajuanPkl = async (req, res, next) => {
  try {
    const id_pembimbing_dudi = parseInt(req.params.id)
    const result = await pembimbingDudiService.getAllPengajuanPkl(id_pembimbing_dudi);
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

const updateStatusPengajuanPkl = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id)
    const status = req.body.status
    const id_pembimbing_dudi = req.body.id_pembimbing_dudi

    const result = await pembimbingDudiService.AccDcnPengajuanPkl(id,status,id_pembimbing_dudi)
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next(error)
  }
}


// cancel pkl
const getAllCancelPkl = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id_pembimbing_dudi)

    const result = await pembimbingDudiService.getAllCancelPkl(id)
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next(error)
  }
}

const getCancelPklById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const result = await pembimbingDudiService.getCancelPklById(id);
    res.status(200).json({
      msg : "succes",
      data : result
  })
  } catch (error) {
    next(error);
  }
};

const updateStatusCancelPkl = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id)
    const status = req.body.status
    const id_pembimbing_dudi = req.body.id_pembimbing_dudi

    const result = await pembimbingDudiService.updateStatusCancelPkl(id,status,id_pembimbing_dudi)
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next(error)
  }
}

// laporan pkl
const addLaporanPkl = async (req,res,next) => {
  try {
    const body = req.body
    const image = req.files.image
    const url = `${req.host}/images`

    const result = await pembimbingDudiService.addLaporanPkl(body,image,url)
    res.status(200).json({
      msg : "succes",
      data : result
    })
  } catch (error) {
    next(error)
  }
}
export default {
  getPembimbingDudiById,
  getSiswaPembimbingDudi,
  getAllSiswaPembimbingDudi,

  // pengajuan pkl
  getAllPengajuanPkl,
  getPengajuanPklById,
  updateStatusPengajuanPkl,


  // cancel pkl
  getAllCancelPkl,
  getCancelPklById,
  updateStatusCancelPkl,


  // laporan pkl
  addLaporanPkl
};
