import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()

// db.$on('query', (e) => {
//     console.log({query : e.query})
//     console.log('Params: ' + e.params)
//   })