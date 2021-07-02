import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { Purchase } from './../../shared/models/purchase';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  loadingSpinner = false;
  purchase: Purchase;
  id: string;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.params.id;
    }

  ngOnInit() {
    this.getOne()
  }

  getOne() {
    this.loadingSpinner = true;
    this.apiService.getOnePurchase(this.id)
      .subscribe((res: Purchase) => {
        this.purchase = res
        console.log(res)
        this.loadingSpinner = false;
      })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/(root:purchase/edit/${id})`)
  }

  delete(id: string) {
    id = this.id
    this.apiService.deletePurchase(id)
    .subscribe(() => {
      this.loadingSpinner = false;
      this.router.navigateByUrl(`admin/(root:purchase)`)
    }, (error) => {
      console.log(error);
    });
  }

  ngOnDestroy() {

  }
}
