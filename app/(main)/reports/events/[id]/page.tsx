"use client";

import DataCard from "@/features/attendance/components/DataCard";
import { useFetchEvent, useStatsOfEvent } from "@/globals/hooks/useEvents";
import { useMemo } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";
import { readableDate } from "@/globals/utils/formatting";
import { capitalize } from "lodash";
import { useParams } from "next/navigation";
import AttendanceRecordsTable from "@/features/attendance/components/AttendanceRecordsTable";

const EventReportsPage = () => {
	const { id } = useParams();
	const eventId = String(id);
	const { data: event, isLoading: isEventLoading } = useFetchEvent(eventId);
	const { data: eventStats, isLoading: isStatsLoading } = useStatsOfEvent(
		eventId
	);

	// Compute attendance rate
	const attendanceRate = useMemo(() => {
		if (!eventStats || !eventStats.eligible || eventStats.eligible === 0)
			return undefined;
		return Number(
			((eventStats.present / eventStats.eligible) * 100).toPrecision(4)
		);
	}, [eventStats]);

	if (!event) {
		return <p className="text-5xl">Loading</p>;
	}

	return (
		<div className="flex flex-col gap-4 p-6 items-center border-2 border-gray-300 rounded-md flex-2 overflow-hidden">
			<h3 className="text-4xl font-semibold">{event.title}</h3>

			{/* Stats Cards */}
			<div className="flex flex-wrap h-fit gap-6">
				<DataCard
					title="Present"
					subtitle="Students checked in"
					icon={IoMdCheckmarkCircleOutline}
					value={eventStats?.present}
					isLoading={isStatsLoading}
				/>
				<DataCard
					title="Total Registered"
					subtitle="Eligible attendees"
					icon={FaUserGroup}
					value={eventStats?.eligible}
					isLoading={isStatsLoading}
				/>
				<DataCard
					title="Attendance Rate"
					subtitle="Current percentage"
					icon={VscPercentage}
					value={attendanceRate}
					isLoading={isStatsLoading}
					isPercentage
				/>
			</div>

			{/* Event Details */}
			<div className="border w-full rounded-md p-4">
				<p className="text-lg">
					Organized by:{" "}
					<span className="font-semibold">{event.userId}</span>
				</p>
				<p className="text-lg">
					Conducted at:{" "}
					<span className="font-semibold">
						{readableDate(event.start)}
					</span>
				</p>
				<p className="text-lg">
					Participant groups:{" "}
					<span className="font-semibold">{event.includedGroups}</span>
				</p>
				<p className="text-lg">
					Location:{" "}
					<span className="font-semibold">{event.location}</span>
				</p>
				<p className="text-lg">
					Type:{" "}
					<span className="font-semibold">
						{capitalize(event.category)} Event
					</span>
				</p>
			</div>

			<AttendanceRecordsTable selectedEvent={event} />
		</div>
	);
};

export default EventReportsPage;
