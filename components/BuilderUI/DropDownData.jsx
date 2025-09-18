import React from "react";


const DropDownData = ({ label, options, value, update }) => {
  // const selectedLabel =
  //   value.length > 0
  //     ? options.find((option) => option.value === value)?.label
  //     : "Select Tag Name";

  return (
    <div className="w-full inline-flex gap-3 items-center justify-between">
      <span className="text-primary-900 font-medium text-[11px]">{label}</span>
      <select
        onChange={(e) => update(e.target.value)}
        value={value}
        className="!text-[11px] !text-primary-900 hover:!text-primary-900 !border !border-gray-300 focus-visible:border-primary-200 focus:outline-hidden focus:ring-0 focus:ring-primary-200"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDownData;
