import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-about-page',
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.scss']
})
export class AboutPageComponent implements OnInit {

  constructor(
      private route: ActivatedRoute
  ) { }


  ngOnInit() {
        this.route.data.subscribe(data => {
            console.log(data);
        });
  }

}
