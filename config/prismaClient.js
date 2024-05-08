import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient({
    // log: [
    //     {
    //       emit: 'event',
    //       level: 'query',
    //     },
    //   ],
})

// db.$on('query', (e) => {
//     console.log({query : e.query})
//     console.log({params : e.params})
//   })