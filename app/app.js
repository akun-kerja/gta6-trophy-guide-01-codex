const STORAGE = 'leonida-ledger-progress-v1';
const rows = await (await fetch('data/trophies.json')).json();
const trophyList = document.querySelector('#trophy-list');
const progressCount = document.querySelector('#progress-count');
const progressBar = document.querySelector('#progress-bar');
const spoilerToggle = document.querySelector('#spoilers');
const earned = new Set(JSON.parse(localStorage.getItem(STORAGE) || '[]'));
let activeKind = 'all';
let hideSpoilers = localStorage.getItem('leonida-ledger-spoilers') === 'true';
spoilerToggle.checked = hideSpoilers;

function save() {
  localStorage.setItem(STORAGE, JSON.stringify([...earned]));
}

function render() {
  trophyList.replaceChildren();
  const matching = rows.trophies.filter((t) => {
    if (activeKind === 'all') return true;
    if (activeKind === 'missable' || activeKind === 'online') return t.kind === activeKind;
    return t.kind === activeKind;
  });
  document.querySelector('#empty-state').hidden = matching.length > 0;
  for (const trophy of matching) {
    const done = earned.has(trophy.id);
    const spoiler = hideSpoilers && trophy.kind === 'story' && !done;
    const card = document.createElement('article');
    card.className = `trophy-card${done ? ' earned' : ''}${spoiler ? ' is-spoiler' : ''}`;
    const checkLabel = document.createElement('label');
    checkLabel.className = 'check-wrap';
    checkLabel.setAttribute('aria-label', `Mark ${trophy.name} earned`);
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = done;
    check.addEventListener('change', () => {
      check.checked ? earned.add(trophy.id) : earned.delete(trophy.id);
      save(); render();
    });
    checkLabel.append(check);
    const detail = document.createElement('div'); detail.className = 'trophy-detail';
    const meta = document.createElement('div'); meta.className = 'trophy-meta';
    const kind = document.createElement('span'); kind.className = 'kind'; kind.textContent = trophy.kind;
    const grade = document.createElement('span'); grade.className = `grade ${trophy.grade}`; grade.textContent = trophy.grade;
    meta.append(kind, grade);
    const title = document.createElement('h3'); title.textContent = spoiler ? 'Story milestone hidden' : trophy.name;
    const description = document.createElement('p'); description.className = 'description'; description.textContent = spoiler ? 'Earn this trophy to reveal its name and description.' : trophy.description;
    const guide = document.createElement('p'); guide.className = 'guide-copy'; guide.textContent = trophy.guide;
    detail.append(meta, title, description, guide);
    const number = document.createElement('span'); number.className = 'trophy-number'; number.textContent = String(trophy.id).padStart(2, '0');
    card.append(checkLabel, detail, number); trophyList.append(card);
  }
  const count = earned.size;
  progressCount.textContent = `${count} / ${rows.trophies.length}`;
  progressBar.style.width = `${(count / rows.trophies.length) * 100}%`;
  document.querySelector('#count-all').textContent = String(rows.trophies.length);
}

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active')?.classList.remove('active');
  button.classList.add('active'); activeKind = button.dataset.kind; render();
}));
spoilerToggle.addEventListener('change', () => {
  hideSpoilers = spoilerToggle.checked;
  localStorage.setItem('leonida-ledger-spoilers', String(hideSpoilers)); render();
});
document.querySelector('#export').addEventListener('click', () => {
  const payload = { schema: 'leonida-ledger-progress/v1', earned: [...earned] };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  link.download = 'leonida-ledger-progress.json'; link.click(); URL.revokeObjectURL(link.href);
});
document.querySelector('#import').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    const value = JSON.parse(await file.text());
    const ids = Array.isArray(value) ? value : value.earned;
    if (!Array.isArray(ids) || ids.some((id) => !Number.isInteger(id) || id < 1 || id > rows.trophies.length)) throw new Error('Invalid tracker file');
    earned.clear(); ids.forEach((id) => earned.add(id)); save(); render();
  } catch { alert('That progress file could not be read. Choose a Leonida Ledger export.'); }
  event.target.value = '';
});
render();
