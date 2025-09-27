import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas-pro';
import { SnackBarService } from '../snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor(
    private readonly snackBarService: SnackBarService
  ) { }

  captureDocumentScreenshot(element: HTMLElement) {
    html2canvas(element).then(canvas => {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            this.snackBarService.success('Imagem copiada para a área de transferência!');
          } catch (err) {
            this.snackBarService.error('Erro ao copiar imagem:');
            console.log(err);
          }
        }
      });
    });
  }

  printDocument(documentName?: string) {
    if (documentName)
      document.title = documentName;

    window.print();
    document.title = "Rosilaine cosméticos";
  }
}
