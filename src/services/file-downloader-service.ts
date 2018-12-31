export class FileDownloaderService {
  download(dataURL: string, filename: string): void {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
  }

  downloadObjectAsJSON(object: any, filename: string): void {
    const data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object));
    const href = `data:'${data}'`;
    
    this.download(href, filename);
  }
}
