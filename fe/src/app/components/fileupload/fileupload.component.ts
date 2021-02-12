import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  @ViewChild('uploadImageModal', { static: true }) uploadImageModal: ModalDirective;
  @ViewChild("uploadDocumentModal", { static: true }) uploadDocumentModal: ModalDirective;

  @Input() accept: string;
  @Output() outFile = new EventEmitter();

  imageBase64: string;
  imageToUploadBase64: string;
  imagePath;
  imagePathToUpload;
  isFileSelected = false;

  document64String: string;
  documentPath;
  fileName: string;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

  }

  showModal() {

    if (this.accept == '.png, .jpg, .jpeg') {
      this.uploadImageModal.show();
    }

    if (this.accept == '.pdf') {
      this.uploadDocumentModal.show();
    }

  }

  /**************************
          File Methods
  ***************************/

  saveImage() {
    this.outFile.emit(this.imageToUploadBase64);
    this.hideModal();
  }

  /* Emit Document */
  saveDocument() {
    this.outFile.emit(this.document64String);
    this.hideModal();
  }

  /* Called on Image File Select */
  onImageSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    this.imagePathToUpload = file;
    console.log(this.imagePathToUpload);

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this.handleImageChange.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  /* 
   Called after onImageSelect
   Changes File to Base64
  */
  handleImageChange(readerEvt) {

    var binaryString = readerEvt.target.result;
    this.imageToUploadBase64 = btoa(binaryString);

    this.isFileSelected = true;

    this.imagePathToUpload = this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/jpg;base64," + this.imageToUploadBase64
    );
  }

  /* Called on File Select */
  onCvSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = this.handleCVChange.bind(this);
      reader.readAsDataURL(file);

      this.fileName = file.name;
      this.isFileSelected = true;
    }
  }

  /* 
   Called after file reader
   Binds reader results to base64 
 */
  handleCVChange(readerEvt) {
    this.document64String = readerEvt.target.result;
    this.documentPath = this.document64String;
  }

  hideModal() {
    this.uploadImageModal.hide();
    this.uploadDocumentModal.hide();
  }

}
