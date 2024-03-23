import { selectSiswaObject } from "./siswaSelect.js"
export const selectPebimbingDudiObject = {
    id : true,
    nama : true,
    username : true,
    agama : true,
    jenis_kelamin : true,
    no_telepon : true,
    siswa : {
        select : selectSiswaObject
    },
    dudi : true,
    alamat : true
}