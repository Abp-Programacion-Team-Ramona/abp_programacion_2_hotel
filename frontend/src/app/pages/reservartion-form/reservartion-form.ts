import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-reservartion-form',
  styleUrl: './reservartion-form.css',
  templateUrl: './reservartion-form.html',
})
export class ReservartionForm {

  minDate = new Date().toISOString().split('T')[0];

  reservationForm = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    guests: new FormControl('', [Validators.required, Validators.min(1), Validators.max(6)]),
    dailyMenu: new FormControl(false),
    parking: new FormControl(false),
    childcare: new FormControl(false),
    historyGuide: new FormControl(false),
    observations: new FormControl('')
  });
}
