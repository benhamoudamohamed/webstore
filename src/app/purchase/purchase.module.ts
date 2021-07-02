import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseEditComponent } from './purchase-edit/purchase-edit.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [
    PurchaseEditComponent,
    PurchaseComponent,
    PurchasesComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NebularComponentModule,
    SpinnerModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ]
})
export class PurchaseModule { }
