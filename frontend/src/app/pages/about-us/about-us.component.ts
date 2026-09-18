import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutUsService } from './services/about-us.service';
import { TeamMember } from './models/team-member.model';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  teamList: TeamMember[] = [];

  constructor(private aboutUsService: AboutUsService) {
    this.teamList = this.aboutUsService.getTeam();
  }
}
