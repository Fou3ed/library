import mongoose from 'mongoose'

mongoose.set('strictQuery', true);

const dbServer = () => mongoose.connect(process.env.MONGODB, () => {
    console.log("connected to data base")
  },
  e => console.error(e)
)
export default dbServer