import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent {
  // Estado inicial mostrando créditos por defecto
  categoriaActiva: 'creditos' | 'ahorros' = 'creditos';

  cambiarCategoria(categoria: 'creditos' | 'ahorros') {
    this.categoriaActiva = categoria;
  }
}