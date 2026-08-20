import { Prisma } from "@prisma/client";

export type PrismaErrorResult = {
  status: number;
  message: string;
};

/**
 * Normalizes Prisma errors into clean HTTP + message pairs
 */
export function handlePrismaError(
  error: unknown
): PrismaErrorResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handleKnownRequestError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      message: "Invalid data provided.",
    };
  }

  return {
    status: 500,
    message: "Something went wrong.",
  };
}

/**
 * Handles known Prisma error codes realistically used in apps
 */
function handleKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError
): PrismaErrorResult {
  switch (error.code) {
    // Unique constraint failed
    case "P2002":
      return {
        status: 409,
        message: "A record with this value already exists.",
      };

    // Record not found
    case "P2025":
      return {
        status: 404,
        message: "Record not found.",
      };

    // Foreign key constraint
    case "P2003":
      return {
        status: 400,
        message: "Invalid reference. Related record does not exist.",
      };

    // Value too long / invalid field
    case "P2000":
      return {
        status: 400,
        message: "One of the provided values is too long or invalid.",
      };

    // Transaction could not start within maxWait, or expired within timeout
    // (P2028). Atomicity guarantees nothing from the timed-out transaction was
    // committed, so the operation can be safely retried — important for the bulk
    // roster import, where a large single transaction is expected to take longer
    // than a typical request.
    case "P2028":
      return {
        status: 503,
        message:
          "The database transaction did not complete and was rolled back. Retrying the operation is safe.",
      };

    default:
      return {
        status: 500,
        message: "Database error occurred.",
      };
  }
}
