import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";


const PORT = config.port;

async function main() {
    try {

        await prisma.$connect();
        console.log("database connected successfully")
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();