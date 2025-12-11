"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";
import Container from "@/components/Container/Container";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import { useProjects } from "@/hooks/useProjects";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// Fixed hex colors for social platforms
const socialColors = {
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  instagram: "#E4405F",
};

export default function Contact() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    project: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const { projects, isLoading, isError } = useProjects();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: activeTab === "contact" ? formData.subject : null,
        project: activeTab === "project" ? formData.project : null,
        message: formData.message,
        type: activeTab,
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Success
      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        project: "",
        message: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "contact", label: "Contact Général", icon: Mail },
    { id: "project", label: "Parler d'un Projet", icon: Send },
    { id: "volunteer", label: "Devenir Bénévole", icon: Send },
  ];

  const getFormTitle = () => {
    switch (activeTab) {
      case "project":
        return "Participer à un Projet";
      case "volunteer":
        return "Devenir Bénévole";
      default:
        return "Contactez-nous";
    }
  };

  const getFormDescription = () => {
    switch (activeTab) {
      case "project":
        return "Vous souhaitez nous proposer un projet ou en discuter avec nous ? Remplissez ce formulaire et nous vous contacterons rapidement.";
      case "volunteer":
        return "Envie de vous engager dans nos actions de solidarité ? Dites-nous en plus sur vous et vos motivations.";
      default:
        return "Pour toute question ou demande d'information, vous pouvez nous contacter directement via les coordonnées ci-dessus.";
    }
  };

  return (
    <div style={{ backgroundColor: BACKGROUND }}>
      <UnifiedHero
        title="L'Espace de Communication et d'Engagement"
        subtitle="Nous sommes là pour répondre à vos questions sur nos actions, partenariats ou toute autre demande. Votre engagement commence ici."
      />

     <Container className="py-16 px-6 space-y-16">
        {/* Main Contact Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50">
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Contact Info Section */}
              <div className="space-y-8">
               {/* Contact Info Card */}
               <div className="rounded-2xl p-8 border shadow-lg bg-white">
                 <h3
                   className="text-xl font-semibold mb-6"
                   style={{ color: ACCENT }}
                 >
                   Notre Siège Social au Maroc
                 </h3>
                 <div className="space-y-6">
                   {[
                     {
                       icon: MapPin,
                       title: "Adresse du Siège:",
                       details: "22 Bd Hassan II, Immeuble 83, 2ème étage, Rabat, Maroc",
                       isLink: false,
                     },
                     {
                       icon: Mail,
                       title: "Email de Contact:",
                       details: "bn.assalam@gmail.com",
                       href: "mailto:bn.assalam@gmail.com",
                       isLink: true,
                     },
                     {
                       icon: Phone,
                       title: "Ligne Directe:",
                       details: "05377-02346",
                       href: "tel:0537702346",
                       isLink: true,
                     },
                     {
                       icon: () => (
                         <div
                           className="h-6 w-6 flex-shrink-0"
                           style={{ color: ACCENT }}
                         >
                           🕒
                         </div>
                       ),
                       title: "Horaires d'Accueil:",
                       details: "Lundi - Vendredi: 9h00 - 17h00 (Heure Marocaine)",
                       isLink: false,
                     },
                   ].map((item, index) => {
                     const IconComponent = item.icon;
                     return (
                       <div key={index} className="flex items-start gap-4">
                         <IconComponent
                           className="h-6 w-6 mt-1 flex-shrink-0"
                           style={{ color: ACCENT }}
                         />
                         <div className="text-lg">
                           <p className="font-semibold" style={{ color: DARK_TEXT }}>
                             {item.title}
                           </p>
                           {item.isLink ? (
                             <a
                               href={item.href}
                               className="transition-colors duration-200 hover:opacity-80"
                               style={{ color: ACCENT }}
                             >
                               {item.details}
                             </a>
                           ) : (
                             <p style={{ color: `${DARK_TEXT}B3` }}>
                               {item.details}
                             </p>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* Google Map Integration */}
               <div className="rounded-2xl overflow-hidden h-80 relative shadow-inner border bg-white">
                 <iframe
                   src="https://maps.google.com/maps?q=22+Bd+Hassan+II,+Rabat,+Maroc&t=&z=15&ie=UTF8&iwloc=&output=embed"
                   width="100%"
                   height="100%"
                   style={{ border: 0 }}
                   allowFullScreen=""
                   loading="lazy"
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Localisation de la Fondation Assalam"
                 ></iframe>
               </div>

               {/* Social Media */}
               <div className="mt-6">
                 <h3
                   className="text-xl font-semibold mb-4"
                   style={{ color: DARK_TEXT }}
                 >
                   Suivez nos Actions de Solidarité
                 </h3>
                 <div className="flex gap-4">
                   {[
                     { icon: Facebook, href: "#f", platform: "facebook" },
                     { icon: Twitter, href: "#t", platform: "twitter" },
                     { icon: Linkedin, href: "#l", platform: "linkedin" },
                     { icon: Instagram, href: "#", platform: "instagram" },
                   ].map(({ icon: Icon, href, platform }, index) => (
                     <a
                       key={href}
                       href={href}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label={`Lien vers ${platform}`}
                       className={`text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                       style={{ backgroundColor: socialColors[platform] }}
                     >
                       <Icon className="w-6 h-6" />
                     </a>
                   ))}
                 </div>
               </div>
             </div>

             {/* Contact Form */}
             <div className="bg-white rounded-2xl shadow-xl p-8 card-lift">
               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
                 {tabs.map((tab) => {
                   const Icon = tab.icon;
                   return (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                         activeTab === tab.id
                           ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600"
                           : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                       }`}
                     >
                       <Icon className="w-3 h-3" />
                       {tab.label}
                     </button>
                   );
                 })}
               </div>

               {/* Form Content */}
               <div>
                 <h3
                   className="text-xl font-semibold mb-2"
                   style={{ color: ACCENT }}
                 >
                   {getFormTitle()}
                 </h3>
                 <p className="mb-6 text-gray-600 text-sm">
                   {getFormDescription()}
                 </p>

                 <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-4">
                     <Input
                       label="Nom complet *"
                       name="name"
                       value={formData.name}
                       onChange={handleInputChange}
                       required
                       placeholder="Votre nom et prénom"
                     />
                     <Input
                       label="Email *"
                       name="email"
                       type="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       required
                       placeholder="votre.email@example.com"
                     />
                   </div>

                   <div className="grid md:grid-cols-2 gap-4">
                     <Input
                       label="Téléphone"
                       name="phone"
                       value={formData.phone}
                       onChange={handleInputChange}
                       placeholder="+212 XXX XXX XXX"
                     />
                     {activeTab === "contact" && (
                       <Input
                         label="Sujet *"
                         name="subject"
                         value={formData.subject}
                         onChange={handleInputChange}
                         required
                         placeholder="Objet de votre message"
                       />
                     )}
                     {activeTab === "project" && (
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Projet concerné *
                         </label>
                         <div className="relative">
                           <select
                             name="project"
                             value={formData.project}
                             onChange={handleInputChange}
                             required
                             disabled={isLoading || isError}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400 text-gray-900 text-sm appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                           >
                             <option value="">
                               {isLoading ? "Chargement des projets..." : isError ? "Erreur lors du chargement des projets" : "Sélectionnez un projet"}
                             </option>
                             {projects?.map((project) => (
                               <option key={project.id} value={project.id}>
                                 {project.title}
                               </option>
                             ))}
                           </select>
                           <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                             </svg>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>

                   <Textarea
                     label="Message *"
                     name="message"
                     value={formData.message}
                     onChange={handleInputChange}
                     required
                     placeholder={
                       activeTab === "project"
                         ? "Décrivez votre projet ou idée..."
                         : activeTab === "volunteer"
                         ? "Parlez-nous de vos motivations et expériences..."
                         : "Votre message..."
                     }
                     rows={5}
                   />

                   <Button
                     type="submit"
                     className="w-full cursor-pointer"
                     style={{ backgroundColor: ACCENT }}
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                   </Button>

                   {submitStatus === 'success' && (
                     <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                       <p className="text-green-800 text-sm">
                         ✅ Merci ! Votre message a été envoyé avec succès. Nous vous répondrons bientôt.
                       </p>
                     </div>
                   )}

                   {submitStatus === 'error' && (
                     <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                       <p className="text-red-800 text-sm">
                         ❌ Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.
                       </p>
                     </div>
                   )}
                 </form>

                 
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Additional Sections can be added here following the same pattern */}
     </Container>
    </div>
  );
}
