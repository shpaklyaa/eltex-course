import { EwsEvents } from './ws-event.enum';

export type ConnectWsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface SubscriptionRequest {
  event: 'subscribe-all' | 'subscribe-article' | 'unsubscribe-article';
  data: string | null;
}

export interface WebSocketMessage {
  event: string;
  payload?: unknown;
  data?: unknown;
}