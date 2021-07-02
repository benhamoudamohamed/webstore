import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as Cookies from 'js-cookie'
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  productListOnCart
  products: Array<any>
  id
  cartItem: number
  newArray

  invoice: any = {};
  invoiceForm: FormGroup;
  invoiceFormSub: Subscription;
  subTotal: number;

  coupons: string;
  message: string = ''
  submitted: boolean = false
  loadingSpinner: boolean = false;
  queryError:string;

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {


    this.products = []
    if(Cookies.get("cartItem") !== undefined && Cookies.get("productListOnCart") !== undefined) {

      this.cartItem = parseInt(Cookies.get("cartItem"))
      this.productListOnCart = Cookies.get("productListOnCart")
      this.newArray = JSON.parse(this.productListOnCart)

      for(let i = 0; i < this.newArray.length; i++) {
        this.id = this.newArray[i]
        this.apiService.getOneProduct(this.id)
          .subscribe((res: any) => {
            this.products.push(res)
            this.productItems.push(
              this.formBuilder.group({
                productName: [res.name],
                image: [res.fileURL],
                quantity: [1],
                price: [res.price],
                cost: [res.price]
              })
            );
          })
      }
    }

    setInterval(() => {
      this.cartItem = parseInt(Cookies.get("cartItem"))
      this.productListOnCart = Cookies.get("productListOnCart")
    }, 1000)
  }

  ngOnInit() {
    this.buildInvoiceForm(this.invoice);

    this.invoiceForm.valueChanges
    .subscribe(formValue => {
      this.coupons = formValue.coupon
      this.queryError = ''
    });
  }

  get productItems() {
    return this.invoiceForm.get('items') as FormArray;
  }
  get f() {
    return this.invoiceForm.controls;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  buildInvoiceForm(i: any = {}) {
    this.invoiceForm = this.fb.group({
      subtotal: [''],
      coupon: [''],
      discount: [0],
      grandTotal: [''],
      clientName: ['', [Validators.required, Validators.minLength(4)]],
      phone : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(4)]],
      items: this.fb.array((() => {
        if (!i.items) {
          return [];
        }
        return i.items.map((item) => this.createItem(item));
      })())
    });
    // LINSTEN FOR VALUE CHANGES AND CALCULATE TOTAL
    if (this.invoiceFormSub) {
      this.invoiceFormSub.unsubscribe();
    }
    this.invoiceFormSub = this.invoiceForm.valueChanges
      .subscribe(formValue => {
        this.subTotal = this.calculateSubtotal(formValue);
      });
  }

  createItem(item: any = {}) {
    return this.fb.group({
      productName: [''],
      image: [''],
      quantity: [''],
      price: [''],
      cost: [''],
    });
  }

  removeItem(i) {
    const control = <FormArray>this.invoiceForm.controls['items'];
    control.removeAt(i);

    let newArray = JSON.parse(this.productListOnCart)
    newArray.forEach((element,index)=>{
      if(index === i) newArray.splice(index, 1);
    });
    Cookies.set("productListOnCart", JSON.stringify(newArray))
    this.productListOnCart = JSON.parse(Cookies.get("productListOnCart"))
    Cookies.set("cartItem", JSON.stringify(this.productListOnCart.length))

    if(this.productListOnCart.length < 1) {
      window.location.reload();
    }
  }

  calculateSubtotal(invoice) {
    let total = 0;
    invoice.items.forEach(i => {
        total += (i.quantity * i.price);
    });
    return total;
  }

  changeQuantity(index, increase: boolean) {
    const control = <FormArray>this.invoiceForm.controls['items'];
    let quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
    let price = this.invoiceForm.get('items')['controls'][index].controls['price'].value

    if(increase === true) {
      control.at(index).patchValue({
        'quantity': quantity + 1,
      })
      quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
      control.at(index).patchValue({
        'cost': quantity * price,
      })
    }
    else {
      if(quantity >1) {
        control.at(index).patchValue({
          'quantity': quantity - 1,
        })
        quantity = this.invoiceForm.get('items')['controls'][index].controls['quantity'].value
        control.at(index).patchValue({
          'cost': quantity * price,
        })
      }
    }

    this.invoiceForm.patchValue({
      'subtotal': this.subTotal
    })

  }

  setCodePromo() {
    const data = this.invoiceForm.value;
    this.apiService.findbyCode(data.coupon)
      .subscribe((res) => {
        if(!res.expired) {
          this.message = 'Valid Code'
          this.invoiceForm.patchValue({
            'discount': res.discount,
            'grandTotal': (this.subTotal - res.discount/100 * this.subTotal),
          })
        } else if(res.expired) {
          this.message = 'Coupon Code Expired'
          this.invoiceForm.patchValue({
            'coupon': '',
            'discount': 0,
            'grandTotal': this.subTotal,
          })
        }
      }, (error: any) => {
        this.message = 'Coupon Not Found'
        this.invoiceForm.patchValue({
          'coupon': '',
          'discount': 0,
          'grandTotal': this.subTotal,
        })
      }
    );
  }

  onSubmit() {
    this.invoiceForm.patchValue({
      'subtotal': this.subTotal,
      'grandTotal': (this.subTotal - this.invoiceForm.controls['discount'].value/100 * this.subTotal)
    })

    this.submitted = true;
    const data = this.invoiceForm.value;
    if (this.invoiceForm.invalid) {
      return;
    }

    let items = data.items
    let subtotal = data.subtotal
    let coupon = data.coupon
    let discount = data.discount
    let grandTotal = data.grandTotal
    let clientName = data.clientName
    let phone = data.phone
    let email = data.email
    let address = data.address

    this.loadingSpinner = true;

    this.apiService.createPurchase({items, subtotal, coupon, discount, grandTotal, clientName, phone, email, address})
      .subscribe(res => {
        console.log("backend ", res)
        Cookies.remove('productListOnCart')
        Cookies.remove('cartItem')

        window.location.reload();
        this.loadingSpinner = false
        this.submitted = false;
        this.invoiceForm.reset();
      }, (error) => {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = error
      })
  }
}
