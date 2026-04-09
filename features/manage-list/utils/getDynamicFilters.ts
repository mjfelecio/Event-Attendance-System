import { Option } from "@/globals/types/primitives";

const getDynamicFilters = (data: any[]) => {
  // Use a Record of Maps to track unique values by their 'value' property
  const filterMap: Record<string, Map<string, string>> = {};

  data.forEach((student) => {
    // 1. Extract from the 'groups' array
    student.groups?.forEach((group: any) => {
      if (!filterMap[group.category]) {
        filterMap[group.category] = new Map();
      }
      filterMap[group.category].set(group.slug, group.name);
    });

    // 2. Add flat fields (Year Level or School Level)
    const extraFields = ["yearLevel", "schoolLevel"];
    extraFields.forEach((field) => {
      const val = student[field];
      if (val) {
        const categoryKey = field;
        if (!filterMap[categoryKey]) filterMap[categoryKey] = new Map();
        
        const label = val.replace("_", " ");
        filterMap[categoryKey].set(val, label);
      }
    });
  });

  // Convert the Maps back into the expected Option[] format
  const result = Object.keys(filterMap).reduce(
    (acc, category) => {
      acc[category] = Array.from(filterMap[category].entries())
        .map(([value, label]) => ({ label, value }))
        .sort((a, b) => a.label.localeCompare(b.label));
      return acc;
    },
    {} as Record<string, Option[]>,
  );

  return result;
};

export default getDynamicFilters;