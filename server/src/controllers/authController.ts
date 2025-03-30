import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";


export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Check for the user in the database
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    console.log("User found:", user);
    

    // Generate a token with user details
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId, // Include tenantId for multi-tenancy
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"

  if (!token) {
    res.status(403).json({ error: "Unauthorized access" });
  } else {
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
      (req as any).user = decoded; // Attach user data to the request object
      next(); // Proceed to the next middleware/route
    } catch (err) {
      res.status(403).json({ error: "Invalid or expired token" });
    }
  }
};

export const logout = (_req: Request, res: Response) => {
  // Since JWTs are stateless, logout is handled on the client side by deleting the token
  res.json({ message: "Logout successful" });
};

export const checkAuth = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.json({ authenticated: false });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
      res.json({ authenticated: true, role: decoded.role }); // Include role in the response
    } catch (err) {
      res.json({ authenticated: false });
    }
  }
};

export const signupOrganization = async (req: Request, res: Response): Promise<void> => {
  const { organizationName, email, username, password } = req.body;

  try {
    // Check if the organization or email already exists
    const existingTenant = await prisma.tenant.findUnique({ where: { email } });
    if (existingTenant) {
      res.status(400).json({ error: "Organization with this email already exists." });
      return;
    }

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists." });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the tenant and admin user
    const tenant = await prisma.tenant.create({
      data: {
        name: organizationName,
        email,
        users: {
          create: {
            username,
            email,
            password: hashedPassword,
            role: "admin",
          },
        },
      },
    });

    res.status(201).json({ message: "Organization created successfully", tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
