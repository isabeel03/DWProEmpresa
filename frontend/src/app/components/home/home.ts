import { Component } from '@angular/core';
import { RouterLink,RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterModule], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {}