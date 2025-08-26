function set_keys() {
    const mejour_key_array = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
    const mejour_key_tones = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
    const mejour_key_midi_tones = [60, 55, 62, 57, 64, 59, 54, 61, 56, 63, 58, 65];
    const minor_key_midi_tones = [57, 64, 59, 54, 61, 56, 63, 58, 65, 60, 55, 62];
    const minor_key_array = ["A", "E", "B", "F♯", "C♯", "G♯", "D♯", "Ab", "Eb", "Bb", "F", "C"];
    for (let i = 0; i < 12; i++) {
        const $key = $(`<button class="key" midi="${mejour_key_midi_tones[i]}" onpointerdown="buttonIn(${i})" onpointerup="buttonOut(${i})">
            <p>${mejour_key_array[i]}</p>
            <p class="sub">${minor_key_array[i]}</p>
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

const doubleKeyThreshold = 400; // ミリ秒以内をダブル押しと判定
let lastKeyDown = {};

document.addEventListener("keydown", function (event) {
    let key = Number(event.key);
    console.log(event.key);
    if (event.key === 'a') {
        key = 10;
    } else if (event.key === 'b') {
        key = 11;
    }
    const now = Date.now();

    if (isNaN(key)) return;

    const isDouble = lastKeyDown[key] && (now - lastKeyDown[key]) < doubleKeyThreshold;
    lastKeyDown[key] = now;

    if (!event.repeat) {
        if (isDouble) {
            buttonInDouble(key)
        } else {
            buttonIn(key);
        }
    }
});

document.addEventListener("keyup", function (event) {
    let key = Number(event.key);
    if (event.key === 'a') {
        key = 10;
    } else if (event.key === 'b') {
        key = 11;
    }
    if (!isNaN(key)) {
        buttonOut(key);
    }
});

const minimumDistance = 30;
let startX = 0;
let startY = 0;
let endY = 0;

window.addEventListener('pointerdown', (e) => {
    startX = e.pageX;
    startY = e.pageY;
});

window.addEventListener('pointermove', (e) => {
    endY = e.pageY;
});

window.addEventListener('pointerup', (e) => {
    const deltaY = endY - startY;

    if (Math.abs(deltaY) > minimumDistance) {
        if (deltaY < 0) {
            console.log('上スワイプ');
            document.querySelector('.modal').classList.add('active')
            const p = document.querySelector('.modal .progression p');

            p.innerHTML = "";

            chord_progression.forEach((chord, index) => {
                const span = document.createElement('span');
                span.textContent = chord;
                p.appendChild(span);

                if (index < chord_progression.length - 1) {
                    const arrow = document.createElement('span');
                    arrow.textContent = " → ";
                    arrow.classList.add("arrow")
                    p.appendChild(arrow);
                }
            });

        } else {
            console.log('下スワイプ');
            document.querySelector('.modal').classList.remove('active')
        }
    }
});

const longPressThreshold = 500; // ミリ秒以上を長押しと判定
let pressTimer = null;


document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // デフォルトの右クリックメニューを無効化
    console.log('右クリック検知');
    mode.main = "compose";
     circleText(chord_progression)
});