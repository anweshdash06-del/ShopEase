const mongoose = require("mongoose");
const dns = require("dns");

// Windows (especially with VPNs, certain adapters, or OneDrive-synced project folders)
// sometimes has a Node.js c-ares DNS resolver that fails "mongodb+srv://" SRV lookups
// even though the OS's own DNS resolves fine. Forcing Node to use Google's DNS servers
// fixes "querySrv ECONNREFUSED" errors in that situation.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;