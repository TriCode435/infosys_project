import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Award, Users, Heart, Globe } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="container py-12" style={{ paddingBottom: '8rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Our <span className="gradient-text">Mission</span></h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    WellNest was founded on the belief that peak performance is a symphony of training, nutrition, and recovery. We provide the elite tools necessary to master all three.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                    { title: "Precision", icon: <Zap />, desc: "Data-driven insights that eliminate guesswork from your fitness journey." },
                    { title: "Privacy", icon: <Shield />, desc: "Your health data is encrypted and secure. You own your metrics." },
                    { title: "Community", icon: <Users />, desc: "Direct connection with world-class trainers and dedicated athletes." }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="card p-10 text-center"
                    >
                        <div className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                        <p className="text-slate-500 font-medium">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <section className="card p-12 bg-slate-900 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-4xl font-black mb-6 tracking-tight font-sans">The <span className="text-primary italic">Elite</span> Ecosystem</h2>
                        <p className="text-slate-400 text-lg mb-8 font-medium">
                            Join thousands of athletes who trust WellNest to manage their daily grind. From macro-nutrient ratios to sleep-cycle analysis, we've built the ultimate platform for serious results.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-3xl font-black text-white">50k+</p>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">200+</p>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Verified Trainers</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                <Award size={48} className="text-primary opacity-50" />
                            </div>
                            <div className="aspect-square bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                <Heart size={48} className="text-secondary opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary opacity-20 blur-[100px]" />
            </section>
        </div>
    );
};

export default AboutPage;
