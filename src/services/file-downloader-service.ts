export class FileDownloaderService {
  download(dataURL: string, filename: string): void {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
  }

  downloadObjectAsJSON(object: any, filename: string): void {
    var data = JSON.stringify(object);
    var blob = new Blob([data], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    
    this.download(url, filename);
  }
}
