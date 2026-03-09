import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, password, name, email, role } = await req.json();

        if (!username || !password || !name || !email || !role) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (!['VASP', 'REGULATOR'].includes(role)) {
             return NextResponse.json(
                { message: "Invalid role" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { message: "Username is already taken" },
                { status: 409 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            passwordHash,
            name,
            email,
            role,
        });

        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
