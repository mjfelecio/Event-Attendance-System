import { Label } from "@/globals/components/shad-cn/label"
import { Switch } from "@/globals/components/shad-cn/switch"

const ShowUnattendedStudentsToggle = () => {
	return (
		<div className="flex items-center gap-2">
			<Switch id="showUnattendedSwitch"/>
			<Label htmlFor="showUnattendedSwitch">Show Unattended Students</Label>
		</div>
	)
}

export default ShowUnattendedStudentsToggle