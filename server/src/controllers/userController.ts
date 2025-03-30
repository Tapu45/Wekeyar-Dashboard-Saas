import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { CustomRequest } from "../authMiddleware";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  // Validate input
  if (!username || !email || !password || !role) {
   res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role, // e.g., "report-access"
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    if ((error as any).code === "P2002") {
      // Handle unique constraint violation (e.g., duplicate email or username)
     res.status(409).json({ error: "Username or email already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getOrganizationDetails = async (req: CustomRequest, res: Response): Promise<void> => {
  const { tenantId } = req.user!; // Use the extended `user` property

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        name: true,
        logo: true,
        employeeSize: true,
        numberOfStores: true,
        mainOfficeAddress: true,
      },
    });

    if (!tenant) {
     res.status(404).json({ error: "Organization not found" });
      return;
    }

    res.status(200).json(tenant);
  } catch (error) {
    console.error("Error fetching organization details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};