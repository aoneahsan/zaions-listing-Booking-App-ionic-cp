import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Capacitor, Plugins, CameraSource, CameraResultType } from "@capacitor/core";

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  
  @Output() saveImage = new EventEmitter<string>();
  selectedImage: string;

  constructor(
    private _modalCtl: ModalController,
    private _http: HttpClient,
    private alertCtl: AlertController,
    private actionSheet: ActionSheetController
  ) { }

  ngOnInit() { }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.showErrorAlert();
      return;
    }
    else {
      
    }
  }

  openDeviceCamera() {
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    }).then(
      image => {
        this.showErrorAlert("onpick", image.base64String);
        this.selectedImage = image.base64String;
        this.saveImage.next(image.base64String);
      }
    ).catch(err => {
      console.log("ImagePickerComponent == onPickImage == err = ", err);
      this.showErrorAlert(err);
    });
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
