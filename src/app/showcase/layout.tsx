import React from 'react';

export default function ShowcaseSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="showcase-isolated-wrapper">
      {children}
    </div>
  );
}
