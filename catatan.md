// absenRouter.get("/absen",(req,res) => {
//     const j = 14.24
//     const p = 14.25

//     if(j < p) {
//         console.log("terlalu cepat");
//     }
//     const date = new Date()
//     const options = {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour : "numeric",
//         minute : "numeric",
//         second : "numeric"
//     };
//     const tanggal = date.toLocaleDateString("id",options)
//     console.log(tanggal);
//    
//     res.send("hay")
// })
done : absen with izin dan telat,absen diluar radius

belum : cek absen,,analisis absen,


  if(dudi.total_siswa >= dudi.total_kouta) {
    dudi.enabled = false
  }else if(siswa.jenis_kelamin == "laki") {
    if(dudi.total_siswa_laki >= dudi.kouta_pria) {
      dudi.enabled = true
    }
  }else if(siswa.jenis_kelamin == "perempuan") {
    if(dudi.total_siswa_perempuan >= dudi.kouta_wanita) {
      dudi.enabled = false
    }
  }