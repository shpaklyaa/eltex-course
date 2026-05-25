import { InjectionToken } from '@angular/core';
import { IWebsocketConnectService } from './websocket-connect.service.interface'

export const WEB_SOCKET_SERVICE = new InjectionToken<IWebsocketConnectService>('IWebsocketConnectService');