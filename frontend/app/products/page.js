"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, List, Grid, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../components/AppClientWrapper';
import api from '../../lib/api';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialQuery = searchParams.get('query') || '';

  const { addToQuote, setSelectedProduct, compareItems, toggleCompare } = useApp();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [brand, setBrand] = useState(initialBrand);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        query,
        brand,
        category,
        page,
        limit: 15
      });
      setProducts(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [brand, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCatalog();
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="bg-[#003366] text-white p-6 rounded-lg border-b-4 border-[#f2cc4d] flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#f2cc4d] text-slate-950 font-bold px-2 py-0.5 rounded uppercase font-mono">
            DIRECT OEM INVENTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1 text-white">
            Precision Bearings & Motion Catalog
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            Displaying {totalCount} genuine parts across NSK, THK, NTN, SKF, and FAG.
          </p>
        </div>

        <Link
          href="/"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 text-[#f2cc4d]" /> Back to Homepage
        </Link>
      </div>

      {/* Quick Filter Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded border flex flex-wrap gap-3 items-center text-xs">
        <input
          type="text"
          placeholder="Filter by part number or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] p-2 bg-slate-50 border rounded focus:outline-none focus:ring-1 focus:ring-[#003366]"
        />

        <input
          type="text"
          placeholder="Brand (e.g. NTN, NSK)..."
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-40 p-2 bg-slate-50 border rounded focus:outline-none"
        />

        <input
          type="text"
          placeholder="Category (e.g. Deep Groove)..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48 p-2 bg-slate-50 border rounded focus:outline-none"
        />

        <button
          type="submit"
          className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 font-black px-5 py-2 rounded uppercase tracking-wider"
        >
          Filter Catalog
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white rounded border overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#003366] text-white text-[10px] uppercase font-mono">
            <tr>
              <th className="p-3">Part Number</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Category</th>
              <th className="p-3">Dimensions (IDxODxW)</th>
              <th className="p-3">Stock Status</th>
              <th className="p-3">Price (INR)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {products.map((p) => {
              const isCompared = compareItems.some((c) => c.id === p.id || c.partNumber === p.partNumber);

              return (
                <tr key={p.id || p.partNumber} className="hover:bg-slate-50 font-mono">
                  <td className="p-3 font-bold text-[#003366]">
                    <button onClick={() => setSelectedProduct(p)} className="hover:underline">
                      {p.partNumber}
                    </button>
                  </td>
                  <td className="p-3 font-sans font-bold text-slate-800">{p.brand}</td>
                  <td className="p-3 font-sans text-slate-600">{p.category}</td>
                  <td className="p-3 text-slate-500">{p.innerDiameter} x {p.outerDiameter} x {p.width} mm</td>
                  <td className="p-3 text-emerald-600 font-bold font-sans">● {p.stockStatus}</td>
                  <td className="p-3 font-black text-slate-900">₹{p.price}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2 font-sans">
                      <button
                        onClick={() => addToQuote(p)}
                        className="bg-[#f2cc4d] hover:bg-[#e0b434] text-slate-950 px-3 py-1 rounded text-[10px] font-black uppercase"
                      >
                        Add to Quote
                      </button>
                      <button
                        onClick={() => toggleCompare(p)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition ${isCompared ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-white text-slate-500'}`}
                      >
                        {isCompared ? 'Comparing' : 'Compare'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            &larr; Previous Page
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border rounded bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            Next Page &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-500">Loading catalog parameters...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
