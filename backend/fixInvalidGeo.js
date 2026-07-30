const mongoose = require("mongoose");
const uri = "mongodb+srv://jaisonjoy303:T9zpBXWVb5oPdgeC@skillrent.9syhlwv.mongodb.net/skillrent?retryWrites=true&w=majority&appName=SkillRent";
mongoose.connect(uri).then(async () => {
    try {
        const Provider = mongoose.connection.collection("providers");
        const invalidDocs = await Provider.updateMany(
            { "location.type": "Point", "location.coordinates": { $exists: false } },
            { $unset: { location: 1 } }
        );
        console.log("Invalid Provider docs fixed:", invalidDocs.modifiedCount);
        
        const User = mongoose.connection.collection("users");
        const invalidUsers = await User.updateMany(
            { "location.type": "Point", "location.coordinates": { $exists: false } },
            { $unset: { location: 1 } }
        );
        console.log("Invalid User docs fixed:", invalidUsers.modifiedCount);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
});
