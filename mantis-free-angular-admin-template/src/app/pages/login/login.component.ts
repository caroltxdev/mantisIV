import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>🥬 Sacola Cheia</h1>
          <p>Sistema de Orçamentos</p>
        </div>
        
        <form (ngSubmit)="login()">
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" class="input" required>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Senha" class="input" required>
          <button type="submit" class="btn-login">Entrar</button>
        </form>
      </div>
    </div>
  `,
  
  styles: [`
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('/assets/images/frutas.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .login-box {
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  .login-header h1 {
    color: #1a4d27;
    font-size: 2.5rem;
    margin: 0;
  }
  .login-header p {
    color: #666;
    font-size: 1rem;
    margin: 0.5rem 0 2rem;
  }
  .input {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  .btn-login {
    width: 100%;
    background: #52c76b;
    color: white;
    border: none;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-login:hover {
    background: #3ab54e;
  }
`]

})
export class LoginComponent {
  email = '';
  password = '';
  private router = inject(Router);

  login() {
    if (this.email && this.password) {
      localStorage.setItem('user_email', this.email);
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/inicio']);
    }
  }
}
