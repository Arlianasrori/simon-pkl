import { selectSiswaObject } from "./siswaSelect.js";

export const selectDudiObject = {
    id : true,
    nama_instansi_perusahaan : true,
    no_telepon : true,
    bidang : true,
    alamat : true,
    siswa : true,
    deksripsi : true,
    alamat : true,
    siswa : {
        select : selectSiswaObject
    }
}