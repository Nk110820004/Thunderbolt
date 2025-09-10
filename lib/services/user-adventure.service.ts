import { prisma } from "../db"

export type CreateUserAdventureData = {
  userId: number
  adventureId: number
  status?: string
}

export type UpdateUserAdventureData = {
  status?: string
  completedAt?: Date | null
}

export class UserAdventureService {
  static async createUserAdventure(data: CreateUserAdventureData) {
    return await prisma.userAdventure.create({
      data,
      include: {
        user: true,
        adventure: true,
      },
    })
  }

  static async getUserAdventureById(id: number) {
    return await prisma.userAdventure.findUnique({
      where: { id },
      include: {
        user: true,
        adventure: true,
      },
    })
  }

  static async getUserAdventuresByUserId(userId: number) {
    return await prisma.userAdventure.findMany({
      where: { userId },
      include: {
        adventure: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    })
  }

  static async getUserAdventuresByAdventureId(adventureId: number) {
    return await prisma.userAdventure.findMany({
      where: { adventureId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            level: true,
            starScore: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    })
  }

  static async updateUserAdventure(id: number, data: UpdateUserAdventureData) {
    return await prisma.userAdventure.update({
      where: { id },
      data,
      include: {
        user: true,
        adventure: true,
      },
    })
  }

  static async completeUserAdventure(id: number) {
    return await prisma.userAdventure.update({
      where: { id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
      include: {
        user: true,
        adventure: true,
      },
    })
  }

  static async deleteUserAdventure(id: number) {
    return await prisma.userAdventure.delete({
      where: { id },
    })
  }

  static async getUserAdventuresByStatus(userId: number, status: string) {
    return await prisma.userAdventure.findMany({
      where: {
        userId,
        status,
      },
      include: {
        adventure: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    })
  }

  static async getCompletedAdventures(userId: number) {
    return await this.getUserAdventuresByStatus(userId, "completed")
  }

  static async getInProgressAdventures(userId: number) {
    return await this.getUserAdventuresByStatus(userId, "in-progress")
  }
}
