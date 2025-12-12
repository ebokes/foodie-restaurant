import React, { useState } from "react";
import Select from "../ui/select";
import Icon from "../ui/app-icon";
// import Icon from "../../../components/AppIcon";
// import Select from "../../../components/ui/Select";

import { Filters } from "@/types/menu-catalog";

interface FilterControlsProps {
  onFiltersChange: (filters: Filters) => void;
  className?: string;
}

interface FilterOption {
  value: string | number | string[] | number[];
  key: string;
}

const FilterControls = ({
  onFiltersChange,
  className = "",
}: FilterControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dietary: "",
    priceRange: "",
    sortBy: "name",
  });

  const dietaryOptions = [
    { value: "", label: "All Dietary Options" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten Free" },
    { value: "dairy-free", label: "Dairy Free" },
    { value: "keto", label: "Keto Friendly" },
  ];

  const priceRangeOptions = [
    { value: "", label: "All Prices" },
    { value: "0-10", label: "Under $10" },
    { value: "10-20", label: "$10 - $20" },
    { value: "20-30", label: "$20 - $30" },
    { value: "30+", label: "$30+" },
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest Items" },
  ];

  const handleFilterChange = ({ key, value }: FilterOption) => {
    const stringValue = String(value);
    const newFilters = { ...filters, [key]: stringValue };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dietary: "",
      priceRange: "",
      sortBy: "name",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters?.dietary || filters?.priceRange || filters?.sortBy !== "name";

  return (
    <div className={`bg-card rounded-lg shadow-warm ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} color="var(--color-primary)" />
          <h3 className="font-body font-medium text-foreground text-sm">
            Filters & Sort
          </h3>
          {hasActiveFilters && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-medium">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-body text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden p-1 rounded-lg text-foreground hover:text-primary hover:bg-muted transition-all duration-200"
          >
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              size={18}
              className="transition-transform duration-200"
            />
          </button>
        </div>
      </div>
      {/* Filter Controls */}
      <div
        className={`px-3 py-2.5 space-y-2.5 ${
          isExpanded ? "block" : "hidden md:block"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Dietary Preferences */}
          <Select
            label="Dietary Preferences"
            options={dietaryOptions}
            value={filters?.dietary}
            onChange={(value) => handleFilterChange({ key: "dietary", value })}
            className="w-full"
          />

          {/* Price Range */}
          <Select
            label="Price Range"
            options={priceRangeOptions}
            value={filters?.priceRange}
            onChange={(value) =>
              handleFilterChange({ key: "priceRange", value })
            }
            className="w-full"
          />

          {/* Sort By */}
          <Select
            label="Sort By"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange({ key: "sortBy", value })}
            className="w-full"
          />
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border">
            {filters?.dietary && (
              <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-body">
                <span>
                  {
                    dietaryOptions?.find(
                      (opt) => opt?.value === filters?.dietary
                    )?.label
                  }
                </span>
                <button
                  onClick={() =>
                    handleFilterChange({ key: "dietary", value: "" })
                  }
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
                >
                  <Icon name="X" size={10} />
                </button>
              </span>
            )}
            {filters?.priceRange && (
              <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-body">
                <span>
                  {
                    priceRangeOptions?.find(
                      (opt) => opt?.value === filters?.priceRange
                    )?.label
                  }
                </span>
                <button
                  onClick={() =>
                    handleFilterChange({ key: "priceRange", value: "" })
                  }
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
                >
                  <Icon name="X" size={10} />
                </button>
              </span>
            )}
            {filters?.sortBy !== "name" && (
              <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-body">
                <span>
                  Sort:{" "}
                  {
                    sortOptions?.find((opt) => opt?.value === filters?.sortBy)
                      ?.label
                  }
                </span>
                <button
                  onClick={() =>
                    handleFilterChange({ key: "sortBy", value: "name" })
                  }
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
                >
                  <Icon name="X" size={10} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
