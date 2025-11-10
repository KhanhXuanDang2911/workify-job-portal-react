declare module "sockjs-client" {
  interface SockJSOptions {
    server?: string;
    sessionId?: number | () => number;
    transports?: string | string[];
    timeout?: number;
    devel?: boolean;
    debug?: boolean;
    protocol_whitelist?: string[];
    jsessionid?: string;
    [key: string]: any;
  }

  class SockJS {
    constructor(url: string, protocols?: string | string[] | null, options?: SockJSOptions);
    url: string;
    protocol: string;
    readyState: number;
    extensions: string;
    onopen: ((event: Event) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    send(data: string | ArrayBuffer | Blob): void;
    close(code?: number, reason?: string): void;
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSING: number;
    static readonly CLOSED: number;
  }

  export = SockJS;
}

