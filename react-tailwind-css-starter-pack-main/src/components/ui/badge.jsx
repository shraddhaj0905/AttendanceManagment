import React from "react";
import clsx from "clsx";

const Badge = ({ children, className }) => {
  return (
    <span className={clsx("inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-sm font-medium text-white", className)}>
      {children}
    </span>
  );
};

export default Badge;
