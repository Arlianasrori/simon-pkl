export const selectAbsenObject = {
    siswa : {
        select : {
            nama : true,
            nis : true,
            kelas : true,
            jurusan : true,                   
        }
    },
    dudi : true,
    pembimbing_dudi : {
        select : {
            id : true,
            nama : true,
            agama : true,
            jenis_kelamin : true
        }
    },
    tanggal : true,
    absen_masuk : true,
    absen_pulang : true,
    status : true
}