'use client';

import { Button } from "@/components/ui/button";
import { Download, Share2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
    title: string;
    stats: {
        plays: number;
        hours: number;
        topGenre: string;
    };
}

export function ShareButtons({ title, stats }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        setCanShare('share' in navigator);
    }, []);

    const shareText = `🎬 My ${new Date().getFullYear()} Trakt Wrapped:\n\n` +
        `📺 ${stats.plays} titles watched\n` +
        `⏱️ ${stats.hours} hours of content\n` +
        `🎭 Favorite genre: ${stats.topGenre}\n\n` +
        `#TraktWrapped #YearInReview`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareNative = async () => {
        try {
            await navigator.share({
                title: title,
                text: shareText,
            });
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                onClick={copyToClipboard}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Stats'}
            </Button>

            {canShare && (
                <Button
                    onClick={shareNative}
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            )}
        </div>
    );
}
