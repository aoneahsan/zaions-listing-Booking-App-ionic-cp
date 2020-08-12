import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutDeveloperPage } from './about-developer.page';

describe('AboutDeveloperPage', () => {
  let component: AboutDeveloperPage;
  let fixture: ComponentFixture<AboutDeveloperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDeveloperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutDeveloperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
