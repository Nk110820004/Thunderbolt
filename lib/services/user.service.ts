import { prisma } from "../db"

export type CreateUserData = {
  username: string
  phoneNumber: string
  email: string
  level?: number
  starScore?: number
  gems?: number
  penaltyBar?: number
}

export type UpdateUserData = Partial<Omit<CreateUserData, "username" | "phoneNumber" | "email">>

export class UserService {
  static async createUser(data: CreateUserData) {
    return await prisma.user.create({
      data,
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
    })
  }

  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
    })
  }

  static async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
    })
  }

  static async updateUser(id: number, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
    })
  }

  static async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    })
  }

  static async getAllUsers(skip?: number, take?: number) {
    return await prisma.user.findMany({
      skip,
      take,
      include: {
        profile: true,
        settings: true,
        userAdventures: {
          include: {
            adventure: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  static async updateUserScore(id: number, starScore: number) {
    return await prisma.user.update({
      where: { id },
      data: { starScore },
    })
  }

  static async updateUserGems(id: number, gems: number) {
    return await prisma.user.update({
      where: { id },
      data: { gems },
    })
  }

  static async updateUserLevel(id: number, level: number) {
    return await prisma.user.update({
      where: { id },
      data: { level },
    })
  }
}
