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

    default:
      return {
        status: 500,
        message: "Database error occurred.",
      };
  }
}
