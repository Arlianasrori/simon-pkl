import { db } from "../config/prismaClient.js"
import generateId from "../utils/generateIdUtils.js"
import absenValidation from "../validation/absenValidation.js"

const addJadwalAbsen = async (body) => {
    body.id = generateId() 
    body = await absenValidation.addJadwalAbsen()
}