import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { level } from 'winston';

@Injectable()
export class TestService {
  create(createTestDto: CreateTestDto) {
    
    return 'This action adds a new test';
  }

  findAll() {
    const data  = {
      name: "Malhada enchentes api",
      version: "1.0.0",
      level: 2.5
    }
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
