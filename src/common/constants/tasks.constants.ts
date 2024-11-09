export enum TaskStatusEnum {
  NEW = 'New',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
}

export const TaskNotifications = {
  NEW_TASK_ASSIGNED: {
    title: 'New Task Assigned to You',
    body: 'A new task has been assigned to you. Please check the details in your task list.',
  },
  TASK_COMPLETED: {
    title: 'Task Completed',
    body: 'The task has been marked as completed. Great job!',
  },
  TASK_UPDATED: {
    title: 'Task Updated',
    body: 'The task has been updated. Please review the latest details and adjust your actions accordingly.',
  },
};
