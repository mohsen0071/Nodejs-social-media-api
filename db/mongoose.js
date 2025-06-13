const mongoose = require('mongoose');

class MongoClient {
    async connect() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/api-social-media', { });
            console.log("Database connected succesfully")
        } catch (error) {
            console.error(error?.message);
            process.exit(1);
        }
    }
}

const mongoClient = new MongoClient()
Object.freeze(mongoClient)

module.exports = mongoClient;