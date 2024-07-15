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
import jwt from "jsonwebtoken"
import pembimbingDudiValidation from "../validation/pembimbingDudiValidation.js"
import siswaValidation from "../validation/siswaValidation.js"


// tahun
const addTahun = async (body,admin) => {
    body.id = generateId()
    body = await validate(adminValidation.addSekolahValidation,body)

    const findTahun = await db.tahun.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    tahun : body.tahun
                }
            ]
        }
    })

    if(findTahun) {
        throw new responseError(400,`tahun ${body.tahun} telah ditambahkan`)
    }
    body.id_sekolah = admin.id_sekolah
    return db.tahun.create({
        data : body
    })
}
const deleteTahun = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findTahun = await db.tahun.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        }
    })

    if(!findTahun) {
        throw new responseError(400,"data tahun tidak ditemukan")
    }
    return db.tahun.delete({
        where : {
            id : id
        }
    })
}
const updateTahun = async (body,id,admin) => {
    id = await validate(adminValidation.idValidation,id)
    const tahun = await validate(adminValidation.namaValidation,body.tahun)
    const findTahun = await db.tahun.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        }
    })

    if(!findTahun) {
        throw new responseError(400,"data tahun tidak ditemukan")
    }
    return db.tahun.update({
        where : {
            id : id
        },
        data : {
            tahun : tahun
        }
    })
}
const getAllTahun = async (admin) => {
    return db.tahun.findMany({
        orderBy : {
            tahun : "desc"
        },
        where : {
            id_sekolah : admin.id_sekolah
        },       
    })
}
// admin login
const adminLogin = async (body) => {
    body = await validate(adminValidation.adminLogin, body)
  
    const findAdmin = await db.admin.findFirst({
      where: {
        username : body.username
      }
    })
    
    if (!findAdmin) {
      throw new responseError (400, "username atau password salah")
    }
  
    const isPassowrd = bcrypt.compare(body.password, findAdmin.password)
    if(!isPassowrd) {
        throw new responseError(400,"username atau password salah")
    }
  
    const payload = {
        username : body.username,
    }
     
    const acces_token_admin = jwt.sign(payload,process.env.TOKEN_SECRET_ADMIN,{expiresIn : "2d"})
    const refresh_token_admin = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_ADMIN,{expiresIn : "60d"})
  
    return {acces_token_admin,refresh_token_admin}
  }

const updatePassword = async (id, password) => {
    id = await validate(adminValidation.idValidation, id)
    password = await validate(pembimbingDudiValidation.updatePassword, password)
  
    const findAdmin = await db.admin.findUnique({
      where: {
        id: id
      }
    })
  
    if (!findAdmin) {
      throw new responseError (404, "Admin tidak ditemukan")
    }
  
    password = await bcrypt.hash(password,10)
  
    return db.admin.update ({
      where: {
        id: id
      },
      data: {
        password : password
      },
        select: {
            id: true,
            username: true
      },
    })
  }
// siswa service
const addSiswa = async (siswa,alamat) => {
    siswa.id = generateId()
    alamat.id_siswa = siswa.id
    console.log(siswa);
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

    const findTahun = await db.tahun.findUnique({
        where : {
            id : siswa.id_tahun
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
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

const findSiswaById = async (id,admin) => {
    id = await validate(adminValidation.idValidation, id)

    const findSiswa = await db.siswa.findFirst ({
        where: {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id: id
                }
            ]
        },
        select : selectSiswaObject
    })
    if (!findSiswa) {
        throw new responseError (404, "Siswa tidak ditemukan")
    }
    return findSiswa
}

const findAllSiswa = async (page,admin,id_tahun,nopage) => {

     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    if(nopage) {
        return db.siswa.findMany({
            where : {
                AND : [
                    {
                        id_sekolah : admin.id_sekolah
                    },
                    {
                        id_tahun : parseInt(id_tahun)
                    }
                ]
            },
            select : selectSiswaObject
        })
    }
    page = await validate(siswaValidation.pageValidation,page)


    const findSiswa = await db.siswa.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectSiswaObject
    })

    const countSiswa = await db.siswa.count({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]
        },
        })
    const countPage = Math.ceil(countSiswa / 10)
    return {siswa : findSiswa,page : page,count : findSiswa.length,countPage : countPage}
}
const findSiswaHaventPkl = async (admin,id_tahun) => {
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    return db.siswa.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : id_tahun
                },
                {
                    status : "belum_pkl"

                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]       
        },
        select : selectSiswaObject
    })
}
const findSiswaFilter = async (query,admin,page) => {
    query = await validate(adminValidation.searchSiswaValidation,query)
    page = await validate(siswaValidation.pageValidation,page)

    const findSiswa = await db.siswa.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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

                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectSiswaObject
    })

    const countSiswa = await db.siswa.count({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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

                }
            ]
        },
    }
    )

    const countPage = Math.ceil(countSiswa / 10)

    return {count : findSiswa.length,data : findSiswa,page : page,countPage}
}

