/**
 * Client service to communicate with the local Python System OS Mouse bridge over WebSocket.
 */

class SystemMouseBridgeService {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectTimer: number | null = null;
  private listeners: ((connected: boolean) => void)[] = [];

  constructor() {
    this.connect();
  }

  public connect(): void {
    if (typeof window === 'undefined') return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket('ws://127.0.0.1:8765');

      this.ws.onopen = () => {
        this.isConnected = true;
        this.notifyListeners();
        console.log('🟢 [AirDraw AI] Connected to System OS Mouse Bridge on 127.0.0.1:8765');
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyListeners();
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.notifyListeners();
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer === null) {
      this.reconnectTimer = window.setTimeout(() => {
        this.reconnectTimer = null;
        this.connect();
      }, 2000);
    }
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.isConnected);
      } catch {}
    }
  }

  public subscribe(callback: (connected: boolean) => void): () => void {
    this.listeners.push(callback);
    callback(this.isConnected);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  private send(payload: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  public sendMove(normX: number, normY: number): void {
    this.send({ type: 'MOVE', x: normX, y: normY });
  }

  public sendLeftClick(): void {
    this.send({ type: 'LEFT_CLICK' });
  }

  public sendDoubleClick(): void {
    this.send({ type: 'DOUBLE_CLICK' });
  }

  public sendRightClick(): void {
    this.send({ type: 'RIGHT_CLICK' });
  }

  public sendMouseDown(): void {
    this.send({ type: 'MOUSE_DOWN' });
  }

  public sendMouseUp(): void {
    this.send({ type: 'MOUSE_UP' });
  }

  public sendScroll(delta: number): void {
    this.send({ type: 'SCROLL', delta });
  }

  public sendSwitchTabNext(): void {
    this.send({ type: 'SWITCH_TAB_NEXT' });
  }

  public sendSwitchTabPrev(): void {
    this.send({ type: 'SWITCH_TAB_PREV' });
  }

  public sendSwitchApp(): void {
    this.send({ type: 'SWITCH_APP' });
  }
}

export const systemMouseBridge = new SystemMouseBridgeService();
