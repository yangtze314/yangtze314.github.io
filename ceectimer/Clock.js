// === class Clock (provides timer functionality) ===

const ClockState = Object.freeze({
  WAITING: "waiting",
  START: "start bell ringing",
  MAIN: "main period",
  END: "end bell ringing",
  FINISHED: "finished"
});

class Clock {
  
  constructor() {
    this.paused = true;
    this.pauseTime = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.displayTimeOffset = 0;
    
    // Clock hands
    
    this.hourHand = new ClockHand();
    this.minuteHand = new ClockHand();
    this.secondHand = new ClockHand();
    
    let c = color(50);
    this.hourHand.color = c;
    this.minuteHand.color = c;
    this.secondHand.color = c;
    
    this.hourHand.length = 48;
    this.minuteHand.length = 70;
    this.secondHand.length = 70;
    
    this.hourHand.weight = 3;
    this.minuteHand.weight = 3;
    this.secondHand.weight = 1;
    
    this.status = ClockState.WAITING;
    
    // Bell
    
    this.bell = {};
  }
  
  
  // --- Helper functions ---
  
  static collapse(hr, mn, sc) {
    return 3600*hr + 60*mn + sc;
  }
  
  static expand(time) {
    let array = [];
    array[0] = floor(time / 3600);
    array[1] = floor((time % 3600) / 60);
    array[2] = time % 60;
    return array;
  }
  
  static realTime() {
    return Clock.collapse(hour(), minute(), second());
  }
  
  // --- Functions for setting Clock ---
  
  setBell(audio) {
    this.bell = new Bell(audio);
  }
  
  set(startTime, duration) {
    this.displayTimeOffset = startTime - Clock.realTime();
    this.startTime = Clock.realTime();
    this.endTime = Clock.realTime() + duration * 60;
    this.setClockFace(Clock.realTime());
    
    this.bell.stop();
    
    this.status = ClockState.WAITING;
    this.pause();
  }
  
  // Alternative to set()
  setFromSpan(timeSpan) {
    this.set(Clock.collapse(timeSpan.starthr, timeSpan.startmn, timeSpan.startsc), timeSpan.duration);
  }
  
  start() {
    this.status = ClockState.START;
    this.bell.restart();
    this.resume();
  }
  
  pause() {
    if (this.bell.isPlaying()) this.bell.stop();
    this.pauseTime = Clock.realTime();
    this.paused = true;
  }
  
  resume() {
    if (this.status == ClockState.FINISHED) return;  // Ignore if time is up
    let pauseDuration = Clock.realTime() - this.pauseTime;
    this.startTime += pauseDuration;
    this.endTime += pauseDuration;
    this.displayTimeOffset -= pauseDuration;
    
    if (this.status == ClockState.START || this.status == ClockState.END) {
      if (!this.bell.isPlaying())
        this.bell.cue(Clock.realTime() - this.startTime);
    }
    this.paused = false;
  }
  
  // Alternative to pause() and resume();
  toggle() {
    if (this.paused) this.resume();
    else this.pause();
  }
  
  // --- Functions for running Clock ---
  
  setClockFace(time) {
    let expandedTime = Clock.expand(time);
    let hr = expandedTime[0];
    let mn = expandedTime[1];
    let sc = expandedTime[2];
    this.hourHand.angle = (hr%12 + mn/60) * TWO_PI/12;
    this.minuteHand.angle = (mn + sc/60) * TWO_PI/60;
    this.secondHand.angle = sc * TWO_PI/60;
  }
  
  display() {
    push();
    translate(width/2, height/2);
    rotate(-PI/2);
    this.hourHand.display();
    this.minuteHand.display();
    this.secondHand.display();
    pop();
  }
  
  run() {
    if (this.paused) this.setClockFace(this.pauseTime + this.displayTimeOffset);
    else {
      
      this.setClockFace(Clock.realTime() + this.displayTimeOffset);
      
      switch (this.status) {
        case ClockState.START:
          if (Clock.realTime() - this.startTime > this.bell.duration)
            this.status = ClockState.MAIN;
          break;
          
        case ClockState.MAIN:
          if (this.endTime - Clock.realTime() < this.bell.duration) {
            this.status = ClockState.ENDING;
            this.bell.restart();
          }
          break;
          
        case ClockState.ENDING:
          if (Clock.realTime() >= this.endTime) {
            this.status = ClockState.FINISHED;
            this.pause();
          }
          // break;
      }
    }

    this.display();
  }
  
  debug() {
    console.log(Clock.realTime() + " => " + this.endTime + "\tstatus: " + this.status);
  }
}


// === class ClockHand (draws the hands of Clock) ===

class ClockHand {
  
  constructor() {
    this.angle = 0.0;
    this.weight = 2;
    this.length = 50;
    this.color = color("#000000");
  }
  
  display() {
    push();
    stroke(this.color);
    strokeWeight(this.weight);
    rotate(this.angle);
    line(0, 0, this.length, 0);
    pop();
  }
}


// === class Bell (handles the audio of bells) ===

class Bell {
  constructor(audio) {
    this.duration = ceil(audio.duration());
    this.player = audio.soundfile;
  }
  
  restart() {
    this.player.start();
  }
  
  stop() {
    this.player.stop();
  }
  
  cue(position) {
    this.player.start(0, position);
  }
  
  isPlaying() {
    return this.player.state == "started";
  }
}