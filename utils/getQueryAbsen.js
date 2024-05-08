export function getQueryAbsen (query) {
    const Now = new Date()
    const dateNow = `${Now.getFullYear()}-${("0" + (Now.getMonth() + 1)).slice(-2)}-${("0" + (Now.getDay())).slice(-2)}`

    let whereQuery = "1 = 1"

    if(query.id_Siswa) {
        whereQuery += ` AND id_siswa = ${query.id_Siswa}`
    }
    if(query.id_pembimbing_dudi) {
        whereQuery += ` AND id_pembimbing_dudi = ${query.id_pembimbing_dudi}`
    }
    if(query.id_guru_pembimbing) {
        whereQuery += ` AND id_guru_pembimbing = ${query.id_guru_pembimbing}`
    }
    if(query.id_dudi) {
        whereQuery += ` AND id_dudi = ${query.id_dudi}`
    }
    if(query.month) {
        if(!query.years) {
            query.years = dateNow.split("-")[0]
        }
        const monthStart = `${query.years}-0${query.month}-01`
        const monthEnd = `${query.years}-0${query.month}-31`

        whereQuery += ` AND (tanggal >= '${monthStart}' AND tanggal <= '${monthEnd}')`
    }

    return `SELECT COUNT(status_absen_masuk) filter (where status_absen_masuk = 'hadir')::int as absen_masuk_hadir,COUNT(status_absen_masuk) filter (where absen_masuk = 'tidak_hadir')::int as absen_masuk_tidak_hadir,COUNT(absen_masuk) filter (where status_absen_masuk = 'telat')::int as absen_masuk_telat,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'izin')::int as absen_masuk_izin,COUNT(status_absen_masuk) filter (where status_absen_masuk = 'diluar_radius')::int as absen_masuk_diluar_radius,

    COUNT(status_absen_pulang) filter (where status_absen_pulang = 'hadir')::int as absen_keluar_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'tidak_hadir')::int as absen_keluar_tidak_hadir,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'telat')::int as absen_keluar_telat,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'izin')::int as absen_keluar_izin,COUNT(status_absen_pulang) filter (where status_absen_pulang = 'diluar_radius')::int as absen_keluar_diluar_radius,COUNT(status) filter (where status = 'hadir')::int as status_absen_hadir,COUNT(status) filter (where status = 'tidak_hadir')::int as status_absen_tidak_hadir,
    id_siswa,siswa.nama
    FROM absen
    INNER JOIN siswa ON absen.id_siswa = siswa.id
    // INNER JOIN jurusan ON absen.id_siswa = siswa.id di ini ya bro jurusannya
    WHERE ${whereQuery}
    GROUP BY id_siswa,nama`
}