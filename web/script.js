let chordsData = {};
let currentNode = null;
let history = [];

fetch("/recursive_chords.json")
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
        }
        updateView();
      });
      nextButtons.appendChild(btn);
    }
  }
  