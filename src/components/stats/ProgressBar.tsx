interface ProgressBarProps {
    value: number;
    max: number;
    label?: string;
    showPercentage?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max,
    label,
    showPercentage = true,
    className,
}: ProgressBarProps) {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div className={className}>
            {label && (
                <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    {showPercentage && (
                        <span className="text-muted-foreground">
                            {value}/{max} ({percentage.toFixed(1)}%)
                        </span>
                    )}
                </div>
            )}
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
