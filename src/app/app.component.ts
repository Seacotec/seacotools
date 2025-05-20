import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/partials/header/header.component';
import {SideBarComponent} from './shared/partials/side-bar/side-bar.component';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,

    SideBarComponent


  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'flowbite-app';

  ngOnInit(): void {
  }




}
