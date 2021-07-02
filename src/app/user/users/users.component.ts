import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  loadingSpinner = false;
  columnsItems = ['id', 'name', 'userRole', 'view'];
  tableDataSource: Array<User>;
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
    this.apiService.getAllUsers(this.currentPage, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
      this.loadingSpinner = false;
    })
  }

  getPage(page: number) {
    this.apiService.getAllUsers(page, this.size)
    .subscribe((res: any) => {
      this.tableDataSource = res.items
      this.totalItems = res.meta.totalItems
    })
  }

  create() {
    this.router.navigateByUrl(`admin/(root:user/create)`)
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/(root:user/detail/${id})`)
  }
}
