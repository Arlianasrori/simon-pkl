import responseError from "../error/responseError.js"
export const checkPklSiswa = (siswa) => {
    if(!siswa.dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      }
    
      if(!siswa.pembimbing_dudi) {
        throw new responseError(400,"siswa belum memiliki tempat pkl")
      }
}