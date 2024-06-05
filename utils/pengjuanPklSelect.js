export const selectPengajuanPklObject = {
    id : true,
    waktu_pengajuan : true,
    status : true,
    siswa : {
        select : {
          id : true,
          nama : true,
          nis : true,
          no_telepon : true,
          token_FCM : true
        }
      },
      dudi : {
        select : {
          id : true,
          nama_instansi_perusahaan : true,
          no_telepon : true
        }
      }
}