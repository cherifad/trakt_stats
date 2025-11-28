'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher() {
    const [currentLocale, setCurrentLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.cookie.split('; ').find(row => row.startsWith('locale='))?.split('=')[1] || 'en';
        }
        return 'en';
    });
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫' }
    ];

    const handleLanguageChange = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;
        setCurrentLocale(locale);
        setIsOpen(false);
        window.location.reload();
    };

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 glass border border-white/10"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
                        >
                            {languages.map((language) => (
                                <motion.button
                                    key={language.code}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${currentLocale === language.code ? 'bg-white/10' : ''
                                        }`}
                                >
                                    <span className="text-2xl">{language.flag}</span>
                                    <span className="text-sm font-medium">{language.name}</span>
                                    {currentLocale === language.code && (
                                        <span className="ml-auto text-primary">✓</span>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
