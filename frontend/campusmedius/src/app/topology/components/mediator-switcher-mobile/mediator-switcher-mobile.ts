import { Component, OnInit, Input } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';
import { Router } from '@angular/router';

@Component({
  selector: 'cm-mediator-switcher-mobile',
  templateUrl: './mediator-switcher-mobile.html',
  styleUrls: ['./mediator-switcher-mobile.scss']
})
export class MediatorSwitcherMobileComponent implements OnInit {

  @Input() mediators: Mediator[];
  @Input() lang: string;

  public selectedMediator: Mediator;
  public previousMediator: Mediator;
  public lastMediator: Mediator;
  public nextMediator: Mediator;
  public firstMediator: Mediator;
  private currentIndex: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.selectMediatorByIndex(0);
  }
  public navigate(mediator: Mediator) {
    if (mediator === this.selectedMediator){
      this.router.navigate(['/topology', 'mediations', mediator.mediationId, 'mediators', mediator.id], {
        queryParamsHandling: 'merge'
    });
    }
  }

  public next() {
    this.selectMediatorByIndex(((this.currentIndex + 1) % 5));
  }

  public previous() {
    this.selectMediatorByIndex(((this.currentIndex + 4) % 5));
  }

  private selectMediatorByIndex(index: number) {
    this.selectedMediator = this.mediators[index];
    this.previousMediator = this.mediators[((index + 4) % 5)];
    this.lastMediator = this.mediators[((index + 2) % 5)];
    this.nextMediator = this.mediators[((index + 1) % 5)];
    this.firstMediator = this.mediators[((index + 3) % 5)];
    this.currentIndex = index;
  }

}
