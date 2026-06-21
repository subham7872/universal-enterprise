import React from 'react';
import { 
  Dribbble, Settings, Wrench, ShieldAlert, Layers, Compass, 
  Cpu, Zap, Disc, Sliders, PlayCircle, HelpCircle, ArrowRight
} from 'lucide-react';
import { CategoryTree, Product } from '../types';
import { CATEGORY_TREE } from '../data/bearingsData';

interface CategoriesPageProps {
  productsList: Product[];
  onSelectCategory: (categoryName: string) => void;
}

// Map top-level category IDs to specific icons for industrial feel
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  'ball-bearings': Disc,
  'roller-bearings': Layers,
  'thrust-bearings': Sliders,
  'housings': Settings,
  'linear-bearings': Compass,
  'automotive-parts': Cpu,
  'other-bearings': Dribbble,
  'parts-for-bearings': Zap,
  'snap-rings-seals': ShieldAlert,
  'tools-for-bearings': Wrench,
  'grease-lubrication': PlayCircle,
};

export default function CategoriesPage({ productsList, onSelectCategory }: CategoriesPageProps) {
  
  // Calculate total products in a category (by matching exact category names or subcategory names)
  const getCategoryCount = (catTree: CategoryTree): number => {
    let count = 0;
    
    // Direct match (if product has top level category name)
    const directMatches = productsList.filter(p => p.category === catTree.name).length;
    count += directMatches;

    // Subcategory matches
    if (catTree.subcategories) {
      catTree.subcategories.forEach(sub => {
        count += productsList.filter(p => p.category === sub.name).length;
      });
    }

    return count;
  };

  const getSubcategoryCount = (subName: string): number => {
    return productsList.filter(p => p.category === subName).length;
  };

  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 sm:p-10 space-y-10 shadow-sm" id="categories-root">
      
      {/* Page Title Hero Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#003366] text-[#F4C542] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono">
            ENGINEERING DIRECTORY
          </span>
          <h2 className="text-4xl md:text-[52px] font-light text-[#003366] uppercase tracking-tight leading-tight mt-3">
            FAG & INA Authorized Bearing Catalogue
          </h2>
          <p className="text-slate-500 text-sm font-semibold max-w-2xl mt-1 leading-relaxed">
            Seamlessly navigate our 11 industrial product categories, containing high performance components, linear rail tolerances, and specific greases.
          </p>
        </div>
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs text-center md:text-right font-mono shrink-0">
          <span className="text-slate-400 text-xs font-bold block uppercase">Active Database Index</span>
          <strong className="text-2xl font-black text-[#003366] block">{productsList.length} Precision Parts</strong>
        </div>
      </div>

      {/* Grid of 11 categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_TREE.map((category) => {
          const IconComponent = CATEGORY_ICONS[category.id] || HelpCircle;
          const totalCount = getCategoryCount(category);

          return (
            <div 
              key={category.id} 
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0A84FF] transition-all flex flex-col justify-between group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#003366] text-[#F4C542] group-hover:scale-110 transition rounded-sm shadow-xs">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 uppercase tracking-tight group-hover:text-[#0A84FF] transition text-sm sm:text-base leading-tight">
                      {category.name}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mt-0.5 block">
                      Category Group
                    </span>
                  </div>
                </div>
                
                {/* Total Counter badge */}
                <span className="bg-[#003366]/5 border border-[#003366]/10 text-[#003366] font-mono font-black text-xs px-2 py-1 rounded">
                  {totalCount} Models
                </span>
              </div>

              {/* Subcategories list */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {category.subcategories.slice(0, 5).map((sub) => {
                      const subCount = getSubcategoryCount(sub.name);
                      return (
                        <li key={sub.id}>
                          <button
                            onClick={() => onSelectCategory(sub.name)}
                            className="w-full text-left text-slate-600 hover:text-[#0A84FF] font-semibold transition flex justify-between items-center py-1 group/item"
                          >
                            <span className="truncate pr-2 group-hover/item:translate-x-1 duration-150 block">
                              • {sub.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold shrink-0">
                              {subCount}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    {category.subcategories.length > 5 && (
                      <li className="text-[11px] text-slate-400 font-bold font-mono pt-1">
                        + {category.subcategories.length - 5} More subdivisions
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="text-xs text-slate-400 italic py-4">
                    Direct custom line. Please specify part number during quote application.
                  </div>
                )}

                {/* Sourcing Action */}
                <button
                  onClick={() => onSelectCategory(category.name)}
                  className="w-full mt-2 bg-slate-50 hover:bg-[#003366] text-[#003366] hover:text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded border border-slate-200 transition flex items-center justify-center gap-1"
                >
                  Explore Complete Segment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
