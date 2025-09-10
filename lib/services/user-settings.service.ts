import { prisma } from "../db"
import type { Prisma } from "@prisma/client"

export type CreateUserSettingsData = {
  userId: number
  settings?: Prisma.JsonValue
}

export type UpdateUserSettingsData = {
  settings: Prisma.JsonValue
}

export class UserSettingsService {
  static async createUserSettings(data: CreateUserSettingsData) {
    return await prisma.userSettings.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })
  }

  static async getUserSettingsById(id: number) {
    return await prisma.userSettings.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })
  }

  static async getUserSettingsByUserId(userId: number) {
    return await prisma.userSettings.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })
  }

  static async updateUserSettings(userId: number, data: UpdateUserSettingsData) {
    return await prisma.userSettings.upsert({
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
          },
        },
      },
    })
  }

  static async deleteUserSettings(userId: number) {
    return await prisma.userSettings.delete({
      where: { userId },
    })
  }

  static async updateSetting(userId: number, key: string, value: any) {
    const currentSettings = await this.getUserSettingsByUserId(userId)
    const settings = (currentSettings?.settings as Record<string, any>) || {}

    settings[key] = value

    return await this.updateUserSettings(userId, { settings })
  }

  static async getSetting(userId: number, key: string) {
    const userSettings = await this.getUserSettingsByUserId(userId)
    const settings = (userSettings?.settings as Record<string, any>) || {}

    return settings[key]
  }

  static async deleteSetting(userId: number, key: string) {
    const currentSettings = await this.getUserSettingsByUserId(userId)
    const settings = (currentSettings?.settings as Record<string, any>) || {}

    delete settings[key]

    return await this.updateUserSettings(userId, { settings })
  }
}
