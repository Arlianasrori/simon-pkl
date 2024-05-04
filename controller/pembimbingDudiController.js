import adminService from "../service/adminService.js"
import pembimbingDudiService from "../service/pembimbingDudiService.js"

const getPembimbingDudiById = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.getPembimbingDudiById(req.pembimbingDudi.id);
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
    const result = await pembimbingDudiService.getSiswaPembimbingDudi(parseInt(req.params.id));
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
    const id_pembimbing_dudi = req.pembimbingDudi.id
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
    const id_pembimbing_dudi = req.pembimbingDudi.id
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
    const id_pengajuan = parseInt(req.params.id_pengajuan)
    const body = req.body

    const result = await pembimbingDudiService.AccDcnPengajuanPkl(body,id_pengajuan)
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
    const id = req.pembimbingDudi.id

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

const AddLaporanPkl = async (req, res, next) => {
  try {
    const body = req.body;
    const image = req.files.file_laporan;
    console.log(image);
    const url = `http://${req.hostname}:2008/laporan_pkl`;

    const result = await pembimbingDudiService.AddLaporanPkl(body, image, url);
    res.status(200).json({
      msg: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateLaporanPkl = async (req, res, next) => {
  try {
    const image = req.files.file_laporan;
    const url = `http://${req.hostname}:2008/laporan_pkl`;
    const result = await pembimbingDudiService.updateLaporanPkl(parseInt(req.params.id),req.body,image,url)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
      
  } catch (error) {
    next(error)
  }
}

const deleteLaporanPkl = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.deleteLaporanPkl(parseInt(req.params.id))
    res.status(200).json({
      msg: "Laporan Anda Berhasil Dihapus",
      data: result,
    })
  } catch (error) { 
   next(error) 
  }
}

const findAllLaporanPkl = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.findAllLaporanPkl(req.pembimbingDudi.id)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const findLaporanPklById = async (req, res, next) => {
  try {
    const result = await pembimbingDudiService.findLaporanPklById(parseInt(req.params.id))
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
  }
const findLaporanPklFilter= async (req, res, next) => {
  try {
    const query = req.query
    query.id_pembimbing_dudi = req.pembimbingDudi.id
    const result = await adminService.findLaporanPklFilter(query)
    res.status(200).json({
      msg: "Success",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

  // absen
const cetakAbsen= async (req, res, next) => {
  try {
    const query = req.query
    query.id_pembimbing_dudi = req.pembimbingDudi.id
    const result = await pembimbingDudiService.cetakAbsen(query)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}

// Kuota Siswa 
const addKuotaSiswa = async (req,res,next) => {
  try {
    const result = await pembimbingDudiService.addKuotaSiswa(req.body)
    res.status(200).json({
    msg: "Success",
    data: result,
    })
  } catch (error) {                 
  next(error)
  }
}

const updateKuotaSiswa = async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const result = await pembimbingDudiService.updateKuotaSiswa(id,body)
    res.status(200).json({
    msg: "Success",
    data: result,
    })
  } catch (error) {
    next(error)
  }
}

const deleteKuotaSiswa = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await pembimbingDudiService.deleteKuotaSiswa(id)
    res.status(200).json({
      msg: "Success",
      data: result,
      })
  } catch (error) {
    next(error)
  }
}
export default {
  // updatePassword,

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
  AddLaporanPkl,
  updateLaporanPkl,
  deleteLaporanPkl,
  findAllLaporanPkl,
  findLaporanPklById,
  findLaporanPklFilter,


  // absen
  cetakAbsen,

  // Kuota SISWA 
  addKuotaSiswa,
  updateKuotaSiswa,
  deleteKuotaSiswa
};
