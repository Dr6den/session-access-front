import { Component, Inject } from "@angular/core";
import { Model } from "../model/repository.model";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../auth/services';
import { first } from 'rxjs/operators';

@Component({
    selector: "paTable",
    templateUrl: "index.component.html",
    styleUrls: ["index.component.css"]
})
export class IndexComponent {
     public title: string = "Directories";
     public dictionariesTypes: string[] = [];
     
     constructor(private model: Model, private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
          let token = activatedRoute.snapshot.params['token'];
          if (token) {
              this.authenticationService.loginForClick(token).pipe(first())
            .subscribe(
                data => {
                    if (data['loginSucceed'] == false) {
                        //this.errorMessage = "Login or Password are incorrect";
                        return;
                    }
                    this.router.navigate(["/"]);
                },
                error => {
                });
          }   
     }
     
     ngOnInit() {
         this.model.getSchemesList().toPromise().then(data => {
                this.dictionariesTypes = data;
            });
     }
}
