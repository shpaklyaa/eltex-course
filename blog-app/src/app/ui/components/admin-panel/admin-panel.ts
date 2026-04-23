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
//   @ViewChild(FormModal) modal!: FormModal;
//   @ViewChild(FormModal) modalBackdrop!: FormModal;
//   @ViewChild(StatsModal) modalStats!: StatsModal;
//   @ViewChild(StatsModal) modalBackdropStats!: StatsModal;

//   @Input() articlesCount!: number;

//   ngAfterViewInit() {
//     console.log('Modal initialized:', this.modal);
//     console.log('Modal initialized:', this.modalBackdrop);
//   }

//   openModalForm() {
//     this.modal.open();
//     this.modalBackdrop.open();
//     this.modalStats.close();
//   }

//   openModalStats() {
//     this.modalStats.openStats();
//     this.modalBackdropStats.openStats();
//     this.modal.close();
//   }
//   ngOnInit() {
//     console.log('[AdminPanel] articlesCount =', this.articlesCount);
//   }
}