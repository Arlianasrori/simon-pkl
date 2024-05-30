export function getQuery (query,page,id_tahun) {
    let whereQuery = "1 = 1"
    
    if(query.nama_instansi_perusahaan) {
        whereQuery += ` AND LOWER(nama_instansi_perusahaan) ILIKE '%${query.nama_instansi_perusahaan.toLowerCase()}%'`
    }
    if(query.no_telepon) {
        whereQuery += ` AND no_telepon = ${query.no_telepon}`
    }
    if(query.bidang) {
        whereQuery += ` AND LOWER(bidang) ILIKE '%${query.bidang.toLowerCase()}%'`
    }

    return `SELECT COUNT(s)::int as total_siswa,COUNT(s.jenis_kelamin)filter (where s.jenis_kelamin = 'laki')::int  as total_siswa_laki,COUNT(s.jenis_kelamin) filter (where s.jenis_kelamin = 'perempuan')::int as total_siswa_perempuan,
    d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total as total_kouta,ks.jumlah_wanita as kouta_perempuan,ks.jumlah_pria as kouta_laki
    FROM dudi as d
    LEFT JOIN siswa as s ON d.id = s.id_dudi
    LEFT JOIN alamat_dudi as ad ON d.id = ad.id_dudi
    LEFT JOIN kouta_siswa as ks ON d.id = ks.id_dudi
    WHERE ${whereQuery} AND d.id_tahun = ${id_tahun}
    GROUP BY d.id,d.nama_instansi_perusahaan,d.no_telepon,d.deksripsi,d.bidang,ad.detail_tempat,ad.desa,ad.kecamatan,ad.kabupaten,ad.provinsi,ad.negara,ks.total,ks.jumlah_wanita,ks.jumlah_pria
    LIMIT 10 OFFSET ${10 * (page - 1)}`
}
