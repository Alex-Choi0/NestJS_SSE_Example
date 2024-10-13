import { Module } from '@nestjs/common';
import { EventService } from './event/event.service';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  controllers: [SseController],
  providers: [SseService, EventService],
  exports: [SseService, EventService],
})
export class SseModule {}
