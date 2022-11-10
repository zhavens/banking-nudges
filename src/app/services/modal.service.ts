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

  openNotification(title: string, message: string, buttonText: string = 'Continue'): Promise<any> {
    const modalRef = this.modalService.open(NotificationDialogComponent, { centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.buttonText = buttonText;
    return modalRef.result;
  }



  openConfirmation(title: string, message: string, confirmText: string = 'Confirm', cancelText = "Cancel"): Promise<any> {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static', centered: true });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.confirmText = confirmText;
    modalRef.componentInstance.cancelText = cancelText;
    return modalRef.result;
  }

  dismissAll() {
    this.modalService.dismissAll();
  }

  get baseService() {
    return this.modalService;
  }
}


