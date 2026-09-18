"use client";

import { useMemo } from "react";
import { MapPin, User, Mail, Phone, Building, Navigation } from "lucide-react";

export interface AddressFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  state: string;
  city: string;
  zip: string;
  notes?: string;
}

interface AddressFormProps {
  formData: AddressFormData;
  onChange: (updated: Partial<AddressFormData>) => void;
  error?: string;
}

export const NIGERIAN_STATES_DATA: Record<string, string[]> = {
  "Lagos": [
    "Lekki Phase 1 / Ikate",
    "Ikoyi",
    "Victoria Island (VI)",
    "Ajah / Sangotedo",
    "Ikeja / GRA",
    "Surulere",
    "Yaba / Ebute Metta",
    "Gbagada / Anthony",
    "Magodo / Shangisha",
    "Maryland / Mende",
    "Ogudu / Ojota",
    "Festac Town",
    "Alimosho / Egbeda",
    "Ikorodu",
    "Agege",
    "Apapa",
    "Oshodi / Isolo",
    "Other Lagos Zone"
  ],
  "Abuja (FCT)": [
    "Maitama",
    "Wuse 2",
    "Wuse Zone 1-7",
    "Garki 1 & 2",
    "Asokoro",
    "Central Business District (CBD)",
    "Jabi / Utako",
    "Gwarinpa Estate",
    "Guzape",
    "Apo / Lokogoma",
    "Kubwa",
    "Lugbe",
    "Other Abuja Zone"
  ],
  "Rivers": [
    "Port Harcourt (Old GRA)",
    "Port Harcourt (New GRA)",
    "Trans-Amadi Industrial Layout",
    "Rumuokoro / Choba",
    "Peter Odili Road",
    "Woji / Elelenwo",
    "Eleme",
    "Other Rivers Zone"
  ],
  "Oyo": [
    "Bodija / Old Bodija",
    "Jericho / GRA",
    "Oluyole Estate",
    "Ring Road / Iyaganku",
    "Ibadan North",
    "Ibadan South-West",
    "Oyo Town",
    "Other Oyo Zone"
  ],
  "Ogun": [
    "Abeokuta City",
    "Arepo / Magboro",
    "Mowe / Ibafo",
    "Ota / Sango",
    "Sagamu",
    "Ijebu Ode",
    "Other Ogun Zone"
  ],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Other Anambra Zone"],
  "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Other Delta Zone"],
  "Enugu": ["Enugu City / Independence Layout", "GRA Enugu", "New Haven", "Other Enugu Zone"],
  "Edo": ["Benin City / GRA", "Uselu", "Ikpoba Hill", "Other Edo Zone"],
  "Kano": ["Kano Municipal", "Nassarawa", "Fagge", "Tarauni", "Other Kano Zone"],
  "Kaduna": ["Kaduna North / Barnawa", "Kaduna South", "Zaria", "Other Kaduna Zone"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Other Akwa Ibom Zone"],
  "Abia": ["Aba", "Umuahia", "Other Abia Zone"],
  "Adamawa": ["Yola", "Jimeta", "Other Adamawa Zone"],
  "Bauchi": ["Bauchi City", "Other Bauchi Zone"],
  "Bayelsa": ["Yenagoa", "Other Bayelsa Zone"],
  "Benue": ["Makurdi", "Gboko", "Other Benue Zone"],
  "Borno": ["Maiduguri", "Other Borno Zone"],
  "Cross River": ["Calabar", "Ikom", "Other Cross River Zone"],
  "Ebonyi": ["Abakaliki", "Other Ebonyi Zone"],
  "Ekiti": ["Ado-Ekiti", "Other Ekiti Zone"],
  "Gombe": ["Gombe City", "Other Gombe Zone"],
  "Imo": ["Owerri", "Orlu", "Other Imo Zone"],
  "Jigawa": ["Dutse", "Other Jigawa Zone"],
  "Katsina": ["Katsina City", "Other Katsina Zone"],
  "Kebbi": ["Birnin Kebbi", "Other Kebbi Zone"],
  "Kogi": ["Lokoja", "Other Kogi Zone"],
  "Kwara": ["Ilorin", "Offa", "Other Kwara Zone"],
  "Nasarawa": ["Lafia", "Karu", "Other Nasarawa Zone"],
  "Niger": ["Minna", "Suleja", "Other Niger Zone"],
  "Ondo": ["Akure", "Ondo Town", "Other Ondo Zone"],
  "Osun": ["Osogbo", "Ile-Ife", "Other Osun Zone"],
  "Plateau": ["Jos", "Bukuru", "Other Plateau Zone"],
  "Sokoto": ["Sokoto City", "Other Sokoto Zone"],
  "Taraba": ["Jalingo", "Other Taraba Zone"],
  "Yobe": ["Damaturu", "Other Yobe Zone"],
  "Zamfara": ["Gusau", "Other Zamfara Zone"],
  "International (Outside Nigeria)": ["International Standard Address"]
};

