import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators }  from '@angular/forms';
import { stringify } from '@angular/core/src/render3/util';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services';

@Component({
  selector: 'login-popup',
  templateUrl: './login.popup.component.html',
  styleUrls: ['./login.popup.component.css']
})
export class LoginPopupComponent implements OnInit {
  display='none'; //default Variable
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    /*this.date = new Date(); // Today date and time
    //Login Validation
    this.loginForm = new FormGroup({
      emailId: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.minLength(4)
          //Validators.pattern("[^ @]*@[^ @]*")
      ])),
      password: new FormControl('', [
           Validators.minLength(4),
           Validators.required])
    });*/ 
    this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });   
    // reset login status
    //this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  openModalDialog(){
    this.display='block'; //Set block css
 }

 closeModalDialog(){
  this.display='none'; //set none css after close dialog
 }
 
 onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.closeModalDialog();
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
        
    }
    
}