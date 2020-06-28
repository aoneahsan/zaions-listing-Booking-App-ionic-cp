// Core Imports
import { Component, OnInit } from '@angular/core';

// Services
import { RecipesService } from './recipes.service';

// Interfaces
import { RecipeInterface } from './recipe-model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})

export class RecipesPage implements OnInit {

  recipes: RecipeInterface[];

  constructor(private _recipeService: RecipesService) { }

  ngOnInit() {
    this.recipes = this._recipeService.getRecipes();
  }

}
