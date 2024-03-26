export const selectLaporanpklObject = {
    id : true,
    tanggal : true,
    keterangan : true,
    file_laporan : true,
    dudi : true,
    siswa : {
        select : {
            nama : true,
            nis : true,
            kelas : true,
            jurusan : true,                   
        }
    },
    pembimbing_dudi : {
        select : {
            id : true,
            nama : true,
            agama : true,
            jenis_kelamin : true
        }
    }
}