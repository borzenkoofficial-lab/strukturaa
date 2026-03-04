import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const categories = ["Демонтаж", "Строительство", "Ремонт", "Фасады", "Кровля", "Фундамент", "Электрика"];

const CategoryPills = () => {
  const [active, setActive] = useState("Демонтаж");

  return (
    <div className="flex items-center gap-3 px-6 py-4 max-w-7xl mx-auto overflow-x-auto">
      <button className="p-2.5 rounded-xl bg-secondary text-secondary-foreground shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPills;
