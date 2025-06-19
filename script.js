// Track if the mouse is being held down
let mouseIsDown = false;

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
const noteCount = 17;
const noteId = {
    C: 1, 'C#': 2, 'Db': 3, D: 4, 'D#': 5,
    'Eb': 6, E: 7, F: 8, 'F#': 9, 'Gb': 10,
    G: 11, 'G#': 12, 'Ab': 13, A: 14, 'A#': 15,
    'Bb': 16, B: 17
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
        sustainedNotes[note] = { oscillator, gainNode, release };
    } else {
        gainNode.gain.setValueAtTime(volume, now + duration);
        gainNode.gain.linearRampToValueAtTime(0, now + duration + release);
        oscillator.stop(now + duration + release);
    }
}
// Stops a sustained note
function stopNote(note) {
    if (sustainedNotes[note]) {
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

// Random sounds
function playScript() {
    let keyDur = 0.33;
    let time = 0;
    const timeInc = 365;
    const pitch = 5;
    const props = {
        duration: keyDur,
        attack: 0.1,
        release: 0.15,
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

// Initialize
function init() {
    // Render the music notes to the DOM
    const musicalKeys = Object.keys(noteFrequencies);
    const notesContainer = document.querySelector("#musicalKeys");
    ['1', '2', '3', '4', '5', '6', '7', '8'].forEach(pitch => {
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
    document.addEventListener('mousedown', () => { mouseIsDown = true; })
    document.addEventListener('mouseup', () => { mouseIsDown = false; })

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