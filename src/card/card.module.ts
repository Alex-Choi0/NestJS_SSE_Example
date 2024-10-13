import { Module } from '@nestjs/common';
import { SseModule } from 'src/sse/sse.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [SseModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
