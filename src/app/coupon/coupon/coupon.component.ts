import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Coupon } from './../../shared/models/coupon';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  loadingSpinner = false;
  coupon: Coupon;
  id: string;
  qrdata: string = null;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;
    }

  ngOnInit() {
    this.getOneCoupon()
  }

  getOneCoupon() {
    this.loadingSpinner = true;
    this.apiService.getOneCoupon(this.id)
      .subscribe((res: Coupon) => {
        this.coupon = res
        this.qrdata = res.code
        this.loadingSpinner = false;
      })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/(root:coupon/edit/${id})`)
  }

  delete(id: string) {
    id = this.id
    this.apiService.deleteCoupon(id)
    .subscribe(() => {
      this.loadingSpinner = false;
      this.router.navigateByUrl(`admin/(root:coupon)`)
    }, (error) => {
      console.log(error);
    });
  }

  downloadQRCode() {
    const fileNameToDownload = 'image_qrcode';
    const base64Img = document.getElementsByClassName('coolQRCode')[0].children[0]['src'];
    fetch(base64Img)
      .then(res => res.blob())
      .then((blob) => {
        // IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob){
          window.navigator.msSaveOrOpenBlob(blob,fileNameToDownload);
        } else { // Chrome
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileNameToDownload;
          link.click();
        }
      })
  }

  ngOnDestroy() {

  }
}