const updateSiswa = async (data,identify,admin) => {
    data = await validate(adminValidation.updateSiswaValidation,data)

    const findSiswa = await db.siswa.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    OR : [
                        {
                            id : identify
                        },
                        {
                            nis : identify.toString()
                        }
                    ]
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
const deleteSiswa = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findSiswa = await db.siswa.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const updateAlamatSiswa = async (data,id,admin) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findSiswa = await db.siswa.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
    body = await validate(adminValidation.addJurusanValidation,body)

    const findTahun = await db.tahun.findUnique({
        where : {
            id : body.id_tahun
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }

    return db.jurusan.create({
        data : body
    })
}
const deleteJurusan = async (id) => {
    id = await validate(adminValidation.idValidation,id)

    const findJurusan = await db.jurusan.findUnique({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const findAllJurusan = async (admin,id_tahun) => {
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }
    console.log('masuk');

    return db.jurusan.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]
        }
    })
} 
const findJurusanById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findJurusan = await db.jurusan.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return findJurusan
} 
const findJurusanByName = async (nama,admin,id_tahun) => {
    nama = await validate(adminValidation.namaValidation,nama)
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const findJurusan = await db.jurusan.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                },
                {
                    nama : {
                        contains : nama,
                        mode : "insensitive"
                    }
                }
            ]
        }
    })

    if(!findJurusan) {
        throw new responseError(404,"data jurusan tidak ditemukan")
    }

    return findJurusan
} 
const updateJurusan = async (id,nama,admin) => {
    id = await validate(adminValidation.idValidation,id)
    nama = await validate(adminValidation.namaValidation,nama)
    const findJurusan = await db.jurusan.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const deleteKelas = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findKelas = await db.kelas.findUnique({
        where : {
            AND : [
                {
                    jurusan : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
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
const findAllkelas = async (admin,id_tahun) => {
    if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    return db.kelas.findMany({
        where : {
            AND : [
                {
                    jurusan : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    jurusan : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]          
        },
        select : selectKelasObject
    })
} 
const findKelasById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findkelas = await db.kelas.findFirst({
        where : {
            AND : [
                {
                    jurusan : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
        },
        select : selectKelasObject
    })

    if(!findkelas) {
        throw new responseError(404,"data kelas tidak ditemukan")
    }

    return findkelas
} 
const findKelasFilter = async (query,admin) => {
    query = await validate(adminValidation.searchKelasValidation,query)

    const findKelas = await db.kelas.findMany({
        where : {
            AND : [
                {
                    jurusan : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    jurusan : {
                        id_tahun : parseInt(query.tahun)
                    }
                },
                {
                    AND : [
                        {
                            nama : {
                                contains : query.nama,
                                mode : "insensitive"
                            },
                            // tahun : {
                            //     contains : query.tahun,
                            //     mode : "insensitive"
                            // },
                            id_jurusan : query.id_jurusan
                        }
                    ]
                }
            ]
        },
        select : selectKelasObject
    })

    return findKelas
} 
const updateKelas = async (id,body,admin) => {
    id = await validate(adminValidation.idValidation,id)
    body = await validate(adminValidation.updateKelasValidation,body)

    const findkelas = await db.kelas.findFirst({
        where : {
            AND : [
                {
                    jurusan : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
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

    const findTahun = await db.tahun.findUnique({
        where : {
            id : guru.id_tahun
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
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

const updateGuruPembimbing = async (identify,data,admin) => {
    data = await validate(adminValidation.updateGuruPembimbingValidation,data)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            AND : [
                {
                    OR : [
                        {
                            id : identify
                        },
                        {
                            nip : identify.toString()
                        }
                    ]
                },
                {
                    id_sekolah : admin.id_sekolah
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
const updateAlamatGuruPembimbing= async (data,id,admin) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            AND :[
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        }
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"guru pembimbing tidak ditemukan")
    }

    const findAlamatGuruPembimbing = await db.alamat_guru_Pembimbing.findUnique({
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
const deleteGuruPembimbing = async (identify,admin) => {
    identify = await validate(adminValidation.idValidation,identify)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : identify
                }
            ]
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

const findAllGuruPembimbing = async (page,admin,id_tahun,noPage) => {
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    if(noPage) {
        return db.guru_pembimbing.findMany({
            where : {
                AND : [
                    {
                        id_sekolah : admin.id_sekolah
                    },
                    {
                        id_tahun : parseInt(id_tahun)
                    }
                ]
    
            },
            select : selectGuruPembimbingPbject
        })
    }
    page = await validate(siswaValidation.pageValidation,page)

    const findGuruPembimbing = await db.guru_pembimbing.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]

        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectGuruPembimbingPbject
    })
    const countGuru = await db.guru_pembimbing.count({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]

        },
    })
    const countpage = Math.ceil(countGuru / 10)

    return {guruPembimbing : findGuruPembimbing,page : page,count : findGuruPembimbing.length,countpage}
}
const findGuruPembimbingById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        },
        select : selectGuruPembimbingPbject
    })

    if(!findGuruPembimbing) {
        throw new responseError(404,"data guru pembimbing tidak ditemukan")
    }
    return findGuruPembimbing
}
const findGuruPembimbingfilter = async (query,admin) => {
    query = await validate(adminValidation.searchGuruPembimbingValidation,query)

    const findGuruPembimbing = await db.guru_pembimbing.findMany({
        where : {
            AND : [
                {
                    id_sekolah : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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

    const findTahun = await db.tahun.findUnique({
        where : {
            id : dudi.id_tahun
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }

    return db.$transaction(async (tx) => {
        const addDudi = await tx.dudi.create({
            data : dudi,
            select : {
                id : true,
                nama_instansi_perusahaan : true,
                no_telepon : true,
                bidang : true,
            }
        })
        const addAlamatDudi= await tx.alamat_dudi.create({
            data : alamat
        })

        return {dudi : addDudi,alamat : addAlamatDudi}
    })
}

const findAllDudi = async (page,admin,id_tahun,noPage) => {
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const findTahun = await db.tahun.findUnique({
        where : {
            id : parseInt(id_tahun)
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }
 
    if(noPage) {
        return db.dudi.findMany({
            where : {
                AND : [
                    {
                        add_by : admin.id_sekolah
                    },
                    {
                        id_tahun : parseInt(id_tahun)
                    }
                ]       
            },
            select : selectDudiObject
        })
    }
    page = await validate(siswaValidation.pageValidation,page)
    const findDudi = await db.dudi.findMany({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]       
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectDudiObject
    })

    const countdudi = await db.dudi.count({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]       
        }
    })

    const countPage = Math.ceil(countdudi/ 10)
    return {dudi: findDudi,page : page,count : findDudi.length,countPage}
}

const findDudiById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        },
        select : selectDudiObject
    })

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    return findDudi
}
// deksripsi
const updateDudi = async (data,id,admin) => {
    id = await validate(adminValidation.idValidation,id)
    data = await validate(adminValidation.updateDudiValidation,data)

    const findDudi = await db.dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const updateAlamatDudi = async (data,id,admin) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const deleteDudi = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findDudi = await db.dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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

const findDudiFilter = async (query,admin,page,nopage) => {
    query = await validate(adminValidation.searchDudiValidation,query)
    if(!query.tahun) {
        throw new responseError(400,"tahun is required")
    }

    if(nopage) {
        return db.dudi.findMany({
            where : {
                AND : [
                    {
                        add_by : admin.id_sekolah
                    },
                    {
                        id_tahun : parseInt(query.tahun)
                    },
                    {
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
                    }
                ]
            },
            select : selectDudiObject
        })
    }
    page = await validate(siswaValidation.pageValidation,page)

    const findDudi = await db.dudi.findMany({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectDudiObject
    })

    const countDudi = await db.dudi.count({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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
                }
            ]
        },
    })

    const countpage = Math.ceil(countDudi / 10)
    return {dudi : findDudi,page : page,count : findDudi.length,countpage}
}


// pembimbing dudi service
const addPembimbingDudi = async (PembimbingDudi,alamat) => {
    PembimbingDudi.id = generateId()
    alamat.id_pembimbing_dudi = PembimbingDudi.id

    PembimbingDudi = await validate(adminValidation.addPembimbingDudiValidation,PembimbingDudi)
    alamat = await validate(adminValidation.addAlamatPembimbingDudiValidation,alamat)

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            OR : [
                {
                    username : PembimbingDudi.username
                },
                {
                    id : PembimbingDudi.id
                }
            ]
        }
    })

    if(findPembimbingDudi) {
        throw new responseError(400,"data pembimbing dudi telah ditambahkan")
    }
    const checkNoHp = await db.pembimbing_dudi.findFirst({
        where : {
            no_telepon : PembimbingDudi.no_telepon
        }
    })

    if(checkNoHp) {
        throw new responseError(400,"no handphone telah digunakan")
    }
    const findDudi = await db.dudi.findUnique({
        where : {
            id : PembimbingDudi.id_dudi
        }
    })

    PembimbingDudi.password = await bcrypt.hash(PembimbingDudi.password, 10)

    if(!findDudi) {
        throw new responseError(404,"data dudi tidak ditemukan")
    }

    const findTahun = await db.tahun.findUnique({
        where : {
            id : PembimbingDudi.id_tahun
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
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
const findAllPembimbingDudi = async (admin,page,id_tahun,noPage) => {
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const findTahun = await db.tahun.findUnique({
        where : {
            id : parseInt(id_tahun)
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }

    if(noPage) {
        return db.pembimbing_dudi.findMany({
            where : {
                AND : [
                    {
                        add_by : admin.id_sekolah
                    },
                    {
                        id_tahun : parseInt(id_tahun)
                    }
                ]
            },
            select : selectPebimbingDudiObject
        })
    }

    page = await validate(siswaValidation.pageValidation,page)

    const countPembimbing = await db.pembimbing_dudi.count({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]
        },
    })

    const countPage = Math.ceil(countPembimbing / 10)

    const pembimbingDudi = await db.pembimbing_dudi.findMany({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(id_tahun)
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectPebimbingDudiObject
    })

    return {pembimbingDudi: pembimbingDudi,page : page,count : pembimbingDudi.length,countPage}
}
const findPembimbingDudiById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        },
        select : selectPebimbingDudiObject
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }
    return findPembimbingDudi
}
const findPembimbingDudifilter = async (query,admin) => {
    query = await validate(adminValidation.searchPembimbingDudiValidation,query)

    const findPembimbingDudi = await db.pembimbing_dudi.findMany({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id_tahun : parseInt(query.tahun)
                },
                {
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
                }
            ]
        },
        select : selectPebimbingDudiObject
    })

    return {count : findPembimbingDudi.length,data : findPembimbingDudi}
}
const updatePembimbingDudi = async (data,id,admin) => {
    id = await validate(adminValidation.idValidation,id)
    data = await validate(adminValidation.updatePembimbingDudiValidation,data)

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const updateAlamatPembimbiDudi = async (data,id,admin) => {
    data = await validate(adminValidation.updateAlamatValidation,data)
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
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
const deletePembimbingDudi = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            AND : [
                {
                    add_by : admin.id_sekolah
                },
                {
                    id : id
                }
            ]
        },
        select : {
            siswa : true,
            laporan_pkl : true,
            laporans_siswa_pkl : true,
            kunjungan_guru_pembimbing : true
        }
    })

    if(!findPembimbingDudi) {
        throw new responseError(404,"data pembimbing dudi tidak ditemukan")
    }

    if(findPembimbingDudi.siswa[0] || findPembimbingDudi.laporan_pkl[0] || findPembimbingDudi.laporans_siswa_pkl[0] || findPembimbingDudi.kunjungan_guru_pembimbing[0]) {
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

const findAllPengajuanPkl = async (page,admin) => {
    page = await validate(siswaValidation.pageValidation,page)

    const findPengajuan = await db.pengajuan_pkl.findMany({
        where : {
            siswa : {
                id_sekolah : admin.id_sekolah
            }
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectPengajuanPklObject
    })

    return {pengajuan : findPengajuan,page : page,count : findPengajuan.length}
}
const findAllPengajuanPklFilter = async (query,admin) => {
    query = await validate(adminValidation.PengajuanPklfilterValidation,query)
    return db.pengajuan_pkl.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                }
            ],
            status : query
        },
        select : selectPengajuanPklObject
    })
}
const findPengajuanPklById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findPengajuanPkl = await db.pengajuan_pkl.findFirst({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
        },
        select : selectPengajuanPklObject
    })

    if(!findPengajuanPkl) {
        throw new responseError(404,"pengajuan pkl tidak ditemukan")
    }
    return findPengajuanPkl
}


