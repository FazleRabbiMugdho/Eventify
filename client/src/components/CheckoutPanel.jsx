import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { 
  X, Minus, Plus, User, Mail, Phone, 
  Shield, CheckCircle, MapPin 
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { secrets } from '../secrets';

const CheckoutPanel = ({ event, dm, onClose, onConfirmed }) => {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [details, setDetails] = useState({
    name: user?.user_name || user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // Keep details in sync if user state changes
  useEffect(() => {
    if (user) {
      setDetails(prev => ({
        ...prev,
        name: prev.name || user.user_name || user.full_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || ""
      }));
    }
  }, [user]);

  const serviceFee = 550;
  const subtotal = event.price * quantity;
  const total = subtotal + serviceFee;

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s\.]{4,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^01[3-9]\d{8}$/; // Exact regex from Register.jsx

    if (!nameRegex.test(details.name)) {
      newErrors.name = "Invalid name (Use at least 4 letters)";
    }
    if (!emailRegex.test(details.email)) {
      newErrors.email = "Only @gmail.com addresses allowed";
    }
    
    if (details.phone.length < 11) {
      newErrors.phone = "Phone number must be at least 11 digits";
    } else if (!phoneRegex.test(details.phone)) {
      newErrors.phone = "Invalid Bangladeshi phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePayment = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${secrets.backendEndpoint}/api/bkash/create`, {
        amount: total,
        ticket_id: event.id,
        customer_name: details.name,
        customer_email: details.email,
        customer_phone: details.phone
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.bkashURL) {
        window.location.href = response.data.bkashURL;
      } else {
        alert(`Error: ${response.data.message}`);
        setLoading(false);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Connection failed'}`);
      setLoading(false);
    }
  };

  const inputClass = (error) => `
    w-full px-4 py-3.5 rounded-xl outline-none font-bold text-sm
    transition-all border ${error ? 'border-rose-500 ring-4 ring-rose-500/10' : 'focus:ring-4 focus:border-indigo-400'}
    ${dm
      ? "bg-[#0F0121] border-white/10 text-white placeholder:text-slate-600 focus:ring-indigo-500/10"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500/10"
    }
  `;

  if (isSuccess) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" />
        <div className={`fixed z-[100] inset-y-0 right-0 w-full sm:max-w-[520px] shadow-2xl ${dm ? "bg-[#0F0121]" : "bg-white"}`}>
          <div className="h-full overflow-y-auto p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className={`text-2xl font-black ${dm ? "text-white" : "text-slate-900"}`}>Booking Confirmed!</h3>
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              <QRCodeSVG value={JSON.stringify({ event: event.title, tickets: quantity })} size={150} />
            </div>
            <button onClick={onClose} className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black">Back to Event</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className={`fixed z-[100] inset-y-0 right-0 w-full sm:max-w-[520px] shadow-2xl animate-in slide-in-from-right duration-500 ${dm ? "bg-[#0F0121]" : "bg-white"}`}>
        
        <div className={`px-6 py-5 flex items-center justify-between border-b ${dm ? "border-white/5" : "border-slate-100"}`}>
          <div>
            <h2 className={`text-xl font-black ${dm ? "text-white" : "text-slate-900"}`}>Order Checkout</h2>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">Review & Pay</p>
          </div>
          <button onClick={onClose} className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 h-[calc(100vh-180px)] overflow-y-auto no-scrollbar px-6 py-6 space-y-6">
          <div className={`rounded-3xl overflow-hidden border ${dm ? "border-white/5" : "border-slate-100"}`}>
            <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
            <div className={`p-4 ${dm ? "bg-[#1E0B3B]" : "bg-slate-50"}`}>
              <h3 className={`font-black text-sm ${dm ? "text-white" : "text-slate-900"}`}>{event.title}</h3>
              <p className="text-slate-400 text-xs font-bold mt-1 flex items-center gap-2">
                <MapPin size={12} /> {event.location}
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex items-center justify-between ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}`}>
            <div>
              <p className={`font-black text-sm ${dm ? "text-white" : "text-slate-900"}`}>Ticket Quantity</p>
              <p className="text-slate-400 text-xs font-bold">৳{event.price.toLocaleString()} per unit</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600/10 text-indigo-500"><Minus size={16} /></button>
              <span className={`font-black text-lg ${dm ? "text-white" : "text-slate-900"}`}>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-600/10 text-indigo-500"><Plus size={16} /></button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Personal Details</h4>
            <div className="space-y-3">
              <div>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="name" value={details.name} onChange={handleDetailChange} placeholder="Full Name" className={`${inputClass(errors.name)} pl-11`} />
                </div>
                {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</p>}
              </div>
              <div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="email" value={details.email} onChange={handleDetailChange} placeholder="Gmail Address" className={`${inputClass(errors.email)} pl-11`} />
                </div>
                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</p>}
              </div>
              <div>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="phone" value={details.phone} onChange={handleDetailChange} placeholder="BD Phone Number" className={`${inputClass(errors.phone)} pl-11`} />
                </div>
                {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border space-y-3 ${dm ? "bg-[#1E0B3B] border-white/5" : "bg-slate-50 border-slate-100"}`}>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Subtotal</span>
              <span className={dm ? "text-white" : "text-slate-700"}>৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Platform Fee</span>
              <span className={dm ? "text-white" : "text-slate-700"}>৳{serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5">
              <span className={`font-black text-base ${dm ? "text-white" : "text-slate-900"}`}>Grand Total</span>
              <span className="font-black text-base text-indigo-500">৳{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${dm ? "border-white/5 bg-[#0F0121]" : "border-slate-100 bg-white"}`}>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? "bg-slate-500" : "bg-[#E2136E] shadow-pink-600/20"}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.bkash.com/sites/all/themes/bkashtheme/img/bkash-logo.png" alt="" className="h-5 brightness-0 invert" />
                Pay ৳{total.toLocaleString()}
              </>
            )}
          </button>
          <div className="mt-3 flex items-center justify-center gap-2 opacity-50">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure SSL Encrypted</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPanel;
