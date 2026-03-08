import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/pages/MarketplacePage";

const categoryLabels: Record<string, string> = {
  demolition: "Демонтаж",
  construction: "Строительство",
  renovation: "Ремонт",
  facades: "Фасады",
  roofing: "Кровля",
  electrical: "Электрика",
  plumbing: "Сантехника",
  other: "Другое",
};

const categoryColors: Record<string, string> = {
  demolition: "bg-destructive/15 text-destructive",
  construction: "bg-primary/15 text-primary",
  renovation: "bg-accent/15 text-accent",
  facades: "bg-primary/15 text-primary",
  roofing: "bg-secondary text-secondary-foreground",
  electrical: "bg-accent/15 text-accent",
  plumbing: "bg-primary/15 text-primary",
  other: "bg-secondary text-secondary-foreground",
};

interface Props {
  listing: Listing;
  index: number;
  onClick: () => void;
}

const ListingCard = ({ listing, index, onClick }: Props) => {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "только что";
    if (hours < 24) return `${hours}ч назад`;
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()} ₽`;
    if (min) return `от ${min.toLocaleString()} ₽`;
    return `до ${max!.toLocaleString()} ₽`;
  };

  const budget = formatBudget(listing.budget_min, listing.budget_max);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-card border border-border/50 p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant="secondary" className={`text-[10px] font-semibold ${categoryColors[listing.category] || ""}`}>
          {categoryLabels[listing.category] || listing.category}
        </Badge>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(listing.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {listing.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{listing.description}</p>

      {/* Meta */}
      <div className="space-y-1.5">
        {budget && (
          <div className="flex items-center gap-2 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">{budget}</span>
          </div>
        )}
        {listing.address && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{listing.address}</span>
          </div>
        )}
        {listing.deadline && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>до {new Date(listing.deadline).toLocaleDateString("ru-RU")}</span>
          </div>
        )}
      </div>

      {/* Photos indicator */}
      {listing.photos && listing.photos.length > 0 && (
        <div className="mt-3 flex gap-1">
          {listing.photos.slice(0, 3).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-secondary" />
          ))}
          {listing.photos.length > 3 && (
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">
              +{listing.photos.length - 3}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ListingCard;
