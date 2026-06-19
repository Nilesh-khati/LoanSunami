import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    })
    console.log(`MongoDB connected successfully ✅  Host: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
