import { MongoClient, Db, ObjectId } from 'mongodb';
import { users, companies, drives, studentProfiles, applications } from './data';

export async function reseedDatabase(client: MongoClient) {
    const db = client.db("campus-connect-db");
    console.log("Dropping database...");
    await db.dropDatabase();
    console.log("Database dropped.");
    await seedDatabase(client, true);
}


export async function seedDatabase(client: MongoClient, force = false) {
    if (process.env.NODE_ENV === 'production' && process.env.DB_SEEDING_DISABLED === 'true') {
        console.log('Database seeding is disabled in production.');
        return;
    }

    try {
        const db = client.db("campus-connect-db");

        // Check if the users collection exists and has documents. If so, assume DB is seeded.
        if (!force) {
            const collections = await db.listCollections({ name: 'users' }).toArray();
            if (collections.length > 0) {
                const userCount = await db.collection('users').countDocuments();
                if (userCount > 0) {
                    console.log("Database already contains data. Skipping seed process.");
                    return;
                }
            }
        }
        
        console.log("Database appears to be empty or seeding is forced. Starting seed process...");

        const seedCollection = async (collectionName: string, data: any[]) => {
            const collection = db.collection(collectionName);
            if (data.length > 0) {
                console.log(`Seeding '${collectionName}'...`);
                await collection.insertMany(data);
                console.log(`Seeded ${data.length} documents into '${collectionName}'.`);
            }
        };

        // 1. Seed Users (no dependencies)
        await seedCollection('users', users);
        const seededUsers = await db.collection('users').find().toArray();
        const userIdMap = new Map<string, ObjectId>();
        seededUsers.forEach(user => {
            userIdMap.set(user.email, user._id);
        });


        // 2. Seed Companies and get their new IDs
        const companiesCollection = db.collection('companies');
        const companySeedResult = await companiesCollection.insertMany(companies);
        console.log(`Seeded ${Object.keys(companySeedResult.insertedIds).length} companies.`);
        const companyIdMap = new Map<string, ObjectId>();
        companies.forEach((company, index) => {
            // Using a simple numeric identifier from original data as key
            const oldId = `comp${index + 1}`;
            const newId = companySeedResult.insertedIds[index];
            companyIdMap.set(oldId, newId);
        });
        
        // 3. Seed Student Profiles (no dependencies on other seeded collections)
        await seedCollection('studentProfiles', studentProfiles);

        // 4. Seed Drives, using the new company IDs
        const drivesCollection = db.collection('drives');
        const mappedDrives = drives.map(drive => {
            const newCompanyId = companyIdMap.get(drive.companyId);
            if (!newCompanyId) {
                console.warn(`Could not find new ID for old companyId: ${drive.companyId}`);
                // Fallback or throw error. Here, we'll just keep the old one, but it will be invalid.
                return { ...drive };
            }
            return {
                ...drive,
                companyId: newCompanyId.toString(),
            };
        });
        const driveSeedResult = await drivesCollection.insertMany(mappedDrives);
        console.log(`Seeded ${Object.keys(driveSeedResult.insertedIds).length} drives.`);
        const driveIdMap = new Map<string, ObjectId>();
         drives.forEach((drive, index) => {
            // Using a simple numeric identifier from original data as key
            const oldId = `drive${index + 1}`;
            const newId = driveSeedResult.insertedIds[index];
            driveIdMap.set(oldId, newId);
        });

        // 5. Seed Applications, using the new drive IDs
        const applicationsCollection = db.collection('applications');
        const mappedApplications = applications.map(app => {
            const newDriveId = driveIdMap.get(app.driveId);
             if (!newDriveId) {
                console.warn(`Could not find new ID for old driveId: ${app.driveId}`);
                return { ...app };
            }
            return {
                ...app,
                driveId: newDriveId.toString(),
            }
        });
        await applicationsCollection.insertMany(mappedApplications);
        console.log(`Seeded ${mappedApplications.length} applications.`);

        console.log("Database seeding process completed successfully.");

    } catch (error) {
        console.error("Error during database seeding:", error);
        throw error;
    }
}
