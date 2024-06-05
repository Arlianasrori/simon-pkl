export const selectCancelPkl = {
    id : true,
    status : true,     
    siswa : {
      select : {
        id : true,
        nama : true,
        token_FCM : true
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