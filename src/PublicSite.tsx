import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, X, Calendar, Clock, MapPin, Phone, Mail, 
  CheckCircle, ArrowRight, Star, Shield, Zap, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// --- NAVBAR SECTION ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Services', href: 'services' },
    { name: 'Book Now', href: 'booking' },
    { name: 'Contact', href: 'contact' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollTo('home')}>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Almaris<span className="text-indigo-600">.</span></span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-colors ${link.name === 'Book Now' ? 'bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-3 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// --- HERO SECTION ---
const Hero = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-slate-50/50" />
        <img 
          src="https://picsum.photos/seed/workspace/1920/1080?blur=2" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide mb-6">
              Premium Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-md"
              >
                Book an Appointment
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex justify-center items-center px-8 py-4 border border-slate-300 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                Explore Services
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- ABOUT SECTION ---
const About = ({ text }: { text: string }) => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 lg:mb-0"
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-6">
              Dedicated to your success since 2010.
            </h2>
            <div className="text-lg text-slate-600 mb-8 leading-relaxed whitespace-pre-wrap">
              {text}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-indigo-600 pl-4">
                <p className="text-3xl font-bold text-slate-900">15+</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Years Experience</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <p className="text-3xl font-bold text-slate-900">2.5k</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Happy Clients</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://picsum.photos/seed/teamwork/800/600" 
                alt="Our Team" 
                className="object-cover w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Average Rating</p>
                  <p className="text-xl font-bold text-slate-900">4.9/5.0</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- SERVICES SECTION ---
const Services = () => {
  const services = [
    {
      title: 'Strategic Consulting',
      description: 'Comprehensive business analysis and strategic planning to accelerate your growth and market presence.',
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      price: 'From $199'
    },
    {
      title: 'Technical Implementation',
      description: 'Seamless integration of modern technologies and software solutions tailored to your operational needs.',
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      price: 'From $299'
    },
    {
      title: 'Performance Optimization',
      description: 'Analyze and optimize your existing workflows to maximize efficiency and reduce operational costs.',
      icon: <Star className="h-6 w-6 text-indigo-600" />,
      price: 'From $149'
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate-600">
            Tailored solutions designed to meet the specific demands of your business. Choose the service that fits your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {React.cloneElement(service.icon, { className: 'h-7 w-7 transition-colors group-hover:text-white' })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                <span className="text-lg font-semibold text-slate-900">{service.price}</span>
                <button 
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
                >
                  Book <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- BOOKING SECTION ---
const Booking = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', date: '', time: '', service: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', date: '', time: '', service: '' });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("There was an error submitting your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="booking" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl overflow-hidden shadow-2xl lg:flex">
          <div className="lg:w-1/2 p-10 lg:p-16 text-white flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Ready to get started?</h2>
            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Schedule your consultation today. Fill out the form with your preferred date and time, and our team will confirm your appointment shortly.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-indigo-100">
                <CheckCircle className="h-6 w-6 mr-3 text-indigo-300" />
                No upfront commitment required
              </li>
              <li className="flex items-center text-indigo-100">
                <CheckCircle className="h-6 w-6 mr-3 text-indigo-300" />
                Free 30-minute initial consultation
              </li>
              <li className="flex items-center text-indigo-100">
                <CheckCircle className="h-6 w-6 mr-3 text-indigo-300" />
                Expert advice tailored to you
              </li>
            </ul>
          </div>
          
          <div className="lg:w-1/2 bg-slate-50 p-10 lg:p-16">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                <p className="text-slate-600">
                  Thank you for scheduling with us. We've sent a confirmation email with the details of your appointment.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Book another appointment
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">Select Service</label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-white"
                  >
                    <option value="" disabled>Choose a service...</option>
                    <option value="consulting">Strategic Consulting</option>
                    <option value="implementation">Technical Implementation</option>
                    <option value="optimization">Performance Optimization</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">Preferred Time</label>
                    <div className="relative">
                      <select
                        id="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors bg-white"
                      >
                        <option value="" disabled>Select a time...</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors mt-4 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- CONTACT SECTION ---
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600">
            Have a question or need more information? Reach out to us directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Office Location</h3>
                <p className="mt-2 text-base text-slate-600">
                  123 Business Avenue<br />
                  Suite 400<br />
                  San Francisco, CA 94107
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Phone</h3>
                <p className="mt-2 text-base text-slate-600">
                  +1 (555) 123-4567<br />
                  Mon-Fri 9am to 6pm PST
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Email</h3>
                <p className="mt-2 text-base text-slate-600">
                  hello@almaris.example.com<br />
                  support@almaris.example.com
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {isSubmitted ? (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center h-full">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle className="h-8 w-8 text-green-600" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                 <p className="text-slate-600">We'll get back to you as soon as possible.</p>
               </div>
            ) : (
              <form className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input type="email" id="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input type="text" id="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="How can we help?" />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea id="message" required value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FOOTER SECTION ---
const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white tracking-tight mb-4 block">Almaris<span className="text-indigo-500">.</span></span>
            <p className="text-slate-400 max-w-sm">
              Professional service solutions designed to help your business grow and thrive in a competitive landscape.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition-colors">Book Appointment</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Almaris Service Theme. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social placeholders */}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN COMPONENT ---
export default function PublicSite() {
  const [content, setContent] = useState({
    heroTitle: 'Elevate your business with professional solutions.',
    heroSubtitle: 'We provide top-tier consulting and service solutions tailored to your unique needs. Book an appointment today and let\'s build something great together.',
    aboutText: 'At Almaris, we believe in delivering exceptional quality and measurable results. Our team of industry experts works closely with you to understand your challenges and implement strategies that drive growth.\n\nWhether you need strategic consulting, technical implementation, or ongoing support, we have the expertise to help you navigate the complex business landscape.'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'content', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setContent({
          heroTitle: docSnap.data().heroTitle || content.heroTitle,
          heroSubtitle: docSnap.data().heroSubtitle || content.heroSubtitle,
          aboutText: docSnap.data().aboutText || content.aboutText
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
        <Hero title={content.heroTitle} subtitle={content.heroSubtitle} />
        <About text={content.aboutText} />
        <Services />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
