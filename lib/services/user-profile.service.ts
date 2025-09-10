import { prisma } from "../db"

export type CreateUserProfileData = {
  userId: number
  displayName?: string
  avatarUrl?: string
  bio?: string
}

export type UpdateUserProfileData = Partial<Omit<CreateUserProfileData, "userId">>

export class UserProfileService {
  static async createUserProfile(data: CreateUserProfileData) {
    return await prisma.userProfile.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            level: true,
            starScore: true,
          },
        },
      },
    })
  }

  static async getUserProfileById(id: number) {
    return await prisma.userProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            level: true,
            starScore: true,
          },
        },
      },
    })
  }

  static async getUserProfileByUserId(userId: number) {
    return await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            level: true,
            starScore: true,
          },
        },
      },
    })
  }

  static async updateUserProfile(userId: number, data: UpdateUserProfileData) {
    return await prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            level: true,
            starScore: true,
          },
        },
      },
    })
  }

  static async deleteUserProfile(userId: number) {
    return await prisma.userProfile.delete({
      where: { userId },
    })
  }

  static async updateAvatar(userId: number, avatarUrl: string) {
    return await this.updateUserProfile(userId, { avatarUrl })
  }

  static async updateDisplayName(userId: number, displayName: string) {
    return await this.updateUserProfile(userId, { displayName })
  }

  static async updateBio(userId: number, bio: string) {
    return await this.updateUserProfile(userId, { bio })
  }
}
