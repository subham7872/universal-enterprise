"use client";

import React from 'react';
import CompareSpecsPage from '../../components/CompareSpecsPage';
import { useApp } from '../../components/AppClientWrapper';

export default function CompareRoute() {
  const { compareItems, setCompareItems, toggleCompare, addToQuote, setSelectedProduct } = useApp();

  return (
    <CompareSpecsPage
      compareItems={compareItems}
      onRemoveItem={(item) => toggleCompare(item)}
      onClearAll={() => setCompareItems([])}
      onAddToQuote={(item) => addToQuote(item)}
      onViewDetails={(item) => setSelectedProduct(item)}
    />
  );
}
