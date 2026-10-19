import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  Save,
  Trash2,
  Copy,
  Download,
  Sparkles,
  PieChart,
  Layers,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BusinessCalculationItem } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FashionBusinessCalculatorProps {
  onOpenRegister?: () => void;
  className?: string;
}

export const FashionBusinessCalculator: React.FC<FashionBusinessCalculatorProps> = ({
  onOpenRegister,
  className = '',
}) => {
  const { studentUser } = useAuth();
  const { businessCalculations, saveBusinessCalculation, deleteBusinessCalculation } = useData();

  // Inputs
  const [title, setTitle] = useState('My Signature Capsule Piece');
  const [quantity, setQuantity] = useState<number>(10);
  const [fabricCost, setFabricCost] = useState<number>(3500);
  const [sewingCost, setSewingCost] = useState<number>(1800);
  const [accessoriesCost, setAccessoriesCost] = useState<number>(750);
  const [packagingCost, setPackagingCost] = useState<number>(450);
  const [marketingCost, setMarketingCost] = useState<number>(600);
  const [transportCost, setTransportCost] = useState<number>(350);
  const [labourCost, setLabourCost] = useState<number>(800);
  const [otherCost, setOtherCost] = useState<number>(250);

  // Pricing Mode: 'PRICE' (enter selling price) or 'TARGET_MARGIN' (enter desired profit margin %)
  const [pricingMode, setPricingMode] = useState<'PRICE' | 'TARGET_MARGIN'>('PRICE');
  const [sellingPriceInput, setSellingPriceInput] = useState<number>(14500);
  const [targetMarginInput, setTargetMarginInput] = useState<number>(40);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculations
  const calc = useMemo(() => {
    const qty = Math.max(1, Number(quantity) || 1);
    const fabric = Math.max(0, Number(fabricCost) || 0);
    const sewing = Math.max(0, Number(sewingCost) || 0);
    const accessories = Math.max(0, Number(accessoriesCost) || 0);
    const packaging = Math.max(0, Number(packagingCost) || 0);
    const marketing = Math.max(0, Number(marketingCost) || 0);
    const transport = Math.max(0, Number(transportCost) || 0);
    const labour = Math.max(0, Number(labourCost) || 0);
    const other = Math.max(0, Number(otherCost) || 0);

    const unitCost = fabric + sewing + accessories + packaging + marketing + transport + labour + other;
    const totalCost = unitCost * qty;

    let finalSellingPrice = 0;
    if (pricingMode === 'PRICE') {
      finalSellingPrice = Math.max(0, Number(sellingPriceInput) || 0);
    } else {
      // Selling price calculated from desired profit margin %:
      // Margin = (Price - Cost) / Price => Price = Cost / (1 - Margin/100)
      const marginDecimal = Math.min(0.95, Math.max(0.01, (Number(targetMarginInput) || 0) / 100));
      finalSellingPrice = Math.round(unitCost / (1 - marginDecimal));
    }

    const profitPerUnit = finalSellingPrice - unitCost;
    const totalProfit = profitPerUnit * qty;
    const markupPercent = unitCost > 0 ? ((finalSellingPrice - unitCost) / unitCost) * 100 : 0;
    const profitMargin = finalSellingPrice > 0 ? (profitPerUnit / finalSellingPrice) * 100 : 0;

    return {
      qty,
      fabric,
      sewing,
      accessories,
      packaging,
      marketing,
      transport,
      labour,
      other,
      unitCost,
      totalCost,
      sellingPrice: finalSellingPrice,
      profitPerUnit,
      totalProfit,
      markupPercent,
      profitMargin,
    };
  }, [
    quantity,
    fabricCost,
    sewingCost,
    accessoriesCost,
    packagingCost,
    marketingCost,
    transportCost,
    labourCost,
    otherCost,
    pricingMode,
    sellingPriceInput,
    targetMarginInput,
  ]);

  // Cost items for distribution chart
  const costBreakdown = useMemo(() => {
    const total = calc.unitCost || 1;
    return [
      { name: 'Fabric', val: calc.fabric, pct: Math.round((calc.fabric / total) * 100), color: '#dfb56c' },
      { name: 'Sewing / Tailoring', val: calc.sewing, pct: Math.round((calc.sewing / total) * 100), color: '#a62b3a' },
      { name: 'Labour', val: calc.labour, pct: Math.round((calc.labour / total) * 100), color: '#540d18' },
      { name: 'Accessories', val: calc.accessories, pct: Math.round((calc.accessories / total) * 100), color: '#f7e2a9' },
      { name: 'Packaging & Labels', val: calc.packaging, pct: Math.round((calc.packaging / total) * 100), color: '#c99a45' },
      { name: 'Marketing & Ads', val: calc.marketing, pct: Math.round((calc.marketing / total) * 100), color: '#9e7225' },
      { name: 'Transport & Freight', val: calc.transport, pct: Math.round((calc.transport / total) * 100), color: '#7a6452' },
      { name: 'Other Overheads', val: calc.other, pct: Math.round((calc.other / total) * 100), color: '#4a3d38' },
    ].filter((item) => item.val > 0);
  }, [calc]);

  // Saved calculations for student
  const studentCalcs = useMemo(() => {
    if (!studentUser) return [];
    return businessCalculations.filter((c) => c.studentRegNo === studentUser.regNumber || c.studentRegNo === 'DEMO');
  }, [businessCalculations, studentUser]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBusinessCalculation({
        studentRegNo: studentUser?.regNumber || 'DEMO',
        studentId: studentUser?.id,
        title: title.trim() || 'Untitled Fashion Piece',
        fabricCost: calc.fabric,
        sewingCost: calc.sewing,
        accessoriesCost: calc.accessories,
        packagingCost: calc.packaging,
        marketingCost: calc.marketing,
        transportCost: calc.transport,
        labourCost: calc.labour,
        otherCost: calc.other,
        quantity: calc.qty,
        totalCost: calc.totalCost,
        unitCost: calc.unitCost,
        sellingPrice: calc.sellingPrice,
        profitPerUnit: calc.profitPerUnit,
        totalProfit: calc.totalProfit,
        markupPercent: Number(calc.markupPercent.toFixed(2)),
        profitMargin: Number(calc.profitMargin.toFixed(2)),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (_) {
      alert('Failed to save calculation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(12, 9, 10);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(223, 181, 108);
    doc.setFontSize(18);
    doc.text('CEYLON STYLE STUDIO', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(247, 243, 235);
    doc.text('Fashion Business Cost & Profit Breakdown Sheet', 14, 28);

    doc.setFontSize(10);
    doc.setTextColor(184, 175, 162);
    doc.text(`Project Title: ${title}`, 14, 36);
    doc.text(`Production Batch: ${calc.qty} Units`, 14, 42);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 48);

    const tableData = [
      ['Fabric Cost per Piece', `Rs. ${calc.fabric.toLocaleString()}`, `Rs. ${(calc.fabric * calc.qty).toLocaleString()}`],
      ['Sewing / Tailoring per Piece', `Rs. ${calc.sewing.toLocaleString()}`, `Rs. ${(calc.sewing * calc.qty).toLocaleString()}`],
      ['Labour Cost per Piece', `Rs. ${calc.labour.toLocaleString()}`, `Rs. ${(calc.labour * calc.qty).toLocaleString()}`],
      ['Accessories & Zippers', `Rs. ${calc.accessories.toLocaleString()}`, `Rs. ${(calc.accessories * calc.qty).toLocaleString()}`],
      ['Branded Packaging & Hangtags', `Rs. ${calc.packaging.toLocaleString()}`, `Rs. ${(calc.packaging * calc.qty).toLocaleString()}`],
      ['Marketing & Ad Spend', `Rs. ${calc.marketing.toLocaleString()}`, `Rs. ${(calc.marketing * calc.qty).toLocaleString()}`],
      ['Transport / Deliveries', `Rs. ${calc.transport.toLocaleString()}`, `Rs. ${(calc.transport * calc.qty).toLocaleString()}`],
      ['Other Atelier Overheads', `Rs. ${calc.other.toLocaleString()}`, `Rs. ${(calc.other * calc.qty).toLocaleString()}`],
      ['TOTAL COST', `Rs. ${calc.unitCost.toLocaleString()} / unit`, `Rs. ${calc.totalCost.toLocaleString()}`],
      ['SELLING PRICE', `Rs. ${calc.sellingPrice.toLocaleString()} / unit`, `Rs. ${(calc.sellingPrice * calc.qty).toLocaleString()}`],
      ['ESTIMATED PROFIT', `Rs. ${calc.profitPerUnit.toLocaleString()} / unit`, `Rs. ${calc.totalProfit.toLocaleString()}`],
      ['PROFIT MARGIN %', `${calc.profitMargin.toFixed(1)}%`, `Markup: ${calc.markupPercent.toFixed(1)}%`],
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Cost / Revenue Item', 'Unit Value', 'Batch Total']],
      body: tableData,
      theme: 'grid',
      styles: { textColor: [247, 243, 235], fillColor: [24, 18, 20] },
      headStyles: { fillColor: [84, 13, 24], textColor: [247, 226, 169] },
    });

    doc.setFontSize(8);
    doc.setTextColor(130, 120, 110);
    doc.text(
      'Disclaimer: These calculations are estimates for educational and planning purposes. Actual business costs and profits may vary.',
      14,
      doc.internal.pageSize.getHeight() - 15
    );

    doc.save(`${title.replace(/\s+/g, '_')}_Costing.pdf`);
  };

  const loadSavedCalc = (c: BusinessCalculationItem) => {
    setTitle(c.title);
    setQuantity(c.quantity);
    setFabricCost(c.fabricCost);
    setSewingCost(c.sewingCost);
    setAccessoriesCost(c.accessoriesCost);
    setPackagingCost(c.packagingCost);
    setMarketingCost(c.marketingCost);
    setTransportCost(c.transportCost);
    setLabourCost(c.labourCost);
    setOtherCost(c.otherCost);
    setSellingPriceInput(c.sellingPrice);
    setPricingMode('PRICE');
  };

  return (
    <section id="calculator" className={`py-20 sm:py-24 bg-[#0a0708] relative border-t border-[#dfb56c]/25 ${className}`}>
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#540d18]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#dfb56c]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#540d18]/50 border border-[#dfb56c]/40 text-[#f7e2a9] text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <Calculator className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>Fashion Entrepreneurship Suite</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            BUILD YOUR FASHION BUSINESS
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#dfb56c] font-mono uppercase tracking-wider">
            Understand your product cost before deciding your selling price
          </p>
          <p className="mt-2 text-xs sm:text-sm text-[#b8afa2] font-sinhala max-w-2xl mx-auto leading-relaxed">
            ඇඳුමක් නිර්මාණය කිරීමට පෙර, රෙදි වියදම, මැහුම් කුලිය, ලේබල් සහ දැන්වීම් වියදම් නිවැරදිව ගණනය කර සැබෑ ලාභය සහ සාධාරණ විකුණුම් මිල තීරණය කරන්න.
          </p>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Main Grid: Inputs on Left, Real-time Visual Results on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: Cost Inputs & Controls */}
          <div className="lg:col-span-7 bg-[#141011] p-6 sm:p-8 rounded-sm border border-[#dfb56c]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#dfb56c] block mb-1">
                  Product / Collection Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Red Velvet Party Dress - Batch 01"
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-sm text-sm text-[#f7f3eb] focus:border-[#dfb56c] focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-32">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#a89f91] block mb-1">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-sm text-sm text-[#f7f3eb] focus:border-[#dfb56c] focus:outline-none text-center font-mono font-bold"
                />
              </div>
            </div>

            {/* Direct Cost Item Inputs */}
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#f7e2a9] font-bold block mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#dfb56c]" /> Direct Production Costs (Per Unit in LKR)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Fabric Cost (රෙදි වියදම)', val: fabricCost, set: setFabricCost, note: 'Silk, linen, lining fabrics' },
                  { label: 'Sewing / Tailoring (මැහුම් කුලිය)', val: sewingCost, set: setSewingCost, note: 'Sample stitching or tailor fee' },
                  { label: 'Labour / Pattern Craft (ශ්‍රම වියදම)', val: labourCost, set: setLabourCost, note: 'Manual drafting & cutting' },
                  { label: 'Accessories & Trims (උපාංග)', val: accessoriesCost, set: setAccessoriesCost, note: 'Zippers, buttons, lace' },
                  { label: 'Packaging & Labels (ඇසුරුම්)', val: packagingCost, set: setPackagingCost, note: 'Boxes, tags, satin ribbons' },
                  { label: 'Marketing & Ad Spend (දැන්වීම්)', val: marketingCost, set: setMarketingCost, note: 'Social media boost per unit' },
                  { label: 'Transport & Freight (ප්‍රවාහන)', val: transportCost, set: setTransportCost, note: 'Courier or delivery fee' },
                  { label: 'Other Overheads (වෙනත් වියදම්)', val: otherCost, set: setOtherCost, note: 'Thread, electricity, studio' },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-black/40 rounded-sm border border-white/5 hover:border-[#dfb56c]/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-[#d5cfc4] font-medium font-sinhala">{item.label}</label>
                      <span className="text-[10px] text-[#a89f91] font-mono">LKR</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#dfb56c] font-mono">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        value={item.val}
                        onChange={(e) => item.set(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full pl-10 pr-3 py-2 bg-black/60 border border-white/10 rounded-sm text-sm text-[#f7f3eb] font-mono font-bold focus:border-[#dfb56c] focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-[#7d7469] block mt-1">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Mode Toggle: Direct Selling Price vs Target Profit Margin % */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-[#f7e2a9] font-bold">
                  Pricing Strategy &amp; Margin Mode
                </span>
                <div className="flex items-center gap-1 p-1 bg-black/60 rounded border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setPricingMode('PRICE')}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      pricingMode === 'PRICE' ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]' : 'text-[#a89f91]'
                    }`}
                  >
                    Enter Selling Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingMode('TARGET_MARGIN')}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      pricingMode === 'TARGET_MARGIN' ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]' : 'text-[#a89f91]'
                    }`}
                  >
                    Target Profit Margin %
                  </button>
                </div>
              </div>

              {pricingMode === 'PRICE' ? (
                <div className="p-4 bg-gradient-to-r from-[#241317] to-black/60 rounded border border-[#dfb56c]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="text-xs text-[#f7e2a9] font-bold block mb-1 font-mono uppercase tracking-wider">
                      Selling Price Per Piece (විකුණුම් මිල)
                    </label>
                    <span className="text-[11px] text-[#b8afa2]">The amount your customer pays per dress</span>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3 top-2.5 text-xs text-[#dfb56c] font-mono">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      value={sellingPriceInput}
                      onChange={(e) => setSellingPriceInput(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-10 pr-3 py-2.5 bg-black border border-[#dfb56c] rounded text-base text-[#f7f3eb] font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-[#241317] to-black/60 rounded border border-[#dfb56c]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="text-xs text-[#f7e2a9] font-bold block mb-1 font-mono uppercase tracking-wider">
                      Desired Profit Margin % (ඉලක්කගත ලාභ ප්‍රතිශතය)
                    </label>
                    <span className="text-[11px] text-[#b8afa2]">System computes ideal luxury retail price</span>
                  </div>
                  <div className="relative w-full sm:w-36">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={targetMarginInput}
                      onChange={(e) => setTargetMarginInput(Math.min(90, Math.max(1, parseFloat(e.target.value) || 1)))}
                      className="w-full px-3 py-2.5 bg-black border border-[#dfb56c] rounded text-base text-[#f7f3eb] font-mono font-bold focus:outline-none text-center"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#dfb56c] font-mono">%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Save & Export */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {studentUser ? (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-3d-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    {saveSuccess ? <Check className="w-4 h-4 text-green-950" /> : <Save className="w-4 h-4" />}
                    <span>{saveSuccess ? 'Saved to Account ✓' : 'Save Calculation'}</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenRegister}
                    className="btn-3d-burgundy px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                    <span>Login to Save to Student Portfolio</span>
                  </button>
                )}

                <button
                  onClick={handleExportPDF}
                  className="btn-3d-secondary px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                  title="Export Costing PDF"
                >
                  <Download className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Export PDF</span>
                </button>
              </div>

              <span className="text-[11px] text-[#8e8579] font-mono">Formula: True Cost vs Margin</span>
            </div>
          </div>

          {/* RIGHT 5 COLS: Real-time Visual Financial KPI Cards & Cost Chart */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary KPI Summary Card */}
            <div className="p-6 sm:p-7 rounded-sm bg-gradient-to-br from-[#1c1214] via-[#241317] to-[#141011] border-2 border-[#dfb56c] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#dfb56c]/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#dfb56c] font-bold block mb-4">
                Financial Summary • Production Batch ({calc.qty} pcs)
              </span>

              {/* 4 Big Numbers Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 bg-black/50 border border-white/10 rounded">
                  <span className="text-[10px] font-mono uppercase text-[#a89f91] block">Cost Per Piece</span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-white block mt-0.5">
                    Rs. {calc.unitCost.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#7d7469]">Total: Rs. {calc.totalCost.toLocaleString()}</span>
                </div>

                <div className="p-3.5 bg-black/50 border border-[#dfb56c]/30 rounded">
                  <span className="text-[10px] font-mono uppercase text-[#dfb56c] block">Selling Price</span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-[#f7e2a9] block mt-0.5">
                    Rs. {calc.sellingPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#a89f91]">Gross: Rs. {(calc.sellingPrice * calc.qty).toLocaleString()}</span>
                </div>

                <div className="p-3.5 bg-black/60 border border-green-500/30 rounded">
                  <span className="text-[10px] font-mono uppercase text-green-400 block">Profit Per Unit</span>
                  <span className={`text-lg sm:text-xl font-mono font-bold block mt-0.5 ${calc.profitPerUnit >= 0 ? 'text-green-300' : 'text-red-400'}`}>
                    Rs. {calc.profitPerUnit.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#7d7469]">Net per garment</span>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-[#540d18] to-black border border-[#dfb56c] rounded shadow-lg">
                  <span className="text-[10px] font-mono uppercase text-[#f7e2a9] block font-bold">Total Batch Profit</span>
                  <span className={`text-xl sm:text-2xl font-mono font-bold block mt-0.5 ${calc.totalProfit >= 0 ? 'text-[#fff3d1]' : 'text-red-400'}`}>
                    Rs. {calc.totalProfit.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#dfb56c] font-bold">Estimated Net</span>
                </div>
              </div>

              {/* Profit Margin vs Markup Ratio Indicator */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a89f91]">Profit Margin % (on Sales):</span>
                  <span className={`font-bold text-sm ${calc.profitMargin >= 30 ? 'text-green-400' : 'text-[#f7e2a9]'}`}>
                    {calc.profitMargin.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#a89f91]">Markup % (on Cost):</span>
                  <span className="text-white font-bold">{calc.markupPercent.toFixed(1)}%</span>
                </div>

                {/* Progress bar visual */}
                <div className="h-2 bg-black/70 rounded-full overflow-hidden border border-white/10 mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#dfb56c] to-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, calc.profitMargin))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Cost Breakdown Bar Chart */}
            <div className="p-6 bg-[#141011] rounded-sm border border-white/10 shadow-xl space-y-4">
              <span className="text-xs uppercase font-mono tracking-wider text-[#dfb56c] font-bold flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5" /> Unit Cost Breakdown Distribution
              </span>

              {/* Stacked Proportional Bar */}
              <div className="h-4 rounded-sm overflow-hidden flex bg-black border border-white/10">
                {costBreakdown.map((item) => (
                  <div
                    key={item.name}
                    title={`${item.name}: ${item.pct}% (Rs. ${item.val})`}
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    className="h-full hover:brightness-125 transition-all"
                  />
                ))}
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                {costBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#d5cfc4] truncate">{item.name}:</span>
                    <span className="text-[#f7e2a9] font-mono font-bold ml-auto">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Educational Disclaimer */}
            <div className="p-3.5 rounded bg-black/70 border border-white/10 text-[11px] text-[#8e8579] flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-[#dfb56c] shrink-0 mt-0.5" />
              <span>
                <strong>Educational Notice:</strong> These calculations are estimates for educational and planning purposes. Actual business costs, supplier pricing, waste margins, and profits may vary based on market conditions.
              </span>
            </div>

            {/* Saved student calculations list if available */}
            {studentUser && studentCalcs.length > 0 && (
              <div className="p-5 bg-[#141011] rounded-sm border border-[#dfb56c]/30 shadow-xl space-y-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#dfb56c] font-bold block">
                  My Saved Costing Sheets ({studentCalcs.length})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {studentCalcs.map((sc) => (
                    <div
                      key={sc.id}
                      className="p-2.5 bg-black/60 rounded border border-white/5 hover:border-[#dfb56c]/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 cursor-pointer" onClick={() => loadSavedCalc(sc)}>
                        <h5 className="text-[#f7f3eb] font-bold truncate">{sc.title}</h5>
                        <span className="text-[10px] text-[#a89f91] font-mono">
                          Unit: Rs. {sc.unitCost} • Sell: Rs. {sc.sellingPrice} ({sc.profitMargin}% margin)
                        </span>
                      </div>
                      <button
                        onClick={() => deleteBusinessCalculation(sc.id)}
                        className="p-1 text-[#8e8579] hover:text-red-400"
                        title="Delete calculation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
