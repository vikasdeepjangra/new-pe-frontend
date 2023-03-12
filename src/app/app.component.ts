import { OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import loader from '@monaco-editor/loader';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{

  constructor(private http: HttpClient){}

  ngOnInit(){
    loader.config({
      paths: {
        vs: './',
      }
    });
  }

  ngOnChanges(){
    console.log(this.code)
  }

  fontsize: number = 18;
  tabsize: number = 4;
  code: string= '//Type your code here.';
  fileHandle : any = null;
  showResultBox = false;
  showRunning = true;
  finalResult: any;
  isfileUploaded: boolean = false;
  uploadFileName: string;

  editorOptions = {theme: 'vs-dark', 
                  language: 'cpp', 
                  renderIndentGuides: true, 
                  fontSize: this.fontsize, 
                  tabSize: this.tabsize,
                  wordWrap: "on"};

  async uploadFileUsingFileSystemAPI(){
    [this.fileHandle] = await (window as any).showOpenFilePicker();
    const file: File = await this.fileHandle.getFile();
    const contents = await file.text();
    if(this.fileHandle != null){
      this.isfileUploaded = true;
      this.uploadFileName = this.fileHandle.name;
      this.finalResult = "";
      this.showResultBox = false;
    }
    this.code = contents;
  }

  async saveFileUsingFileSystemAPI(){
    const contents = this.code;
    const writable = await this.fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  async resetEditor(){
    this.fileHandle = null;
    this.code = '//Type your code here.';
    this.finalResult = "";
    this.showResultBox = false;
    this.uploadFileName = ""
  }

  async compileRunCode(){
    this.showRunning = true;
    this.showResultBox = true;
    this.finalResult = "";
    const x = { data: "Hello"};
    const data = await fetch('http://localhost:5000/saveFileAndCompile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: this.code })
    })
    this.showRunning = false;
    console.log(data);
    data.text().then((x) => {
      this.finalResult = x;
      console.log("The Output is: ", this.finalResult);
    });
  }

}
