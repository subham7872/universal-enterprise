"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import AiCompanion from './AiCompanion';
import QuoteListDrawer from './QuoteListDrawer';
import ProductDetailModal from './ProductDetailModal';
import LeadCaptureModal from './LeadCaptureModal';

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function AppClientWrapper({ children }) {
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareItems, setCompareItems] = useState([]);

  // Load quote and compare items from localStorage on mount
  useEffect(() => {
    try {
      const savedQuote = localStorage.getItem('ue_quote_cart');
      if (savedQuote) setQuoteItems(JSON.parse(savedQuote));

      const savedCompare = localStorage.getItem('ue_compare_items');
      if (savedCompare) setCompareItems(JSON.parse(savedCompare));
    } catch (e) {}
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ue_quote_cart', JSON.stringify(quoteItems));
    } catch (e) {}
  }, [quoteItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ue_compare_items', JSON.stringify(compareItems));
    } catch (e) {}
  }, [compareItems]);

  const addToQuote = (product, quantity = 1) => {
    setQuoteItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id || item.product.partNumber === product.partNumber
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setQuoteOpen(true);
  };

  const updateQuantity = (productId, quantity) => {
    setQuoteItems((prev) =>
      prev.map((item) =>
        item.product.id === productId || item.product.partNumber === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromQuote = (productId) => {
    setQuoteItems((prev) =>
      prev.filter(
        (item) => item.product.id !== productId && item.product.partNumber !== productId
      )
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      const exists = prev.some(
        (p) => p.id === product.id || p.partNumber === product.partNumber
      );
      if (exists) {
        return prev.filter(
          (p) => p.id !== product.id && p.partNumber !== product.partNumber
        );
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 bearings side-by-side.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const totalCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        quoteItems,
        addToQuote,
        updateQuantity,
        removeFromQuote,
        clearQuote,
        setQuoteOpen,
        selectedProduct,
        setSelectedProduct,
        compareItems,
        setCompareItems,
        toggleCompare
      }}
    >
      <div className="min-h-screen flex flex-col justify-between bg-[#f8f8f8]">
        <Header
          quoteCount={totalCount}
          onOpenQuote={() => setQuoteOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6">
          {children}
        </main>

        <Footer />

        <QuoteListDrawer
          isOpen={quoteOpen}
          onClose={() => setQuoteOpen(false)}
          quoteItems={quoteItems}
          updateQuantity={updateQuantity}
          removeFromQuote={removeFromQuote}
          clearQuote={clearQuote}
        />

        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToQuote={addToQuote}
        />

        <AiCompanion
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        <LeadCaptureModal />
      </div>
    </AppContext.Provider>
  );
}
