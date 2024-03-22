import express from "express"
import siswaController from "../controller/siswaController.js"

export const siswaRouter = express.Router()

siswaRouter.get('/getSiswaById', siswaController.getSiswaById)
siswaRouter.get('/getSiswaByName', siswaController.getSiswaByName)
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)