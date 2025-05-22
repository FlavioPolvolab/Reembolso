import React, { useState } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FilterBarProps {
  onFilterChange?: (filters: {
    search: string;
    status: string;
    category: string;
    costCenter: string;
    dateRange: { from: Date | undefined; to: Date | undefined };
  }) => void;
}

const FilterBar = ({ onFilterChange = () => {} }: FilterBarProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const handleFilterChange = () => {
    onFilterChange({
      search,
      status,
      category,
      costCenter,
      dateRange,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setCostCenter("");
    setDateRange({ from: undefined, to: undefined });
    onFilterChange({
      search: "",
      status: "",
      category: "",
      costCenter: "",
      dateRange: { from: undefined, to: undefined },
    });
  };

  return (
    <div className="w-full p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={costCenter} onValueChange={setCostCenter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Cost Center" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="institutional">Institutional</SelectItem>
              <SelectItem value="babacu">Babaçu</SelectItem>
              <SelectItem value="mel">Mel</SelectItem>
              <SelectItem value="milho">Milho</SelectItem>
              <SelectItem value="cacau">Cacau</SelectItem>
              <SelectItem value="caju">Caju</SelectItem>
              <SelectItem value="novos-projetos">Novos Projetos</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleFilterChange} className="gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>

          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
