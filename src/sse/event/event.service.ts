import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  // 다른 모듈에서 호출하여 이벤트를 발생시킵니다.
  triggerEvent(id: number, message: string) {
    this.eventEmitter.emit('triggerEvent', id, message);
  }
}
