import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, Palette, Globe, Search, Bell, Link2, Terminal, Shield, Calculator,
} from "lucide-react";
import { SERVICE_RATE_CATALOG, SERVICE_RATE_SERVICES, SERVICE_RATE_UNITS, ServiceRateBook, getServiceRate, serviceRateKey } from "@/lib/servicePricing";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serviceRates, setServiceRates] = useState<ServiceRateBook>({});
  const [activeRateService, setActiveRateService] = useState("apartment-demolition");

  // Theme
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#c8842a", fontFamily: "Space Grotesk",
    darkMode: true, animationsEnabled: true,
  });

  // Header / Footer
  const [headerSettings, setHeaderSettings] = useState({ logoText: "STRUKTURA", phone: "", email: "" });
  const [footerSettings, setFooterSettings] = useState({ copyright: "", socialVk: "", socialTg: "" });

  // SEO
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: "", siteDescription: "", ogImage: "",
    robotsTxt: "", googleAnalyticsId: "", yandexMetrikaId: "",
  });

  // Notifications
  const [notifSettings, setNotifSettings] = useState({
    emailOnNewRequest: true, emailOnNewListing: false,
    telegramEnabled: false, telegramChatId: "",
  });

  // Integrations
  const [intSettings, setIntSettings] = useState({
    stripeEnabled: false, stripePublicKey: "",
    telegramBotEnabled: false,
  });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data) {
        data.forEach((s) => {
          const val = s.value as Record<string, any>;
          if (s.key === "theme") setThemeSettings(prev => ({ ...prev, ...val }));
          if (s.key === "header") setHeaderSettings(prev => ({ ...prev, ...val }));
          if (s.key === "footer") setFooterSettings(prev => ({ ...prev, ...val }));
          if (s.key === "seo") setSeoSettings(prev => ({ ...prev, ...val }));
          if (s.key === "notifications") setNotifSettings(prev => ({ ...prev, ...val }));
          if (s.key === "integrations") setIntSettings(prev => ({ ...prev, ...val }));
          if (s.key === "service_rates" && val && typeof val === "object") setServiceRates(val as ServiceRateBook);
        });
      }
    };
    fetch();
  }, []);

  const upsertSetting = async (key: string, value: any) => {
    const { data, error: selectError } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
    if (selectError) throw selectError;
    if (data) {
      const { error } = await supabase.from("site_settings").update({ value: value as any }).eq("key", key);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("site_settings").insert({ key, value: value as any });
      if (error) throw error;
    }
  };

  const saveAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        upsertSetting("theme", themeSettings),
        upsertSetting("header", headerSettings),
        upsertSetting("footer", footerSettings),
        upsertSetting("seo", seoSettings),
        upsertSetting("notifications", notifSettings),
        upsertSetting("integrations", intSettings),
        upsertSetting("service_rates", serviceRates),
      ]);
      toast({ title: "Все настройки сохранены!" });
    } catch (error) {
      console.error("Unable to save site settings", error);
      toast({ title: "Не удалось сохранить настройки", description: "Проверьте подключение и права администратора.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateServiceRate = (slug: string, workId: string, field: "price" | "unit", value: string) => {
    const key = serviceRateKey(slug, workId);
    setServiceRates((current) => {
      const previous = getServiceRate(current, slug, workId);
      if (field === "price") {
        const parsed = value.trim() === "" ? null : Number(value);
        return { ...current, [key]: { ...previous, price: parsed !== null && Number.isFinite(parsed) && parsed > 0 ? parsed : null } };
      }
      return { ...current, [key]: { ...previous, unit: value } };
    });
  };

  const Section = ({ children, title, icon: Icon, delay = 0 }: any) => (
    <motion.div
      className="bg-card border border-border/30 rounded-xl p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h2>
      {children}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Настройки</h1>
          <p className="text-sm text-muted-foreground mt-1">Управление платформой</p>
        </div>
        <Button onClick={saveAll} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Сохранение..." : "Сохранить всё"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="text-xs gap-1.5"><Globe className="w-3.5 h-3.5" />Общие</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs gap-1.5"><Palette className="w-3.5 h-3.5" />Оформление</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs gap-1.5"><Search className="w-3.5 h-3.5" />SEO</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1.5"><Bell className="w-3.5 h-3.5" />Уведомления</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs gap-1.5"><Link2 className="w-3.5 h-3.5" />Интеграции</TabsTrigger>
          <TabsTrigger value="rates" className="text-xs gap-1.5"><Calculator className="w-3.5 h-3.5" />Расценки</TabsTrigger>
          <TabsTrigger value="security" className="text-xs gap-1.5"><Shield className="w-3.5 h-3.5" />Безопасность</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Section title="Шапка сайта" icon={Globe}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Текст логотипа</Label>
                <Input value={headerSettings.logoText} onChange={e => setHeaderSettings({ ...headerSettings, logoText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input value={headerSettings.phone} onChange={e => setHeaderSettings({ ...headerSettings, phone: e.target.value })} placeholder="+7 (999) 999-99-99" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={headerSettings.email} onChange={e => setHeaderSettings({ ...headerSettings, email: e.target.value })} placeholder="info@domain.com" />
              </div>
            </div>
          </Section>

          <Section title="Подвал сайта" icon={Globe} delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Текст копирайта</Label>
                <Input value={footerSettings.copyright} onChange={e => setFooterSettings({ ...footerSettings, copyright: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>VK</Label>
                <Input value={footerSettings.socialVk} onChange={e => setFooterSettings({ ...footerSettings, socialVk: e.target.value })} placeholder="https://vk.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Telegram</Label>
                <Input value={footerSettings.socialTg} onChange={e => setFooterSettings({ ...footerSettings, socialTg: e.target.value })} placeholder="https://t.me/..." />
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-4">
          <Section title="Тема оформления" icon={Palette}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Основной цвет</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={e => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-md border border-input cursor-pointer"
                  />
                  <Input value={themeSettings.primaryColor} onChange={e => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Шрифт</Label>
                <select
                  value={themeSettings.fontFamily}
                  onChange={e => setThemeSettings({ ...themeSettings, fontFamily: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground"
                >
                  {["Space Grotesk", "Inter", "Roboto", "Montserrat", "PT Sans", "Golos Text"].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={themeSettings.animationsEnabled} onCheckedChange={v => setThemeSettings({ ...themeSettings, animationsEnabled: v })} />
                <Label className="text-sm">Анимации</Label>
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Section title="Поисковая оптимизация" icon={Search}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Заголовок сайта (title)</Label>
                <Input value={seoSettings.siteTitle} onChange={e => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })} placeholder="Структура — строительная компания" />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input value={seoSettings.ogImage} onChange={e => setSeoSettings({ ...seoSettings, ogImage: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={seoSettings.siteDescription}
                onChange={e => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
                placeholder="Описание сайта для поисковых систем (до 160 символов)"
                rows={3}
              />
              <p className="text-[10px] text-muted-foreground">{seoSettings.siteDescription.length}/160 символов</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input value={seoSettings.googleAnalyticsId} onChange={e => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Yandex Metrika ID</Label>
                <Input value={seoSettings.yandexMetrikaId} onChange={e => setSeoSettings({ ...seoSettings, yandexMetrikaId: e.target.value })} placeholder="12345678" />
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Section title="Email-уведомления" icon={Bell}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Новая заявка с сайта</p>
                  <p className="text-xs text-muted-foreground">Уведомлять о каждой новой заявке</p>
                </div>
                <Switch checked={notifSettings.emailOnNewRequest} onCheckedChange={v => setNotifSettings({ ...notifSettings, emailOnNewRequest: v })} />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Новая заявка на бирже</p>
                  <p className="text-xs text-muted-foreground">Уведомлять при публикации на бирже</p>
                </div>
                <Switch checked={notifSettings.emailOnNewListing} onCheckedChange={v => setNotifSettings({ ...notifSettings, emailOnNewListing: v })} />
              </div>
            </div>
          </Section>

          <Section title="Telegram-уведомления" icon={Bell} delay={0.1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Telegram бот</p>
                  <p className="text-xs text-muted-foreground">Отправлять уведомления в Telegram</p>
                </div>
                <Switch checked={notifSettings.telegramEnabled} onCheckedChange={v => setNotifSettings({ ...notifSettings, telegramEnabled: v })} />
              </div>
              {notifSettings.telegramEnabled && (
                <div className="space-y-2">
                  <Label>Chat ID</Label>
                  <Input value={notifSettings.telegramChatId} onChange={e => setNotifSettings({ ...notifSettings, telegramChatId: e.target.value })} placeholder="-1001234567890" />
                </div>
              )}
            </div>
          </Section>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Section title="Платёжные системы" icon={Link2}>
            <div className="flex items-center justify-between py-2 border-b border-border/20">
              <div>
                <p className="text-sm font-medium text-foreground">Stripe</p>
                <p className="text-xs text-muted-foreground">Приём платежей через Stripe</p>
              </div>
              <Switch checked={intSettings.stripeEnabled} onCheckedChange={v => setIntSettings({ ...intSettings, stripeEnabled: v })} />
            </div>
            {intSettings.stripeEnabled && (
              <div className="space-y-2">
                <Label>Publishable Key</Label>
                <Input value={intSettings.stripePublicKey} onChange={e => setIntSettings({ ...intSettings, stripePublicKey: e.target.value })} placeholder="pk_live_..." />
              </div>
            )}
          </Section>

          <Section title="Мессенджеры" icon={Link2} delay={0.1}>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Telegram Bot</p>
                <p className="text-xs text-muted-foreground">Интеграция с Telegram ботом для уведомлений</p>
              </div>
              <Switch checked={intSettings.telegramBotEnabled} onCheckedChange={v => setIntSettings({ ...intSettings, telegramBotEnabled: v })} />
            </div>
          </Section>
        </TabsContent>

        {/* Service rate book */}
        <TabsContent value="rates" className="space-y-4">
          <Section title="Справочник расценок" icon={Calculator}>
            <div className="space-y-3 rounded-lg border border-border/40 bg-secondary/20 p-4">
              <p className="text-sm text-foreground">
                Заполняйте только ваши подтверждённые расценки. Пустая цена означает, что система не будет рассчитывать эту позицию.
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                Цена задаётся за указанную единицу. На странице услуги заказчик укажет фактический объём каждой выбранной работы. Если цена зависит от материала, толщины, высоты или специальных условий, сначала зафиксируйте отдельную расценку/состав — коэффициенты автоматически не выдумываются.
              </p>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <Label htmlFor="rate-service">Услуга</Label>
                <select
                  id="rate-service"
                  value={activeRateService}
                  onChange={(event) => setActiveRateService(event.target.value)}
                  className="min-h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground sm:min-w-72"
                >
                  {SERVICE_RATE_SERVICES.map((service) => (
                    <option key={service.slug} value={service.slug}>{service.title.ru}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>{SERVICE_RATE_CATALOG.filter((item) => item.slug === activeRateService).length} позиций в справочнике</span>
                <span>{SERVICE_RATE_CATALOG.filter((item) => item.slug === activeRateService && getServiceRate(serviceRates, item.slug, item.workId).price !== null).length} расценок заполнено</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border/50">
              <div className="hidden grid-cols-[minmax(0,1fr)_130px_150px] gap-3 border-b border-border/50 bg-secondary/40 px-4 py-3 text-xs font-medium text-muted-foreground md:grid">
                <span>Работа</span><span>Единица</span><span>Цена, ₽</span>
              </div>
              <div className="divide-y divide-border/40">
                {SERVICE_RATE_CATALOG.filter((item) => item.slug === activeRateService).map((item) => {
                  const rate = getServiceRate(serviceRates, item.slug, item.workId);
                  return (
                    <div key={serviceRateKey(item.slug, item.workId)} className="grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,1fr)_130px_150px] md:items-center md:gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title.ru}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{item.workId}</p>
                      </div>
                      <label className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2 md:block">
                        <span className="text-xs text-muted-foreground md:hidden">Ед. изм.</span>
                        <select
                          value={rate.unit}
                          onChange={(event) => updateServiceRate(item.slug, item.workId, "unit", event.target.value)}
                          className="min-h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
                        >
                          {SERVICE_RATE_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                      </label>
                      <label className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2 md:block">
                        <span className="text-xs text-muted-foreground md:hidden">Цена, ₽</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={rate.price ?? ""}
                          onChange={(event) => updateServiceRate(item.slug, item.workId, "price", event.target.value)}
                          placeholder="Не задана"
                          className="h-9 bg-background"
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              После заполнения нажмите «Сохранить всё» вверху. Расценки сохраняются в общей базе настроек и становятся доступны публичному калькулятору. Пока для выбранной работы не заполнены цена и объём, полный итог не показывается.
            </p>
          </Section>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Section title="Безопасность и доступ" icon={Shield}>
            <div className="space-y-3">
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-1">Ролевая модель</p>
                <p className="text-xs text-muted-foreground">
                  Система поддерживает три уровня доступа: <strong>Администратор</strong> (полный доступ),{" "}
                  <strong>Модератор</strong> (управление контентом), <strong>Пользователь</strong> (базовый доступ).
                  Управление ролями доступно в разделе «Пользователи».
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-1">Row Level Security (RLS)</p>
                <p className="text-xs text-muted-foreground">
                  Все таблицы базы данных защищены политиками RLS. Пользователи имеют доступ только к своим данным,
                  администраторы — ко всем записям.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-1">Аутентификация</p>
                <p className="text-xs text-muted-foreground">
                  Email + пароль с подтверждением через email. Поддерживается сброс пароля.
                  Сессии хранятся в localStorage с автоматическим обновлением токенов.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Системные логи" icon={Terminal} delay={0.1}>
            <div className="bg-secondary/30 rounded-lg p-4 font-mono text-xs text-muted-foreground max-h-48 overflow-y-auto space-y-1">
              <p>[{new Date().toISOString()}] System started</p>
              <p>[{new Date().toISOString()}] RLS policies active on all tables</p>
              <p>[{new Date().toISOString()}] Auth provider: email/password</p>
              <p>[{new Date().toISOString()}] Storage buckets: media, avatars</p>
              <p>[{new Date().toISOString()}] Edge functions: generate-listings, moderate-listing, notify-request, notify-shop-message</p>
              <p>[{new Date().toISOString()}] Wallet system: active (3000₽ signup bonus)</p>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
