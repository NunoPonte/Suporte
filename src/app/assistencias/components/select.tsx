import Select, { SingleValue } from "react-select";
import { useRef } from "react";

import styles from "./select.module.css";

type Option = { value: string; label: string };

interface SelectComponentProps {
  options: Option[];
  value: { label: string; value: string } | null;
  onChange?: (newValue: SingleValue<{ label: string; value: string }>) => void;
  placeholder?: string;
  error?: boolean;
  num?: number;
}

export default function SelectComponent({
  options,
  value,
  onChange,
  placeholder,
  error,
  num,
}: SelectComponentProps) {
  const arrowRef = useRef<SVGSVGElement>(null);
  return (
    <div className={styles.selectContainer}>
      <Select<Option, false>
        components={{
          DropdownIndicator: null,
          ClearIndicator: undefined,
          IndicatorSeparator: null,
        }}
        className={styles.select}
        styles={{
          control: (base) => ({
            ...base,
            lineHeight: num === 2 ? "14px" : "22px",
            width: num === 2 ? "56px" : "100%",
            maxHeight: num === 2 ? "28px" : "44px",
            padding: num === 2 ? "0.5rem 0rem" : "0.5rem 0rem",
            borderRadius: "0.5rem",
            border: `1px solid ${
              error ? "#ff4d4f" : num === 2 ? "#E3E3E3" : "#c2eefe"
            }`,
            backgroundColor: "#f5fcff",
            boxShadow: "none",
            outline: "none",
            "&:hover": {
              borderColor: error
                ? "#ff4d4f"
                : num === 2
                ? "#E3E3E3"
                : "#c2eefe",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            display: "block",
          }),
        }}
        placeholder={placeholder || "Estado"}
        options={options}
        value={value}
        onChange={onChange}
        isClearable
        isSearchable={false}
        onMenuOpen={() => {
          arrowRef.current?.setAttribute("style", "transform: rotate(180deg);");
        }}
        onMenuClose={() => {
          arrowRef.current?.setAttribute("style", "transform: rotate(0deg);");
        }}
      />
      <svg
        ref={arrowRef}
        width={num === 2 ? "6" : "8"}
        height={num === 2 ? "6" : "8"}
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.48914 7.21629C4.43964 7.30251 4.36827 7.37414 4.28224 7.42396C4.19621 7.47377 4.09855 7.5 3.99914 7.5C3.89972 7.5 3.80207 7.47377 3.71603 7.42396C3.63 7.37414 3.55863 7.30251 3.50914 7.21629L0.080637 1.38279C-0.147863 0.993791 0.126637 0.499291 0.570637 0.499291L7.42814 0.499291C7.87264 0.499291 8.14664 0.994291 7.91814 1.38279L4.48914 7.21629Z"
          fill={error ? "#ff4d4f" : "black"}
        />
      </svg>
    </div>
  );
}
