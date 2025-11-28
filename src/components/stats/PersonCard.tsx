import { getTMDBImageUrl } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface PersonCardProps {
    name: string;
    image: string;
    subtitle: string;
    items?: string[];
    maxItems?: number;
}

export function PersonCard({ name, image, subtitle, items, maxItems = 5 }: PersonCardProps) {
    const displayItems = items?.slice(0, maxItems) || [];
    const remaining = (items?.length || 0) - maxItems;

    return (
        <Card className="overflow-hidden">
            <div className="flex gap-4 p-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={getTMDBImageUrl(image, 'w200')}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>
                <CardContent className="flex-1 p-0">
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
                    {displayItems.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                            <p className="line-clamp-3">{displayItems.join(', ')}</p>
                            {remaining > 0 && (
                                <p className="mt-1 italic">+{remaining} more</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
}
