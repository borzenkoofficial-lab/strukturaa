import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useLanguage, TranslationKey } from "@/contexts/LanguageContext";

const categoryKeys: TranslationKey[] = [
  "cat.demolition", "cat.construction", "cat.renovation", "cat.facades",
  "cat.roofing", "cat.foundation", "cat.electrical",
];

const CategoryPills = () => {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 px-6 py-4 max-w-7xl mx-auto overflow-x-auto">
      <button className="p-2.5 rounded-xl bg-secondary text-secondary-foreground shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        {categoryKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              active === i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPills;
