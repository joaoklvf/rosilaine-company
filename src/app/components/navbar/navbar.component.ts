import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule]
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.dark') isDarkMode: boolean = false; // Initial theme

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    // Optionally, save the preference to local storage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  // Load theme preference on initialization
  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    }
  }
}
