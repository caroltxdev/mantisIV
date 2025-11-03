import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],  // ← Mantenha para *ngIf, *ngFor, etc
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class Produtos {}
