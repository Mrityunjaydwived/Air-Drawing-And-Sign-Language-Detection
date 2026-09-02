import type { DrawingStroke } from '../types/drawing';

export class HistoryManager {
  private undoStack: DrawingStroke[][] = [];
  private redoStack: DrawingStroke[][] = [];
  private maxHistory: number = 40;

  constructor(maxHistory: number = 40) {
    this.maxHistory = maxHistory;
  }

  public pushState(strokes: DrawingStroke[]): void {
    // Clone strokes deeply to preserve snapshot
    const snapshot = strokes.map(s => ({
      ...s,
      points: s.points.map(p => ({ ...p })),
    }));

    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }

    // New action invalidates redo tree
    this.redoStack = [];
  }

  public undo(currentStrokes: DrawingStroke[]): DrawingStroke[] | null {
    if (!this.canUndo()) {
      return null;
    }

    const currentState = currentStrokes.map(s => ({
      ...s,
      points: s.points.map(p => ({ ...p })),
    }));
    this.redoStack.push(currentState);

    const previousState = this.undoStack.pop();
    return previousState || [];
  }

  public redo(currentStrokes: DrawingStroke[]): DrawingStroke[] | null {
    if (!this.canRedo()) {
      return null;
    }

    const currentState = currentStrokes.map(s => ({
      ...s,
      points: s.points.map(p => ({ ...p })),
    }));
    this.undoStack.push(currentState);

    const nextState = this.redoStack.pop();
    return nextState || [];
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
