import mongoose from 'mongoose';

async function initMongoConnection() {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const mongoURI = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Mongo connection error:', error);
    }
}

export default initMongoConnection;
