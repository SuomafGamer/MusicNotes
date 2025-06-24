// Track if the mouse is being held down
let mouseIsDown = false;
const octaves = ['1', '2', '3', '4', '5', '6', '7', '8'];
// The note frequencies - 7 Primary: C D E F G A B - 10 Modified
const noteFrequencies = {
    C: 0,
    'C#': 1,
    'Db': 1,
    D: 2,
    'D#': 3,
    'Eb': 3,
    E: 4,
    F: 5,
    'F#': 6,
    'Gb': 6,
    G: 7,
    'G#': 8,
    'Ab': 8,
    A: 9,
    'A#': 10,
    'Bb': 10,
    B: 11,
};
const noteCount = Object.keys(noteFrequencies).length;
const totalNotes = octaves.length * noteCount;
const noteId = {
    C: 1, 'C#': 2, 'Db': 3, D: 4, 'D#': 5, 'Eb': 6, E: 7, F: 8, 'F#': 9, 'Gb': 10,
    G: 11, 'G#': 12, 'Ab': 13, A: 14, 'A#': 15, 'Bb': 16, B: 17
};

// Oscillator
const oscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];
let oscillatorIndex = 0;
// Toggles the current oscillator type
function changeOscillator() {
    oscillatorIndex++;
    if (oscillatorIndex >= oscillatorTypes.length) {
        oscillatorIndex = 0;
    }
    document.querySelector("#oscillatorType").innerText = oscillatorTypes[oscillatorIndex];
}

// Map of all sustained notes
const sustainedNotes = {};
const context = new (window.AudioContext || window.webkitAudioContext)();

