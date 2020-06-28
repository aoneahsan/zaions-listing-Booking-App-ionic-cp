import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from './../recipes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeInterface } from '../recipe-model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit, OnDestroy {

  _recipe: RecipeInterface;
  _routeParams_Sub: Subscription;

  constructor(private _recipeService: RecipesService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._routeParams_Sub = this._route.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('id')) {
          console.log("RecipeDetailPage == ngOnInit == paramMap['id'] = ", paramMap.get('id'));
          this._recipe = this._recipeService.getRecipe(paramMap.get('id'));
          console.log(this._recipe);
        }
        else {
          this._router.navigate(['recipes']);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this._routeParams_Sub) {
      this._routeParams_Sub.unsubscribe();
    }
  }

}
