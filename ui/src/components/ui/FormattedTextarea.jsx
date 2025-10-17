import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getFormattedInputProps } from "@/hooks/useFormattedInput";

export const FormattedTextarea = ({ control, name, label, formatType, maxLength, ...props }) => {
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
              <Textarea {...formattedProps} {...props} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
