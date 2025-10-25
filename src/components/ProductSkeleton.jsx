import React from "react";
import ContentLoader from "react-content-loader";

const ProductSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={70}
    backgroundColor="#e0e0e0"
    foregroundColor="#f5f5f5"
    {...props}
  >
    <rect x="10" y="15" rx="4" ry="4" width="40" height="40" />  {/* product image */}
    <rect x="60" y="20" rx="3" ry="3" width="150" height="10" /> {/* title */}
    <rect x="60" y="40" rx="3" ry="3" width="100" height="10" /> {/* subtitle */}
    <rect x="80%" y="25" rx="3" ry="3" width="60" height="15" /> {/* price */}
  </ContentLoader>
);

export default ProductSkeleton;
