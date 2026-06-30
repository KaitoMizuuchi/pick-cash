import { Controller, Get } from "@nestjs/common";
import { BffPracticeService } from "./bff-practice.service";

@Controller("bff-practice")
export class BffPracticeController {
  constructor(private readonly service: BffPracticeService) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { data };
  }
}
