export const selectLaporanpklSiswaObject = {
    id : true,
    tanggal : true,
    topik_pekerjaan : true,
    rujukan_kompetensi_dasar : true,
    dokumentasi : true,
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