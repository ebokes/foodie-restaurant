import React from "react";
import * as LucideIcons from "lucide-react";
import Icon from "../ui/app-icon";
import { Category } from "@/types/menu-catalog";

// Define props interface
interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryFilterProps) => {
  return (
    <div className={`bg-card rounded-xl px-4 py-3 shadow-warm ${className}`}>
      <h2 className="text-base font-heading font-bold text-foreground mb-3">
        Browse by Category
      </h2>

      {/* Unified Chip Design for All Screen Sizes */}
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 hover:scale-[1.02] ${
              activeCategory === category?.id
                ? "bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground shadow-md"
                : "bg-muted text-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
            }`}
          >
            <Icon
              name={category?.icon}
              size={14}
              color={
                activeCategory === category?.id
                  ? "currentColor"
                  : "var(--color-primary)"
              }
            />
            <span className="whitespace-nowrap">{category?.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === category?.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {category?.count}
            </span>
            
            {category?.featured && (
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse ml-1"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
