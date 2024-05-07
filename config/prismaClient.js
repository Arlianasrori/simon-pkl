import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient({
    log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
})

db.$on('query', (e) => {
    console.log({query : e.query})
    console.log('Params: ' + e.params)
  })