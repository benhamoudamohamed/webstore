import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Coupon } from './../../shared/models/coupon';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  loadingSpinner = false;
  columnsItems = ['id', 'code', 'expired', 'view'];
  tableDataSource: Array<Coupon>;
  itemsPagination = [];
  searchedKeyword: string;
  currentPage: number = 1;
  size: number = 10;
  totalItems: number;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadAll()
  }

  loadAll() {
    this.loadingSpinner = true;
    this.apiService.getAllCouponsByPage(this.currentPage, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
      this.loadingSpinner = false;
    })
  }

  getPage(page: number) {
    this.apiService.getAllCouponsByPage(page, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
    })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:coupon/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:coupon/detail/${id})`)
  }
}
