import React from "react";

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-title shimmer"></div>
    <div className="skeleton-line shimmer"></div>
    <div className="skeleton-line short shimmer"></div>
    <div className="skeleton-buttons">
      <div className="skeleton-button shimmer"></div>
      <div className="skeleton-button shimmer"></div>
    </div>
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default LoadingSkeleton;
