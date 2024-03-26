import express from "express"
import siswaController from "../controller/siswaController.js"

export const siswaRouter = express.Router()

siswaRouter.get('/getSiswaById/:id', siswaController.getSiswaById)
siswaRouter.get('/getSiswaByName', siswaController.getSiswaByName)
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudi/:id', siswaController.getDudiById)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)