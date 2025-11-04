import React, { type ReactNode } from "react";

interface PagePaddingProps {
  children: ReactNode;
  className?: string;
}

const PagePadding: React.FC<PagePaddingProps> = ({
  children,
  className = "",
}) => (
  <div className={`px-4 py-8 md:px-12 lg:px-24 ${className}`}>{children}</div>
);

export default PagePadding;
