import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from 'src/app/shared/models/product';
import * as Cookies from 'js-cookie'
import { NbToastrService } from '@nebular/theme';
import products from '../../shared/products.json';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loadingSpinner: boolean = false;
  productByCategory;
  id: string;
  product
  isInList: boolean = false

  productListOnCart: any;
  cartItem: any = 0
  disableButton: boolean = false;

  constructor(private apiService: ApiService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;

      this.productListOnCart = []

      if(Cookies.get("productListOnCart") !== undefined && Cookies.get("cartItem") !== undefined) {
        setInterval(() => {
          this.productListOnCart = JSON.parse(Cookies.get("productListOnCart"))
          this.cartItem = JSON.parse(Cookies.get("cartItem"))
        }, 1000)
      }
    }

  ngOnInit() {
    this.getAllproductsByCategory()
  }

  getAllproductsByCategory() {
    this.loadingSpinner = true;
    // this.productByCategory = products
    // this.loadingSpinner = false;

    this.apiService.getProductsByCategory(this.id)
      .subscribe((res: any) => {
        this.productByCategory = res
        this.loadingSpinner = false;
      })
  }

  addTocart(id: string) {

    // let newId = id-1

    // console.log(id)
    // this.product = products[newId]
    // console.log(' res ', this.product)

    // this.isInList = this.productListOnCart.includes(this.product.id);

    // if(this.isInList) {
    //   this.toastrService.info('Product Already In Cart')
    //   return;
    // }
    // if(!this.isInList && this.product.isAvailable === true) {
    //   this.productListOnCart.push(this.product.id)
    //   Cookies.set("productListOnCart", JSON.stringify(this.productListOnCart)), {expires: (365), secure: true}
    //   Cookies.set("cartItem", JSON.stringify(this.productListOnCart.length), {expires: (365), secure: true})
    //   this.toastrService.success('Product Add to Cart successfully')
    // }

    this.apiService.getOneProduct(id)
      .subscribe((res: Product) => {
        this.product = res
        this.isInList = this.productListOnCart.includes(this.product.id);

        if(this.isInList) {
          this.toastrService.info('Product Already In Cart')
          return;
        }
        if(!this.isInList && this.product.isAvailable === true) {
          this.productListOnCart.push(this.product.id)
          Cookies.set("productListOnCart", JSON.stringify(this.productListOnCart)), {expires: (365), secure: true}
          Cookies.set("cartItem", JSON.stringify(this.productListOnCart.length), {expires: (365), secure: true})
          this.toastrService.success('Product Add to Cart successfully')
        }
      })
  }
}
