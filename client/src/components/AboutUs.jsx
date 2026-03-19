import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AboutSection from './AboutSection';

const AboutUs = () => {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />
            <div className="pt-20">
                <AboutSection />
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
