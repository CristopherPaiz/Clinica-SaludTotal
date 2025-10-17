export const getFormattedInputProps = (field, options = {}) => {
  const { type = "string", maxLength } = options;
  const { onChange, onBlur, ...restField } = field;

  const handleChange = (e) => {
    let value = e.target.value;
    let formattedValue = value;

    switch (type) {
      case "string":
        formattedValue = value.trimStart();
        break;
      case "number":
        formattedValue = value.replace(/[^0-9]/g, "");
        break;
      case "decimal": {
        formattedValue = value.replace(/[^0-9.]/g, "");
        const parts = formattedValue.split(".");
        if (parts.length > 2) {
          formattedValue = parts[0] + "." + parts.slice(1).join("");
        }
        break;
      }
      case "alpha":
        formattedValue = value.replace(/[^a-zA-Z\s]/g, "");
        break;
      case "alphanumeric":
        formattedValue = value.replace(/[^a-zA-Z0-9]/g, "");
        break;
      default:
        formattedValue = value;
    }

    if (maxLength && formattedValue.length > maxLength) {
      formattedValue = formattedValue.slice(0, maxLength);
    }

    e.target.value = formattedValue;
    onChange(e);
  };

  const handleBlur = (e) => {
    const trimmedValue = e.target.value.trim();
    if (e.target.value !== trimmedValue) {
      e.target.value = trimmedValue;
      onChange(e);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  const inputProps = {};
  if (type === "number" || type === "decimal") {
    inputProps.inputMode = "decimal";
  }
  if (type === "number") {
    inputProps.pattern = "[0-9]*";
  }

  return {
    ...restField,
    onChange: handleChange,
    onBlur: handleBlur,
    ...inputProps,
  };
};
