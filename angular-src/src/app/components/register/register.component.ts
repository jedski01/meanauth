import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService : ValidateService,
    private flashMessage : FlashMessagesService,
    private authService: AuthService,
    private router: Router)
  { }

  ngOnInit() {
  }

  submitForm() {

    const userInfo = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }

    //Required fields
    if(!this.validateService.isFormValid(userInfo)) {
      // console.log("Please fill in all fields");
      this.flashMessage.show("Please fill in all fields",
                              {cssClass: "alert-danger", timeout: 3000})
      return false;
    }

    if(!this.validateService.isEmailValid(userInfo.email)) {
      this.flashMessage.show("Please use a valid email",
                              {cssClass: "alert-danger", timeout: 3000})
      return false;
    }

    //register user
    this.authService.register(userInfo)
      .subscribe( data => {
        if(data.success) {
          this.flashMessage.show(
            "You are now registered and can log in",
            {cssClass: 'alert-success', timeout: 3000}
          );
          this.router.navigate(['/login'])
        } else {
          this.flashMessage.show(
            "Something went terribly wrong",
            {cssClass: 'alert-danger', timeout: 3000}
          );
          this.router.navigate(['/register']);
        }
      })
  }
}
