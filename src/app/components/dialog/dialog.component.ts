import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'nofication-dialog',
	template: `
		<div class="modal-header">
			<h4 class="modal-title">{{title}}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>{{ message }}</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-primary" (click)="activeModal.close('Close click')">{{buttonText}}</button>
		</div>
	`,
})
export class NotificationDialogComponent {
	@Input() title!: string;
	@Input() message!: string;
	@Input() buttonText: string = "Continue";

	constructor(public activeModal: NgbActiveModal) { }
}

@Component({
	selector: 'confirm-dialog',
	template: `
		<div class="modal-header">
			<h4 class="modal-title">{{title}}</h4>
		</div>
		<div class="modal-body">
			<p>{{ message }}</p>
		</div>
		<div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="activeModal.dismiss('cancel')">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="activeModal.close('confirm')">Confirm</button>
		</div>
	`,
})
export class ConfirmDialogComponent {
	@Input() title!: string;
	@Input() message!: string;

	constructor(public activeModal: NgbActiveModal) { }
}