// laporan pembimbing dudi pkl

const findAllLaporanPkl = async (page,admin,id_tahun) => {
    page = await validate(siswaValidation.pageValidation,page)
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const findTahun = await db.tahun.findUnique({
        where : {
            id : parseInt(id_tahun)
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }

    const findLaporan = await db.laporan_pkl.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]

        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectLaporanpklObject
    })

    const countLaporan = await db.laporan_pkl.count({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]

        },
    }) 

    const countPage = Math.ceil(countLaporan / 10)
    return {laporan : findLaporan,page : page,count : findLaporan.length,countPage}
}
const findLaporanPklById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findLaporan = await db.laporan_pkl.findFirst({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },{
                    id : id
                }
            ]
        },
        select : selectLaporanpklObject
    })

    if(!findLaporan) {
        throw new responseError(404,"laporan pkl tidak ditemukan")
    }
    return findLaporan
}
const findLaporanPklFilter = async (query,page,admin) => {
    query = await validate(adminValidation.searchLaporanPkl,query)
    page = await validate(siswaValidation.pageValidation,page)

    const findTahun = await db.tahun.findUnique({
        where : {
            id : parseInt(query.tahun)
        }
    })

    if(!findTahun) {
        throw new responseError(404,"data tahun tidak ditemukan")
    }

    const findLaporan = await db.laporan_pkl.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(query.tahun)
                    }
                },
                {
                    AND : [
                        {
                            id_dudi : query.id_dudi 
                        },
                        {
                            id_siswa :  query.id_siswa
                        },
                        {
                            siswa : {
                                id_guru_pembimbing : query.id_guru_Pembimbing
                            }
                        },
                        {
                            id_pembimbing_dudi : query.id_pembimbing_dudi
                        },
                        {
                            AND : [
                            {
                              keterangan : query.keterangan
                            },
                            {
                                OR : [
                                    {
                                        tanggal : query.tanggal
                                    },
                                    {
                                        AND : [
                                            {
                                                tanggal : {
                                                    gte : query.tanggal_start
                                                }
                                            },
                                            {
                                                tanggal : {
                                                    lte : query.tanggal_end
                                                }
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                tanggal : query.month_ago
                            }
                        ]
                        }
                    ]
                }
            ]
        },
        orderBy : {
            tanggal : "desc"
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectLaporanpklObject
    })

    return {count : findLaporan.length,data : findLaporan}
}


