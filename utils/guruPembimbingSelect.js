export const selectGuruPembimbingPbject =
    {
        id : true,
        nama : true,
        nip : true,
        agama : true,
        tanggal_lahir : true,
        tempat_lahir : true,
        jenis_kelamin : true,
        siswa : {
            select : {
                id: true,
                nis: true,
                nama: true,
                kelas: true,
                jurusan: true,
                jenis_kelamin: true,
                no_telepon: true
            }
        },
        alamat : true
    }