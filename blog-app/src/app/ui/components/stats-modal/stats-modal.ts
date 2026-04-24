import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-stats-modal',
  imports: [],
  templateUrl: './stats-modal.html',
  styleUrl: './stats-modal.scss',
})
export class StatsModal {
  @Input() articlesCount!: number;
  @Output() close = new EventEmitter<void>;

  onClose() {
    this.close.emit();
  }


  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      console.log('[FormModal] open() called');
      this.onClose();
    }
  }
}
