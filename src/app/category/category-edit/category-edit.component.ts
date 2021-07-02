import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { baseURL } from 'src/app/shared/baseURL';
import { Category } from './../../shared/models/category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  title: string;
  form: FormGroup;
  id = '';
  name = '';
  file: any;
  fileName: string;
  fileURL: string;
  submitted = false;
  queryError:string;
  loadingSpinner = false;
  itemId: string;

  private api: string = baseURL;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : ['', [Validators.required]],
      file : [''],
      fileName : [''],
      fileURL : [''],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params.id;

    if(this.itemId !== undefined) {
      this.title = 'Update Category'
      this.apiService.getOneCategory(this.itemId)
      .subscribe((res: Category) => {
        this.id = res.id;
        this.form.setValue({
          name: res.name,
          file: '',
          fileName: res.fileName,
          fileURL: res.fileURL,
        });

      })
    } else {
      this.title = 'Create Category'
      this.form.setValue({
        name: '',
        file: '',
        fileName: '',
        fileURL: '',
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
        const fileName = res.data.filename
        const fileURL = `${this.api}/api/upload/${fileName}`

        this.apiService.createCategory({name, fileName, fileURL})
          .subscribe(() => {
            this.loadingSpinner = false
            this.router.navigateByUrl(`admin/(root:category)`)
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
          const fileName = res.data.filename
          const fileURL = `${this.api}/api/upload/${fileName}`

          this.apiService.updateCategory(id, {name, fileName, fileURL})
          .subscribe(() => {
            this.loadingSpinner = false;
            this.router.navigateByUrl(`admin/(root:category)`)
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
      const fileName = this.form.get('fileName').value
      const fileURL = this.form.get('fileURL').value

      this.apiService.updateCategory(id, {name, fileName, fileURL})
      .subscribe(() => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:category)`)
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
}
