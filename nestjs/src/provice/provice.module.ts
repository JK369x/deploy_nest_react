import { Module } from '@nestjs/common';
import { ProviceService } from './provice.service';
import { ProviceController } from './provice.controller';

@Module({
  providers: [ProviceService],
  controllers: [ProviceController],
  // exports: [ProviceService]
})
export class ProviceModule { }
