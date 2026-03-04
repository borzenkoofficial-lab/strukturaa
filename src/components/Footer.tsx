const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-sm text-primary-foreground">S</span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">STRUKTURA</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Услуги</a>
          <a href="#" className="hover:text-foreground transition-colors">Проекты</a>
          <a href="#" className="hover:text-foreground transition-colors">О нас</a>
          <a href="#" className="hover:text-foreground transition-colors">Контакты</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 STRUKTURA. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
