import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { StorehomeComponent } from './storehome/storehome.component';
import { ShopComponent } from './shop/shop.component';
import { CollectionComponent } from './collection/collection.component';
import { AboutComponent } from './about/about.component';
import { ShippingComponent } from './shipping/shipping.component';
import { CartComponent } from './cart/cart.component';
import { NebularComponentModule } from '../shared/nebular-component.module';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { SwiperModule } from 'swiper/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';
import { ContactComponent } from './contact/contact.component';
import { ProductsComponent } from './products/products.component';

@NgModule({
  declarations: [
    StorehomeComponent,
    ShopComponent,
    CollectionComponent,
    AboutComponent,
    ShippingComponent,
    CartComponent,
    LandingpageComponent,
    ContactComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    NebularComponentModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
  ]
})
export class StoreModule { }
