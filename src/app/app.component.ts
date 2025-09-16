import { Component, HostBinding, OnInit } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [LoaderComponent, NavbarComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  @HostBinding('class.dark') isDarkMode: boolean = false; // Initial theme

  title = 'Rosilaine cosméticos';

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