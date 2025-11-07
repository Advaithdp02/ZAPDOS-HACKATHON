

/**
 * @file This file contains mock API functions that will be replaced with actual API calls to a MongoDB backend.
 */
import { users, companies, drives, applications, studentProfiles } from './data';
import type { User, Company, Drive, Application, StudentProfile, EducationItem, ExperienceItem, CertificationItem, CreateDrive } from './types';

// USER API
export async function login(email: string, password_sent: string): Promise<User | null> {
  const foundUser = users.find(u => u.email === email && u.password === password_sent);
  if (foundUser) {
    const userToStore = { ...foundUser };
    delete userToStore.password;
    return Promise.resolve(userToStore);
  }
  return Promise.resolve(null);
}

// STUDENT PROFILE API
export async function getStudentProfile(studentId: string): Promise<StudentProfile | undefined> {
  // Deep copy to prevent mutation of original data
  const profile = studentProfiles.find(p => p.studentId === studentId);
  return Promise.resolve(profile ? JSON.parse(JSON.stringify(profile)) : undefined);
}

export async function updateStudentProfile(studentId: string, profileData: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
  const profileIndex = studentProfiles.findIndex(p => p.studentId === studentId);
  if (profileIndex !== -1) {
      // When updating, give new items a temporary ID
      const newEducation = profileData.education?.map(e => e.id ? e : {...e, id: `edu-${Date.now()}-${Math.random()}`});
      const newExperience = profileData.experience?.map(e => e.id ? e : {...e, id: `exp-${Date.now()}-${Math.random()}`});
      const newCertifications = profileData.certifications?.map(c => c.id ? c : {...c, id: `cert-${Date.now()}-${Math.random()}`});

      const updatedProfile = {
          ...studentProfiles[profileIndex],
          ...profileData,
          education: newEducation || studentProfiles[profileIndex].education,
          experience: newExperience || studentProfiles[profileIndex].experience,
          certifications: newCertifications || studentProfiles[profileIndex].certifications,
      };

      studentProfiles[profileIndex] = updatedProfile;
      console.log('Updated student profile:', studentProfiles[profileIndex]);
      // Deep copy to prevent mutation of original data
      return Promise.resolve(JSON.parse(JSON.stringify(studentProfiles[profileIndex])));
  }
  return Promise.resolve(undefined);
}


export async function getStudentProfilesByDepartment(department: string): Promise<StudentProfile[]> {
    if (!department) {
        return Promise.resolve(JSON.parse(JSON.stringify(studentProfiles)));
    }
    const profiles = studentProfiles.filter(s => s.department === department);
    return Promise.resolve(JSON.parse(JSON.stringify(profiles)));
}

// APPROVALS API
export async function getPendingApprovals(department: string): Promise<StudentProfile[]> {
    // Mock: first 3 students from user's department need approval
    return Promise.resolve(
        studentProfiles
            .filter((s) => s.department === department)
            .slice(0, 3)
            .map((s) => ({ ...s, status: "Pending" })) // status is not part of original model, but is used in component
    );
}

export async function approveStudent(studentId: string): Promise<{success: boolean}> {
    console.log(`Student ${studentId} approved`);
    return Promise.resolve({ success: true });
}

export async function rejectStudent(studentId: string): Promise<{success: boolean}> {
    console.log(`Student ${studentId} rejected`);
    return Promise.resolve({ success: true });
}


// DRIVES API
export async function getDrives(): Promise<Drive[]> {
  return Promise.resolve(JSON.parse(JSON.stringify(drives)));
}

export async function getDriveById(id: string): Promise<Drive | undefined> {
    const drive = drives.find(d => d.id === id);
    return Promise.resolve(drive ? JSON.parse(JSON.stringify(drive)) : undefined);
}

export async function createDrive(driveData: CreateDrive): Promise<Drive> {
    const newDrive: Drive = {
        id: `drive-${Date.now()}`,
        ...driveData,
        status: 'upcoming',
        applications: [],
    };
    drives.push(newDrive);
    return Promise.resolve(JSON.parse(JSON.stringify(newDrive)));
}


// COMPANIES API
export async function getCompanies(): Promise<Company[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(companies)));
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
    const company = companies.find(c => c.id === id);
    return Promise.resolve(company ? JSON.parse(JSON.stringify(company)) : undefined);
}

