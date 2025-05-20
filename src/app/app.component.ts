import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/partials/header/header.component';
import {FooterComponent} from './shared/partials/footer/footer.component';
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
    initFlowbite();
  }




}
