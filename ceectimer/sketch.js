const BASEURL = "/ceectimer/";
// const BASEURL = "";

let gsat;
let ast;
let subjectNames = [];
let timeSpans = [];
let currentTimeSpan;

let html;

let bellSound;
let clockFace;
let clock;

let ssButton;
let prButton;
let subjectSelect;
let currentSubject;


async function setup() {
  
  await requestWakeLock();
  
  createCanvas(220, 220);
  background(255);
  frameRate(10);
  
  clock = new Clock();
  clock.setBell(await loadSound(BASEURL + "assets/bell.mp3"));
  
  clockFace = await loadImage(BASEURL + "assets/clockface.jpg")
  imageMode(CENTER);
  clockFace.resize(0, height);
  
  await loadTables();  // see tables.js
  subjectSelect = createSelect();
  subjectSelect.html(html);
  subjectSelect.changed(setSubject);
  
  ssButton = createButton("");
  prButton = createButton("");
  reset();
}


function draw() {
  background(255);
  image(clockFace, width/2, height/2);
  clock.run();
  
  if (clock.paused) {
    if (clock.status == ClockState.FINISHED) fill(255, 0, 0, 75);
    else fill(255, 75);
    noStroke();
    rect(0, 0, width, height);
  }
  
  if (clock.status == ClockState.FINISHED) {
    ssButton.html("⏹ Reset");
    prButton.hide();
  }
}


function reset() {
  subjectSelect.enable();
  subjectSelect.selected(currentSubject);
  setSubject();  // also resets clock
  
  ssButton.html("▶ Start");
  
  prButton.hide();
}


function start() {
  subjectSelect.disable();
  clock.start();
  
  ssButton.html("⏹ Stop");
  ssButton.mousePressed(reset);
  
  prButton.html("⏸︎ Pause");
  prButton.mousePressed(toggle);
  prButton.show();
}


function toggle() {
  if (clock.paused) {
    clock.resume();
    prButton.html("⏸︎ Pause");
  }
  else {
    clock.pause();
    prButton.html("▶ Resume");
  }
}


function setSubject() {
  
  currentSubject = subjectSelect.selected();
  
  if (subjectSelect.value() == "--請選擇考科--") {
    ssButton.attribute("disabled", "");
    ssButton.mousePressed(() => {});
    clock.set(0, 0);
    return;
  }
  else {
    ssButton.removeAttribute("disabled");
    ssButton.mousePressed(start);
  }
  
  for (let i = 0; i < subjectNames.length; i++) {
    if (currentSubject == subjectNames[i]) {
      clock.setFromSpan(timeSpans[i]);
      return;
    }
  }
  
  // If for whatever reason, a subject cannot be found
  clock.set(0, 0);
}