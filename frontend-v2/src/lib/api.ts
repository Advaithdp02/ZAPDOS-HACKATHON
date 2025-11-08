

'use server';

/**
 * @file This file contains API functions that interact with a MongoDB backend.
 */
import type { User, Company, Drive, Application, StudentProfile, EducationItem, ExperienceItem, CertificationItem, CreateDrive } from './types';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

// Helper function to connect to a collection
async function getCollection(collectionName: string) {
    const client = await clientPromise;
    const db = client.db("campus-connect-db");
    return db.collection(collectionName);
}

// Helper to convert MongoDB document to our type
function fromMongo<T extends { _id: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}

// USER API
export async function login(email: string, password_sent: string): Promise<User | null> {
    const usersCollection = await getCollection('users');
    const user = await usersCollection.findOne({ email, password: password_sent });
    if (user) {
        // Don't send password to the client
        const { password, ...userWithoutPassword } = user;
        return fromMongo(userWithoutPassword as any);
    }
    return null;
}

// STUDENT PROFILE API
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const profilesCollection = await getCollection('studentProfiles');
    const usersCollection = await getCollection('users');

    // The incoming `userId` is the user's `_id` from the auth context.
    if (!ObjectId.isValid(userId)) {
        console.error("getStudentProfile: Invalid user ObjectId format for ID:", userId);
        return null;
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        console.error("getStudentProfile: User not found in 'users' collection for _id:", userId);
        return null;
    }
    
    // Now find the profile using the unique email from the user document.
    const profile = await profilesCollection.findOne({ email: user.email });
    if (!profile) {
        console.error("getStudentProfile: StudentProfile not found in 'studentProfiles' collection for email:", user.email);
        return null;
    }
    
    return profile ? fromMongo(profile as any) : null;
}

export async function getStudentProfileByStudentId(studentId: string): Promise<StudentProfile | null> {
    const profilesCollection = await getCollection('studentProfiles');
    const profile = await profilesCollection.findOne({ studentId: studentId });
     if (!profile) {
        console.error("getStudentProfileByStudentId: StudentProfile not found for studentId:", studentId);
        return null;
    }
    return profile ? fromMongo(profile as any) : null;
}


export async function updateStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<StudentProfile | null> {
    const profilesCollection = await getCollection('studentProfiles');
    const usersCollection = await getCollection('users');
     if (!ObjectId.isValid(userId)) {
        return null;
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return null;
    }

    const updateData = { ...profileData };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, _id, studentId, email, ...setValues } = updateData as any;
    
    const assignObjectIds = (items: any[]) => items.map(item => ({
        ...item,
        id: item.id && ObjectId.isValid(item.id) ? item.id : new ObjectId().toString()
    }));

    if (setValues.education) {
        setValues.education = assignObjectIds(setValues.education);
    }
    if (setValues.experience) {
        setValues.experience = assignObjectIds(setValues.experience);
    }
    if (setValues.certifications) {
        setValues.certifications = assignObjectIds(setValues.certifications);
    }


    const result = await profilesCollection.findOneAndUpdate(
        { email: user.email },
        { $set: setValues },
        { returnDocument: 'after' }
    );
    
    return result ? fromMongo(result as any) : null;
}


export async function getStudentProfilesByDepartment(department?: string): Promise<StudentProfile[]> {
    const profilesCollection = await getCollection('studentProfiles');
    const query = department ? { department } : {};
    const profiles = await profilesCollection.find(query).toArray();
    return profiles.map(p => fromMongo(p as any));
}

// APPROVALS API
export async function getPendingApprovals(department: string): Promise<StudentProfile[]> {
    const profilesCollection = await getCollection('studentProfiles');
    const profiles = await profilesCollection.find({ department, registrationStatus: 'Pending' }).limit(5).toArray();
    return profiles.map(p => fromMongo(p as any));
}

export async function approveStudent(studentId: string): Promise<{success: boolean}> {
    const profilesCollection = await getCollection('studentProfiles');
    const result = await profilesCollection.updateOne({ studentId }, { $set: { registrationStatus: 'Approved' } });
    return { success: result.modifiedCount > 0 };
}

