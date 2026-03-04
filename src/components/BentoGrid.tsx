import { ArrowUpRight, Heart, ShoppingBag, Star, ArrowLeft, ArrowRight, Users, MapPin, Mail } from "lucide-react";
import heroDemolition from "@/assets/hero-demolition.jpg";
import serviceConstruction from "@/assets/service-construction.jpg";
import serviceRenovation from "@/assets/service-renovation.jpg";
import teamWorker from "@/assets/team-worker.jpg";

const BentoGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* Hero Card - Large left */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-2 glass-card overflow-hidden relative group">
          <img
            src={heroDemolition}
            alt="Демонтажные работы"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="relative h-full flex flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl font-display font-bold text-foreground">от 500₽</span>
                <span className="text-muted-foreground text-xs">/м²</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="text-sm font-medium text-foreground">4.9</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-display font-semibold text-foreground">Демонтаж</p>
              <div className="flex items-center gap-2 mt-3">
                <button className="w-9 h-9 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/40 transition-colors">
                  <Heart className="w-4 h-4 text-primary" />
                </button>
                <button className="w-9 h-9 rounded-full bg-secondary/60 backdrop-blur-sm flex items-center justify-center hover:bg-secondary transition-colors">
                  <ShoppingBag className="w-4 h-4 text-secondary-foreground" />
                </button>
              </div>
            </div>
          </div>
          {/* Slider controls */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-8 h-8 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Листайте</span>
            <button className="w-8 h-8 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Great Value Deals - Center top */}
        <div className="md:col-span-1 lg:col-span-2 glass-card overflow-hidden relative">
          <img
            src={serviceConstruction}
            alt="Строительство"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-card/40" />
          <div className="relative h-full flex flex-col justify-between p-6">
            <div>
              <h3 className="text-2xl font-display font-bold text-foreground">Лучшие решения</h3>
              <p className="text-muted-foreground mt-1">Скидки 50–60% на комплекс работ</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/60 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="text-sm text-foreground">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team - Right top */}
        <div className="glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground uppercase tracking-wider">Наша команда</span>
            <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-secondary-foreground" />
            </button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mt-3">Профессионалы с опытом работы более 15 лет</p>
            <div className="flex -space-x-2 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-card overflow-hidden">
                  <img src={teamWorker} alt="Член команды" className="w-full h-full object-cover" style={{ objectPosition: `${i * 20}% center` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Join Now - Right middle */}
        <div className="glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground uppercase tracking-wider">Подписка</span>
            <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Mail className="w-4 h-4 text-secondary-foreground" />
            </button>
          </div>
          <div className="mt-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="w-full mt-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Подписаться
            </button>
          </div>
        </div>

        {/* Exclusive - Bottom left */}
        <div className="glass-card-hover p-5 flex flex-col justify-between">
          <span className="px-3 py-1 rounded-lg bg-primary/15 text-xs font-medium text-primary uppercase tracking-wider w-fit">Эксклюзив</span>
          <div className="mt-3">
            <h4 className="text-lg font-display font-semibold text-foreground">Качество без компромиссов</h4>
            <p className="text-sm text-muted-foreground mt-1">Используем передовые технологии для точного и безопасного демонтажа</p>
          </div>
        </div>

        {/* Renovation card */}
        <div className="glass-card overflow-hidden relative">
          <img
            src={serviceRenovation}
            alt="Ремонт"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-5">
            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Открыть</span>
              <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Our Shop / Location */}
        <div className="glass-card-hover p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground uppercase tracking-wider">Наш офис</span>
            <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <MapPin className="w-4 h-4 text-secondary-foreground" />
            </button>
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">г. Москва, ул. Строителей, д. 15</p>
            <p className="text-xs text-muted-foreground mt-1">Пн–Пт: 9:00–18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
