import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule],  // ← Mantenha para *ngIf, *ngFor, etc
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class Funcionarios {}
