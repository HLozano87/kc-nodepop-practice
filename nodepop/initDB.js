import readline from 'node:readline/promises'
import connectMongoose from './lib/connectMongoose.js'
import Product from './models/Product.js'
import User from './models/User.js'


const connection = await connectMongoose()
console.log(`Connected to MongoDB ${connection.name}`)

const answer = await ask('Are you sure you want to initialize the database? (n)')
if (answer.toLowerCase() !== 'y') {
  console.log('Process aborted.')
  process.exit()
}

await initUsers()
await initDBNodepop()
await connection.close()

async function initDBNodepop() {
  const products = await Product.deleteMany()
  console.log(`Delete ${products.deletedCount} products.`)

  const randomImg = Math.floor(Math.random() * 1000)
  const insertProduct = await Product.insertMany([
    {
      name: 'Mobile',
      price: 440,
      image: `https://picsum.photos/id/${randomImg}/300/200`,
      tags: ['smartphone']
    },
  ])
  console.log(`Insert ${insertProduct} products. \nTotal products insert ${insertProduct.length}.`)

}

async function initUsers() {
  const users = await User.deleteMany()
  console.log(`Delete ${users.deletedCount} users.`)

  const insertUsers = await User.insertMany([
    { email: 'user@example.com', password: await User.hashPassword('1234') },
  ])
  console.log(`Insert ${insertUsers.length} users.`)
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const askResult = await rl.question(question)
  rl.close()
  return askResult
}