// laporan siswa pkl
const findAllLaporanSiswaPkl = async (page,admin,id_tahun) => {
    page = await validate(siswaValidation.pageValidation,page)
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const findLaporan = await db.laporan_siswa_pkl.findMany({
        where : {
            AND : [
                {                  
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectLaporanpklSiswaObject
    })

    const countLaporan = await db.laporan_siswa_pkl.count({
        where : {
            AND : [
                {                  
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]
        },
    }) 
    
    const countPage = Math.ceil(countLaporan / 10)
    return {laporan : findLaporan,page : page,count : findLaporan.length,countPage}
}
const findLaporanPklSiswaById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findLaporan = await db.laporan_siswa_pkl.findFirst({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
        },
        select : selectLaporanpklSiswaObject
    })

    if(!findLaporan) {
        throw new responseError(404,"laporan pkl siswa tidak ditemukan")
    }
    return findLaporan
}
const findLaporanPklSiswaFilter = async (query,page,admin) => {
    query = await validate(adminValidation.searchLaporanPklSiswa,query)
    page = await validate(siswaValidation.pageValidation,page)

    const findLaporan = await db.laporan_siswa_pkl.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    AND : [
                        {
                            id_dudi : query.id_dudi
                        },
                        {
                            id_siswa : query.id_siswa
                        },
                        {
                            id_pembimbing_dudi : query.id_pembimbing_dudi
                        },
                           {
                            siswa : {
                                id_guru_pembimbing : query.id_guru_Pembimbing
                            }
                        },
                        {
                            AND : [
                              {
                                rujukan_kompetensi_dasar : query.rujukan_kompetensi_dasar
                              },
                              {
                                topik_pekerjaan : query.topik_pekerjaan
                              },
                              {
                                  OR : [
                                      {
                                          tanggal : query.tanggal
                                      },
                                      {
                                          AND : [
                                              {
                                                  tanggal : {
                                                      gte : query.tanggal_start
                                                  }
                                              },
                                              {
                                                  tanggal : {
                                                      lte : query.tanggal_end
                                                  }
                                              },
                                          ]
                                      }
                                  ]
                              },
                              {
                                  tanggal : query.month_ago
                              }
                            ]
                          }
                    ]
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectLaporanpklSiswaObject
    })

    return {count : findLaporan.length,data : findLaporan}
}


