import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  keepLoggedIn = false;
  error = '';
  isLoading = false;

  signupName = '';
  signupEmail = '';
  signupPassword = '';
  signupMsg = '';

  activeTab: 'signin' | 'signup' = 'signin';

  constructor(private router: Router, private accountService: AccountService) {}

  login() {
    this.isLoading = true;
    this.error = '';
    
    this.accountService.login(this.username, this.password).subscribe({
      next: (account) => {
        this.isLoading = false;
        if (account.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (account.role === 'SuperAdmin') {
          this.router.navigate(['/superadmin']);
        } else {
          this.router.navigate(['/frontdesk']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || 'Invalid credentials!';
      }
    });
  }

  signup() {
    this.signupMsg = 'Account created! You can now sign in.';
    setTimeout(() => {
      this.activeTab = 'signin';
      this.signupMsg = '';
    }, 1500);
  }
}