import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Purchase } from 'src/app/shared/models/purchase';

@Component({
  selector: 'app-purchase-edit',
  templateUrl: './purchase-edit.component.html',
  styleUrls: ['./purchase-edit.component.scss']
})
export class PurchaseEditComponent implements OnInit {

  title: string;
  form: FormGroup;
  id = '';
  productName: string;
  image: string;
  price: number;
  quantity: number;
  cost: number;
  subtotal: number;
  coupon: string;
  discount: number;
  grandTotal: number;
  clientName: string;
  email: string;
  phone: string;
  address: string;

  submitted = false;
  queryError:string;
  loadingSpinner = false;
  itemId: string;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      productName : ['', [Validators.required]],
      image : ['', [Validators.required]],
      price : ['', [Validators.required]],
      quantity : ['', [Validators.required]],
      cost : ['' , [Validators.required]],
      subtotal : ['' , [Validators.required]],
      coupon : ['' , [Validators.required]],
      discount : ['' , [Validators.required]],
      grandTotal : ['', [Validators.required]],
      clientName : ['', [Validators.required]],
      email : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      address : ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update Purchase'
      this.apiService.getOnePurchase(this.itemId)
      .subscribe((res: Purchase) => {
        this.id = res.id;
        this.form.setValue({
          productName: res.productName,
          image: res.image,
          price: res.price,
          quantity: res.quantity,
          cost: res.cost,
          subtotal: res.subtotal,
          coupon: res.coupon,
          discount: res.discount,
          grandTotal: res.grandTotal,
          clientName: res.clientName,
          email: res.email,
          phone: res.phone,
          address: res.address,
        });

      })
    } else {
      this.title = 'Create Purchase'
      this.form.setValue({
        productName: '',
        image: '',
        price: '',
        quantity: '',
        total: '',
        discount: '',
        grandTotal: '',
        clientName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if(this.itemId !== undefined) {
      this.update(this.itemId)
    } else {
      this.create()
    }
  }

  create() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.apiService.createPurchase(data)
      .subscribe(() => {
        this.loadingSpinner = false
        this.router.navigateByUrl(`admin/(root:purchase)`)
        this.submitted = false;
        this.form.reset();
      }, (error) => {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = error.error.message
      }
    );
  }

  update(id: string) {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.apiService.updatePurchase(id, data)
      .subscribe(() => {
        this.loadingSpinner = false
        this.router.navigateByUrl(`admin/(root:purchase)`)
        this.submitted = false;
        this.form.reset();
      }, (error) => {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = error.error.message
      }
    );
  }
}
