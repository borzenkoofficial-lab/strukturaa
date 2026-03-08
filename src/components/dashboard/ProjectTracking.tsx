import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Circle, MapPin, Calendar, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectStage {
  id: string;
  title: string;
  description: string;
  status: string;
  sort_order: number;
  photos: string[];
  completed_at: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  address: string | null;
  status: string;
  created_at: string;
  stages: ProjectStage[];
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Ожидание", color: "bg-muted text-muted-foreground", icon: Circle },
  in_progress: { label: "В работе", color: "bg-primary/15 text-primary", icon: Clock },
  completed: { label: "Завершён", color: "bg-green-500/15 text-green-500", icon: CheckCircle2 },
};

const stageStatusIcon = (status: string) => {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  if (status === "in_progress") return <Clock className="w-5 h-5 text-primary animate-pulse" />;
  return <Circle className="w-5 h-5 text-muted-foreground/40" />;
};

const ProjectTracking = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const projectIds = projectsData.map(p => p.id);
      const { data: stagesData } = await supabase
        .from("project_stages")
        .select("*")
        .in("project_id", projectIds)
        .order("sort_order", { ascending: true });

      const merged = projectsData.map(p => ({
        ...p,
        stages: (stagesData || []).filter(s => s.project_id === p.id),
      }));

      setProjects(merged);
      if (merged.length > 0) setExpandedProject(merged[0].id);
      setLoading(false);
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-5 bg-muted rounded w-1/3 mb-3" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">У вас пока нет активных проектов</p>
        <p className="text-xs text-muted-foreground mt-1">Когда мы начнём работу, прогресс появится здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const expanded = expandedProject === project.id;
        const completedStages = project.stages.filter(s => s.status === "completed").length;
        const totalStages = project.stages.length;
        const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
        const cfg = statusConfig[project.status] || statusConfig.pending;

        return (
          <motion.div
            key={project.id}
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <button
              onClick={() => setExpandedProject(expanded ? null : project.id)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display font-bold text-foreground truncate">{project.title}</h3>
                  <Badge variant="secondary" className={cfg.color}>
                    <cfg.icon className="w-3 h-3 mr-1" />
                    {cfg.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {project.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {project.address}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(project.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs font-medium text-muted-foreground w-8">{progress}%</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {/* Stages */}
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t border-border/30"
              >
                {/* Mobile progress */}
                <div className="sm:hidden px-5 pt-4 flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
                </div>

                {project.description && (
                  <p className="px-5 pt-4 text-sm text-muted-foreground">{project.description}</p>
                )}

                <div className="p-5 space-y-0">
                  {project.stages.map((stage, idx) => (
                    <div key={stage.id} className="flex gap-3">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        {stageStatusIcon(stage.status)}
                        {idx < project.stages.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 ${stage.status === "completed" ? "bg-green-500/30" : "bg-border/30"}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-5 ${idx === project.stages.length - 1 ? "pb-0" : ""}`}>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${stage.status === "completed" ? "text-green-500" : stage.status === "in_progress" ? "text-foreground" : "text-muted-foreground"}`}>
                            {stage.title}
                          </p>
                          {stage.completed_at && (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(stage.completed_at).toLocaleDateString("ru-RU")}
                            </span>
                          )}
                        </div>
                        {stage.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                        )}
                        {stage.photos && stage.photos.length > 0 && (
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {stage.photos.map((photo, pi) => (
                              <a key={pi} href={photo} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={photo}
                                  alt={`${stage.title} фото ${pi + 1}`}
                                  className="w-16 h-16 rounded-lg object-cover border border-border/30 hover:border-primary/50 transition-colors"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {project.stages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Этапы проекта скоро будут добавлены</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectTracking;