export async function rejectStudent(studentId: string): Promise<{success: boolean}> {
    const profilesCollection = await getCollection('studentProfiles');
    const result = await profilesCollection.updateOne({ studentId }, { $set: { registrationStatus: 'Rejected' } });
    return { success: result.modifiedCount > 0 };
}


// DRIVES API
export async function getDrives(): Promise<Drive[]> {
    const drivesCollection = await getCollection('drives');
    const drives = await drivesCollection.find({}).toArray();
    return drives.map(d => fromMongo(d as any));
}

export async function getDriveById(id: string): Promise<Drive | null> {
    if (!ObjectId.isValid(id)) return null;
    const drivesCollection = await getCollection('drives');
    const drive = await drivesCollection.findOne({ _id: new ObjectId(id) });
    return drive ? fromMongo(drive as any) : null;
}

export async function createDrive(driveData: CreateDrive): Promise<Drive> {
    const drivesCollection = await getCollection('drives');
    const newDriveData = {
        ...driveData,
        status: 'active' as const,
        applications: [],
    };
    const result = await drivesCollection.insertOne(newDriveData);
    const createdDrive = await drivesCollection.findOne({_id: result.insertedId});
    if (!createdDrive) {
        throw new Error("Failed to create drive");
    }
    return fromMongo(createdDrive as any);
}


// COMPANIES API
export async function getCompanies(): Promise<Company[]> {
    const companiesCollection = await getCollection("companies");
    const companies = await companiesCollection.find({}).toArray();
    return companies.map(c => fromMongo(c as any));
}

export async function getCompanyById(id: string): Promise<Company | null> {
    if (!ObjectId.isValid(id)) return null;
    const companiesCollection = await getCollection("companies");
    const company = await companiesCollection.findOne({ _id: new ObjectId(id) });
    return company ? fromMongo(company as any) : null;
}

export async function createCompany(companyData: Omit<Company, 'id' | 'logoUrl'>): Promise<Company> {
    const companiesCollection = await getCollection("companies");
    const newCompanyData = {
        logoUrl: `/logos/placeholder.svg`,
        ...companyData
    };
    const result = await companiesCollection.insertOne(newCompanyData);
    const createdCompany = await companiesCollection.findOne({_id: result.insertedId});
     if (!createdCompany) {
        throw new Error("Failed to create company");
    }
    return fromMongo(createdCompany as any);
}


// APPLICATIONS API
export async function getApplications(): Promise<Application[]> {
    const applicationsCollection = await getCollection('applications');
    const apps = await applicationsCollection.find({}).toArray();
    return apps.map(a => fromMongo(a as any));
}

export async function getApplicationsByStudentId(userId: string): Promise<Application[]> {
    // The incoming `userId` is the user's `_id` from the auth context.
    if (!ObjectId.isValid(userId)) {
        console.error("getApplicationsByStudentId: Invalid user ObjectId format:", userId);
        return [];
    }
    
    // First, get the student's profile to find their actual `studentId` (e.g., "student1")
    const profile = await getStudentProfile(userId);
    if (!profile) {
        console.error("getApplicationsByStudentId: Could not find student profile for user ID:", userId);
        return [];
    }

    const applicationsCollection = await getCollection('applications');
    const apps = await applicationsCollection.find({ studentId: profile.studentId }).toArray();
    return apps.map(a => fromMongo(a as any));
}

export async function getApplicationsByDriveId(driveId: string): Promise<Application[]> {
    const applicationsCollection = await getCollection('applications');
    const apps = await applicationsCollection.find({ driveId }).toArray();
    return apps.map(a => fromMongo(a as any));
}

