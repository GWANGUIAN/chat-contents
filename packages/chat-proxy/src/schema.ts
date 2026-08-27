import { type ZodType, z } from 'zod'
import { SchemaError } from './errors'

export interface ParseContext {
  /** 에러 메시지에 들어갈 라벨. 어느 응답이 깨졌는지 바로 알 수 있게 합니다. */
  label: string
}

/**
 * zod 파싱 결과를 SchemaError로 정규화합니다.
 *
 * 비공식 API는 예고 없이 필드가 바뀌므로, 여기서 실패하면 대개 우리 코드가 아니라
 * 상대 API가 변한 것입니다. 그 판단이 바로 서도록 원본 값을 함께 담습니다.
 */
export function parseWith<T>(schema: ZodType<T>, data: unknown, context: ParseContext): T {
  const result = schema.safeParse(data)
  if (result.success) return result.data

  throw new SchemaError(
    `${context.label} 응답 형식이 예상과 다릅니다: ${summarize(result.error)}`,
    {
      issues: result.error.issues,
      received: data,
      detail:
        'SOOP 비공식 API가 변경되었을 수 있습니다. packages/chat-proxy/src/soop/schema.ts를 확인하세요.',
    },
  )
}

function summarize(error: z.ZodError): string {
  return error.issues
    .slice(0, 3)
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join(', ')
}

/**
 * 숫자로 오기도 하고 문자열로 오기도 하는 필드용.
 * SOOP `CHPT`는 항상 문자열입니다.
 */
export const numeric = z.union([z.number(), z.string()]).transform((value, ctx) => {
  const parsed = typeof value === 'number' ? value : Number(value.trim())
  if (!Number.isFinite(parsed)) {
    ctx.addIssue({ code: 'custom', message: `숫자가 아닙니다: ${String(value)}` })
    return z.NEVER
  }
  return parsed
})

export { z }
