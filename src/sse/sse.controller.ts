import { Controller, Get, MessageEvent, Param, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject, takeUntil, timer } from 'rxjs';

@Controller('sse')
export class SseController {
  // Subject를 통해 id별로 클라이언트 스트림을 관리합니다.
  private clients: Map<number, Subject<MessageEvent>> = new Map();

  constructor(private readonly eventEmitter: EventEmitter2) {
    // 이벤트가 발생할 때 특정 id로 메시지를 푸시합니다.
    this.eventEmitter.on('triggerEvent', (id: number, message: string) => {
      const clientStream = this.clients.get(id);
      if (clientStream) {
        clientStream.next({ data: message });
      }
    });
  }

  // 클라이언트가 특정 id로 SSE를 시작합니다.
  @Sse(':id')
  handleSse(@Param('id') id: number): Observable<MessageEvent> {
    const stream$ = new Subject<MessageEvent>();
    this.clients.set(id, stream$); // 클라이언트 연결 저장

    // 일정 시간이 지나면 연결 종료 (예: 30초)
    const timeout$ = timer(30000); // 30초 타임아웃
    const observable$ = stream$.pipe(
      takeUntil(timeout$), // 타임아웃이 되면 스트림 종료
    );

    timeout$.subscribe(() => {
      console.log(`Connection with id ${id} closed due to timeout.`);
      stream$.complete();
      this.clients.delete(id); // 연결 종료 후 클라이언트 제거
    });

    return observable$;
  }

  // 클라이언트 연결 종료 시 id 제거
  @Get('close/:id')
  closeSse(@Param('id') id: number) {
    const clientStream = this.clients.get(id);
    if (clientStream) {
      clientStream.complete();
      this.clients.delete(id); // 연결이 종료되면 제거
    }
    return { message: `SSE connection for id ${id} closed.` };
  }
}
