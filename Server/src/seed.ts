import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillrent";

async function seedData() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    try {
        // 1. Create a dummy USER
        const userPassword = await bcrypt.hash('password123', 10);
        const userResult = await db.collection('users').insertOne({
            name: 'Test Client',
            email: 'client@test.com',
            password: userPassword,
            role: 'user',
            isBanned: false,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("Created Test User:", userResult.insertedId);

        // 2. Create a dummy ADMIN
        const adminPassword = await bcrypt.hash('admin123', 10);
        await db.collection('users').updateOne(
            { email: 'admin@skillrent.com' },
            {
                $set: {
                    name: 'Super Admin',
                    password: adminPassword,
                    role: 'admin',
                    isBanned: false,
                    isVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );
        console.log("Ensured Admin exists (admin@skillrent.com / admin123)");

        // 3. Create a dummy pending PROVIDER
        const providerUserPassword = await bcrypt.hash('provider123', 10);
        const providerUserResult = await db.collection('users').insertOne({
            name: 'Alex the Plumber',
            email: 'alex@plumbing.com',
            password: providerUserPassword,
            role: 'provider',
            isBanned: false,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("Created Provider User:", providerUserResult.insertedId);

        // Create the associated Provider profile
        await db.collection('providers').insertOne({
            userId: providerUserResult.insertedId,
            bio: 'Expert plumber with 10 years of experience fixing leaks.',
            skills: ['Plumbing', 'Pipe Repair'],
            language: ['English'],
            hasTransport: true,
            location: 'New York',
            validationStatus: 'pending', // IMPORTANT: Keep it pending for testing
            availability: [],
            experience: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log("Created Provider Profile (Pending state)");

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seedData();
