import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login-landing.html',
  styleUrl: './login-landing.css'
})
export class LoginLandingComponent {}