export async function createApplication(userId: string, driveId: string, coverLetter: string): Promise<Application> {
    const drive = await getDriveById(driveId);
    if (!drive) {
        throw new Error("Drive not found");
    }

    const profile = await getStudentProfile(userId);
     if (!profile) {
        throw new Error("Student profile not found for user ID: " + userId);
    }

    const applicationsCollection = await getCollection('applications');
    const drivesCollection = await getCollection('drives');

    const currentStatus = drive.stages[0] || 'Applied';

    const newApplicationData = {
        studentId: profile.studentId, // Use the actual studentId from the profile
        driveId,
        statusUpdates: [{ status: currentStatus, date: new Date().toISOString() }],
        resumeUrl: profile.resumeUrl,
        appliedDate: new Date().toISOString(),
        coverLetter,
    };
    
    const result = await applicationsCollection.insertOne(newApplicationData);

    await drivesCollection.updateOne(
        { _id: new ObjectId(driveId) },
        { $push: { applications: profile.studentId } }
    );
    
    const createdApp = await applicationsCollection.findOne({_id: result.insertedId});
     if (!createdApp) {
        throw new Error("Failed to create application");
    }
    
    revalidatePath('/applications');
    revalidatePath(`/drives/${driveId}`);
    
    return fromMongo(createdApp as any);
}

// REPORTS API
export async function getOffersByCompany(): Promise<{ name: string; count: number }[]> {
    const applicationsCollection = await getCollection('applications');
    const companiesCollection = await getCollection('companies');
    const drivesCollection = await getCollection('drives');

    // Find applications that have an "Offered" status in their statusUpdates array.
    const offeredApps = await applicationsCollection.find({ "statusUpdates.status": "Offered" }).toArray();
    
    const driveIds = [...new Set(offeredApps.map(app => new ObjectId(app.driveId)))];
    
    const drivesWithCompany = await drivesCollection.find({ _id: { $in: driveIds } }).project({ companyId: 1 }).toArray();
    const companyIdCounts: Record<string, number> = {};

    for (const app of offeredApps) {
        const drive = drivesWithCompany.find(d => d._id.toString() === app.driveId);
        if (drive) {
            const companyId = drive.companyId.toString();
            companyIdCounts[companyId] = (companyIdCounts[companyId] || 0) + 1;
        }
    }

    const companyIds = Object.keys(companyIdCounts).map(id => {
        try {
            return new ObjectId(id);
        } catch {
            return null;
        }
    }).filter(id => id !== null) as ObjectId[];

    const companies = await companiesCollection.find({ _id: { $in: companyIds } }).toArray();

    return companies.map(company => ({
        name: company.name,
        count: companyIdCounts[company._id.toString()] || 0
    }));
}

export async function getOffersByDepartment(department?: string): Promise<{ name: string; count: number }[]> {
    const applicationsCollection = await getCollection('applications');
    const profilesCollection = await getCollection('studentProfiles');
    
    const offeredApps = await applicationsCollection.find({ "statusUpdates.status": 'Offered' }).toArray();
    const studentIds = [...new Set(offeredApps.map(app => app.studentId))];
    
    const students = await profilesCollection.find({ studentId: { $in: studentIds } }).project({ department: 1 }).toArray();
    
    const departmentCounts: Record<string, number> = {};
    for (const student of students) {
        if (department && student.department !== department) continue;
        departmentCounts[student.department] = (departmentCounts[student.department] || 0) + 1;
    }
    
    return Object.entries(departmentCounts).map(([name, count]) => ({ name, count }));
}


// VERIFICATION API
export async function getUnverifiedProfiles(department?: string): Promise<StudentProfile[]> {
    const profilesCollection = await getCollection('studentProfiles');
    const query: any = {
        $or: [
            { "education.verified": false },
            { "experience.verified": false },
            { "certifications.verified": false }
        ]
    };
    if (department) {
        query.department = department;
    }
    const profiles = await profilesCollection.find(query).toArray();
    return profiles.map(p => fromMongo(p as any));
}

async function verifyItem(studentId: string, itemId: string, field: 'education' | 'experience' | 'certifications'): Promise<{ success: boolean }> {
    const profilesCollection = await getCollection('studentProfiles');
    const arrayFilter = { [`item.id`]: itemId };
    const update = { $set: { [`${field}.$[item].verified`]: true } };
    
    const result = await profilesCollection.updateOne({ studentId }, update, { arrayFilters: [arrayFilter] });
    return { success: result.modifiedCount > 0 };
}

export async function verifyEducationItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    return verifyItem(studentId, itemId, 'education');
}

export async function verifyExperienceItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    return verifyItem(studentId, itemId, 'experience');
}

export async function verifyCertificationItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    return verifyItem(studentId, itemId, 'certifications');
}


    