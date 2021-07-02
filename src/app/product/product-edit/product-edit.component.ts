import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Product } from './../../shared/models/product';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/shared/models/category';
import { baseURL } from 'src/app/shared/baseURL';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  private api: string = baseURL;

  title: string;
  form: FormGroup;
  id = '';
  name = '';
  productCode = '';
  price = '';
  isFavorite: Boolean;
  isAvailable: Boolean;
  category = '';
  file: any;
  fileName: string;
  fileURL: string;
  categories: Category[];

  submitted = false;
  queryError:string;
  loadingSpinner = false;
  itemId: string;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : ['', [Validators.required]],
      productCode : ['', [Validators.required]],
      price : ['', [Validators.required]],
      isFavorite : ['' , [Validators.required]],
      isAvailable : ['' , [Validators.required]],
      file : [''],
      fileName : [''],
      fileURL : [''],
      category : ['', [Validators.required]],
    });

    this.loadAllCategory();

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update Product'
      this.apiService.getOneProduct(this.itemId)
      .subscribe((res: Product) => {
        this.id = res.id;
        this.form.setValue({
          name: res.name,
          productCode: res.productCode,
          price: res.price,
          isFavorite: res.isFavorite,
          isAvailable: res.isAvailable,
          file: '',
          fileName: res.fileName,
          fileURL: res.fileURL,
          category: res.category.id,
        });

      })
    } else {
      this.title = 'Create Product'
      this.form.setValue({
        name: '',
        productCode: this.generateRandomCode(8),
        price: '',
        isFavorite: false,
        isAvailable: false,
        file: '',
        fileName: '',
        fileURL: '',
        category: null,
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

    let formData: FormData = new FormData();
    formData.append('file', this.file, this.file.name);

    this.apiService.uploadFile(formData)
      .then(res => {
        const name = data.name
        const productCode = data.productCode
        const price = data.price
        const isFavorite = data.isFavorite
        const isAvailable = data.isAvailable
        const category = data.category
        const fileName = res.data.filename
        const fileURL = `${this.api}/api/upload/${fileName}`

        this.apiService.createProduct({name, productCode, price, isFavorite, isAvailable, fileName, fileURL}, category)
          .subscribe(() => {
            this.loadingSpinner = false
            this.router.navigateByUrl(`admin/(root:product)`)
            this.submitted = false;
            this.form.reset();
          }, (error) => {
            console.log(error)
            this.loadingSpinner = false
            this.queryError = error.error.message
          }
        );
      }, (error)=> {
        console.log(error)
        this.loadingSpinner = false
        this.queryError = 'Only supported type: png, jpeg, jpg'
      })
  }

  update(id: string) {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    if(this.file) {
      let formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);

      this.apiService.uploadFile(formData)
        .then(res => {
          const name = data.name
          const productCode = data.productCode
          const price = data.price
          const isFavorite = data.isFavorite
          const isAvailable = data.isAvailable
          const category = data.category
          const fileName = res.data.filename
          const fileURL = `${this.api}/api/upload/${fileName}`

          this.apiService.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL}, category)
          .subscribe(() => {
            this.loadingSpinner = false;
            this.router.navigateByUrl(`admin/(root:product)`)
            this.submitted = false;
            this.form.reset();
          }, (error) => {
            this.loadingSpinner = false;
            console.log(error)
          });
        }, (error)=> {
          console.log(error)
          this.loadingSpinner = false
          this.queryError = 'Only supported type: png, jpeg, jpg'
        })
    } else {
      const name = this.form.get('name').value
      const productCode = this.form.get('productCode').value
      const price = this.form.get('price').value
      const isFavorite = this.form.get('isFavorite').value
      const isAvailable = this.form.get('isAvailable').value
      const category = data.category
      const fileName = this.form.get('fileName').value
      const fileURL = this.form.get('fileURL').value

      this.apiService.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL}, category)
      .subscribe(() => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:product)`)
        this.submitted = false;
        this.form.reset();
      }, (error) => {
        this.loadingSpinner = false;
        console.log(error)
        this.queryError = error.error.message
      });
    }
  }

  onFileSecelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.file = file
      this.form.patchValue({
        fileName: 's',
        fileURL: 's',
      });
    }
  }

  loadAllCategory() {
    this.apiService.getAllCategories()
    .subscribe((res: any) => {
      this.categories = res
    })
  }

  isFavoriteEvent(isFavorite: boolean) {
    this.isFavorite = isFavorite;
  }

  isAvailableEvent(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }

  generateRandomCode(length: number) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
}
