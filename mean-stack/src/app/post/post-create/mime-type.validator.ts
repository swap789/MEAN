// import { AbstractControl } from "@angular/forms";
// import { Observable, Observer } from "rxjs";

// export const mimeType = (
//   control: AbstractControl
// ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
//   const file = control.value as File;
//   const fileReader = new FileReader();
//   const frObse = Observable.create(
//     (observer: Observable<{ [key: string]: any }>) => {
//       fileReader.addEventListener("loade", () => {
//         const arr = new Uint8Array(fileReader.result).subarray(0, 4);
//         let header = "";
//         let invalid = false;
//         for (let index = 0; index < arr.length; index++) {
//           header += arr[index].toString(16);
//         }
//         switch (header) {
//             case value:
                
//                 break;
        
//             default:
//                 break;
//         }

//         if (invalid) {
//           Observer.next(null);
//         } else {
//           observer.next({ invalidMimeType: true });
//         }
//         observer.complete();
//       });
//       fileReader.readAsArrayBuffer(file);
//     }
//   );
// };
