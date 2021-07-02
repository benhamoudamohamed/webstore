import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Purchase } from 'src/app/shared/models/purchase';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  loadingSpinner = false;
  columnsItems = ['id', 'clientName', 'phone', 'grandTotal', 'view'];
  tableDataSource: Array<Purchase>;
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
    this.apiService.getAllPurchases(this.currentPage, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
      this.loadingSpinner = false;
    })
  }

  getPage(page: number) {
    this.apiService.getAllPurchases(page, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
    })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:purchase/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:purchase/detail/${id})`)
  }
}
