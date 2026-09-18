import { Injectable } from '@angular/core';
import { TeamMember } from '../models/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {

  private teamList: TeamMember[] = [
    {
      id: 1,
      name: 'Marco Remon',
      photo: 'assets/images/marco.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/marco-remon-4ba9571a2/'
    },
    {
      id: 2,
      name: 'Diego Mendia',
      photo: 'assets/images/diego.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/diego-mendia-developer/'
    },
    {
      id: 3,
      name: 'Candela Blanco',
      photo: 'assets/images/cande.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/candelaesperanza/'
    },
    {
      id: 4,
      name: 'Nicolás Oggero',
      photo: 'assets/images/nico.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/nicolasoggero/'
    }
  ];

  getTeam(): TeamMember[] {
    return this.teamList;
  }
}