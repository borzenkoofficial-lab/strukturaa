import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp, GripVertical, ImagePlus, X } from "lucide-react";

interface Stage {
  id?: string;
  title: string;
  description: string;
  status: string;
  sort_order: number;
  photos: string[];
  completed_at: string | null;
}

interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  address: string | null;
  status: string;
  created_at: string;
  client_email?: string;
  client_name?: string;
}

const statusLabels: Record<string, string> = {
  pending: "Ожидание",
  in_progress: "В работе",
  completed: "Завершён",
};

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [stagesLoading, setStagesLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", description: "", address: "", status: "pending", client_id: "" });
  const [users, setUsers] = useState<{ id: string; email: string; name: string }[]>([]);
  const [stageForm, setStageForm] = useState({ title: "", description: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (!data) { setLoading(false); return; }

    // Fetch client profiles
    const clientIds = [...new Set(data.map(p => p.client_id))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", clientIds);

    const enriched = data.map(p => {
      const prof = profiles?.find(pr => pr.user_id === p.client_id);
      return { ...p, client_name: prof?.display_name || "—" };
    });

    setProjects(enriched);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("user_id, display_name");
    setUsers((data || []).map(u => ({ id: u.user_id, email: "", name: u.display_name || "—" })));
  };

  const fetchStages = async (projectId: string) => {
    setStagesLoading(true);
    const { data } = await supabase.from("project_stages").select("*").eq("project_id", projectId).order("sort_order");
    setStages(data || []);
    setStagesLoading(false);
  };

  useEffect(() => { fetchProjects(); fetchUsers(); }, []);

  const handleToggleExpand = (id: string) => {
    if (expandedProject === id) {
      setExpandedProject(null);
    } else {
      setExpandedProject(id);
      fetchStages(id);
    }
  };

  const handleCreateProject = async () => {
    if (!form.title || !form.client_id) {
      toast({ title: "Заполните название и клиента", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      address: form.address || null,
      status: form.status,
      client_id: form.client_id,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Проект создан!" });
      setShowCreate(false);
      setForm({ title: "", description: "", address: "", status: "pending", client_id: "" });
      fetchProjects();
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    const { error } = await supabase.from("projects").update({
      title: form.title,
      description: form.description,
      address: form.address || null,
      status: form.status,
    }).eq("id", editingProject.id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Проект обновлён!" });
      setEditingProject(null);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Удалить проект и все его этапы?")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast({ title: "Проект удалён" });
    fetchProjects();
  };

  const handleAddStage = async (projectId: string) => {
    if (!stageForm.title) return;
    const nextOrder = stages.length;
    const { error } = await supabase.from("project_stages").insert({
      project_id: projectId,
      title: stageForm.title,
      description: stageForm.description,
      sort_order: nextOrder,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setStageForm({ title: "", description: "" });
      fetchStages(projectId);
    }
  };

  const handleStageStatusChange = async (stageId: string, newStatus: string, projectId: string) => {
    const update: any = { status: newStatus };
    if (newStatus === "completed") update.completed_at = new Date().toISOString();
    else update.completed_at = null;

    await supabase.from("project_stages").update(update).eq("id", stageId);
    fetchStages(projectId);
  };

  const handleDeleteStage = async (stageId: string, projectId: string) => {
    await supabase.from("project_stages").delete().eq("id", stageId);
    fetchStages(projectId);
  };

  const handlePhotoUpload = async (stageId: string, projectId: string, file: File) => {
    setUploadingPhoto(stageId);
    const ext = file.name.split(".").pop();
    const path = `projects/${projectId}/${stageId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file);
    if (upErr) {
      toast({ title: "Ошибка загрузки", description: upErr.message, variant: "destructive" });
      setUploadingPhoto(null);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
    const stage = stages.find(s => s.id === stageId);
    const newPhotos = [...(stage?.photos || []), publicUrl];
    await supabase.from("project_stages").update({ photos: newPhotos }).eq("id", stageId);
    setUploadingPhoto(null);
    fetchStages(projectId);
  };

  const handleRemovePhoto = async (stageId: string, projectId: string, photoUrl: string) => {
    const stage = stages.find(s => s.id === stageId);
    const newPhotos = (stage?.photos || []).filter(p => p !== photoUrl);
    await supabase.from("project_stages").update({ photos: newPhotos }).eq("id", stageId);
    fetchStages(projectId);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({ title: p.title, description: p.description || "", address: p.address || "", status: p.status, client_id: p.client_id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Проекты клиентов</h1>
        <Button onClick={() => { setShowCreate(true); setForm({ title: "", description: "", address: "", status: "pending", client_id: "" }); }}>
          <Plus className="w-4 h-4 mr-2" /> Новый проект
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">Проектов пока нет</div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const expanded = expandedProject === project.id;
            return (
              <motion.div key={project.id} className="glass-card overflow-hidden" layout>
                <div className="p-4 flex items-center gap-3">
                  <button onClick={() => handleToggleExpand(project.id)} className="flex-1 text-left flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-foreground truncate">{project.title}</span>
                        <Badge variant="secondary" className="text-[10px]">{statusLabels[project.status]}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">Клиент: {project.client_name}</span>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(project)}><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>

                {expanded && (
                  <div className="border-t border-border/30 p-4 space-y-4">
                    {stagesLoading ? (
                      <div className="h-20 bg-muted/20 rounded animate-pulse" />
                    ) : (
                      <>
                        {stages.map(stage => (
                          <div key={stage.id} className="bg-secondary/30 rounded-xl p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                              <span className="text-sm font-medium text-foreground flex-1">{stage.title}</span>
                              <Select value={stage.status} onValueChange={(v) => handleStageStatusChange(stage.id!, v, project.id)}>
                                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Ожидание</SelectItem>
                                  <SelectItem value="in_progress">В работе</SelectItem>
                                  <SelectItem value="completed">Завершён</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteStage(stage.id!, project.id)}>
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                            {stage.description && <p className="text-xs text-muted-foreground pl-6">{stage.description}</p>}

                            {/* Photos */}
                            <div className="flex items-center gap-2 pl-6 flex-wrap">
                              {(stage.photos || []).map((photo, pi) => (
                                <div key={pi} className="relative group">
                                  <img src={photo} alt="" className="w-14 h-14 rounded-lg object-cover border border-border/30" />
                                  <button
                                    onClick={() => handleRemovePhoto(stage.id!, project.id, photo)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-destructive-foreground" />
                                  </button>
                                </div>
                              ))}
                              <label className="w-14 h-14 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                {uploadingPhoto === stage.id ? (
                                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                ) : (
                                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handlePhotoUpload(stage.id!, project.id, f);
                                }} />
                              </label>
                            </div>
                          </div>
                        ))}

                        {/* Add stage form */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Название этапа..."
                            value={stageForm.title}
                            onChange={(e) => setStageForm(s => ({ ...s, title: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Описание (опц.)"
                            value={stageForm.description}
                            onChange={(e) => setStageForm(s => ({ ...s, description: e.target.value }))}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => handleAddStage(project.id)} disabled={!stageForm.title}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={showCreate || !!editingProject} onOpenChange={(open) => { if (!open) { setShowCreate(false); setEditingProject(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Редактировать проект" : "Новый проект"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Название проекта" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            <Input placeholder="Адрес объекта" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
            <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидание</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершён</SelectItem>
              </SelectContent>
            </Select>
            {!editingProject && (
              <Select value={form.client_id} onValueChange={(v) => setForm(f => ({ ...f, client_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Выберите клиента" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button className="w-full" onClick={editingProject ? handleUpdateProject : handleCreateProject}>
              {editingProject ? "Сохранить" : "Создать проект"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
