'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-lg bg-white/10 animate-pulse" />
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-colors flex items-center justify-center"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
        </motion.button>
    );
}
