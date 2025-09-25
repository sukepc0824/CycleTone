let chordsData = {};
let currentNode = null;
let history = [];
const chordMap = {
    C: ["C4", "E4", "G4"],
    D: ["D4", "F#4", "A4"],
    E: ["E4", "G#4", "B4"],
    F: ["F4", "A4", "C5"],
    G: ["G3", "B3", "D4"],
    A: ["A3", "C#4", "E4"],
    B: ["B3", "D#4", "F#4"],
    Cm: ["C4", "Eb4", "G4"],
    Dm: ["D4", "F4", "A4"],
    Em: ["E4", "G4", "B4"],
    Fm: ["F4", "Ab4", "C5"],
    Gm: ["G3", "Bb3", "D4"],
    Am: ["A3", "C4", "E4"],
    Bm: ["B3", "D4", "F#4"],
    C7: ["C4", "E4", "G4", "Bb4"],
    D7: ["D4", "F#4", "A4", "C5"],
    E7: ["E4", "G#4", "B4", "D5"],
    F7: ["F4", "A4", "C5", "Eb5"],
    G7: ["G3", "B3", "D4", "F4"],
    A7: ["A3", "C#4", "E4", "G4"],
    B7: ["B3", "D#4", "F#4", "A4"],
    Cm7: ["C4", "Eb4", "G4", "Bb4"],
    Dm7: ["D4", "F4", "A4", "C5"],
    Em7: ["E4", "G4", "B4", "D5"],
    Fm7: ["F4", "Ab4", "C5", "Eb5"],
    Gm7: ["G3", "Bb3", "D4", "F4"],
    Am7: ["A3", "C4", "E4", "G4"],
    Bm7: ["B3", "D4", "F#4", "A4"],
    CM7: ["C4", "E4", "G4", "B4"],
    DM7: ["D4", "F#4", "A4", "C#5"],
    EM7: ["E4", "G#4", "B4", "D#5"],
    FM7: ["F4", "A4", "C5", "E5"],
    GM7: ["G3", "B3", "D4", "F#4"],
    AM7: ["A3", "C#4", "E4", "G#4"],
    BM7: ["B3", "D#4", "F#4", "A#4"],
    Cdim: ["C4", "Eb4", "Gb4"],
    Ddim: ["D4", "F4", "Ab4"],
    Edim: ["E4", "G4", "Bb4"],
    Fdim: ["F4", "Ab4", "B4"],
    Gdim: ["G3", "Bb3", "Db4"],
    Adim: ["A3", "C4", "Eb4"],
    Bdim: ["B3", "D4", "F4"],
    Caug: ["C4", "E4", "G#4"],
    Daug: ["D4", "F#4", "A#4"],
    Eaug: ["E4", "G#4", "C5"],
    Faug: ["F4", "A4", "C#5"],
    Gaug: ["G3", "B3", "D#4"],
    Aaug: ["A3", "C#4", "F4"],
    Baug: ["B3", "D#4", "G4"]
};


function playChord(chordName) {
    const notes = chordMap[chordName];
    if (!notes) return;

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    Tone.start();
    synth.triggerAttackRelease(notes, "0.2n");
}


fetch("./recursive_chords.json")
    .then(res => res.json())
    .then(data => {
        chordsData = data;

        const select = document.getElementById("startChord");
        for (let chord in chordsData) {
            const option = document.createElement("option");
            option.value = chord;
            option.textContent = chord;
            select.appendChild(option);
        }
    });

document.getElementById("startBtn").addEventListener("click", () => {
    const chord = "<s>";
    if (chordsData[chord]) {
        history = [chord];
        currentNode = chordsData[chord];
        updateView();
    }
});

function updateView() {
    const nextButtons = document.getElementById("nextButtons");
    const historyDisplay = document.getElementById("historyDisplay");

    nextButtons.innerHTML = "";
    historyDisplay.textContent = "進行: " + history.join(" → ");

    if (!currentNode || !currentNode.next) {
        const endMsg = document.createElement("div");
        endMsg.textContent = "終止しました。";
        nextButtons.appendChild(endMsg);
        return;
    }

    const sortedEntries = Object.entries(currentNode.next)
        .sort((a, b) => b[1].value - a[1].value);

    for (let [nextChord, data] of sortedEntries) {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = `${nextChord} (${(data.value * 100).toFixed(1)}%)`;
        btn.addEventListener("click", () => {
            if (nextChord === "<END>") {
                history.push("⏹ 終止");
                currentNode = null;
            } else {
                history.push(nextChord);
                currentNode = data;
                playChord(nextChord);
            }
            updateView();
        });
        nextButtons.appendChild(btn);
    }
}
