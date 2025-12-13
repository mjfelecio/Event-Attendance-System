import { Button } from "@/globals/components/shad-cn/button";
import { Input } from "@/globals/components/shad-cn/input";
import { Label } from "@/globals/components/shad-cn/label";
import ComboBox from "@/globals/components/shared/ComboBox";
import React from "react";

const Toolbar = () => {
  return (
    <div className="w-full bg-slate-200 p-2 space-y-2">
      <div className="flex gap-2">
        <Input className="bg-gray-50" />
        <Button>Search</Button>
        <Button>Export</Button>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-row gap-2">
          <Label className="">Date Started</Label>
          <Input type="datetime-local" className=" flex-1 bg-gray-50" />
        </div>
        <div className="flex flex-row gap-2">
          <Label className="">Date Ended</Label>
          <Input type="datetime-local" className=" flex-1 bg-gray-50" />
        </div>
        <ComboBox
          choices={[{ label: "Categories", value: "category1" }]}
          onSelect={(category) => console.log("Selected category: ", category)}
          placeholder="Category"
          searchFallbackMsg="No category found"
          selectedValue="category1"
        />
      </div>
    </div>
  );
};

export default Toolbar;
