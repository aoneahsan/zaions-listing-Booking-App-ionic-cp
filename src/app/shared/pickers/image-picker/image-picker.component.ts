import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { ModalController, AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Capacitor, Plugins, CameraSource, CameraResultType } from "@capacitor/core";

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  
  @ViewChild('filePicker') fileInput: ElementRef<HTMLInputElement>;

  @Input() showPreview: boolean = false;
  @Output() saveImage = new EventEmitter<string | File>();
  selectedImage: string;

  useFilePicker: boolean = false; // for desktop devices

  constructor(
    private _modalCtl: ModalController,
    private _http: HttpClient,
    private alertCtl: AlertController,
    private actionSheet: ActionSheetController,
    private plateform: Platform
  ) { }

  ngOnInit() {
    if ((this.plateform.is('mobile') && !this.plateform.is('hybrid')) || this.plateform.is('desktop')) {
      this.useFilePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      // this.showErrorAlert('Camera not Available', "Device camera not available, kindly select image file from system.");
      this.fileInput.nativeElement.click();
    }
    else {
      if (this.useFilePicker) {
        this.actionSheet.create({
          header: "Select Option",
          buttons: [
            { text: "Take Pitcher", handler: () => this.openDeviceCamera() },
            { text: "Pick from device", handler: () => this.fileInput.nativeElement.click() },
            { text: "Cancel", role: "cancel" },
          ]
        }).then(asEl => asEl.present());
      } else {
        this.openDeviceCamera();
      }
    }
  }

  openDeviceCamera() {
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 500,
      resultType: CameraResultType.DataUrl
    }).then(
      image => {
        // this.showErrorAlert("onpick", image.dataUrl);
        this.selectedImage = image.dataUrl;
        this.saveImage.next(image.dataUrl);
      }
    ).catch(err => {
      console.log("ImagePickerComponent == onPickImage == err = ", err);
      if (err != 'User cancelled photos app') {
        this.showErrorAlert(err);
        if (this.useFilePicker) { // this will only run if this is a desktop device and some how device camera not working
          this.fileInput.nativeElement.click(); 
        }
      }
    });
  }

  onImageSelectedFromSystem(data: Event) {
    let pickedFile = (data.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      this.showErrorAlert();
      return;
    }
    let file = new FileReader();
    file.onload = () => {
      const imageURL = file.result.toString();
      this.selectedImage = imageURL;
    }
    file.readAsDataURL(pickedFile);
    this.saveImage.emit(pickedFile);
  }

  showErrorAlert(header = "Error Occured", message = "Something went wrong, try again.") {
    this.alertCtl.create({
      header: header,
      message: message,
      buttons: [
        { text: 'Okay', role: 'cancel' }
      ]
    }).then(al => al.present());
  }
}
