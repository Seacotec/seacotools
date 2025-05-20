import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',

})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
    this.setMode();
  }

  setMode(change = false): void {
    const theme = localStorage.getItem('theme');
    const html = document.documentElement;
    const lightMode = change
      ? html.classList.contains('dark')
      : theme === 'light';
    if (lightMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}
