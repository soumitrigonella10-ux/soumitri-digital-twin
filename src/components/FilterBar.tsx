"use client";

import { format } from "date-fns";
import { Calendar, Sun, Moon, Briefcase, Home, Plane, PartyPopper } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { BodyArea, TimeOfDay } from "@/types";

const OCCASIONS = ["Casual", "Office", "Party", "Date", "Gym", "Travel"];
const BODY_AREAS: BodyArea[] = ["UA", "IT", "BL", "IA", "B"];

export function FilterBar() {
  const { filters, setFilters } = useAppStore();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFilters({ date });
    }
  };

  const toggleTimeOfDay = (time: TimeOfDay) => {
    setFilters({ timeOfDay: filters.timeOfDay === time ? "ANY" : time });
  };

  const toggleFlag = (flag: keyof typeof filters.flags) => {
    setFilters({
      flags: {
        ...filters.flags,
        [flag]: !filters.flags[flag],
      },
    });
  };

  const toggleBodyArea = (area: BodyArea) => {
    const current = filters.bodyAreas;
    const newAreas = current.includes(area)
      ? current.filter((a) => a !== area)
      : [...current, area];
    setFilters({ bodyAreas: newAreas });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      {/* Row 1: Date and Time */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={format(filters.date, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="w-auto"
          />
        </div>

        {/* Time of Day */}
        <div className="flex items-center gap-1">
          <Button
            variant={filters.timeOfDay === "AM" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTimeOfDay("AM")}
            className="gap-1"
          >
            <Sun className="h-4 w-4" />
            AM
          </Button>
          <Button
            variant={filters.timeOfDay === "PM" ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTimeOfDay("PM")}
            className="gap-1"
          >
            <Moon className="h-4 w-4" />
            PM
          </Button>
          <Button
            variant={filters.timeOfDay === "ANY" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilters({ timeOfDay: "ANY" })}
          >
            All
          </Button>
        </div>
      </div>

      {/* Row 2: Flags */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.flags.office ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFlag("office")}
          className="gap-1"
        >
          <Briefcase className="h-4 w-4" />
          Office
        </Button>
        <Button
          variant={filters.flags.wfh ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFlag("wfh")}
          className="gap-1"
        >
          <Home className="h-4 w-4" />
          WFH
        </Button>
        <Button
          variant={filters.flags.travel ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFlag("travel")}
          className="gap-1"
        >
          <Plane className="h-4 w-4" />
          Travel
        </Button>
        <Button
          variant={filters.flags.goingOut ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFlag("goingOut")}
          className="gap-1"
        >
          <PartyPopper className="h-4 w-4" />
          Going Out
        </Button>
      </div>

      {/* Row 3: Occasion and Body Areas */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Occasion */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Occasion:</span>
          <Select
            value={filters.occasion}
            onChange={(e) => setFilters({ occasion: e.target.value })}
            className="w-32"
          >
            {OCCASIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </Select>
        </div>

        {/* Body Areas */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Body areas:</span>
          {BODY_AREAS.map((area) => (
            <Badge
              key={area}
              variant={filters.bodyAreas.includes(area) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleBodyArea(area)}
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
