import { ProviderContainer } from './src/container/container';
import mongoose from 'mongoose';

async function run() {
    console.log('Starting test...');
    try {
        await mongoose.connect('mongodb+srv://jaisonjoy303:T9zpBXWVb5oPdgeC@skillrent.9syhlwv.mongodb.net/skillrent?retryWrites=true&w=majority&appName=SkillRent');
        console.log('Connected to DB');
        const service = ProviderContainer();
        const result = await service.listProviderService({ validationStatus: 'approved' }, 1, 10, 'Alex', 'newest');
        console.log('Total found:', result.total);
        console.log('Providers:', result.providers.map((p: any) => p.userId?.name));
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
