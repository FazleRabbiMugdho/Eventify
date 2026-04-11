import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { CheckCircle, Sparkles, Download, ArrowLeft, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const bookingId = searchParams.get('booking_id') || '0';
  const trxId = searchParams.get('trx_id') || 'N/A';
  const isDarkMode = document.documentElement.classList.contains('dark');

  const eventData = {
    name: "Test Concert 2026",
    date: "Dec 31, 2026",
    time: "08:00 PM",
    venue: "Dhaka Arena",
    location: "Purbachal, Dhaka",
    type: "General Admission"
  };

  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if (!element) return;

    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: isDarkMode ? '#1E0B3B' : '#FFFFFF',
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth / 3, imgHeight / 3]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 3, imgHeight / 3);
    pdf.save(`Eventify_Ticket_${bookingId}.pdf`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Eventify Ticket',
          text: `I just booked my ticket for ${eventData.name}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#0F0121]' : 'bg-slate-50'}`}>
      <div className="w-full max-w-5xl">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
              <CheckCircle size={40} className="text-white" />
            </div>
          </div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Booking Confirmed
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Your payment was processed successfully via bKash.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div 
            ref={ticketRef}
            className={`lg:col-span-2 rounded-[32px] overflow-hidden border shadow-2xl ${isDarkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-200"}`}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-300" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Official Entry Pass</span>
                  </div>
                  <h2 className="text-3xl font-black">{eventData.name}</h2>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center gap-2 text-indigo-100 text-sm">
                      <Calendar size={16} />
                      <span>{eventData.date} • {eventData.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-100 text-sm">
                      <MapPin size={16} />
                      <span>{eventData.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <TicketIcon size={64} className="opacity-20 rotate-12" />
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="space-y-6 text-left">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Attendee</p>
                  <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Verified User</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Venue Details</p>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{eventData.location}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Transaction ID</p>
                  <p className={`font-mono text-sm ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>{trxId}</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                <div className="p-4 bg-white rounded-3xl shadow-inner border border-slate-100 inline-block">
                  <QRCodeCanvas 
                    value={JSON.stringify({
                      event: eventData.name,
                      venue: eventData.venue,
                      date: eventData.date,
                      booking: bookingId,
                      trx: trxId,
                      status: "Verified"
                    })} 
                    size={140}
                    level="H"
                  />
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-tighter ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Scan for Entry Verification
                </p>
              </div>
            </div>

            <div className={`px-8 py-4 border-t flex flex-wrap justify-between items-center gap-4 ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
               <span className="text-slate-500 text-xs font-bold">Booking Ref: BKG-{bookingId.padStart(4, '0')}</span>
               <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-[#E2136E] rounded-full flex items-center justify-center text-white text-[10px] font-black">b</div>
                 <span className="text-[#E2136E] text-xs font-black uppercase">Processed by bKash</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className={`p-6 rounded-[32px] border ${isDarkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-200"}`}>
              <h4 className={`text-sm font-black mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Next Steps</h4>
              <div className="space-y-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              <ArrowLeft size={18} /> Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}