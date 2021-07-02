import { Component, OnInit } from '@angular/core';
import SwiperCore, { Lazy, EffectFade, Navigation, Pagination, Zoom, Autoplay, Controller} from "swiper/core";
SwiperCore.use([Lazy, EffectFade, Navigation, Pagination, Zoom, Autoplay, Controller]);
declare let Email: any;

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
