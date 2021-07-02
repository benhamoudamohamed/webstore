import { mergeMap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthDTO, AuthType } from './models/auth';
import { User } from './models/user';
import * as Cookies from 'js-cookie'
import * as cryptoJS from 'crypto-js';
import { baseURL } from './baseURL';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private api: string = environment.api_server;
  private api: string = baseURL;
  //private lang: string = environment.lang;
  private lang: string = 'ZF!:158ETlgjkdXdf78,$'

  constructor(private http: HttpClient) { }

  private auth(authType: AuthType, data: AuthDTO): Observable<User>  {
    return this.http.post<User>(`${this.api}/${authType}`, data).pipe(
      mergeMap((user: User) => {
        this.token = user.token;
        return of(user);
      })
    )
  }

  whoami() {
    return this.http.get(`${this.api}/whoami`, {
      headers: { authorization: `Bearer ${this.token}`}
    })
  }

  refresh() {
    return this.http.get(`${this.api}/refresh`, {
      headers: { authorization: `Bearer ${this.token}`}
    })
  }

  login(data: AuthDTO): Observable<User>  {
    return this.auth('login', data)
  }

  register(data: AuthDTO): Observable<User>  {
    return this.auth('register', data)
  }

  get token() {
    const userToken = Cookies.get('lang_defautl_sys') || Cookies.get('lang_defautl_2');
    // const bytes  = cryptoJS.AES.decrypt(userToken, this.lang);
    // const decrypt = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    // return decrypt;
    return userToken;
  }

  set token(val: string) {
    if(val) {
      // const encrypt = cryptoJS.AES.encrypt(JSON.stringify(val), this.lang).toString();
      // Cookies.set("lang_defautl_sys", encrypt, {expires: (1/24/60*15), secure: true})
      Cookies.set("lang_defautl_sys", val, {expires: (1/24/60*15), secure: true})
    } else {
      Cookies.remove('lang_defautl_sys');
      Cookies.remove('tr_fs_tik');
    }
  }
}
