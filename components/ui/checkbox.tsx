import React, { forwardRef, useId } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  className?: string;
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "default" | "lg";
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  defaultChecked?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      id,
      checked,
      indeterminate = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      size = "default",
      onCheckedChange,
      onChange,
      ...props
    },
    ref
  ) => {
    // Generate unique ID using React's useId hook
    const generatedId = useId();
    const checkboxId = id || generatedId;

    // Size variants
    const sizeClasses = {
      sm: "h-4 w-4",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    return (
      <div className={cn("flex items-start space-x-2", className)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            required={required}
            className="sr-only"
            onChange={handleChange}
            {...props}
          />

          <label
            htmlFor={checkboxId}
            className={cn(
              "peer shrink-0 rounded-sm border border-primary-solid ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer transition-colors mt-1.5",
              sizeClasses?.[size],
              checked && "bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground border-primary",
              indeterminate &&
                "bg-linear-to-br from-primary-solid via-grad1 to-grad2 text-primary-foreground border-primary",
              error && "border-destructive",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {checked && !indeterminate && (
              <Check className="h-[16px] w-[14px] text-current flex items-center justify-center" />
            )}
            {indeterminate && (
              <Minus className="h-3 w-3 text-current flex items-center justify-center" />
            )}
          </label>
        </div>
        {(label || description || error) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                  error ? "text-destructive" : "text-foreground"
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}

            {description && !error && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

// Checkbox Group component
interface CheckboxGroupProps {
  className?: string;
  children?: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    {
      className,
      children,
      label,
      description,
      error,
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        className={cn("space-y-3", className)}
        {...props}
      >
        {label && (
          <legend
            className={cn(
              "text-sm font-medium",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </legend>
        )}

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        <div className="space-y-2">{children}</div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </fieldset>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
export type { CheckboxProps, CheckboxGroupProps };
