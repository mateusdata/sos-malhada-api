import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateWaterLevelDto } from './dto/create-water-level.dto';
import { WaterLevelService } from './water-level.service';

@Controller('water-level')
export class WaterLevelController {
  constructor(private readonly waterLevelService: WaterLevelService) {}

  @Post()
  create(@Body() createWaterLevelDto: CreateWaterLevelDto) {
    return this.waterLevelService.create(createWaterLevelDto);
  }

  @Get()
  findAll() {
    return this.waterLevelService.findAll();
  }

  @Get('history')
  findHistory(@Query('limit') limit?: string) {
    return this.waterLevelService.findHistory(limit ? parseInt(limit) : 10);
  }
}