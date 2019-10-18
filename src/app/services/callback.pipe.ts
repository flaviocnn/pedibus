import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback',
  pure: false
})
export class CallbackPipe implements PipeTransform {

  transform(items: any[], callback: (item: any, s: any) => boolean, arg1: any): any {
    if (!items || !callback) {
        return items;
    }
    return items.filter(item => callback(item, arg1));
}

}
