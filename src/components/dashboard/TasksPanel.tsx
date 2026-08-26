import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListChecks, Clock, Plus, Trash2, Edit, Check, X } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
}

export function TasksPanel() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status: "all" | "open" | "in_progress" | "completed" | "cancelled";
  }>({ status: "all" });

  const userId = localStorage.getItem("paw-m:admin-session")
    ? JSON.parse(localStorage.getItem("paw-m:admin-session") || "{}").id
    : null;

  useEffect(() => {
    fetchTasks();
  }, [filter, userId]);

  async function fetchTasks() {
    setLoading(true);
    try {
      let url = `/api/tasks/mine`;
      if (userId) {
        const response = await api.get<Task[]>(url);
        if (Array.isArray(response)) {
          const filtered =
            filter.status === "all"
              ? response
              : response.filter((task) => task.status === filter.status);
          setTasks(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createTask() {
    // In a real implementation, this would open a modal
    // For now, we'll just log it
    console.log("Opening create task modal");
  }

  async function updateTaskStatus(taskId: number, status: "open" | "in_progress" | "completed" | "cancelled") {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }

  async function deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{t("dash.tasks")}</h2>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Clock className="h-4 w-4" />
                <span className="ml-2 text-xs">
                  {filter.status === "all"
                    ? t("dash.allTasks")
                    : filter.status === "open"
                      ? t("dash.openTasks")
                      : filter.status === "in_progress"
                        ? t("dash.inProgress")
                        : filter.status === "completed"
                          ? t("dash.completed")
                          : t("dash.cancelled")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilter({ status: "all" })}>
                {t("dash.allTasks")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ status: "open" })}>
                {t("dash.openTasks")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ status: "in_progress" })}>
                {t("dash.inProgress")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ status: "completed" })}>
                {t("dash.completed")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ status: "cancelled" })}>
                {t("dash.cancelled")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={createTask} className="btn-primary">
            <Plus className="mr-2 h-4 w-4" /> {t("dash.newTask")}
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">{t("dash.noTasks")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-x-4">
            <thead>
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="w-20">{t("dash.title")}</th>
                <th className="w-20">{t("dash.description")}</th>
                <th className="w-12">{t("dash.priority")}</th>
                <th className="w-12">{t("dash.dueDate")}</th>
                <th className="w-12">{t("dash.status")}</th>
                <th className="w-12">{t("dash.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted">
                  <td className="py-3">
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    )}
                  </td>
                  <td className="py-3 max-w-[200px] break-words">{task.description || "-"}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full">
                      {task.priority === "high"
                        ? t("dash.priorityHigh")
                        : task.priority === "medium"
                          ? t("dash.priorityMedium")
                          : t("dash.priorityLow")}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {task.dueDate ? formatDate(task.dueDate) : "-"}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full">
                      {task.status === "open"
                        ? t("dash.taskOpen")
                        : task.status === "in_progress"
                          ? t("dash.taskInProgress")
                          : task.status === "completed"
                            ? t("dash.taskCompleted")
                            : t("dash.taskCancelled")}
                    </span>
                  </td>
                  <td className="py-3 flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateTaskStatus(task.id, "completed")}
                      title={t("dash.markComplete")}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateTaskStatus(task.id, "in_progress")}
                      title={t("dash.markInProgress")}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      title={t("dash.delete")}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
