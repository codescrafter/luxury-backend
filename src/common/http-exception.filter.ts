import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { resolveLang, SupportedLang } from './lang.helper';
import { translate, isRegisteredCode } from '../i18n/registry';

/**
 * Global HTTP Exception Filter — Production i18n version
 *
 * Every HttpException thrown in the application passes through here.
 * The filter:
 *   1. Resolves the active language from the request (JWT → query → header → 'en')
 *   2. If the exception message is a registered code (e.g. 'AUTH.USER_NOT_FOUND'):
 *        - Translates it via the central registry
 *        - Echoes the code in the response for frontend programmatic handling
 *   3. If the message is NOT a registered code (legacy/unknown messages):
 *        - Falls back to HTTP-status-based generic messages (localized)
 *        - Still returns a clean response — never crashes
 *   4. Validation errors (400 arrays) are individually translated
 *   5. Special countdown fields (emailCodeSentAt, phoneCodeSentAt) are preserved
 *
 * ─── Error response shape ──────────────────────────────────────────────────
 * {
 *   "success": false,
 *   "statusCode": 401,
 *   "code": "AUTH.INVALID_CREDENTIALS",   ← stable, machine-readable
 *   "message": "بيانات الاعتماد غير صحيحة"  ← localized, human-readable
 * }
 *
 * ─── Never modify services/guards to pass lang around ─────────────────────
 * Language stays at the HTTP boundary (this filter). Business logic is clean.
 */
@Catch(HttpException)
export class LocalizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LocalizedExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const lang = resolveLang(request as any);
    const exceptionResponse = exception.getResponse();

    // Parse the raw exception into a normalized shape
    const parsed = this.parseExceptionResponse(exceptionResponse);

    // Resolve the final code + localized message
    const { code, message } = this.resolveCodeAndMessage(
      parsed.message,
      lang,
      statusCode,
    );

    // Build the standard error response
    const errorResponse: Record<string, any> = {
      success: false,
      statusCode,
      ...(code ? { code } : {}),
      message,
    };

    // Validation errors array — translate each entry individually
    if (parsed.errors && Array.isArray(parsed.errors)) {
      errorResponse.errors = this.localizeValidationErrors(parsed.errors, lang);
    }

    // Preserve countdown timestamps for rate-limit responses (frontend timers)
    if (parsed.emailCodeSentAt !== undefined) {
      errorResponse.emailCodeSentAt = parsed.emailCodeSentAt;
    }
    if (parsed.phoneCodeSentAt !== undefined) {
      errorResponse.phoneCodeSentAt = parsed.phoneCodeSentAt;
    }

    // Logging — always log the raw code/message (NOT translated text)
    // This ensures logs are consistent regardless of the request language
    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${statusCode} | code: ${code ?? 'UNREGISTERED'} | raw: ${parsed.message}`,
        exception.stack,
      );
    } else if (statusCode >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} → ${statusCode} | code: ${code ?? 'UNREGISTERED'}`,
      );
    }

    response.status(statusCode).json(errorResponse);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Normalizes HttpException.getResponse() (string | object) into a flat shape.
   */
  private parseExceptionResponse(exceptionResponse: string | object): {
    message: string;
    errors?: any[];
    emailCodeSentAt?: number;
    phoneCodeSentAt?: number;
  } {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    const obj = exceptionResponse as Record<string, any>;

    // ValidationPipe returns { message: string[], error: 'Bad Request', statusCode: 400 }
    let message: string;
    if (Array.isArray(obj.message)) {
      message = obj.message[0] ?? 'COMMON.BAD_REQUEST';
    } else {
      message = obj.message ?? obj.error ?? 'COMMON.INTERNAL_SERVER_ERROR';
    }

    return {
      message,
      errors: Array.isArray(obj.message) ? obj.message : obj.errors,
      emailCodeSentAt: obj.emailCodeSentAt,
      phoneCodeSentAt: obj.phoneCodeSentAt,
    };
  }

  /**
   * Resolves the stable code and localized message from a raw exception message.
   *
   * Priority:
   *   1. Registered code (e.g. 'AUTH.USER_NOT_FOUND') → translate + return code
   *   2. NestJS default strings ('Unauthorized', 'Not Found', ...) → map to COMMON.* code
   *   3. Unknown string → return as-is (no code, no translation)
   */
  private resolveCodeAndMessage(
    rawMessage: string,
    lang: SupportedLang,
    statusCode: number,
  ): { code?: string; message: string } {
    // Case 1: It's a registered dot-notation code — O(1) lookup
    if (isRegisteredCode(rawMessage)) {
      return {
        code: rawMessage,
        message: translate(rawMessage, lang),
      };
    }

    // Case 2: NestJS/Passport default generic messages → map to COMMON code
    const commonCode = this.mapStatusToCommonCode(statusCode, rawMessage);
    if (commonCode) {
      return {
        code: commonCode,
        message: translate(commonCode, lang),
      };
    }

    // Case 3: Unknown / legacy message — pass through as English, no code
    return { message: rawMessage };
  }

  /**
   * Maps an HTTP status code + raw message to a COMMON.* code.
   * Only applies when the raw message is a known NestJS/Passport default.
   */
  private mapStatusToCommonCode(
    statusCode: number,
    rawMessage: string,
  ): string | undefined {
    const normalized = rawMessage.toLowerCase();

    // Match NestJS default messages to COMMON codes
    const defaultMap: Array<{ match: string[]; code: string }> = [
      { match: ['unauthorized', 'jwt'], code: 'COMMON.UNAUTHORIZED' },
      { match: ['forbidden'], code: 'COMMON.FORBIDDEN' },
      { match: ['not found'], code: 'COMMON.NOT_FOUND' },
      { match: ['bad request', 'validation'], code: 'COMMON.BAD_REQUEST' },
      { match: ['conflict'], code: 'COMMON.CONFLICT' },
      { match: ['too many requests'], code: 'COMMON.TOO_MANY_REQUESTS' },
      { match: ['internal server error'], code: 'COMMON.INTERNAL_SERVER_ERROR' },
    ];

    for (const entry of defaultMap) {
      if (entry.match.some((m) => normalized.includes(m))) {
        return entry.code;
      }
    }

    // Status-code-only fallback (when message gives no info)
    const statusMap: Record<number, string> = {
      [HttpStatus.UNAUTHORIZED]: 'COMMON.UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'COMMON.FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'COMMON.NOT_FOUND',
      [HttpStatus.BAD_REQUEST]: 'COMMON.BAD_REQUEST',
      [HttpStatus.CONFLICT]: 'COMMON.CONFLICT',
      [HttpStatus.TOO_MANY_REQUESTS]: 'COMMON.TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'COMMON.INTERNAL_SERVER_ERROR',
    };

    return statusMap[statusCode];
  }

  /**
   * Translates an array of validation error entries.
   * Each entry can be a string (raw message) or { field, message, code } object.
   */
  private localizeValidationErrors(
    errors: any[],
    lang: SupportedLang,
  ): Array<{ field?: string; code?: string; message: string }> {
    return errors.map((err) => {
      if (typeof err === 'string') {
        if (isRegisteredCode(err)) {
          return { code: err, message: translate(err, lang) };
        }
        return { message: err };
      }

      // Structured error: { field, message, code? }
      const rawMsg: string = err.code ?? err.message ?? '';
      if (isRegisteredCode(rawMsg)) {
        return {
          field: err.field,
          code: rawMsg,
          message: translate(rawMsg, lang),
        };
      }

      return {
        field: err.field,
        message: err.message ?? rawMsg,
      };
    });
  }
}
