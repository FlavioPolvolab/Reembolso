import React, { useState, useEffect } from "react";
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
import { fetchCategories, fetchCostCenters } from "@/services/expenseService";

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
  const [categories, setCategories] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);

  // Carregar categorias e centros de custo do banco de dados
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesData, costCentersData] = await Promise.all([
          fetchCategories(),
          fetchCostCenters(),
        ]);
        setCategories(categoriesData || []);
        setCostCenters(costCentersData || []);
      } catch (error) {
        console.error("Erro ao carregar dados para filtros:", error);
      }
    };

    loadFilterData();
  }, []);

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
            placeholder="Buscar despesas..."
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
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Carregando...
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={costCenter} onValueChange={setCostCenter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Centro de Custo" />
            </SelectTrigger>
            <SelectContent>
              {costCenters.length > 0 ? (
                costCenters.map((center) => (
                  <SelectItem
                    key={
                      center.id || `cost-center-${center.name || Date.now()}`
                    }
                    value={
                      center.id || `cost-center-${center.name || Date.now()}`
                    }
                  >
                    {center.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading-cost-centers" disabled>
                  Carregando...
                </SelectItem>
              )}
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
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Período</span>
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
            Aplicar Filtros
          </Button>

          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
