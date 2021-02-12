import { Injectable } from '@angular/core';
import * as ui_avatars from "node_modules/ui-avatars";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor() { }

  generateAvatar(name: string) {

    return ui_avatars.generateAvatar({
      uppercase: true,
      name,
      background: "e0f3fa",
      color: "009688",
      fontsize: 0.4,
      bold: true,
      length: 2,
      rounded: false,
      size: 250
    });
    
  }

}
