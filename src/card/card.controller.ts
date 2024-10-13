import { Controller, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('send/:id/:message')
  create(@Param('id') id: number, @Param('message') message = 'testing') {
    return this.cardService.triggerSomeEvent(id, message);
  }
}
