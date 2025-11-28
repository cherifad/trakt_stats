'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ChartDataItem {
    name: string;
    value: number;
}

interface BarChartProps {
    data: ChartDataItem[];
    title: string;
    maxItems?: number;
    showValues?: boolean;
}

export function BarChart({ data, title, maxItems = 10, showValues = true }: BarChartProps) {
    const displayData = data.slice(0, maxItems);
    const maxValue = Math.max(...displayData.map((d) => d.value));

    return (
        <Card className="glass border-white/10 hover-lift">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {displayData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold">{item.name}</span>
                                {showValues && (
                                    <span className="text-muted-foreground font-medium">{item.value}</span>
                                )}
                            </div>
                            <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
