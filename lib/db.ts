import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
    errorFormat: "pretty",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function testConnection() {
  try {
    console.log("[v0] Testing database connection...")
    console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)
    console.log("[v0] DATABASE_URL preview:", process.env.DATABASE_URL?.substring(0, 30) + "...")

    await prisma.$connect()
    console.log("[v0] ✅ Prisma $connect successful")

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log("[v0] ✅ Test query successful:", result)

    return true
  } catch (error) {
    console.error("[v0] ❌ Database connection failed:")
    console.error("[v0] Error name:", error.name)
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error code:", error.code)
    return false
  }
}
