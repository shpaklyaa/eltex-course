import { Component} from '@angular/core';

@Component({
  selector: 'app-form-modal',
  imports: [],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.scss',
})
export class FormModal {
  visible: boolean = false;

  open() {
    console.log('[FormModal] open() called');
    this.visible = true;
    console.log('[FormModal] visible =', this.visible);
  }

  close() {
    console.log('[FormModal] open() called');
    this.visible = false;
    console.log('[FormModal] visible =', this.visible);
  }

  closeOnBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      console.log('[FormModal] open() called');
      this.close();
      console.log('[FormModal] visible =', this.visible);
    }
  }
}
