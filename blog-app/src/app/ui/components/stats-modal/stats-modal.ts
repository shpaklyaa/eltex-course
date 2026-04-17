import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-stats-modal',
  imports: [],
  templateUrl: './stats-modal.html',
  styleUrl: './stats-modal.scss',
})
export class StatsModal {
  @Input() articlesCount!: number;
  visible: boolean = false;

  openStats() {
    console.log('[StatsModal] open() called');
    this.visible = true;
    console.log('[StatsModal] visible =', this.visible);
  }

  close() {
    console.log('[StatsModal] open() called');
    this.visible = false;
    console.log('[StatsModal] visible =', this.visible);
  }

  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      console.log('[StatsModal] open() called');
      this.close();
      console.log('[StatsModal] visible =', this.visible);
    }
  }
  ngOnInit() {
    console.log('[StatsModal] articlesCount =', this.articlesCount);
  }
}