// absen
const findAllAbsen = async (admin,id_tahun,page) => {
    page = await validate(siswaValidation.pageValidation,page)
     if(!id_tahun) {
        throw new responseError(400,"tahun is required")
    }

    const countAbsen = await db.absen.count({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]
        },
        })
    const countPage = Math.ceil(countAbsen / 10)

    const findAbsen = await db.absen.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(id_tahun)
                    }
                }
            ]
        },
        skip : 10 * (page - 1),
        take : 10,
        select : selectAbsenObject
    })

    return {absen : findAbsen,page : page,count : findAbsen.length,countPage : countPage}
}
// const findAllAbsenBySiswa = async ()
const findAbsenById = async (id,admin) => {
    id = await validate(adminValidation.idValidation,id)

    const findAbsen = await db.absen.findFirst({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    id : id
                }
            ]
        },
        select : selectAbsenObject
    })

    if(!findAbsen) {
        throw new responseError(404,"data absen tidak ditemukan")
    }
    return findAbsen
}
const findAbsenFilter = async (query,admin) => {
    query = await validate(adminValidation.searchAbsen,query)

    const findAbsen = await db.absen.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    }
                },
                {
                    siswa : {
                        id_tahun : parseInt(query.tahun)
                    }
                },
                // {
                //     AND : [
                //         {
                //             id_dudi : query.id_dudi
                //         },
                //         {
                //             id_siswa : query.id_siswa
                //         },
                //         {
                //             id_pembimbing_dudi : query.id_pembimbing_dudi
                //         }
                //     ]
                // },
            ]
        },
        select : selectAbsenObject
    })

    return {count : findAbsen.length,data : findAbsen}
}
const findAbsenBySiswa = async (id_siswa,admin) => {
    id_siswa = await validate(adminValidation.idValidation,id_siswa)

    const findAbsen = await db.absen.findMany({
        where : {
            AND : [
                {
                    siswa : {
                        id_sekolah : admin.id_sekolah
                    },
                },
                {
                    id_siswa : id_siswa
                }
            ]
        },
        select : selectAbsenObject
    })

    return findAbsen
}
export default {
    // admin login
    adminLogin,
    updatePassword,

    // tahun
    addTahun,
    deleteTahun,
    updateTahun,
    getAllTahun,

    // siswa
    addSiswa,
    findSiswaById,
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
    findAbsenFilter,
    findAbsenBySiswa
}