"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Save, Check, Plus, Package, Eye, X } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import { useCurrency } from "@/context/CurrencyContext";

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const { currency, exchangeRate, isLoading } = useCurrency();
  const currencySymbol = currency === 'NGN' ? '₦' : '$';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: product.name || "",
    price: product.price?.toString() || "",
    category: product.category || "Everyday Essentials",
    images: product.images ? (Array.isArray(product.images) ? product.images.join(',') : product.images) : "",
    colors: product.colors ? (Array.isArray(product.colors) ? product.colors.join(',') : product.colors) : "#16202C",
    sizes: product.sizes ? (Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes) : "S,M,L",
    description: product.description || "",
    material: product.material || "",
    careInstructions: product.careInstructions || "",
    stock: "100", // Stock is not in schema yet, keeping as mock
    discount: "0",
    discountType: "None",
    collection: product.collection || ""
  });

  // Initialize price with local currency once exchange rate is loaded
  useEffect(() => {
    if (!isLoading && product.price) {
      let displayPrice = product.price;
      let displayDiscount = 0;

      if (product.originalPrice) {
        displayPrice = product.originalPrice;
        displayDiscount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      }

      setFormData(prev => ({
        ...prev,
        price: (displayPrice * exchangeRate).toFixed(2),
        discount: displayDiscount.toFixed(0)
      }));
    }
  }, [exchangeRate, isLoading, product]);

  const imagesList = formData.images ? formData.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.name || !formData.price || !formData.images) {
      setError("Name, Price, and Images are required.");
      setIsSubmitting(false);
      return;
    }

    // Calculate basePrice and originalPrice
    const inputPrice = parseFloat(formData.price) / exchangeRate;
    const discountValue = parseFloat(formData.discount) || 0;
    
    let basePrice = inputPrice;
    let originalPrice = null;

    if (discountValue > 0) {
      originalPrice = inputPrice.toFixed(2);
      basePrice = inputPrice - (inputPrice * (discountValue / 100));
    }

    const result = await updateProduct(product.id, {
      ...formData,
      price: basePrice.toFixed(2),
      originalPrice: originalPrice
    });
    
    if (result.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(result.error || "Failed to update product");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full pt-4">
      <form onSubmit={handleSubmit}>
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Link href="/admin/products" className="hover:text-brand-midnight">Products</Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-semibold flex items-center gap-2">
              <Package size={16} /> Edit Product
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setIsPreviewing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 text-sm transition-colors"
            >
              <Eye size={16} /> Preview
            </button>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 text-sm transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-champagne/20 text-brand-midnight font-medium hover:bg-brand-champagne/30 text-sm transition-colors"
            >
              <Check size={16} /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium mb-6">
            {error}
          </div>
        )}

        {/* Form Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (General Info & Pricing) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* General Information Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-6">General Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name Product</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description Product</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 min-h-[120px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Size</label>
                    <p className="text-xs text-gray-400 mb-3 -mt-2">Pick Available Size</p>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => {
                        const isSelected = formData.sizes.includes(size);
                        return (
                          <div 
                            key={size}
                            onClick={() => {
                              const newSizes = isSelected 
                                ? formData.sizes.split(',').filter((s: string) => s !== size).join(',')
                                : [...formData.sizes.split(','), size].filter(Boolean).join(',');
                              setFormData({...formData, sizes: newSizes});
                            }}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                              isSelected ? 'bg-brand-champagne/20 text-brand-midnight' : 'bg-[#F8F9FA] text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {size}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
                    <p className="text-xs text-gray-400 mb-3 -mt-2">Enter hex codes or names, separated by commas</p>
                    <input 
                      type="text" 
                      value={formData.colors}
                      onChange={(e) => setFormData({...formData, colors: e.target.value})}
                      className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.colors.split(',').map((color: string, idx: number) => {
                        const trimmedColor = color.trim();
                        if (!trimmedColor) return null;
                        return (
                          <div 
                            key={idx} 
                            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: trimmedColor }}
                            title={trimmedColor}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                    <input 
                      type="text" 
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                      placeholder="e.g. 100% Cotton"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                    <input 
                      type="text" 
                      value={formData.careInstructions}
                      onChange={(e) => setFormData({...formData, careInstructions: e.target.value})}
                      className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                      placeholder="e.g. Dry clean only"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing And Stock Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-6">Pricing And Stock</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Pricing</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol}</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-[#F8F9FA] rounded-xl pl-8 pr-3.5 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  {parseFloat(formData.discount) > 0 && parseFloat(formData.price) > 0 && (
                    <p className="text-xs text-brand-charcoal mt-2">
                      Final Selling Price: <span className="font-medium text-brand-midnight">{currencySymbol}{(parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discount) / 100)).toFixed(2)}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 appearance-none"
                  >
                    <option>None</option>
                    <option>Seasonal Discount</option>
                    <option>Holiday Special</option>
                  </select>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column (Upload Img & Category) */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            
            {/* Upload Img Card */}
            <ImageUploader 
              images={imagesList}
              onChange={(newImages) => setFormData({...formData, images: newImages.join(',')})}
            />

            {/* Category Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-6">Category</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 appearance-none"
                >
                  <option>Everyday Essentials</option>
                  <option>Evening & Occasion</option>
                  <option>Outerwear & Layering</option>
                  <option>The Resort Collection</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
                <select 
                  value={formData.collection}
                  onChange={(e) => setFormData({...formData, collection: e.target.value})}
                  className="w-full bg-[#F8F9FA] rounded-xl p-3.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50 appearance-none"
                >
                  <option value="">None</option>
                  <option value="The SN24 Capsule">The SN24 Capsule</option>
                  <option value="The Midnight Navy Edit">The Midnight Navy Edit</option>
                  <option value="Soft White Minimalism">Soft White Minimalism</option>
                </select>
              </div>
            </div>
            
          </div>
          
        </div>
        </form>

      {/* Preview Modal */}
      {isPreviewing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-8 backdrop-blur-sm">
          <div className="bg-brand-softwhite w-full max-w-[1400px] h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
              <h2 className="text-lg font-display font-semibold text-brand-midnight">Product Preview</h2>
              <button 
                onClick={() => setIsPreviewing(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content (Storefront look) */}
            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
                <div className="w-full lg:w-[55%] xl:w-[60%]">
                  <ProductGallery images={imagesList.length > 0 ? imagesList : ["https://placehold.co/800x1000/F8F9FA/A0AEC0?text=No+Image"]} productName={formData.name || "Preview Product"} />
                </div>
                <div className="w-full lg:w-[45%] xl:w-[40%]">
                  <ProductInfo product={{
                    ...product,
                    ...formData,
                    price: parseFloat(formData.price) || 0,
                    images: imagesList.length > 0 ? imagesList : ["https://placehold.co/800x1000"],
                    colors: formData.colors ? formData.colors.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                    sizes: formData.sizes ? formData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                  } as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
