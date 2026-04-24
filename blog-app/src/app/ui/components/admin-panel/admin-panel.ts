import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  @Output() openModal = new EventEmitter<void>();
  @Output() openStats = new EventEmitter<void>();

  isAddModalOpen = false;

  onOpenModal() {
    console.log('[Admin|Modal] button clicked');
    this.openModal.emit();
  }

  onOpenStats() {
    console.log('[Admin|Stats] button clicked');
    this.openStats.emit();
  }
}