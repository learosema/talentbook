export class ApiException extends Error {
  name: string;
  code: number;
  details: any;
  constructor(code: number, message?: any, details?: any) {
    super(`${code}: ${message}`);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
    this.name = 'ApiException';
    this.code = code;
    this.details = details;
  }
}

enum RequestState {
  IDLE = 'idle',
  ABORTED = 'aborted',
  PENDING = 'pending',
  READY = 'ready',
  ERROR = 'error'
}

/**
 * Ajax class
 *
 * This is a helper class around the fetch API.
 * It creates an AbortController alongisde with the request.
 * Also, it keeps track of the request state and throws an ApiException on HTTP status code !== 200
 *
 */
export class Ajax<T = any> {
  promise: Promise<Response> | null;
  abortController: AbortController | null;

  info: RequestInfo;
  init: RequestInit;

  state: RequestState;

  /**
   * Ajax constructor. Takes the same arguments as fetch()
   * @param info
   * @param init
   */
  constructor(info: RequestInfo, init?: RequestInit) {
    this.abortController = new AbortController();
    this.init = { ...(init || {}), signal: this.abortController.signal };
    this.info = info;
    this.state = RequestState.IDLE;
    this.promise = null;
  }

  /**
   * Send API request.
   *
   * @returns {any} json data (await (await fetch()).json())
   * @throws {ApiException} exception if http response status code is not 2xx
   *
   */
  async send(): Promise<T> {
    this.state = RequestState.PENDING;
    try {
      this.promise = fetch(this.info, this.init);
      const response = await this.promise;
      const json = await response.json();
      if (!response.ok) {
        throw new ApiException(response.status, json.error, json.details);
      }
      this.state = RequestState.READY;
      return json;
    } catch (ex) {
      this.state = RequestState.ERROR;
      throw ex;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Cancel the request.
   */
  abort(): void {
    if (this.abortController) {
      this.state = RequestState.ABORTED;
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
