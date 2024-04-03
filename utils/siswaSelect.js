export const selectSiswaObject = {
    id : true,
    nama : true,
    nis : true,
    status : true,
    jenis_kelamin : true,
    tanggal_masuk : true,
    tanggal_keluar : true,
    guru_pembimbing : {
        select : {
            id : true,
            nama : true,
            nip : true,
            no_telepon : true,
            agama : true,
            jenis_kelamin :true,
            tanggal_lahir : true,
            tempat_lahir : true,
        }
    },
    jurusan : true,
    kelas : true,
    alamat : true,
    dudi : {
        select : {
            id : true,
            nama_instansi_perusahaan : true
        }
    },
    pembimbing_dudi : {
        select : {
            id : true,
            nama : true,
            username : true,
            agama : true,
            alamat : true
        }
    }
}