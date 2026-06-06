import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AUTH_CODES } from '../i18n/namespaces/auth.namespace';

/**
 * Localized Validation Pipe Factory
 *
 * Creates a NestJS ValidationPipe whose exceptionFactory:
 *   - Flattens nested ValidationError trees into a flat array
 *   - Each error entry carries { field, code, message } where:
 *       code    = the stable dot-notation i18n code (e.g. 'AUTH.FIELD_REQUIRED')
 *       message = the raw constraint message from the DTO decorator
 *   - The global LocalizedExceptionFilter translates codes to the active language
 *
 * The primary message of the BadRequestException is AUTH.VALIDATION_FAILED
 * so the filter always has a translatable top-level code.
 */
export function createLocalizedValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const flatErrors = flattenValidationErrors(errors);
      return new BadRequestException({
        statusCode: 400,
        // Stable code — the filter translates this to the active language
        message: AUTH_CODES.VALIDATION_FAILED,
        errors: flatErrors,
      });
    },
  });
}

/**
 * Maps common class-validator constraint names to stable i18n codes.
 * When a DTO sets message: 'AUTH.SOME_CODE', that code is used directly.
 * When a DTO uses a generic decorator with no i18n message, we map the
 * constraint name to a reasonable COMMON code here.
 */
function mapConstraintToCode(
  constraintName: string,
  rawMessage: string,
): string {
  // If the DTO already supplied a dot-notation code as the message, use it
  if (rawMessage.includes('.') && rawMessage === rawMessage.toUpperCase().replace(/ /g, '')) {
    // Looks like a code (e.g. 'AUTH.PASSWORD_TOO_SHORT') — trust it
    return rawMessage;
  }

  // Map common class-validator constraint names → stable codes
  const constraintCodeMap: Record<string, string> = {
    isNotEmpty: 'AUTH.FIELD_REQUIRED',
    isEmail: 'AUTH.INVALID_EMAIL_FORMAT',
    isPhoneNumber: 'AUTH.INVALID_PHONE_FORMAT',
    minLength: 'AUTH.PASSWORD_TOO_SHORT',
    maxLength: 'AUTH.CODE_INVALID_LENGTH',
    isString: 'AUTH.FIELD_REQUIRED',
    isNumber: 'AUTH.FIELD_REQUIRED',
    isBoolean: 'AUTH.FIELD_REQUIRED',
    emailOrPhone: 'AUTH.INVALID_EMAIL_OR_PHONE',
    isEnum: 'COMMON.BAD_REQUEST',
  };

  return constraintCodeMap[constraintName] ?? rawMessage;
}

/**
 * Recursively flattens nested ValidationError objects.
 * Each entry: { field: string; code: string; message: string }
 *   field   = dot-path from root (e.g. 'address.street')
 *   code    = i18n code for the filter to translate
 *   message = raw English message (fallback if code not in registry)
 */
function flattenValidationErrors(
  errors: ValidationError[],
  parentField = '',
): Array<{ field: string; code: string; message: string }> {
  const result: Array<{ field: string; code: string; message: string }> = [];

  for (const error of errors) {
    const fieldPath = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      for (const [constraintName, rawMessage] of Object.entries(error.constraints)) {
        const code = mapConstraintToCode(constraintName, rawMessage);
        result.push({
          field: fieldPath,
          code,
          message: rawMessage, // raw English as fallback
        });
      }
    }

    // Recurse into nested DTOs
    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationErrors(error.children, fieldPath));
    }
  }

  return result;
}
