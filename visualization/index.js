function set_keys() {
    const mejour_key_array = ["C", "G", "D", "A", "E", "B", "F#", "Db", "G#", "Eb", "Bb", "F"];
    const mejour_key_tones = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
    const mejour_key_midi_tones = [60, 55, 62, 57, 64, 59, 54, 61, 56, 63, 58, 65];
    const minor_key_midi_tones = [57, 64, 59, 54, 61, 56, 63, 58, 65, 60, 55, 62];
    const minor_key_array = ["D#m", "A#m", "Fm", "Cm", "Gm", "Dm", "Am", "Em", "Bm", "F#m", "C#m", "G#m"];
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

const keyPressThreshold = { double: 200, triple: 400 }; // ms
let keyPressData = {};

document.addEventListener("keydown", function (event) {
    if (event.repeat) return; // 押しっぱなし無視

    let key = Number(event.key);
    if (event.key === "a") key = 10;
    else if (event.key === "b") key = 11;
    if (isNaN(key)) return;

    const now = Date.now();

    if (!keyPressData[key]) {
        keyPressData[key] = { count: 0, lastTime: 0, timer: null };
    }

    const keyData = keyPressData[key];
    const timeSinceLastPress = now - keyData.lastTime;

    // 時間が空きすぎたらリセット
    if (timeSinceLastPress > keyPressThreshold.triple) {
        keyData.count = 0;
        if (keyData.timer) {
            clearTimeout(keyData.timer);
            keyData.timer = null;
        }
    }

    keyData.count++;
    keyData.lastTime = now;

    if (keyData.count === 1) {
        // シングルは即実行
        buttonIn(key);
    } else if (keyData.count === 2) {
        // ダブルはトリプル待ち
        if (keyData.timer) clearTimeout(keyData.timer);
        keyData.timer = setTimeout(() => {
            buttonInDouble(key);
            keyData.count = 0;
            keyData.timer = null;
        }, keyPressThreshold.triple);
    } else if (keyData.count === 3) {
        // トリプル確定 → ダブル予約キャンセル
        if (keyData.timer) {
            clearTimeout(keyData.timer);
            keyData.timer = null;
        }
        buttonInTriple(key);
        keyData.count = 0;
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

        } else {
            console.log('下スワイプ');
            document.querySelector('.modal').classList.remove('active')
        }
    }
});

document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.modal').classList.add('active')
    const p = document.querySelector('.modal .progression p');
    updateChordList(chord_progression)
    p.innerHTML = "";
    chord_progression_temp = chord_progression
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
})

const longPressThreshold = 500; // ミリ秒以上を長押しと判定
let pressTimer = null;


document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // デフォルトの右クリックメニューを無効化
    console.log('右クリック検知');
    mode.main = "compose";
    //circleText(chord_progression)
});


const listElement = document.querySelector(".list");
for (let i = 0; i < 8; i++) {
    const chordDiv = document.createElement("div");
    chordDiv.className = "chord";
    listElement.appendChild(chordDiv);
}

function updateChordList(chord_progression) {
    const listElement = document.querySelector(".list");
    listElement.querySelectorAll(".chord").forEach(chord => {
        chord.textContent = "";
    });

    chord_progression.forEach((chord, index) => {
        const chordDiv = listElement.children[index];
        chordDiv.textContent = chord;
    });
    mode.main = 'compose';
}