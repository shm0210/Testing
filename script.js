// Exam date
const examDate = new Date("May 3, 2026 00:00:00");

// Load countdown
function updateCountdown() {
  const now = new Date();
  const diff = examDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("days-left").innerText = `${days} days ${hours} hrs left`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Load daily quote
fetch("data/quotes.json")
  .then(res => res.json())
  .then(data => {
    const quote = data[Math.floor(Math.random() * data.length)];
    document.getElementById("daily-quote").innerText = `"${quote}"`;
  });

// Load subjects
fetch("data/subjects.json")
  .then(res => res.json())
  .then(subjects => {
    const container = document.getElementById("subjects-container");
    subjects.forEach(sub => {
      const card = document.createElement("div");
      card.className = "subject-card";

      card.innerHTML = `
        <img src="${sub.icon}" alt="${sub.name} icon">
        <h3>${sub.name}</h3>
        <div class="chapters">
          ${sub.chapters.map(ch => `
            <div class="chapter">
              <strong>${ch.name}</strong><br>
              <a href="${ch.lecture}" target="_blank">🎥 Lecture</a> |
              <a href="${ch.notes}" target="_blank">📄 Notes</a>
            </div>
          `).join("")}
        </div>
      `;
      container.appendChild(card);
    });
  });
