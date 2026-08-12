"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mainImage = images.length > 0 ? images[0] : null;
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file", e.target.files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.filePaths) {
        onChange([...images, ...data.filePaths]);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-6">Product Images</h3>
      
      {/* Main Image Preview */}
      <div className="bg-[#F8F9FA] rounded-2xl aspect-square mb-4 relative overflow-hidden flex items-center justify-center border border-gray-100">
        {mainImage ? (
          <Image src={mainImage} alt="Main preview" fill className="object-cover" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <span className="text-sm">Main Preview</span>
          </div>
        )}
      </div>
      
      {/* Thumbnails and Add Button */}
      <div className="flex flex-wrap gap-3 mb-6">
        {images.map((img, idx) => (
          <div key={idx} className="w-16 h-16 rounded-lg border border-gray-200 relative overflow-hidden group">
            <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => removeImage(idx)}
            >
              <X size={16} className="text-white" />
            </div>
          </div>
        ))}
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-lg border border-dashed border-brand-champagne/50 flex flex-col items-center justify-center text-brand-champagne bg-brand-champagne/5 cursor-pointer hover:bg-brand-champagne/10 transition-colors"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-champagne"></div>
          ) : (
            <Plus size={20} />
          )}
        </div>
      </div>
      
      {/* Add via URL */}
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
          className="flex-1 bg-[#F8F9FA] border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-champagne/50"
          placeholder="Paste image URL here..."
        />
        <button 
          type="button"
          onClick={handleAddUrl}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Add URL
        </button>
      </div>
      
      <input 
        type="file" 
        multiple 
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden" 
      />
      
      <p className="text-xs text-gray-500">
        You can upload multiple images. The first image will be the main display image.
      </p>
    </div>
  );
}
