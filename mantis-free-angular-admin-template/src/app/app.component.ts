import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: `
    <div class="sacola-sidebar">
      <!-- Logo -->
      <div class="sacola-header">
        <a href="/inicio" class="sacola-brand">
          <span class="sacola-logo-text">Sacola Cheia</span>
        </a>
      </div>

      <!-- Menu -->
      <div class="sacola-menu">
        <div class="sacola-caption">MENU PRINCIPAL</div>
        <a href="/inicio" class="sacola-link">
          <span class="sacola-icon">🏠</span>
          <span>Início</span>
        </a>
      </div>
    </div>

    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .sacola-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 260px;
      height: 100vh;
      background: #1a4d27;
      z-index: 9999;
      overflow-y: auto;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      padding: 1rem;
    }

    .sacola-header {
      background: #2d7a3e;
      padding: 1rem;
      border-bottom: 2px solid #52c76b;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .sacola-brand {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .sacola-logo-text {
      color: #e8f5e9;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .sacola-menu {
      padding: 1rem 0;
    }

    .sacola-caption {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.75rem 0.5rem 0.5rem;
      margin-top: 1rem;
      letter-spacing: 0.5px;
    }

    .sacola-link {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      color: #e8f5e9;
      text-decoration: none;
      border-radius: 8px;
      margin: 0.25rem 0;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .sacola-link:hover {
      background: rgba(82, 199, 107, 0.15);
      transform: translateX(5px);
    }

    .sacola-icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .main-content {
      margin-left: 260px;
      padding: 2rem;
      background: #f5f5f5;
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .sacola-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Sacola Cheia';
}
