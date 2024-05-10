import absenService from "../service/absenService.js";
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

const refreshToken = async (req, res, next) => {
  try {
    const pembimbingDudi = req.pembimbingDudi

    const payload = {
      id : pembimbingDudi.id,
      username : pembimbingDudi.username
    }
    const acces_token_pembimbing_dudi = jwt.sign(payload,process.env.TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "120d"})
    const refresh_token_pembimbing_dudi = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "60d"})

    return res.status(200).json({
      msg : "succes",
      acces_token : acces_token_pembimbing_dudi,
      refresh_token : refresh_token_pembimbing_dudi
  })
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


// jadwal absen
const addJadwalAbsen= async (req, res, next) => {
  try {
    const body = req.body.jadwal
    body.id_dudi = req.pembimbingDudi.id_dudi
    body.id_pembimbing_dudi = req.pembimbingDudi.id
    const day = req.body.day

    const result = await absenService.addJadwalAbsen(body,day)
     res.status(201).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const findAllJadwalAbsen= async (req, res, next) => {
  try {
    const result = await absenService.findAllJadwalAbsen(req.pembimbingDudi.id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const findJadwalAbsenById= async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const result = await absenService.findJadwalAbsenById(id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}

// kordinat

const addKordinat = async (req, res, next) => {
  try {
    const body = req.body
    body.id_pembimbing_dudi = req.pembimbingDudi.id
    body.id_dudi = req.pembimbingDudi.id_dudi

    const result = await absenService.addKordinatAbsen(body)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const findAllKordinat = async (req, res, next) => {
  try {
    const id = req.pembimbingDudi.id

    const result = await absenService.findAllKordinatAbsen(id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const deleteKoordinat = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id_koordinat)

    const result = await absenService.deleteKoordinatAbsen(id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const findKoordinatById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id_koordinat)

    const result = await absenService.findkoordinatById(id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}

  // absen
const findAllAbsen= async (req, res, next) => {
  try {
    const query = req.query
    const result = await pembimbingDudiService.findAllAbsen(req.pembimbingDudi,query)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
const findAbsenById= async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const result = await pembimbingDudiService.findAbsenById(req.pembimbingDudi,id)
     res.status(200).json({
      msg: "Success",
      data: result,
     })
  } catch (error) {
    next(error)
  }
}
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
const cetakAnalisisAbsen= async (req, res, next) => {
  try {
    const query = req.query
    query.id_pembimbing_dudi = req.pembimbingDudi.id
    const result = await pembimbingDudiService.cetakAnalisisAbsen(query)
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
    const body = req.body
    body.id_dudi = req.pembimbingDudi.id_dudi
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
const findAllKouta = async (req, res, next) => {
  try {
    const id_dudi = req.pembimbingDudi.id_dudi
    const result = await pembimbingDudiService.findAllKouta(id_dudi)
    res.status(200).json({
      msg: "Success",
      data: result,
      })
  } catch (error) {
    next(error)
  }
}
const findKoutaById = async (req, res, next) => {
  try {
    const id_dudi = req.pembimbingDudi.id_dudi
    const id = parseInt(req.params.id)
    const result = await pembimbingDudiService.findKoutabyid(id,id_dudi)
    res.status(200).json({
      msg: "Success",
      data: result,
      })
  } catch (error) {
    next(error)
  }
}
export default {
  // token
  refreshToken,
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

  // jadwal absen
  addJadwalAbsen,
  findAllJadwalAbsen,
  findJadwalAbsenById,

  // kordinat
  addKordinat,
  findAllKordinat,
  deleteKoordinat,
  findKoordinatById,

  // absen
  findAllAbsen,
  findAbsenById,
  cetakAbsen,
  cetakAnalisisAbsen,

  // Kuota SISWA 
  addKuotaSiswa,
  updateKuotaSiswa,
  deleteKuotaSiswa,
  findAllKouta,
  findKoutaById
};
