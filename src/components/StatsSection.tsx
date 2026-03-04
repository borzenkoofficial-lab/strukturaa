const stats = [
  { value: "500+", label: "Проектов выполнено", accent: false },
  { value: "15", label: "Лет на рынке", accent: false },
  { value: "98%", label: "Довольных клиентов", accent: true },
];

const StatsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 flex flex-col justify-between min-h-[120px] ${
              stat.accent ? "bg-primary text-primary-foreground" : "glass-card"
            }`}
          >
            <span className={`text-3xl font-display font-bold ${stat.accent ? "" : "text-foreground"}`}>
              {stat.value}
            </span>
            <span className={`text-sm mt-2 ${stat.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
