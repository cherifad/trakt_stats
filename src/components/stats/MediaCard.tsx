'use client';

import { getTMDBImageUrl } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MediaCardProps {
    title?: string;
    poster: string;
    subtitle?: string;
    rating?: number;
    watched?: boolean;
    runtime?: string;
    className?: string;
}

export function MediaCard({
    title,
    poster,
    subtitle,
    rating,
    watched,
    runtime,
    className,
}: MediaCardProps) {
    const hasContent = title || subtitle || runtime;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Card className={`overflow-hidden glass border-white/10 gap-0 dark:border-white/5 group py-0 ${!hasContent ? 'h-full' : ''} ${className || ''}`}>
                <div className={`relative w-full overflow-hidden ${hasContent ? 'aspect-[2/3]' : 'h-full'}`}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Image
                            src={getTMDBImageUrl(poster)}
                            alt={title || 'Media poster'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    </motion.div>

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {watched !== undefined && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${watched ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'
                                }`}
                        >
                            {watched ? '✓ Watched' : 'Not Watched'}
                        </motion.div>
                    )}
                    {rating !== undefined && rating > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                            ★ {rating}
                        </motion.div>
                    )}
                </div>
                {(title || subtitle || runtime) && (
                    <CardContent className="p-3 bg-card/50 dark:bg-card/80 backdrop-blur-sm">
                        {title && (
                            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                        {runtime && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span>⏱️</span> {runtime}
                            </p>
                        )}
                    </CardContent>
                )}
            </Card>
        </motion.div>
    );
}
