import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-team-page',
  templateUrl: './team-page.html',
  styleUrls: ['./team-page.scss']
})
export class TeamPageComponent implements OnInit {

  constructor(
      private route: ActivatedRoute
  ) { }


  ngOnInit() {
        this.route.data.subscribe(data => {
            console.log(data);
        });
  }

}
