import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { motion } from "framer-motion";

const AdminSettings = () => {
  const [themeSettings, setThemeSettings] = useState({ primaryColor: "#c8842a", fontFamily: "Space Grotesk" });
  const [headerSettings, setHeaderSettings] = useState({ logoText: "STRUKTURA", phone: "" });
  const [footerSettings, setFooterSettings] = useState({ copyright: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data) {
        data.forEach((s) => {
          const val = s.value as Record<string, string>;
          if (s.key === "theme") setThemeSettings(prev => ({ ...prev, ...val }));
          if (s.key === "header") setHeaderSettings(prev => ({ ...prev, ...val }));
          if (s.key === "footer") setFooterSettings(prev => ({ ...prev, ...val }));
        });
      }
    };
    fetch();
  }, []);

  const save = async () => {
    setLoading(true);
    await Promise.all([
      supabase.from("site_settings").update({ value: themeSettings as any }).eq("key", "theme"),
      supabase.from("site_settings").update({ value: headerSettings as any }).eq("key", "header"),
      supabase.from("site_settings").update({ value: footerSettings as any }).eq("key", "footer"),
    ]);
    setLoading(false);
    toast({ title: "Settings saved!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Site Settings</h1>
        <Button onClick={save} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save All"}
        </Button>
      </div>

      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-lg font-semibold text-foreground">Theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={themeSettings.primaryColor}
                onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-md border border-input cursor-pointer"
              />
              <Input
                value={themeSettings.primaryColor}
                onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Font Family</Label>
            <select
              value={themeSettings.fontFamily}
              onChange={(e) => setThemeSettings({ ...themeSettings, fontFamily: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-lg font-semibold text-foreground">Header</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Logo Text</Label>
            <Input
              value={headerSettings.logoText}
              onChange={(e) => setHeaderSettings({ ...headerSettings, logoText: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={headerSettings.phone}
              onChange={(e) => setHeaderSettings({ ...headerSettings, phone: e.target.value })}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-semibold text-foreground">Footer</h2>
        <div className="space-y-2">
          <Label>Copyright Text</Label>
          <Input
            value={footerSettings.copyright}
            onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
