import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validateWhitespaces } from 'src/app/shared/validators';
import { IsAuthenticated } from 'src/app/shared/isAuthenticated.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  user: any = {email: '', password: ''};
  email = '';
  password = '';
  submitted = false;
  queryError: any;
  loadingSpinner = false;

  constructor(private isAuthenticated: IsAuthenticated,
    private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService) {

    if (this.isAuthenticated.isAuthenticated()) {
      this.router.navigateByUrl(`admin/(root:dashboard)`)
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email : ['', [Validators.required, validateWhitespaces]],
      password : ['', [Validators.required, validateWhitespaces]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.authservice.login(data)
      .subscribe(() => {
        this.router.navigateByUrl(`admin/(root:dashboard)`)
        this.submitted = false;
        this.form.reset();
      }, (error) => {
        console.log(error)
        this.loadingSpinner = false;
        if(error.error.status === 401 || error.error.status === 403) {
          this.queryError = error.error.error
        } else if (error.error.status !== (401 || 403)) {
          this.queryError = 'Internel Server Error'
          console.log(error)
        }
      })
  }
}
