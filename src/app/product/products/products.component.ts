import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from './../../shared/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loadingSpinner = false;
  columnsItems = ['id', 'productCode', 'name', 'image', 'view'];
  tableDataSource: Array<Product>;
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
    this.apiService.getAllProducts(this.currentPage, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
      this.loadingSpinner = false;
    })
  }

  getPage(page: number) {
    this.apiService.getAllProducts(page, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
    })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:product/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:product/detail/${id})`)
  }
}