// Plays a note
function playNote(note, { sustain = false, duration = 0.35, attack = 0.05, release = 0.3, oscillatorType = null }) {
    // Do not play a specific note if it's already being sustained
    if (sustain && sustainedNotes[note]) {
        return;
    }
    drawNote(note);
    const volumeControl = document.getElementById('volume');
    const volume = parseFloat(volumeControl?.value || 0.1);

    const regex = /^([A-Ga-g#b]{1,2})(\d)$/;
    const match = note.match(regex);

    // full / pitch / octave
    const [, pitch, octave] = match;
    const semitone = noteFrequencies[pitch];
    const midi = (parseInt(octave) + 1) * 12 + semitone;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = oscillatorType || oscillatorTypes[oscillatorIndex];
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Volume envelope (attack and release)
    const now = context.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    // gainNode.gain.setValueAtTime(volume, now + duration);
    // gainNode.gain.linearRampToValueAtTime(0, now + duration + release);
    // oscillator.stop(now + duration + release);

    if (sustain) {
        colourKey(note, { action: 'on' });
        sustainedNotes[note] = { oscillator, gainNode, release };
    } else {
        colourKey(note, { duration });
        gainNode.gain.setValueAtTime(volume, now + duration);
        gainNode.gain.linearRampToValueAtTime(0, now + duration + release);
        oscillator.stop(now + duration + release);
    }
}
// Stops a sustained note
function stopNote(note) {
    if (sustainedNotes[note]) {
        colourKey(note, { action: 'off' });
        const now = context.currentTime;
        const { oscillator, gainNode, release } = sustainedNotes[note];
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + release);
        oscillator.stop(now + release);

        delete sustainedNotes[note];
    }
}
// Plays a note on mouse-over
function overNote(note) {
    if (mouseIsDown && !sustainedNotes[note]) {
        playNote(note, { sustain: true });
    }
}
function getHex2(dec) {
    const hex = dec.toString(16);
    return hex.length == 2 ? hex : '0' + hex;
}
function colourKey(note, props) {
    const { action, duration } = props || {};
    const regex = /^([A-Ga-g#b]{1,2})(\d)$/;
    const match = note.match(regex);
    const [, pitch, octave] = match;
    const totalId = noteId[pitch] + (octave - 1) * 17;
    const per = (totalId - 1) / totalNotes;
    const inc = Math.floor(154 * per);
    const r = 0; // 0   - 154
    const g = 51; // 51  - 205
    const b = 102; // 102 - 256
    const rd = r + inc;
    const gd = g + inc;
    const bd = b + inc;
    const highlightColour = '#' + getHex2(rd) + getHex2(gd) + getHex2(bd);
    if (action == 'on') {
        // Highlight on
        const noteBtn = document.querySelector(`[data-note="${note}"]`);
        noteBtn.style.transition = 'none';
        noteBtn.style.backgroundColor = highlightColour;
    } else if (action == 'off') {
        // Highlight off
        const noteBtn = document.querySelector(`[data-note="${note}"]`);
        noteBtn.style.transition = '';
        noteBtn.style.backgroundColor = '';
    } else {
        // Highlight on/off
        const noteBtn = document.querySelector(`[data-note="${note}"]`);
        noteBtn.style.transition = 'none';
        noteBtn.style.backgroundColor = highlightColour;
        setTimeout(() => {
            noteBtn.style.transition = '';
            noteBtn.style.backgroundColor = '';
        }, Math.round(duration * 1000));
    }
}

// Random sounds
function playScript() {
    let keyDur = 0.25;
    let time = 0;
    const timeInc = 320;
    const pitch = 4;
    const props = {
        duration: keyDur,
        attack: 0.1,
        release: 0.2,
    };
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`C${pitch}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    // C -> B
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`A${pitch}`, props);
    }, time);
    // A -> G
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`G${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`G${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`G${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`G${pitch}`, props);
    }, time);
    time += timeInc;
    setTimeout(() => {
        playNote(`B${pitch - 1}`, props);
        playNote(`E${pitch}`, props);
        playNote(`G${pitch}`, props);
    }, time);
}

// Map keys to notes
const keyMap = {
    // 3
    'q': 'C3',
    'w': 'D3',
    'e': 'E3',
    'r': 'F3',
    't': 'G3',
    'y': 'A3',
    'u': 'B3',
    // 4
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'h': 'A4',
    'j': 'B4',
    // 5
    'z': 'C5',
    'x': 'D5',
    'c': 'E5',
    'v': 'F5',
    'b': 'G5',
    'n': 'A5',
    'm': 'B5',
};
function keyDown(key) {
    if (keyMap[key]) {
        playNote(keyMap[key], { sustain: true });
    }
}
function keyUp(key) {
    if (keyMap[key]) {
        stopNote(keyMap[key]);
    }
}

// Initialize
function init() {
    // Render the music notes to the DOM
    const musicalKeys = Object.keys(noteFrequencies);
    const notesContainer = document.querySelector("#musicalKeys");
    octaves.forEach(pitch => {
        const newRow = document.createElement("div");
        musicalKeys.forEach(key => {
            const note = key + pitch;
            const newNote = document.createElement("button");
            newNote.className = "music-note";
            newNote.setAttribute('data-note', note);
            newNote.innerText = note;
            newRow.appendChild(newNote);
        });
        notesContainer.appendChild(newRow);
    });

    // Track if mouse is down
    document.addEventListener('mousedown', () => { mouseIsDown = true; });
    document.addEventListener('mouseup', () => { mouseIsDown = false; });
    document.addEventListener('keydown', (event) => keyDown(event.key.toLowerCase()));
    document.addEventListener('keyup', (event) => keyUp(event.key.toLowerCase()));

    // Configure the music note events
    const musicNotes = document.querySelectorAll(".music-note");
    musicNotes.forEach(curNote => {
        const note = curNote.getAttribute('data-note');
        curNote.setAttribute('onmouseover', `overNote('${note}')`);
        curNote.setAttribute('onmousedown', `playNote('${note}', {sustain: true})`);
        curNote.setAttribute('onmouseup', `stopNote('${note}')`);
        curNote.setAttribute('onmouseout', `stopNote('${note}')`);
    });

    // Initialize drawing
    drawInit();
}