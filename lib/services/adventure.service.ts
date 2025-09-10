import { prisma } from "../db"

export type CreateAdventureData = {
  name: string
  description?: string
}

export type UpdateAdventureData = Partial<CreateAdventureData>

export class AdventureService {
  static async createAdventure(data: CreateAdventureData) {
    return await prisma.adventure.create({
      data,
      include: {
        userAdventures: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  static async getAdventureById(id: number) {
    return await prisma.adventure.findUnique({
      where: { id },
      include: {
        userAdventures: {
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
        },
      },
    })
  }

  static async getAllAdventures(skip?: number, take?: number) {
    return await prisma.adventure.findMany({
      skip,
      take,
      include: {
        userAdventures: {
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
        },
      },
      orderBy: {
        name: "asc",
      },
    })
  }

  static async updateAdventure(id: number, data: UpdateAdventureData) {
    return await prisma.adventure.update({
      where: { id },
      data,
      include: {
        userAdventures: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  static async deleteAdventure(id: number) {
    return await prisma.adventure.delete({
      where: { id },
    })
  }

  static async getAdventuresByName(name: string) {
    return await prisma.adventure.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        userAdventures: {
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
        },
      },
    })
  }
}
