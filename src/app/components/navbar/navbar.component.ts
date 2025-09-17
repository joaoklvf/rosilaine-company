import { Component, HostBinding, OnInit, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule]
})
export class NavbarComponent {
  readonly toggleTheme = output<void>();

  onToggleButtonClick() {
    this.toggleTheme.emit();
  }
}
