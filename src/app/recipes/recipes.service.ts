// Core Imports
import { Injectable } from '@angular/core';

// Interfaces
import { RecipeInterface } from './recipe-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RecipesService {

  private _recipes: RecipeInterface[] = [
    {
      id: 'r1',
      title: 'Biryani',
      image_url: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/9/9/0/FNK_the-best-biryani_H.JPG.rend.hgtvcom.616.462.suffix/1568143107638.jpeg',
      gradients: ['chieken', 'rise']
    },
    {
      id: 'r2',
      title: 'Water',
      image_url: 'https://nnimgt-a.akamaihd.net/transform/v1/crop/frm/A3aygSSaTF7hiCbjiqBAXx/e24cc52a-ebc6-4342-9d87-59ef79e20693.jpg/r0_0_1000_563_w1200_h678_fmax.jpg',
      gradients: ['Hydrogen', 'Oxygen']
    }
  ];

  constructor() { }

  getRecipes() {
    return [...this._recipes];
  }

  getRecipe(id) {
    // console.log("id = ", id);
    let recipe =
    {
      ...this._recipes.find(el => {
        return el.id == id;
      })
    };
    // console.log(recipe);
    return recipe;
  }

}
