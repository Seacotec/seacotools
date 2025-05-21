import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './partials/header/header.component';
import {SideBarComponent} from './partials/side-bar/side-bar.component';


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
