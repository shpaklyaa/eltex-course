import { Component, ViewChild, Input } from '@angular/core';
import { FormModal } from '../form-modal/form-modal';
import { StatsModal } from '../stats-modal/stats-modal';

@Component({
  selector: 'app-admin-panel',
  imports: [ FormModal, StatsModal ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  @ViewChild(FormModal) modal!: FormModal;
  @ViewChild(FormModal) modalBackdrop!: FormModal;
  @ViewChild(StatsModal) modalStats!: StatsModal;
  @ViewChild(StatsModal) modalBackdropStats!: StatsModal;

  @Input() articlesCount!: number;

  ngAfterViewInit() {
    console.log('Modal initialized:', this.modal);
    console.log('Modal initialized:', this.modalBackdrop);
  }

  openModalForm() {
    this.modal.open();
    this.modalBackdrop.open();
    this.modalStats.close();
  }

  openModalStats() {
    this.modalStats.openStats();
    this.modalBackdropStats.openStats();
    this.modal.close();
  }
  ngOnInit() {
    console.log('[AdminPanel] articlesCount =', this.articlesCount);
  }
}