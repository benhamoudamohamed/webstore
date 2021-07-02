import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Category } from './../../shared/models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  category: Category;
  id: string;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;
    }

  ngOnInit() {
    this.getOneCategory()
  }

  getOneCategory() {
    this.loadingSpinner = true;
    this.apiService.getOneCategory(this.id)
      .subscribe((res: Category) => {
        this.category = res
        console.log(res)
        this.loadingSpinner = false;
      })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/(root:category/edit/${id})`)
  }

  delete(id: string) {
    id = this.id
    this.apiService.deleteFile(this.category.fileName).subscribe(() => { }, error => console.log(error));
    this.apiService.deleteCategory(id)
      .subscribe(() => {
        this.loadingSpinner = false;
        this.router.navigateByUrl(`admin/(root:category)`)
      }, (error) => {
        console.log(error);
      });
  }

  ngOnDestroy() {

  }
}
