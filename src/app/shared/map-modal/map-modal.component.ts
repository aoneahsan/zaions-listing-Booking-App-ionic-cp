import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() center = { lat: 31.5204, lng: 74.3587 };
  @Input() modalTitle = "Pick Location";
  @Input() closeBtnText = "Cancel";
  @Input() selectable = true;

  @ViewChild('mapCon') mapRef: ElementRef;
  googleMapsObject: any;
  mapClickListener;

  constructor(
    private modalCtl: ModalController,
    private alertCtl: AlertController,
    private renderer: Renderer2
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getGoogleMaps().then((googleMaps: any) => {

      this.googleMapsObject = googleMaps;

      const mapEl = this.mapRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });

      // Global event to add visible class to mapCon
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if (this.selectable) {
        // simple click event on map object
        this.mapClickListener = map.addListener('click', event => {
          const selectedCors = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.modalCtl.dismiss(selectedCors);
        });
      } else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: "Picked Location"
        });
        marker.setMap(map);
      }
    }).catch(err => {
      console.log("ngAfterViewInit == getGoogleMaps == Google Maps SDK Error == err = ", err);
      this.alertCtl.create({
        header: "Google Maps SDK Error",
        message: "Google maps not available right not, can't pick live location.",
        buttons: [
          {
            text: "Okay",
            role: 'cancel',
            handler: () => {
              this.modalCtl.dismiss();
            }
          }
        ]
      }).then(al => {
        al.present();
      })
    });
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, rejects) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPI}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleMaps = win.google;
        if (loadedGoogleMaps && loadedGoogleMaps.maps) {
          return resolve(loadedGoogleMaps.maps);
        } else {
          return rejects("Google Maps SDK not available.");
        }
      };
    });
  }

  onCancel() {
    this.modalCtl.dismiss();
  }

  ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.googleMapsObject.event.removeListener(this.mapClickListener);
    }
  }
}
