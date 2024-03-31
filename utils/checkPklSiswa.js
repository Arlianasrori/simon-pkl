import responseError from "../error/responseError.js"
export const checkPklSiswa = (siswa) => {
    if(!siswa.dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      } else if(!siswa.pembimbing_dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      }else if(siswa.status == "belum_pkl") {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      }
}