export type FrameTask = {
  readonly id: string
  readonly priority: number
  readonly execute: () => void
}

export class FrameBudgetManager {
  private tasks: FrameTask[] = []
  private budgetMs: number

  constructor(budgetMs = 16) {
    this.budgetMs = budgetMs
  }

  addTask(task: FrameTask): void {
    this.tasks.push(task)
    this.sortTasks()
  }

  removeTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }

  executeFrame(deltaMs: number): void {
    if (this.tasks.length === 0) return

    const startTime = performance.now()
    const budget = Math.min(this.budgetMs, deltaMs * 0.5) // Use at most 50% of frame time

    while (this.tasks.length > 0 && performance.now() - startTime < budget) {
      const task = this.tasks.shift()
      if (task) {
        try {
          task.execute()
        } catch (error) {
          console.error('[FrameBudget] Task execution error:', error)
        }
      }
    }
  }

  private sortTasks(): void {
    this.tasks.sort((a, b) => a.priority - b.priority)
  }

  clear(): void {
    this.tasks = []
  }

  getPendingCount(): number {
    return this.tasks.length
  }
}
