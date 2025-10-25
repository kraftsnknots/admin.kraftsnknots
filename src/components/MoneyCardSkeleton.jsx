import React from "react";
import ContentLoader from "react-content-loader";

const MoneyCardSkeleton = (props) => (
  <div className="money-card">
    <ContentLoader
      speed={2}
      width={250}
      height={120}
      viewBox="0 0 250 120"
      backgroundColor="#e0e0e0"
      foregroundColor="#f5f5f5"
      {...props}
    >
      {/* Title (Admin Users) */}
      <rect x="20" y="20" rx="4" ry="4" width="100" height="14" />
      {/* Number (amount) */}
      <rect x="20" y="45" rx="6" ry="6" width="80" height="24" />
      {/* Icon circle */}
      <circle cx="200" cy="45" r="18" />
      {/* Subtext (Verified admins) */}
      <rect x="20" y="85" rx="3" ry="3" width="140" height="12" />
    </ContentLoader>
  </div>
);

export default MoneyCardSkeleton;
