import { Component, ViewChild } from '@angular/core';
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

  ngAfterViewInit() {
    console.log('Modal initialized:', this.modal);
  }

  openModal() {
    this.modal.open();
  }
}