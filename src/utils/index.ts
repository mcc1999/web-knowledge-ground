import { TodoTask } from "@/store/calendar";
import { SiderDataTreeItem, SiderDataType } from "@/store/mdx";

export function buildSiderDataTree(siderData: SiderDataType[]) {
  const tree: SiderDataTreeItem[] = [];
  siderData.forEach((data) => {
    const index = tree.findIndex((t) => t.folder === data.id.split("/")[0]);
    if (index !== -1) {
      tree[index].children.push(data);
    } else {
      tree.push({
        folder: data.id.split("/")[0],
        children: [data],
      });
    }
  });

  return tree;
}

export function hasTimeConflict(newTask: TodoTask, tasks: TodoTask[]) {
  return tasks.some((existingTask) => {
    if (newTask.id === existingTask.id) return false; // 排除自身
    const newStart = newTask.timeRange[0];
    const newEnd = newTask.timeRange[1];
    const existingStart = existingTask.timeRange[0];
    const existingEnd = existingTask.timeRange[1];

    // 检查是否有重叠：
    // 1. 新任务开始时间在已有任务时间范围内
    // 2. 新任务结束时间在已有任务时间范围内
    // 3. 新任务时间范围完全包含已有任务
    return (
      ((newStart.isAfter(existingStart) || newStart.isSame(existingStart)) &&
        newStart.isBefore(existingEnd)) ||
      (newEnd.isAfter(existingStart) &&
        (newEnd.isBefore(existingEnd) || newEnd.isSame(existingEnd))) ||
      (newStart.isBefore(existingStart) && newEnd.isAfter(existingEnd))
    );
  });
}
