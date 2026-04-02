import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { groupBy } from "lodash";
import { NextResponse } from "next/server";

/**
 * GET /api/groups/[studentId]
 * Fetches all groups that a student belongs to.
 */
export async function GET(
	_request: Request,
	{ params }: { params: { studentId: string } },
) {
	const { studentId } = await params;
	try {
		const groups = await prisma.group.findMany({
			where: {
				students: { some: { id: studentId } }
			},
			orderBy: {
				name: "asc",
			},
		});

		const groupedByCategory = groupBy(groups, 'category');

		return NextResponse.json(ok(groupedByCategory), { status: 200 });
	} catch (e) {
		const { status, message } = handlePrismaError(e);

		console.error("[GROUPS_GET_BY_STUDENT_ID]", message);
		return NextResponse.json(err(message), { status });
	}
}
