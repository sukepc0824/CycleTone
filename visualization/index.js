function set_keys() {
    const mejour_key_array = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
    const mejour_key_tones = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
    const mejour_key_midi_tones = [60, 55, 62, 57, 64, 59, 54, 61, 56, 63, 58, 65];
    const minor_key_midi_tones = [57, 64, 59, 54, 61, 56, 63, 58, 65, 60, 55, 62];
    const minor_key_array = ["A", "E", "B", "F♯", "C♯", "G♯", "D♯", "Ab", "Eb", "Bb", "F", "C"];
    for (let i = 0; i < 12; i++) {
        const $key = $(`<button class="key" midi="${mejour_key_midi_tones[i]}" onpointerdown="buttonIn(${i})" onpointerup="buttonOut(${i})" onpointerleave="buttonOut(${i})">
            <p>${mejour_key_array[i]}</p>
            <p class="sub">${minor_key_array[i],i}</p>
        </button>`).appendTo(".keys");
    }

    $("button.key").each(function (index) {
        $(this).css({
            transform: `rotate(${index * 30}deg)`,
        });
    });
}


async function getChords(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error('Failed to fetch recursive_chords.json');
    }
    const chords = await response.json();
    return chords
}