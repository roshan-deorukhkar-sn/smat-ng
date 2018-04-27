import { NgModule, PipeTransform, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class PipesModule implements PipeTransform { 
  transform(value, args:string[]) : any {
    console.log(value)
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}
