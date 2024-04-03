export const selectCancelPkl = {
    id : true,
    status : true,     
    siswa : {
      select : {
        nama : true
      }
    },
    dudi : {
      select : {
        nama_instansi_perusahaan : true
      }
    },
    pembimbing_dudi : {
      select : {
        nama : true
      }
    }
  }