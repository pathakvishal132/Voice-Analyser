import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../speech.service';
interface UniquePhrase {
  phrase: string;
}

interface MostFrequentWord {
  word: string;
}
@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.css']
})
export class SpeechComponent implements OnInit {

  speech_text = '';
  language = '';
  speeches: any[] = [];
  uniquePhrases: UniquePhrase[] = [];
  mostFrequentWord: string = '';
  isLoading: boolean = false;
  showUniquePhrasesPopup: boolean = false;
  showMostFrequentWordPopup: boolean = false; //
  text: string = "";
  // uttr: SpeechSynthesisUtterance;


  constructor(public speechService: SpeechService) {
    // this.uttr = new SpeechSynthesisUtterance;
  }
  ngOnInit() {
    // Initialize with a default value or fetch from somewhere

  }


  toggleSpeechRecognition() {

  }
  stopRecording() {

  }



  createSpeech() {
    const data = { speech_text: this.speech_text, language: this.language };
    this.speechService.createSpeech(data).subscribe(
      response => {
        console.log('Speech created:', response);
        this.speech_text = ''; // Clear input after creation
        this.language = '';
        this.getSpeeches(); // Refresh speeches list after creating
      },
      error => {
        console.error('Error creating speech:', error);
        // Handle error, e.g., show error message
      }
    );
  }

  getSpeeches() {
    this.speechService.getSpeeches().subscribe(
      speeches => {
        this.speeches = speeches;
        console.log('Fetched speeches:', speeches);
      },
      error => {
        console.error('Error fetching speeches:', error);
        // Handle error, e.g., show error message
      }
    );
  }

  deleteSpeech(speechId: number) {
    this.speechService.deleteSpeech(speechId).subscribe(
      response => {
        console.log('Speech deleted:', response);
        this.getSpeeches(); // Refresh speeches list after deleting
      },
      error => {
        console.error('Error deleting speech:', error);
        // Handle error, e.g., show error message
      }
    );
  }
  getUniquePhrases(speechId: number) {
    this.isLoading = true;
    this.showUniquePhrasesPopup = true; // Show popup on request

    this.speechService.getUniquePhrases(speechId)
      .subscribe(
        response => {
          this.uniquePhrases = response;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching unique phrases:', error);
          this.isLoading = false;
          this.showUniquePhrasesPopup = false; // Hide popup on error
        }
      );
  }

  getMostFrequentWord(speechId: number) {
    this.isLoading = true;
    this.showMostFrequentWordPopup = true; // Show popup on request

    this.speechService.getMostFrequentWord(speechId)
      .subscribe(
        response => {
          this.mostFrequentWord = response.word;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching most frequent word:', error);
          this.isLoading = false;
          this.showMostFrequentWordPopup = false; // Hide popup on error
        }
      );
  }

  closeUniquePhrasesPopup() {
    this.showUniquePhrasesPopup = false;
  }

  closeMostFrequentWordPopup() {
    this.showMostFrequentWordPopup = false;
  }



}
