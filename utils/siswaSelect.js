export const selectSiswaObject = {
    id : true,
    nama : true,
    nis : true,
    status : true,
    jenis_kelamin : true,
    guru_pembimbing : {
        select : {
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
    dudi : true,
    pembimbing_dudi : {
        select : {
            nama : true,
            username : true,
            agama : true,
            alamat : true
        }
    }
}