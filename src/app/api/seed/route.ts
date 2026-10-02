import { NextResponse } from "next/server";
import { FirestoreService } from "@/lib/firestore";

export async function GET() {
  try {
    const seedUsers = [
      {
        uid: "seed-trainer-1",
        email: "amit.sharma@imd.gov.in",
        displayName: "Dr. Amit Sharma",
        role: "trainer" as const,
        status: "approved" as const,
        emailVerified: true,
        department: "Satellite Meteorology Division",
        designation: "Senior Scientist 'F'",
        location: "New Delhi",
        qualifications: [],
        experience: [],
        skills: ["Satellite Imagery", "Remote Sensing"],
        interests: [],
        certificates: [],
        createdAt: new Date().toISOString(),
      },
      {
        uid: "seed-trainer-2",
        email: "priya.nair@moes.gov.in",
        displayName: "Dr. Priya Nair",
        role: "trainer" as const,
        status: "approved" as const,
        emailVerified: true,
        department: "Climate Research Lab",
        designation: "Lead Instructor",
        location: "Pune",
        qualifications: [],
        experience: [],
        skills: ["Climatology", "Data Modeling"],
        interests: [],
        certificates: [],
        createdAt: new Date().toISOString(),
      },
      {
        uid: "seed-trainee-1",
        email: "rahul.verma@imd.gov.in",
        displayName: "Rahul Verma",
        role: "trainee" as const,
        status: "approved" as const,
        emailVerified: true,
        department: "Aviation Services",
        designation: "Scientific Assistant",
        location: "Mumbai",
        qualifications: [],
        experience: [],
        skills: ["Aviation Weather"],
        interests: [],
        certificates: [],
        createdAt: new Date().toISOString(),
      },
      {
        uid: "seed-trainee-2",
        email: "sneha.patil@imd.gov.in",
        displayName: "Sneha Patil",
        role: "trainee" as const,
        status: "approved" as const,
        emailVerified: true,
        department: "Agromet Division",
        designation: "Field Officer",
        location: "Nagpur",
        qualifications: [],
        experience: [],
        skills: ["Agriculture forecasting"],
        interests: [],
        certificates: [],
        createdAt: new Date().toISOString(),
      }
    ];

    for (const user of seedUsers) {
      await FirestoreService.saveUser(user);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Successfully seeded 2 trainers and 2 trainees directly into Firestore!" 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
