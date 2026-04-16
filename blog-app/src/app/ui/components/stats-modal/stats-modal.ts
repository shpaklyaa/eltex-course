import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-stats-modal',
  imports: [],
  templateUrl: './stats-modal.html',
  styleUrl: './stats-modal.scss',
})
export class StatsModal {
  @Input() articlesCount!: number;
}
