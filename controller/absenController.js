import absenService from "../service/absenService.js";

const addJadwalAbsen = async (req,res,next) => {
    try {
        console.log("p");
        const body = req.body
        const result = await absenService.addJadwalAbsen(body)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    addJadwalAbsen
}