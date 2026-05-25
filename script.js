import {prisma} from "./lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123!",
      phoneNumber: "123-456-7890",
      isVerified: true,
      role: "ADMIN",
    }
   
  });
  console.log("Created user:", user);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
  
  
}

main()
  .then(async() => { 
    await prisma.$disconnect();
    })
