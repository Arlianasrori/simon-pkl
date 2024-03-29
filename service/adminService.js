import adminValidation from "../validation/adminValidation.js"
import { validate } from "../validation/validate.js"
import { db } from "../config/prismaClient.js"
import responseError from "../error/responseError.js"
import generateId from "../utils/generateIdUtils.js"
import bcrypt from "bcryptjs"
import { selectSiswaObject } from "../utils/siswaSelect.js"
import { selectGuruPembimbingPbject } from "../utils/guruPembimbingSelect.js"
import { selectDudiObject } from "../utils/dudiSelect.js"
import { selectPebimbingDudiObject } from "../utils/pembimbingDudiSelect.js"
import { selectLaporanpklObject } from "../utils/laporanPklSelect.js"
import { selectLaporanpklSiswaObject } from "../utils/laporanPklSiswaSelect.js"
import { selectAbsenObject } from "../utils/absenSelect.js"
import { selectPengajuanPklObject } from "../utils/pengjuanPklSelect.js"
import { selectKelasObject } from "../utils/kelasSelect.js"


// siswa service
const addSiswa = async (siswa,alamat) => {
    siswa.id = generateId()
    alamat.id_siswa = siswa.id
    siswa = await validate(adminValidation.addSiswaValidation,siswa)
    alamat = await validate(adminValidation.addAlamatSiswaValidation,alamat)

    siswa.password = await bcrypt.hash(siswa.password,10)

    const findSiswa = await db.siswa.findFirst({
       where : {
        OR : [
            {
                id : siswa.id
            },
            {
                nis : siswa.nis
            }
        ]
       }
    })

    if(findSiswa) {
        throw new responseError(400,"siswa sudah terdaftar")
    }
    
    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
            id : siswa.id_guru_pembimbing
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"guru pembimbing tidak ditemukan")
    }

    const findJurusan = await db.jurusan.findUnique({
        where : {
            id : siswa.id_jurusan
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    const findKelas = await db.kelas.findUnique({
        where : {
            id : siswa.id_kelas
        }
    })

    if(!findKelas) {
        throw new responseError(404,"data kelas tidak ditemukan")
    }

    return db.$transaction(async (tx) => {
        const addSiswa = await tx.siswa.create({
            data : siswa,
            select : selectSiswaObject
        })
        const addAlamatSiswa = await tx.alamat_siswa.create({
            data : alamat
        })

        return {siswa : addSiswa,alamat : addAlamatSiswa}
    })
}

const findAllSiswa = async () => {
    return db.siswa.findMany({
        select : selectSiswaObject
    })
}
const findSiswaHaventPkl = async () => {
    return db.siswa.findMany({
        where : {
            status : "belum_pkl"
           
        },
        select : selectSiswaObject
    })
}
const findSiswaFilter = async (query) => {
    query = await validate(adminValidation.searchSiswaValidation,query)

    const findSiswa = await db.siswa.findMany({
        where : {
            AND : [
                {
                    nama : {
                        contains : query.nama,
                        mode : 'insensitive'
                    }
                },
                {
                    id_jurusan : query.id_jurusan
                },
                {
                    id_kelas : query.id_kelas
                },
                {
                    jenis_kelamin : query.jenis_kelamin
                },
                {
                    alamat : {
                        AND : [
                            {
                                negara : {
                                    contains : query.negara,
                                    mode : "insensitive"
                                }
                            },
                            {
                                provinsi : {
                                    contains : query.provinsi,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kabupaten : {
                                    contains : query.kabupaten,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kecamatan : {
                                    contains : query.kecamatan,
                                    mode : "insensitive"
                                }
                            },
                            {
                                desa : {
                                    contains : query.desa,
                                    mode : "insensitive"
                                }
                            },
                            {
                                detail_tempat : {
                                    contains : query.detail_tempat,
                                    mode : "insensitive"
                                }
                            },
                        ]
                    }
                }
            ]
        },
        select : selectSiswaObject
    })

    return {count : findSiswa.length,data : findSiswa}
}

const updateSiswa = async (data,identify) => {
    data = await validate(adminValidation.updateSiswaValidation,data)

    const findSiswa = await db.siswa.findFirst({
        where : {
            OR : [
                {
                    id : identify
                },
                {
                    nis : identify
                }
            ]
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }
    return db.siswa.update({
        where : {
            id : findSiswa.id
        },
        data : data,
        select : selectSiswaObject
    })
}
const deleteSiswa = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findSiswa = await db.siswa.findUnique({
        where : {
           id : id
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }
    return db.siswa.delete({
        where : {
            id : findSiswa.id
        },
        select : selectSiswaObject
    })
}
const updateAlamatSiswa = async (data,id) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findSiswa = await db.siswa.findUnique({
        where : {
           id : id
        }
    })

    if(!findSiswa) {
        throw new responseError(404,"siswa tidak ditemukan")
    }

    const findAlamatsiswa = await db.alamat_siswa.findUnique({
        where : {
            id_siswa : id
        }
    })

    if(!findAlamatsiswa) {
        throw new responseError(404,"alamat siswa tidak ditemukan")
    }
    return db.alamat_siswa.update({
        where : {
            id_siswa : findSiswa.id
        },
        data : data
    })
}



// jurusan
const addJurusan = async (body) => {
    body.id = generateId()
    console.log(body);
    body = await validate(adminValidation.addJurusanValidation,body)

    return db.jurusan.create({
        data : body
    })
}
const deleteJurusan = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJurusan = await db.jurusan.findUnique({
        where : {
            id : id
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return db.jurusan.delete({
        where : {
            id : id
        }
    })
}
const findAllJurusan = async () => {
    return db.jurusan.findMany()
} 
const findJurusanById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJurusan = await db.jurusan.findUnique({
        where : {
            id : id
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return findJurusan
} 
const findJurusanByName = async (nama) => {
    nama = await validate(adminValidation.namaValidation,nama)

    const findJurusan = await db.jurusan.findFirst({
        where : {
            nama : {
                contains : nama,
                mode : "insensitive"
            }
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return findJurusan
} 
const updateJurusan = async (id,nama) => {
    id = await validate(adminValidation.idValidation,id)
    nama = await validate(adminValidation.namaValidation,nama)
    const findJurusan = await db.jurusan.findUnique({
        where : {
            id : id
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return db.jurusan.update({
        where : {
            id : id
        },
        data : {
            nama : nama
        }
    })
} 


// kelas
const addKelas = async (body) => {
    body.id = generateId()
    body = await validate(adminValidation.addKelasValidation,body)

    const findJurusan = await db.jurusan.findUnique({
        where : {
            id : body.id_jurusan
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return db.kelas.create({
        data : body,
        select : selectKelasObject
    })
}
const deleteKelas = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findKelas = await db.kelas.findUnique({
        where : {
            id : id
        }
    })

    if(!findKelas) {
        throw new responseError(404,"data kelas tidak ditemukan")
    }

    return db.kelas.delete({
        where : {
            id : id
        },
        select : selectKelasObject
    })
}
const findAllkelas = async () => {
    return db.kelas.findMany({
        select : selectKelasObject
    })
} 
const findKelasById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findkelas = await db.kelas.findUnique({
        where : {
            id : id
        },
        select : selectKelasObject
    })

    if(!findkelas) {
        throw new responseError(404,"data kelas tidak ditemukan")
    }

    return findkelas
} 
const findKelasFilter = async (query) => {
    query = await validate(adminValidation.searchKelasValidation,query)

    const findKelas = await db.kelas.findMany({
        where : {
            AND : [
                {
                    nama : {
                        contains : query.nama,
                        mode : "insensitive"
                    },
                    tahun : {
                        contains : query.tahun,
                        mode : "insensitive"
                    },
                    id_jurusan : query.id_jurusan
                }
            ]
        },
        select : selectKelasObject
    })

    return findKelas
} 
const updateKelas = async (id,body) => {
    id = await validate(adminValidation.idValidation,id)
    body = await validate(adminValidation.updateKelasValidation,body)

    const findkelas = await db.kelas.findUnique({
        where : {
            id : id
        }
    })

    if(!findkelas) {
        throw new responseError(404,"data kelas tidak ditemukan")
    }

    return db.kelas.update({
        where : {
            id : id
        },
        data : body,
        select : selectKelasObject
    })
} 



// guru pembimbing service
const addGuruPembimbing = async (guru,alamat) => {
    guru.id = generateId()
    alamat.id_guru_Pembimbing = guru.id
    guru = await validate(adminValidation.addGuruPembimbingValidation,guru)
    alamat = await validate(adminValidation.addAlamatGuruValidation,alamat)

    guru.password = await bcrypt.hash(guru.password,10)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
       where : {
        OR : [
            {
                id : guru.id
            },
            {
                nip : guru.nip
            }
        ]
       }
    })

    if(findGuruPembimbing) {
        throw new responseError(400,"guru pemimbing sudah terdaftar")
    }
    
    return db.$transaction(async (tx) => {
        const addGuruPembimbimg = await tx.guru_pembimbing.create({
            data : guru,
            select : {
                id : true,
                nama : true,
                nip : true,
                agama : true,
                jenis_kelamin : true,
                tanggal_lahir : true,
                tempat_lahir : true,
            }
        })
        const addAlamatGuruPembimbing= await tx.alamat_guru_Pembimbing.create({
            data : alamat
        })

        return {guru : addGuruPembimbimg,alamat : addAlamatGuruPembimbing}
    })
}

const updateGuruPembimbing = async (identify,data) => {
    data = await validate(adminValidation.updateGuruPembimbingValidation,data)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            OR : [
                {
                    id : identify
                },
                {
                    nip : identify
                }
            ]
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"guru pembimbing tidak ditemukan")
    }
    return db.guru_pembimbing.update({
        where : {
            id : findGuruPembimbing.id
        },
        data : data,
        select : selectGuruPembimbingPbject
    })
}
const updateAlamatGuruPembimbing= async (data,id) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
           id : id
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"guru pembimbing tidak ditemukan")
    }

    const findAlamatGuruPembimbing= await db.alamat_guru_Pembimbing.findUnique({
        where : {
            id_guru_Pembimbing : id
        }
    })

    if(!findAlamatGuruPembimbing) {
        throw new responseError(404,"alamat guru pembimbing tidak ditemukan")
    }
    return db.alamat_guru_Pembimbing.update({
        where : {
            id_guru_Pembimbing : findGuruPembimbing.id
        },
        data : data
    })
}
const deleteGuruPembimbing = async (identify) => {
    identify = await validate(adminValidation.idValidation,identify)

    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
            id : identify
        },
        select : {
            id : true,
            siswa : true
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"data guru pembimbing tidak ditemukan")
    }

    if(findGuruPembimbing.siswa[0]) {
        throw new responseError(400,"guru pembimbing ini masih memiliki siswa yang dibimbing")
    }
    return db.guru_pembimbing.delete({
        where : {
            id : identify
        },
        select : selectGuruPembimbingPbject
    })
}

const findAllGuruPembimbing = async () => {
    return db.guru_pembimbing.findMany({
        select : selectGuruPembimbingPbject
    })
}
const findGuruPembimbingById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
            id : id
        },
        select : selectGuruPembimbingPbject
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"data guru pembimbing tidak ditemukan")
    }
    return findGuruPembimbing
}
const findGuruPembimbingfilter = async (query) => {
    query = await validate(adminValidation.searchGuruPembimbingValidation,query)

    const findGuruPembimbing = await db.guru_pembimbing.findMany({
        where : {
            AND : [
                {
                    nama : {
                        contains : query.nama,
                        mode : 'insensitive'
                    }
                },
                {
                    agama : {
                        contains : query.agama,
                        mode : 'insensitive'
                    }
                },
                {
                    jenis_kelamin : {
                        contains : query.jenis_kelamin
                    }
                },
                {
                    nip : {
                        contains : query.nip
                    }
                },
                {
                    alamat : {
                        AND : [
                            {
                                negara : {
                                    contains : query.negara,
                                    mode : "insensitive"
                                }
                            },
                            {
                                provinsi : {
                                    contains : query.provinsi,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kabupaten : {
                                    contains : query.kabupaten,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kecamatan : {
                                    contains : query.kecamatan,
                                    mode : "insensitive"
                                }
                            },
                            {
                                desa : {
                                    contains : query.desa,
                                    mode : "insensitive"
                                }
                            },
                            {
                                detail_tempat : {
                                    contains : query.detail_tempat,
                                    mode : "insensitive"
                                }
                            },
                        ]
                    }
                }
            ]
        },
        select : selectGuruPembimbingPbject
    })

    return {count : findGuruPembimbing.length,data : findGuruPembimbing}
}


// dudi service
const addDudi = async (dudi,alamat) => {
    dudi.id = generateId()
    alamat.id_dudi = dudi.id

    dudi = await validate(adminValidation.addDudiValidation,dudi)
    alamat = await validate(adminValidation.addAlamatDudiValidation,alamat)

    const findDudi = await db.dudi.findFirst({
        where : {
            OR : [
                {
                    id : dudi.id
                },
                {
                    nama_instansi_perusahaan : dudi.nama_instansi_perusahaan
                }
            ]
        }
    })

    if(findDudi) {
        throw new responseError(400,"data dudi telah ditambahkan")
    }
    dudi.nama_instansi_perusahaan = dudi.nama_instansi_perusahaan.toLowerCase()

    return db.$transaction(async (tx) => {
        const addDudi = await tx.dudi.create({
            data : dudi,
            select : {
                id : true,
                nama_instansi_perusahaan : true,
                no_telepon : true,
                bidang : true,
                catatan : true
            }
        })
        const addAlamatDudi= await tx.alamat_dudi.create({
            data : alamat
        })

        return {dudi : addDudi,alamat : addAlamatDudi}
    })
}

const findAllDudi = async () => {
    return db.dudi.findMany({
        select : selectDudiObject
    })
}

const findDudiById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findUnique({
        where : {
            id : id
        },
        select : selectDudiObject
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    return findDudi
}
const updateDudi = async (data,id) => {
    id = await validate(adminValidation.idValidation,id)
    data = await validate(adminValidation.updateDudiValidation,data)
    console.log(data);
    const findDudi = await db.dudi.findUnique({
        where : {
            id : id
        },
        select : selectDudiObject
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    return db.dudi.update({
        where : {
            id : id
        },
        data : data,
        select : selectDudiObject
    })
}
const updateAlamatDudi = async (data,id) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findUnique({
        where : {
           id : id
        }
    })

    if(!findDudi) {
        throw new responseError(404,"duditidak ditemukan")
    }

    const findAlamatDudi = await db.alamat_dudi.findUnique({
        where : {
            id_dudi : id
        }
    })

    if(!findAlamatDudi) {
        throw new responseError(404,"alamat dudi tidak ditemukan")
    }
    return db.alamat_dudi.update({
        where : {
            id_dudi : findDudi.id
        },
        data : data
    })
}
const deleteDudi = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findUnique({
        where : {
            id : id
        },
        select : {
            siswa : true,
            pembimbing_dudi : true,
            kunjungan_guru_pembimbing : true,
            laporan_pkl : true,
            laporans_siswa_pkl : true,
            pengajuan_pkl : true
        }
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    if(findDudi.pembimbing_dudi[0] || findDudi.siswa[0] || findDudi.kunjungan_guru_pembimbing[0] || findDudi.siswa[0] || findDudi.pengajuan_pkl[0] || findDudi.laporan_pkl[0] || findDudi.laporans_siswa_pkl[0]) {
        throw new responseError(400,"dudi yang ingin dihapus masih terkait dengan hal lainnya seperti siswa,pemimbing dudi dan lainnya")
    }
    return db.dudi.delete({
        where : {
            id : id
        },
        select : selectDudiObject
    })
}

const findDudiFilter = async (query) => {
    query = await validate(adminValidation.searchDudiValidation,query)

    const findDudi = await db.dudi.findMany({
        where : {
            AND : [
                {
                    nama_instansi_perusahaan : {
                        contains : query.nama_instansi_perusahaan,
                        mode : 'insensitive'
                    }
                },
                {
                    bidang : {
                        contains : query.bidang,
                        mode : 'insensitive'
                    }
                },
                {
                    alamat : {
                        AND : [
                            {
                                negara : {
                                    contains : query.negara,
                                    mode : "insensitive"
                                }
                            },
                            {
                                provinsi : {
                                    contains : query.provinsi,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kabupaten : {
                                    contains : query.kabupaten,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kecamatan : {
                                    contains : query.kecamatan,
                                    mode : "insensitive"
                                }
                            },
                            {
                                desa : {
                                    contains : query.desa,
                                    mode : "insensitive"
                                }
                            },
                            {
                                detail_tempat : {
                                    contains : query.detail_tempat,
                                    mode : "insensitive"
                                }
                            },
                        ]
                    }
                }
            ]
        },
        select : selectDudiObject
    })

    return {count : findDudi.length,data : findDudi}
}


// pembimbing dudi service
const addPembimbingDudi = async (PembimbingDudi,alamat) => {
    console.log(PembimbingDudi);
    PembimbingDudi.id = generateId()
    alamat.id_pembimbing_dudi = PembimbingDudi.id

    PembimbingDudi = await validate(adminValidation.addPembimbingDudiValidation,PembimbingDudi)
    alamat = await validate(adminValidation.addAlamatPembimbingDudiValidation,alamat)
    console.log(PembimbingDudi);
    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            OR : [
                {
                    id : PembimbingDudi.id
                },
                {
                    username : PembimbingDudi.username
                }
            ]
        }
    })

    if(findPembimbingDudi) {
        throw new responseError(400,"data pembimbing dudi telah ditambahkan")
    }

    const findDudi = await db.dudi.findUnique({
        where : {
            id : PembimbingDudi.id_dudi
        }
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    return db.$transaction(async (tx) => {
        const addPembimbingDudi = await tx.pembimbing_dudi.create({
            data : PembimbingDudi,
            select : selectPebimbingDudiObject
        })
        const addAlamatDudi= await tx.alamat_pembimbing_dudi.create({
            data : alamat
        })

        return {pembimbingDudi : addPembimbingDudi,alamat : addAlamatDudi}
    })
}
const findAllPembimbingDudi = async () => {
    return db.pembimbing_dudi.findMany({
        select : selectPebimbingDudiObject
    })
}
const findPembimbingDudiById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : id
        },
        select : selectPebimbingDudiObject
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }
    return findPembimbingDudi
}
const findPembimbingDudifilter = async (query) => {
    query = await validate(adminValidation.searchPembimbingDudiValidation,query)

    const findPembimbingDudi = await db.pembimbing_dudi.findMany({
        where : {
            AND : [
                {
                    nama : {
                        contains : query.nama,
                        mode : 'insensitive'
                    }
                },
                {
                    agama : {
                        contains : query.agama,
                        mode : 'insensitive'
                    }
                },
                {
                    jenis_kelamin : {
                        contains : query.jenis_kelamin
                    }
                },
                {
                    alamat : {
                        AND : [
                            {
                                negara : {
                                    contains : query.negara,
                                    mode : "insensitive"
                                }
                            },
                            {
                                provinsi : {
                                    contains : query.provinsi,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kabupaten : {
                                    contains : query.kabupaten,
                                    mode : "insensitive"
                                }
                            },
                            {
                                kecamatan : {
                                    contains : query.kecamatan,
                                    mode : "insensitive"
                                }
                            },
                            {
                                desa : {
                                    contains : query.desa,
                                    mode : "insensitive"
                                }
                            },
                            {
                                detail_tempat : {
                                    contains : query.detail_tempat,
                                    mode : "insensitive"
                                }
                            },
                        ]
                    }
                }
            ]
        },
        select : selectPebimbingDudiObject
    })

    return {count : findPembimbingDudi.length,data : findPembimbingDudi}
}
const updatePembimbingDudi = async (data,id) => {
    id = await validate(adminValidation.idValidation,id)
    data = await validate(adminValidation.updatePembimbingDudiValidation,data)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : id
        },
        select : selectPebimbingDudiObject
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }
    return db.pembimbing_dudi.update({
        where : {
            id : id
        },
        data : data,
        select : selectPebimbingDudiObject
    })
}
const updateAlamatPembimbiDudi = async (data,id) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
           id : id
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"pembimbing dudi tidak ditemukan")
    }

    const findAlamatPembimbingDudi = await db.alamat_pembimbing_dudi.findUnique({
        where : {
            id_pembimbing_dudi : id
        }
    })

    if(!findAlamatPembimbingDudi) {
        throw new responseError(404,"alamat pembimbing dudi tidak ditemukan")
    }
    return db.alamat_pembimbing_dudi.update({
        where : {
            id_pembimbing_dudi : findPembimbingDudi.id
        },
        data : data
    })
}
const deletePembimbingDudi = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : id
        },
        select : {
            siswa : true,
            laporan_pkl : true,
            laporans_siswa_pkl : true,
            absen : true,
            kunjungan_guru_pembimbing : true
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }

    if(findPembimbingDudi.siswa[0] || findPembimbingDudi.laporan_pkl[0] || findPembimbingDudi.laporans_siswa_pkl[0] || findPembimbingDudi.absen[0] || findPembimbingDudi.kunjungan_guru_pembimbing[0]) {
        throw new responseError(400,"pembimbing dudi masih terkait dengan beberapa hal seperti siswa,laporan dan lainnya")
    }
    return db.pembimbing_dudi.delete({
        where : {
            id : id
        },
        select : selectPebimbingDudiObject
    })
}

// pengajuan PKL

const findAllPengajuanPkl = async () => {
    return db.pengajuan_pkl.findMany({
        select : selectPengajuanPklObject
    })
}
const findAllPengajuanPklFilter = async (query) => {
    query = await validate(adminValidation.PengajuanPklfilterValidation,query)
    return db.pengajuan_pkl.findMany({
        where : {
            status : query
        },
        select : selectPengajuanPklObject
    })
}
const findPengajuanPklById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findPengajuanPkl = await db.pengajuan_pkl.findUnique({
        where : {
            id : id
        },
        select : selectPengajuanPklObject
    })

    if(!findPengajuanPkl) {
        throw new responseError(404,"pengajuan pkl tidak ditemukan")
    }
    return findPengajuanPkl
}


