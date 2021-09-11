export class Queue {
  size = 1;
  running = 0;
  tasks: ((cb: (err: any, result: any) => void) => void)[] = [];
  addTask(task) {
    this.tasks.push(task);
    this.update();
  }
  update() {
    while (this.running <= this.size && this.tasks.length > 0) {
      const task = this.tasks.pop();
      task(() => {
        this.running--;
        this.update();
      });
      this.running++;
    }
  }
}
