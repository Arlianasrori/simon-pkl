import { selectSiswaObject } from "./siswaSelect.js";

export const selectDudiObject = {
    id : true,
    nama_instansi_perusahaan : true,
    no_telepon : true,
    bidang : true,
    alamat : true,
    siswa : true,
    deksripsi : true,
    tersedia : true,
    alamat : true,
    siswa : {
        select : selectSiswaObject
    },
    pembimbing_dudi : {
        select : {
            id : true,
            nama : true
        }
    },
    kouta : true
}