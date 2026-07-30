const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://jaisonjoy303:T9zpBXWVb5oPdgeC@skillrent.9syhlwv.mongodb.net/skillrent?retryWrites=true&w=majority&appName=SkillRent';

mongoose.connect(mongoURI).then(async () => {
  console.log('Connected to DB');
  const db = mongoose.connection.db;
  
  try {
    // Also unset if location is a string instead of an object
    const pResult2 = await db.collection('providers').updateMany(
      { location: { $type: "string" } },
      { $unset: { location: '' } }
    );
    console.log('Providers string locations cleaned:', pResult2.modifiedCount);

    const uResult2 = await db.collection('users').updateMany(
      { location: { $type: "string" } },
      { $unset: { location: '' } }
    );
    console.log('Users string locations cleaned:', uResult2.modifiedCount);

    await db.collection('providers').createIndex({ location: '2dsphere' });
    await db.collection('users').createIndex({ location: '2dsphere' });
    console.log('Indexes created successfully');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
