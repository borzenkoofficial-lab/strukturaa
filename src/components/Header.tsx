import { Search, Phone, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-primary-foreground">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">STRUKTURA</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="glass-card flex items-center w-full px-4 py-2.5 gap-2">
            <span className="text-sm text-muted-foreground">Демонтаж, строительство...</span>
            <Search className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {["Услуги", "Проекты", "О нас", "Контакты"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Phone className="w-4 h-4" />
            Связаться
          </button>
          <button className="lg:hidden p-2 rounded-xl bg-secondary text-secondary-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
