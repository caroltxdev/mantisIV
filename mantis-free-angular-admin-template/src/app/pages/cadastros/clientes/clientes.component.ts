import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],  // ← Mantenha para *ngIf, *ngFor, etc
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class Produtos {}
