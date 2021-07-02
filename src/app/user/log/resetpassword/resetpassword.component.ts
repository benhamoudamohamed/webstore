import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { AuthDTO } from 'src/app/shared/models/auth';
import { validateWhitespaces } from 'src/app/shared/validators';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  submitted = false;
  loadingSpinner = false;
  queryError: string;

  firstForm: FormGroup;
  secondForm: FormGroup;
  enableStepper = false

  constructor(private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstForm = this.formBuilder.group({
      email : ['', [Validators.required, validateWhitespaces]],
    });

    this.secondForm = this.formBuilder.group({
      password : ['', [Validators.required, validateWhitespaces]],
    });

    this.firstForm.valueChanges.subscribe(() => {
      this.queryError = ''
    });
  }

  onFirstSubmit() {
    this.submitted = true;
    const data = this.firstForm.value;
    if (this.firstForm.invalid) {
      return;
    }
    this.loadingSpinner = true;
    this.apiService.getUserBymail(data)
      .subscribe(() => {
        this.loadingSpinner = false;
        this.enableStepper = true;
        this.submitted = false;
        this.queryError = 'Valid Credentials'
      }, (error) => {
        this.loadingSpinner = false;
        if(error.error.statusCode === 401) {
          this.queryError = error.error.message
        } else {
          this.queryError = 'Internel Server Error'
          console.log(error)
        }
      })
  }

  onSecondSubmit() {
    this.submitted = true;
    const data = this.secondForm.value;
    if (this.secondForm.invalid) {
      return;
    }
    this.loadingSpinner = true;

    const input: AuthDTO = {
      email: this.firstForm.get('email').value,
      password: data.password
    }

    this.apiService.resetPassowrd(input)
      .subscribe(() => {
        this.loadingSpinner = false;
        this.submitted = false;
        this.router.navigate(['/login'])
        this.secondForm.reset();
      }, (error) => {
        this.loadingSpinner = false;
        if(error.error.statusCode  === 400) {
          this.queryError = error.error.message
        } else {
          this.queryError = 'Internel Server Error'
          console.log(error)
        }
      });
  }

  get f() {
    return this.firstForm.controls
  }
}
