import { Module } from "@nestjs/common";
import { BffPracticeController } from "./bff-practice.controller";
import { BffPracticeService } from "./bff-practice.service";
import { BffPracticeRepository } from "./bff-practice.repository";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [BffPracticeController],
  providers: [BffPracticeService, BffPracticeRepository],
})
export class BffPracticeModule {}
