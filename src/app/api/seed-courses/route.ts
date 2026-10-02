import { NextResponse } from "next/server";
import { FirestoreService } from "@/lib/firestore";
import { Course } from "@/types";

export async function GET() {
  try {
    const trainer1 = { id: "seed-trainer-1", name: "Dr. Amit Sharma" };
    const trainer2 = { id: "seed-trainer-2", name: "Dr. Priya Nair" };

    const seedCourses = [
      {
        title: "Advanced Data Science & Machine Learning",
        domain: "Data Science",
        description: "A comprehensive deep dive into statistical modeling, predictive analytics, and end-to-end machine learning pipelines using Python and TensorFlow. Includes real-world dataset projects.",
        trainerId: trainer1.id,
        trainerName: trainer1.name,
        durationWeeks: 12,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "Full-Stack Web Development BootCamp",
        domain: "Software Engineering",
        description: "Master modern web development from ground up. Learn React, Next.js, Node.js, and Cloud Databases. Build responsive, accessible, and high-performance web applications.",
        trainerId: trainer2.id,
        trainerName: trainer2.name,
        durationWeeks: 10,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "Embedded Systems Engineering",
        domain: "Hardware Engineering",
        description: "Learn microcontroller programming, RTOS fundamentals, hardware-software interfacing, and IoT architecture. Hands-on labs with ARM Cortex-M architecture.",
        trainerId: trainer1.id,
        trainerName: trainer1.name,
        durationWeeks: 8,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "VLSI Design & Architecture",
        domain: "Hardware Engineering",
        description: "Detailed curriculum covering digital logic design, Verilog/VHDL, ASIC design flow, timing analysis, and physical design concepts for modern silicon chips.",
        trainerId: trainer2.id,
        trainerName: trainer2.name,
        durationWeeks: 14,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "Artificial Intelligence Engineering",
        domain: "Artificial Intelligence",
        description: "Deep learning architectures, neural networks, computer vision, and NLP. Train and deploy models at scale using modern cloud infrastructure.",
        trainerId: trainer1.id,
        trainerName: trainer1.name,
        durationWeeks: 12,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "Mastering Prompt Engineering & LLMs",
        domain: "Artificial Intelligence",
        description: "Learn advanced techniques for interacting with Large Language Models. Topics include few-shot prompting, chain-of-thought, RAG (Retrieval-Augmented Generation), and Agentic AI workflows.",
        trainerId: trainer2.id,
        trainerName: trainer2.name,
        durationWeeks: 6,
        enrolledTraineeIds: [],
        createdAt: new Date().toISOString()
      }
    ];

    for (const course of seedCourses) {
      await FirestoreService.addCourse(course);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Successfully seeded 6 detailed courses into Firestore!" 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
