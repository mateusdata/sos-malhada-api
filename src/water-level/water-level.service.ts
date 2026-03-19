import { Injectable } from '@nestjs/common';
import { CreateWaterLevelDto } from './dto/create-water-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

@Injectable()
export class WaterLevelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly WebsocketsGateway: WebsocketsGateway,
  ) {}

  async create(createWaterLevelDto: CreateWaterLevelDto) {
    
    const waterLevel = await this.prisma.waterLevel.create({
      data: {
        level: createWaterLevelDto.level,
        location: createWaterLevelDto.location,
      },
    });

    await this.WebsocketsGateway.findAll();
    return waterLevel;
  }

  async findAll() {
    
    const waterLevel = await this.prisma.waterLevel.findFirst({
      orderBy: { recordedAt: 'desc' },
    });
    await this.WebsocketsGateway.findAll();
    return waterLevel;
  }

  async findHistory(limit = 10) {
    const history = await this.prisma.waterLevel.findMany({
      orderBy: { recordedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        level: true,
        location: true,
        recordedAt: true,
      },
    });
    return history;
  }
}