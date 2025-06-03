import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: [{
    emit: 'event',
    level: 'query'
  }]
})

prisma.$on('query', event => {
  console.log('-'.repeat(40))
  console.log(event.query)
  if(event.params) console.log('PARAMS:', event.params)
})

export default prisma