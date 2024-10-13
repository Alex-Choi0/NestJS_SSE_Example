import { Inject, Injectable } from '@nestjs/common';
import { EventService } from 'src/sse/event/event.service';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class CardService {
  constructor(
    @Inject(SseService)
    private readonly sseService: SseService,

    private readonly eventService: EventService,
  ) {}

  triggerSomeEvent(id: number, message: string = 'test') {
    this.eventService.triggerEvent(id, message);
  }

  async changeUser(id: number) {
    // 카드 업데이트시 이벤트 발생
    // this.sseService.emitCardChangeEvent(id);
    this.sseService.sendEventToClient(id, `${id} send message`);

    return {
      message: `${id}번 카드의 SSE push.`,
    };
  }
}
