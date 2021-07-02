import { Product } from 'src/app/shared/models/product';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Category } from './../../shared/models/category';
import Categories from '../../shared/categories.json';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  loadingSpinner = false;
  categories: Category[]
  //categories: any

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadAllCategories()
  }

  loadAllCategories() {
    this.loadingSpinner = true;
    // this.categories = Categories;
    // this.loadingSpinner = false;
    // console.log(this.categories)

    this.apiService.getAllCategories()
      .subscribe((res: any) => {
        this.categories = res
        this.loadingSpinner = false;
        console.log(res)
      })
  }

  onClick(id: string) {
    this.router.navigateByUrl(`store/products/${id})`)
  }
}
