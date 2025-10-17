import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getFormattedInputProps } from "@/hooks/useFormattedInput";

export const FormattedInput = ({ control, name, label, formatType, maxLength, ...props }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const formattedProps = getFormattedInputProps(field, { type: formatType, maxLength });
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input {...formattedProps} {...props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
