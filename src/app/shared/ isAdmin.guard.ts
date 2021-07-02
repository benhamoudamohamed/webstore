import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NbToastrService  } from '@nebular/theme';
import * as Cookies from 'js-cookie'
import * as cryptoJS from 'crypto-js';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  userRole: string;
  decrypt: any;
  //private lang: string = environment.lang;
  private lang: string = 'ZF!:158ETlgjkdXdf78,$'

  constructor(private toastrService: NbToastrService) {
    // this.userRole = Cookies.get('tr_fs_tik');
    // const bytes  = cryptoJS.AES.decrypt(this.userRole, this.lang);
    // this.decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    this.decrypt = Cookies.get('tr_fs_tik');
  }

  canActivate(): boolean {
    if (this.decrypt === 'Admin') {
      return true;
    }
    this.toastrService.danger('Reserved to Admin members')
    return false;
  }
}
