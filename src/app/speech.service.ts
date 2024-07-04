
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// declare var webkitSpeechRecognition: any;
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
@Injectable({
  providedIn: 'root'
})
export class SpeechService {


  private recognition: any;
  isStoppedSpeechRecog = false;
  public text = '';
  tempwords = "";

  private apiUrl = 'http://localhost:8000/api'; // Replace with your API endpoint
  // http://127.0.0.1:8000/api/get_speeches/

  constructor(private http: HttpClient) {

  }

  init() {
    this.recognition.interimesults = true;
    this.recognition.lang = 'en-uS';
    this.recognition.addEventListener('result', (e: any) => {
      const transcript = e.results[0][0].transcript;
      this.tempwords = transcript;
      console.log(transcript)
    })
  }

  start() {
    if (!this.recognition) {
      console.error('Speech Recognition not supported by your browser.');
      return;
    }

    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started");

    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition");
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log("Speech recognition stopped");
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempwords + '.';
    this.tempwords = '';
  }


  createSpeech(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save_speech/`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSpeeches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_speeches/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteSpeech(speechId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_speech/${speechId}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error.message || error); // Use throwError instead of throw
  }

  getUniquePhrases(speechId: number) {
    return this.http.get<any>(`${this.apiUrl}/unique_phrase/${speechId}/`)
  }

  getMostFrequentWord(speechId: number) {
    return this.http.get<any>(`${this.apiUrl}/mostFrequentWord/${speechId}/`)
  }
}
