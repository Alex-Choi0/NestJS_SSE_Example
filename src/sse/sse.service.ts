import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private clients = new Map<number, Subject<string>>(); // id별로 SSE 연결을 저장

  constructor(private eventEmitter: EventEmitter2) {
    // 다른 모듈에서 이벤트가 발생했을 때 수신
    this.eventEmitter.on('event.trigger', (payload) => {
      const { id, message } = payload;
      this.sendEventToClient(id, message); // 해당 id의 클라이언트에 이벤트 푸시
    });
  }

  // 클라이언트를 SSE에 등록
  registerClient(id: number): Subject<string> {
    const clientStream = new Subject<string>();
    this.clients.set(id, clientStream);
    return clientStream;
  }

  // 해당 id의 클라이언트에게 이벤트 푸시
  sendEventToClient(id: number, message: string) {
    const clientStream = this.clients.get(id);
    if (clientStream) {
      clientStream.next(message); // 이벤트 푸시
    }
  }

  // 클라이언트를 해제
  removeClient(id: number) {
    this.clients.delete(id);
  }
}
