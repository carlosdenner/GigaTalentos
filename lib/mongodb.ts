import mongoose from 'mongoose';



if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 15000, // Increased connection timeout
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
    };

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI exists:', !!MONGODB_URI);
    console.log('Environment:', process.env.NODE_ENV);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('Connected to database:', mongoose.connection.db?.databaseName);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('Full error:', error);
      cached.promise = null;
      throw new Error(`MongoDB connection failed: ${error.message}`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;