import express from "express"

export const absenRouter = express.Router()


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
//     res.send("hay")
// })