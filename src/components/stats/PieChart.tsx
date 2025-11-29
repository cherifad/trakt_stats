'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PieChartProps {
    data: Array<{ name: string; value: number }>;
    title: string;
    maxItems?: number;
}

export function PieChart({ data, title, maxItems = 8 }: PieChartProps) {
    const sortedData = [...data]
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, maxItems);

    const total = sortedData.reduce((sum, item) => sum + item.value, 0);

    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
    ];

    return (
        <Card className="glass border-white/10 hover-lift">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sortedData.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 4 }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.05 + 0.2 }}
                                        className={`w-4 h-4 rounded-full ${colors[index % colors.length]} shadow-lg`}
                                    />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">{item.value}</span>
                                    <span className="text-sm font-bold w-12 text-right text-primary">{percentage}%</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
