import { configDotenv } from "dotenv";
configDotenv();
import { ROLES } from "@components/user/constants";
import AppDataSource from "@config/db"; // Replace with your actual DataSource file
import User from "@components/user/user.model";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
  await AppDataSource.initialize(); // Initialize TypeORM connection
  console.log("Data Source has been initialized!");

  // Check if admin already exists
  const existingAdmin = await User.findOneBy({
    username: "admin",
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Skipping seeding.");
  } else {
    // Create a new admin user
    const adminUser = new User({
      email: "admin",
      username: "admin",
      password: "admin",
      role: ROLES.Admin,
      height: 180,
      age: 20,
    });

    await adminUser.save();
    console.log("Admin user has been seeded!");
  }

  await AppDataSource.destroy(); // Close the database connection
};

seedDatabase().catch((error) => {
  console.error("Error during seeding:", error);
});
