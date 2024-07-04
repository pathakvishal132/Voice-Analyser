import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
interface NavItem {
  displayName: string;
  routeLink?: string; // Optional route link
  children?: NavItem[]; // Optional nested menu items
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],

})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  navItems: NavItem[] = [
    { displayName: 'Home', routeLink: '/' },
    { displayName: 'About', routeLink: '/about' },
    {
      displayName: 'Services',
      children: [
        { displayName: 'Service 1', routeLink: '/services/1' },
        { displayName: 'Service 2', routeLink: '/services/2' },
      ]
    },
    { displayName: 'Contact', routeLink: '/contact' }
  ];

  constructor() { }

  ngOnInit() { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}