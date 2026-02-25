import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram } from 'lucide-react';

const ContactPage = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="container py-12" style={{ paddingBottom: '8rem' }}>
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="flex-1">
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Get in <span className="gradient-text">Touch</span></h1>
                    <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                        Have a question about our platform or need support with your training plan? Our team of experts is here to help.
                    </p>

                    <div className="space-y-8">
                        {[
                            { icon: <Mail />, label: "Email Us", detail: "support@wellnest.com" },
                            { icon: <Phone />, label: "Call Us", detail: "+1 (800) WELLNEST" },
                            { icon: <MapPin />, label: "Visit Us", detail: "Fitness District, CA 90210" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-primary">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-lg font-black text-slate-800">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-light hover:text-primary transition-all">
                            <Twitter size={20} />
                        </button>
                        <button className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-primary-light hover:text-primary transition-all">
                            <Instagram size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="card p-10 bg-white shadow-2xl space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                <input type="text" className="input-field" placeholder="John" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                <input type="text" className="input-field" placeholder="Doe" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" className="input-field" placeholder="john@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea className="input-field min-h-[150px]" placeholder="How can we help you?" required />
                        </div>

                        <button
                            type="submit"
                            disabled={sent}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${sent ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            {sent ? <Award size={22} /> : <Send size={22} />}
                            {sent ? 'Message Received!' : 'Broadcast Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