export async function createCompany(companyData: Omit<Company, 'id' | 'logoUrl'>): Promise<Company> {
    const newCompany: Company = {
        id: `comp-${Date.now()}`,
        logoUrl: `/logos/placeholder.svg`,
        ...companyData
    };
    companies.push(newCompany);
    return Promise.resolve(JSON.parse(JSON.stringify(newCompany)));
}


// APPLICATIONS API
export async function getApplications(): Promise<Application[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(applications)));
}

export async function getApplicationsByStudentId(studentId: string): Promise<Application[]> {
    const studentApps = applications.filter(a => a.studentId === studentId);
    return Promise.resolve(JSON.parse(JSON.stringify(studentApps)));
}

export async function getApplicationsByDriveId(driveId: string): Promise<Application[]> {
    const driveApps = applications.filter(a => a.driveId === driveId);
    return Promise.resolve(JSON.parse(JSON.stringify(driveApps)));
}

export async function createApplication(studentId: string, driveId: string, coverLetter: string): Promise<Application> {
    const drive = await getDriveById(driveId);
    if (!drive) {
        throw new Error("Drive not found");
    }
    const newApplication: Application = {
        id: `app-${Date.now()}`,
        studentId,
        driveId,
        status: drive.stages[0] || 'Applied',
        statusUpdates: [{ status: drive.stages[0] || "Applied", date: new Date().toISOString() }],
        resumeUrl: '', // This would be handled by file upload logic
        appliedDate: new Date().toISOString(),
        coverLetter,
    };
    applications.push(newApplication);
    
    // Also add student to drive applications list
    const driveIndex = drives.findIndex(d => d.id === driveId);
    if (driveIndex !== -1) {
        drives[driveIndex].applications.push(studentId);
    }
    
    return Promise.resolve(JSON.parse(JSON.stringify(newApplication)));
}

// REPORTS API
export async function getOffersByCompany(): Promise<{ name: string; count: number }[]> {
    const companyList = await getCompanies();
    const driveList = await getDrives();
    const applicationList = await getApplications();

    return Promise.resolve(companyList.map(company => {
        const companyDrives = driveList.filter(d => d.companyId === company.id).map(d => d.id);
        const offerCount = applicationList.filter(app => companyDrives.includes(app.driveId) && app.status.toLowerCase() === 'offered').length;
        return { name: company.name, count: offerCount };
      }).filter(c => c.count > 0));
}

export async function getOffersByDepartment(department?: string): Promise<{ name: string; count: number }[]> {
    // This is a simplification. In a real app, you'd link students to departments.
    const departments = department ? [department] : ["Computer Science", "Electronics", "Mechanical"];
    return Promise.resolve(departments.map(dept => {
        const deptOffers = Math.floor(Math.random() * 30) + 5;
        return { name: dept, count: deptOffers };
    }));
}


// VERIFICATION API
export async function getUnverifiedProfiles(department?: string): Promise<StudentProfile[]> {
    const allProfiles = department ? studentProfiles.filter(s => s.department === department) : studentProfiles;
    const unverifiedProfiles = allProfiles.filter(p =>
        p.education.some(e => !e.verified) || 
        p.experience.some(e => !e.verified) ||
        p.certifications.some(c => !c.verified)
    );
    return Promise.resolve(JSON.parse(JSON.stringify(unverifiedProfiles)));
}

export async function verifyEducationItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    const profile = studentProfiles.find(p => p.studentId === studentId);
    if (profile) {
        const item = profile.education.find(e => e.id === itemId);
        if (item) {
            item.verified = true;
            return Promise.resolve({ success: true });
        }
    }
    return Promise.resolve({ success: false });
}

export async function verifyExperienceItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    const profile = studentProfiles.find(p => p.studentId === studentId);
    if (profile) {
        const item = profile.experience.find(e => e.id === itemId);
        if (item) {
            item.verified = true;
            return Promise.resolve({ success: true });
        }
    }
    return Promise.resolve({ success: false });
}

export async function verifyCertificationItem(studentId: string, itemId: string): Promise<{ success: boolean }> {
    const profile = studentProfiles.find(p => p.studentId === studentId);
    if (profile) {
        const item = profile.certifications.find(c => c.id === itemId);
        if (item) {
            item.verified = true;
            return Promise.resolve({ success: true });
        }
    }
    return Promise.resolve({ success: false });
}
