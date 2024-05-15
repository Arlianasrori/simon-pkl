export const selectAbsenObject = {
    id : true,
    absen_masuk : true,
    absen_pulang : true,
    jadwal_absen : true,
    status_absen_masuk : true,
    status_absen_pulang : true,
    keterangan_absen_masuk : true,
    keterangan_absen_pulang : true,
    foto : true,
    siswa : {
        select : {
            nama : true,
            nis : true,
            kelas : true,
            jurusan : true,                   
        }
    }
}