export default function AddressForm({ formData, onChange, error }: AddressFormProps) {
  const stateList = useMemo(() => Object.keys(NIGERIAN_STATES_DATA), []);

  const availableLocalAreas = useMemo(() => {
    if (!formData.state || !NIGERIAN_STATES_DATA[formData.state]) {
      return [];
    }
    return NIGERIAN_STATES_DATA[formData.state];
  }, [formData.state]);

  const handleStateChange = (selectedState: string) => {
    const defaultLocalArea = NIGERIAN_STATES_DATA[selectedState]?.[0] || "";
    onChange({
      state: selectedState,
      city: defaultLocalArea
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div data-testid="checkout-error-banner" className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center gap-2">
          <span className="font-bold">Notice:</span> {error}
        </div>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            First Name *
          </label>
          <div className="relative">
            <input
              id="firstName"
              data-testid="shipping-firstName"
              type="text"
              placeholder="e.g. Adanna"
              value={formData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
              required
            />
            <User size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Last Name *
          </label>
          <div className="relative">
            <input
              id="lastName"
              data-testid="shipping-lastName"
              type="text"
              placeholder="e.g. Okonkwo"
              value={formData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
              required
            />
            <User size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Contact Row (Email & Phone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <input
              id="email"
              data-testid="shipping-email"
              type="email"
              placeholder="adanna@example.com"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
              required
            />
            <Mail size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-[10px] text-brand-graphite mt-1">Order receipt & tracking will be sent here.</p>
        </div>

        <div>
          <label htmlFor="phone" className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Phone Number (for Courier Dispatch) *
          </label>
          <div className="relative">
            <input
              id="phone"
              data-testid="shipping-phone"
              type="tel"
              placeholder="+234 800 123 4567"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
              required
            />
            <Phone size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-[10px] text-brand-graphite mt-1">Driver will call before arrival.</p>
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="address" className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
          Street Address / House Number *
        </label>
        <div className="relative">
          <input
            id="address"
            data-testid="shipping-address"
            type="text"
            placeholder="e.g. 14 Admiralty Way, Block B, Suite 4"
            value={formData.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
            required
          />
          <MapPin size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* State & Local Area Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State Selector */}
        <div>
          <label className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            State / Region *
          </label>
          <div className="relative">
            <select
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">-- Select State --</option>
              {stateList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <Building size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Local Area / LGA Selector */}
        <div>
          <label className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Local Area / City / Zone *
          </label>
          <div className="relative">
            {availableLocalAreas.length > 0 ? (
              <select
                value={formData.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">-- Select Local Area --</option>
                {availableLocalAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter City / Local Area"
                value={formData.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
                required
              />
            )}
            <Navigation size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Postal Code & Landmark Notes Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Postal / Zip Code
          </label>
          <input
            type="text"
            placeholder="100001"
            value={formData.zip}
            onChange={(e) => onChange({ zip: e.target.value })}
            className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-brand-midnight uppercase tracking-wider block mb-1.5">
            Delivery Landmark or Gate Code (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Opposite Palms Mall, Black Gate"
            value={formData.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="w-full bg-brand-softwhite border border-brand-stone rounded-xl py-3 px-4 text-sm text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne focus:ring-1 focus:ring-brand-champagne transition-all"
          />
        </div>
      </div>
    </div>
  );
}
