// Hands-Free Speech-to-Text & Auto-Parts Phonetic Normalizer Engine

export class SpeechEngine {
  constructor(onResultCallback, onStateChangeCallback) {
    this.onResult = onResultCallback;
    this.onStateChange = onStateChangeCallback;
    this.recognition = null;
    this.isListening = false;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN'; // Optimized for Indian Auto Spares English

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateChange) this.onStateChange(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const normalized = this.normalizeAutoPartsSpeech(transcript);
        if (this.onResult) this.onResult(normalized, transcript);
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        if (this.onStateChange) this.onStateChange(false, e.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStateChange) this.onStateChange(false);
      };
    } catch (e) {
      console.warn("Speech recognition initialization failed:", e);
    }
  }

  toggle() {
    if (!this.recognition) {
      alert("Voice search is not supported on this browser. Use Chrome, Edge, or Android Chrome for Voice input.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        this.recognition.stop();
      }
    }
  }

  // Phonetic Auto-Parts Dictionary Normalizer
  normalizeAutoPartsSpeech(rawText) {
    if (!rawText) return "";
    let t = rawText.toLowerCase().trim();

    const replacements = [
      { find: /\b(break|breaks|brake pad|brake pads)\b/g, replace: "Brake Pad" },
      { find: /\b(shock up|shockups|shock absorbers|strut|struts)\b/g, replace: "Shock Absorber" },
      { find: /\b(oil filter|mobil filter)\b/g, replace: "Oil Filter" },
      { find: /\b(air filter)\b/g, replace: "Air Filter" },
      { find: /\b(ac filter|cabin filter)\b/g, replace: "Cabin AC Filter" },
      { find: /\b(fuel filter|diesel filter|petrol filter)\b/g, replace: "Fuel Filter" },
      { find: /\b(spark plug|plugs)\b/g, replace: "Spark Plug" },
      { find: /\b(wiper|wipers|wiper blade)\b/g, replace: "Wiper Blade" },
      { find: /\b(clutch plate|clutch)\b/g, replace: "Clutch Plate" },
      { find: /\b(timing belt|fan belt)\b/g, replace: "Timing Belt" },
      { find: /\b(creta|kretta)\b/g, replace: "Creta" },
      { find: /\b(suzuki|maruti|maruti suzuki)\b/g, replace: "Suzuki" },
      { find: /\b(innova|crysta)\b/g, replace: "Innova" },
      { find: /\b(fortuner)\b/g, replace: "Fortuner" },
      { find: /\b(corolla|altis)\b/g, replace: "Corolla" },
      { find: /\b(baleno)\b/g, replace: "Baleno" },
      { find: /\b(swift|dzire)\b/g, replace: "Swift" },
      { find: /\b(venue)\b/g, replace: "Venue" },
      { find: /\b(i20|i 20|i-20)\b/g, replace: "i20" },
      { find: /\b(i10|i 10|grand i10)\b/g, replace: "Grand i10" },
      { find: /\b(seltos)\b/g, replace: "Seltos" },
      { find: /\b(sonet)\b/g, replace: "Sonet" },
      { find: /\b(scorpio|scorpio n)\b/g, replace: "Scorpio" },
      { find: /\b(thar)\b/g, replace: "Thar" },
      { find: /\b(nexon)\b/g, replace: "Nexon" },
      { find: /\b(harrier)\b/g, replace: "Harrier" },
      { find: /\b(hector)\b/g, replace: "Hector" }
    ];

    replacements.forEach(r => {
      t = t.replace(r.find, r.replace);
    });

    return t;
  }
}
