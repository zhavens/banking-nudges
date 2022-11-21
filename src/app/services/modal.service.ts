import { Component, Injectable, Input, TemplateRef } from '@angular/core';
// import { TextConfirmDialogComponent, NotificationDialogComponent } from '@app/components/dialog/dialog.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from './logging.service';

@Component({
  selector: 'nofication-dialog',
  template: `
		<div class="modal-header">
			<h4 class="modal-title">{{title}}</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
      <ng-container *ngIf="(content | typeof) == 'string'; else templateContent">
        {{ content }}
      </ng-container>
      <ng-template #templateContent>
        <ng-container *ngTemplateOutlet="content;"></ng-container>
      </ng-template>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-primary" (click)="activeModal.close('Close click')">{{buttonText}}</button>
		</div>
	`,
})
export class NotificationDialogComponent {
  @Input() title!: string;
  @Input() content!: any;
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
			<ng-container *ngIf="(content | typeof) == 'string'; else templateContent">
        {{ content }}
      </ng-container>
      <ng-template #templateContent>
        <ng-container *ngTemplateOutlet="content;"></ng-container>
      </ng-template>
		</div>
		<div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="activeModal.dismiss('cancel')">{{cancelText}}</button>
      <button type="button" class="btn btn-primary" (click)="activeModal.close('confirm')">{{confirmText}}</button>
		</div>
	`,
})
export class ConfirmDialogComponent {
  @Input() title!: string;
  @Input() content!: any;
  @Input() confirmText: string = "Confirm";
  @Input() cancelText: string = "Cancel";

  constructor(public activeModal: NgbActiveModal) { }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(
    private modalService: NgbModal,
    private logging: LoggingService) { }

  async openNotification(title: string, content: TemplateRef<any> | string, buttonText: string = 'Continue'): Promise<any> {
    this.logging.info(`Opening notification modal: ${title}`);
    const modalRef = this.modalService.open(NotificationDialogComponent, { centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.buttonText = buttonText;
    return modalRef.result
      .then(() => { this.logging.info(`${title} notification modal closed.`) })
      .catch((reason: any) => { this.logging.info(`${title} notification modal dismissed. Reason: ${reason}`) });
  }

  async openConfirmation(title: string, content: TemplateRef<any> | string, confirmText: string = 'Confirm', cancelText = "Cancel"): Promise<any> {
    this.logging.info(`Opening confirmation modal: ${title}`);
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.confirmText = confirmText;
    modalRef.componentInstance.cancelText = cancelText;
    return modalRef.result
      .then(() => { this.logging.info(`${title} confirmation modal closed.`) })
      .catch((reason: any) => { this.logging.info(`${title} confirmation modal dismissed. Reason: ${reason}`) });
  }

  dismissAll() {
    this.logging.info('Dismissing all modals.');
    this.modalService.dismissAll();
  }

  get baseService() {
    return this.modalService;
  }
}


