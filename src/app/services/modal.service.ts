import { Injectable } from '@angular/core';
import { ConfirmDialogComponent, NotificationDialogComponent } from '@app/components/dialog/dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(
    private modalService: NgbModal,
    private logging: LoggingService) { }

  async openNotification(title: string, message: string, buttonText: string = 'Continue'): Promise<any> {
    this.logging.info(`Opening notification modal: ${title}`);
    const modalRef = this.modalService.open(NotificationDialogComponent, { centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.buttonText = buttonText;
    return modalRef.result
      .then(() => { this.logging.info(`${title} notification modal closed.`) })
      .catch((reason: any) => { this.logging.info(`${title} notification modal dismissed. Reason: ${reason}`) });
  }

  async openConfirmation(title: string, message: string, confirmText: string = 'Confirm', cancelText = "Cancel"): Promise<any> {
    this.logging.info(`Opening confirmation modal: ${title}`);
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.confirmText = confirmText;
    modalRef.componentInstance.cancelText = cancelText;
    return modalRef.result
  }

  dismissAll() {
    this.logging.info('Dismissing all modals.');
    this.modalService.dismissAll();
  }

  get baseService() {
    return this.modalService;
  }
}


