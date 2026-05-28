export const userRoles = ["student", "teacher", "admin"];
export const defaultUserRole = "student";
export const betterAuthPrismaSchema = String.raw `
enum Role {
  student
  teacher
  admin
}

model User {
  id            String    @id
  name          String
  email         String    @unique(map: "user_email_key")
  emailVerified Boolean   @default(false)
  image         String?
  role          Role      @default(student)
  imageCldPubId String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions Session[]
  accounts Account[]

  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique(map: "session_token_key")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId], map: "session_userId_idx")
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId], map: "account_userId_idx")
  @@unique([providerId, accountId], map: "account_providerId_accountId_key")
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier], map: "verification_identifier_idx")
  @@unique([identifier, value], map: "verification_identifier_value_key")
  @@map("verification")
}
`;
//# sourceMappingURL=authControllers.js.map