// laporan pembimbing dudi pkl

const findAllLaporanPkl = async () => {
    return db.laporan_pkl.findMany({
        select : selectLaporanpklObject
    })
}
const findLaporanPklById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findLaporan = await db.laporan_pkl.findUnique({
        where : {
            id : id
        },
        select : selectLaporanpklObject
    })

    if(!findLaporan) {
        throw new responseError(404,"laporan pkl tidak ditemukan")
    }
    return findLaporan
}
const findLaporanPklFilter = async (query) => {
    query = await validate(adminValidation.searchLaporanPkl,query)

    const findLaporan = await db.laporan_pkl.findMany({
        where : {
            AND : [
                {
                    id_dudi : query.id_dudi 
                },
                {
                    id_siswa :  query.id_siswa
                },
                {
                    id_pembimbing_dudi : query.id_pembimbing_dudi
                }
            ]
        },
        select : selectLaporanpklObject
    })

    return {count : findLaporan.length,data : findLaporan}
}


// laporan siswa pkl
const findAllLaporanSiswaPkl = async () => {
    return db.laporan_siswa_pkl.findMany({
        select : selectLaporanpklSiswaObject
    })
}
const findLaporanPklSiswaById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findLaporan = await db.laporan_siswa_pkl.findUnique({
        where : {
            id : id
        },
        select : selectLaporanpklSiswaObject
    })

    if(!findLaporan) {
        throw new responseError(404,"laporan pkl siswa tidak ditemukan")
    }
    return findLaporan
}
const findLaporanPklSiswaFilter = async (query) => {
    query = await validate(adminValidation.searchLaporanPkl,query)

    const findLaporan = await db.laporan_siswa_pkl.findMany({
        where : {
            AND : [
                {
                    id_dudi : query.id_dudi
                },
                {
                    id_siswa : query.id_siswa
                },
                {
                    id_pembimbing_dudi : query.id_pembimbing_dudi
                }
            ]
        },
        select : selectLaporanpklSiswaObject
    })

    return {count : findLaporan.length,data : findLaporan}
}


