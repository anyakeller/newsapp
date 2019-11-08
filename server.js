var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHEadlines";

mongoose.conect(MONGODB_URI);
