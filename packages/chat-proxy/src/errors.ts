export interface StreamErrorOptions {
  cause?: unknown
  /** 사용자에게 그대로 보여줘도 되는 설명. 없으면 message를 씁니다. */
  detail?: string
}

/**
 * 이 패키지의 모든 에러의 뿌리.
 *
 * 번들러/HMR을 거치면 클래스 identity가 갈라져 instanceof가 거짓이 되는 경우가 있어
 * `name`을 함께 비교할 수 있도록 정적 `is` 헬퍼를 둡니다.
 */
export class StreamError extends Error {
  readonly detail?: string

  constructor(message: string, options: StreamErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = new.target.name
    this.detail = options.detail
  }

  static is(value: unknown): value is StreamError {
    return value instanceof Error && value.name.endsWith('Error')
  }
}

/** 인증 자체가 실패했거나 자격증명이 유효하지 않음. */
export class AuthError extends StreamError {}

export interface RateLimitErrorOptions extends StreamErrorOptions {
  retryAfterMs?: number
}

/** 429. 플랫폼이 수치 쿼터를 공개하지 않으므로 백오프로만 대응합니다. */
export class RateLimitError extends StreamError {
  readonly retryAfterMs?: number

  constructor(message: string, options: RateLimitErrorOptions = {}) {
    super(message, options)
    this.retryAfterMs = options.retryAfterMs
  }
}

export interface ProviderErrorOptions extends StreamErrorOptions {
  status?: number
  code?: string | number
  body?: unknown
  url?: string
}

/** SOOP이 에러 응답을 준 경우. */
export class ProviderError extends StreamError {
  readonly status?: number
  readonly code?: string | number
  readonly body?: unknown
  readonly url?: string

  constructor(message: string, options: ProviderErrorOptions = {}) {
    super(message, options)
    this.status = options.status
    this.code = options.code
    this.body = options.body
    this.url = options.url
  }
}

/** 네트워크 실패 또는 타임아웃. */
export class NetworkError extends StreamError {}

export interface SchemaErrorOptions extends StreamErrorOptions {
  issues?: unknown
  received?: unknown
}

/**
 * 응답이 기대한 모양이 아님.
 *
 * 비공식 API에서 이 에러가 나면 대개 상대 API가 예고 없이 바뀐 것입니다.
 */
export class SchemaError extends StreamError {
  readonly issues?: unknown
  readonly received?: unknown

  constructor(message: string, options: SchemaErrorOptions = {}) {
    super(message, options)
    this.issues = options.issues
    this.received = options.received
  }
}

/** 채팅 연결 관련 실패. */
export class ChatConnectionError extends StreamError {}