// absen
const findAllAbsen = async () => {
    return db.absen.findMany({
        select : selectAbsenObject
    })
}
const findAbsenById = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findAbsen = await db.absen.findUnique({
        where : {
            id : id
        },
        select : selectAbsenObject
    })

    if(!findAbsen) {
        throw new responseError(404,"data absen tidak ditemukan")
    }
    return findAbsen
}
const findAbsenFilter = async (query) => {
    query = await validate(adminValidation.searchAbsen,query)

    const findAbsen = await db.absen.findMany({
        where : {
            AND : [
                {
                    id_dudi : query.id_dudi
                },
                {
                    id_siswa : query.id_siswa
                },
                {
                    id_pembimbing_dudi : query.id_pembimbing_dudi
                }
            ]
        },
        select : selectAbsenObject
    })

    return {count : findAbsen.length,data : findAbsen}
}
export default {
    // siswa
    addSiswa,
    findAllSiswa,
    updateSiswa,
    deleteSiswa,
    updateAlamatSiswa,
    findSiswaFilter,
    findSiswaHaventPkl,


    // jurusan
    addJurusan,
    deleteJurusan,
    findAllJurusan,
    findJurusanById,
    findJurusanByName,
    updateJurusan,


    // kelas
    addKelas,
    findAllkelas,
    findKelasById,
    findKelasFilter,
    deleteKelas,
    updateKelas,


    // guru pembimbing
    addGuruPembimbing, 
    findAllGuruPembimbing,
    updateGuruPembimbing,
    updateAlamatGuruPembimbing,
    deleteGuruPembimbing,
    findGuruPembimbingById,
    findGuruPembimbingfilter,

    // dudi
    addDudi,
    findAllDudi,
    findDudiById,
    updateDudi,
    updateAlamatDudi,
    deleteDudi,
    findDudiFilter,


    // pembimbing dudi
    addPembimbingDudi,
    findAllPembimbingDudi,
    findPembimbingDudiById,
    findPembimbingDudifilter,
    updatePembimbingDudi,
    updateAlamatPembimbiDudi,
    deletePembimbingDudi,


    // pengajuan pkl
    findAllPengajuanPkl,
    findAllPengajuanPklFilter,
    findPengajuanPklById,


    // laporan pkl
    findAllLaporanPkl,
    findLaporanPklById,
    findLaporanPklFilter,


    // laporan pkl siswa
    findAllLaporanSiswaPkl,
    findLaporanPklSiswaById,
    findLaporanPklSiswaFilter,


    // absen
    findAllAbsen,
    findAbsenById,
    findAbsenFilter
}