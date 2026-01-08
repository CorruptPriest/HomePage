const links = {
    'reddit': 'https://reddit.com',
    'github': 'https://github.com',
    'youtube': 'https://youtube.com',
    'gmail': 'https://mail.google.com',
    'chatgpt': 'https://chat.openai.com'
};

const view = document.getElementById('editor');

function row(content, num) {
    const div = document.createElement('div');
    div.className = 'line physics-target';
    div.innerHTML = `<div class="line-number">${num}</div><div class="code-content">${content}</div>`;
    return div;
}

function tick() {
    const now = new Date();
    const dStr = now.toDateString();
    const tStr = now.toLocaleTimeString();

    let timeLine = document.getElementById('time-line');
    if (!timeLine) {
        view.innerHTML = '';
        view.appendChild(row(`<span class="comment">/**</span>`, 1));
        view.appendChild(row(`<span class="comment"> * "Freedom is the freedom to say that two plus two make four.</span>`, 2));
        view.appendChild(row(`<span class="comment"> *  If that is granted, all else follows."</span>`, 3));
        view.appendChild(row(`<span class="comment"> * <span id="date-display">${dStr}</span></span>`, 4));
        view.appendChild(row(`<span class="comment"> * <span id="time-display">${tStr}</span></span>`, 5));
        view.appendChild(row(`<span class="comment"> */</span>`, 6));
        view.appendChild(row(``, 7));

        view.appendChild(row(`<span class="keyword">import</span> { <span class="variable">Universe</span> } <span class="keyword">from</span> <span class="string">'./reality'</span>;`, 8));
        view.appendChild(row(``, 9));

        view.appendChild(row(`<span class="keyword">const</span> <span class="function">loadLinks</span> = () => {`, 10));

        Object.entries(links).forEach(([name, url], i) => {
            const str = `    <span class="keyword">const</span> <span class="variable">${name}</span> = <span class="string">"<a href="${url}" target="_blank">${url}</a>"</span>;`;
            view.appendChild(row(str, 11 + i));
        });

        const count = Object.keys(links).length;
        view.appendChild(row(`};`, 11 + count));
        view.appendChild(row(``, 12 + count));
        view.appendChild(row(`<span class="comment">// Type "gravity" in the terminal below...</span>`, 13 + count));

        const marker = document.createElement('div');
        marker.id = 'time-line';
        marker.style.display = 'none';
        view.appendChild(marker);
    } else {
        const dDisp = document.getElementById('date-display');
        const tDisp = document.getElementById('time-display');
        if (dDisp) dDisp.textContent = dStr;
        if (tDisp) tDisp.textContent = tStr;
    }
}

tick();
setInterval(tick, 1000);

const opts = {
    theme: 'dark',
    accent: 'red',
    dots: true,
    glaze: false,
    tint: false
};

function toggleOpts() {
    document.getElementById('settings-panel').classList.toggle('open');
}

function updateOpts() {
    opts.theme = document.getElementById('toggle-theme').checked ? 'light' : 'dark';
    opts.accent = document.getElementById('toggle-accent').checked ? 'yellow' : 'red';
    opts.dots = document.getElementById('toggle-dots').checked;
    opts.glaze = document.getElementById('toggle-glaze').checked;
    opts.tint = document.getElementById('toggle-tint').checked;

    applyOpts();
    saveOpts();
}

function applyOpts() {
    const b = document.body;
    if (opts.theme === 'light') b.classList.add('theme-light'); else b.classList.remove('theme-light');
    if (opts.accent === 'yellow') b.classList.add('accent-yellow'); else b.classList.remove('accent-yellow');
    if (!opts.dots) b.classList.add('no-dots'); else b.classList.remove('no-dots');
    if (opts.glaze) b.classList.add('glaze-gold'); else b.classList.remove('glaze-gold');
    if (opts.tint) b.classList.add('tint-high'); else b.classList.remove('tint-high');

    document.getElementById('toggle-theme').checked = opts.theme === 'light';
    document.getElementById('toggle-accent').checked = opts.accent === 'yellow';
    document.getElementById('toggle-dots').checked = opts.dots;
    document.getElementById('toggle-glaze').checked = opts.glaze;
    document.getElementById('toggle-tint').checked = opts.tint;
}

function saveOpts() {
    localStorage.setItem('antigravity_settings', JSON.stringify(opts));
}

function loadOpts() {
    const s = localStorage.getItem('antigravity_settings');
    if (s) {
        Object.assign(opts, JSON.parse(s));
        applyOpts();
    }
}

loadOpts();

class Notes {
    constructor() {
        this.list = JSON.parse(localStorage.getItem('antigravity_notes') || '[]');
        this.ui = document.getElementById('notes-gallery');
        this.draw();
    }

    add(text = '') {
        const id = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.list.push({ id, content: text, timestamp: Date.now() });
        this.save();
        this.draw();
        return id;
    }

    edit(id, text) {
        const n = this.list.find(x => x.id === id);
        if (n) {
            n.content = text;
            n.timestamp = Date.now();
            this.save();
            this.draw();

            if (!document.getElementById('note-modal-overlay').classList.contains('hidden')) {
                const mId = document.querySelector('.note-modal-id').textContent.replace('#', '');
                if (mId === id) {
                    document.querySelector('.note-modal-body').textContent = text;
                    const d = new Date(n.timestamp);
                    const dStr = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                    const tStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    document.querySelector('.note-modal-time').textContent = `${dStr} • ${tStr}`;
                }
            }
            return true;
        }
        return false;
    }

    del(id) {
        const i = this.list.findIndex(x => x.id === id);
        if (i !== -1) {
            this.list.splice(i, 1);
            this.save();
            this.draw();
            return true;
        }
        return false;
    }

    get(id) {
        return this.list.find(x => x.id === id);
    }

    save() {
        localStorage.setItem('antigravity_notes', JSON.stringify(this.list));
    }

    draw() {
        this.ui.innerHTML = '';
        this.list.forEach(n => {
            const el = document.createElement('div');
            el.className = 'note-card';
            el.onclick = () => openModal(n);

            const d = new Date(n.timestamp);
            const t = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            el.innerHTML = `
                <div class="note-header">
                    <div class="note-id">#${n.id}</div>
                    <div class="note-time">${t}</div>
                </div>
                <div class="note-content">${this.esc(n.content)}</div>
            `;
            this.ui.appendChild(el);
        });
    }

    esc(t) {
        const d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }
}

const notes = new Notes();

const modal = document.getElementById('note-modal-overlay');

function openModal(n) {
    modal.classList.remove('hidden');
    document.querySelector('.note-modal-id').textContent = `#${n.id}`;
    document.querySelector('.note-modal-body').textContent = n.content;

    const d = new Date(n.timestamp);
    const dStr = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const tStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.note-modal-time').textContent = `${dStr} • ${tStr}`;
}

function closeModal() {
    modal.classList.add('hidden');
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

const input = document.getElementById('command-input');
const output = document.getElementById('terminal-output');
let state = 'IDLE';
let query = '';

function say(text, type = 'normal') {
    const div = document.createElement('div');
    div.className = `term-line ${type}`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;

    const hist = JSON.parse(sessionStorage.getItem('terminal_history') || '[]');
    hist.push({ text, type });
    sessionStorage.setItem('terminal_history', JSON.stringify(hist));
}

function boot() {
    say('Welcome to Antigravity v1.0', 'info');
    say('Type "help" for commands.', 'normal');

    const hist = JSON.parse(sessionStorage.getItem('terminal_history') || '[]');
    hist.forEach(x => {
        const div = document.createElement('div');
        div.className = `term-line ${x.type}`;
        div.textContent = x.text;
        output.appendChild(div);
    });
    setTimeout(() => output.scrollTop = output.scrollHeight, 10);
}

boot();

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
            if (state === 'SEARCH') {
                e.preventDefault();
                return;
            }
            say(`➜ ${val}`, 'normal');
            input.value = '';
            e.stopPropagation();
            cmd(val);
        }
    }
});

document.addEventListener('click', (e) => {
    const ok = e.target.closest('a, button, input, textarea, .note-card, .icon');
    if (!ok && window.getSelection().toString().length === 0) input.focus();
});

window.addEventListener('load', () => input.focus());
window.addEventListener('focus', () => input.focus());

function cmd(raw) {
    const low = raw.toLowerCase();
    const parts = raw.split(' ');
    const c = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (links[low]) {
        say(`Opening ${low}...`, 'success');
        window.open(links[low], '_blank');
        say(`Successfully opened ${low}.`, 'success');
        return;
    }

    if (c === 'gravity') {
        say('Gravity enabled. Watch out!', 'warning');
        startPhys();
        return;
    }

    if (c === 'clear') {
        output.innerHTML = '';
        sessionStorage.removeItem('terminal_history');
        return;
    }

    if (c === 'reset') {
        location.reload();
        return;
    }

    if (c === 'help') {
        say('Available commands:', 'info');
        say('  [bookmark]   - Open bookmark', 'normal');
        say('  note         - Create note', 'normal');
        say('  note -ID     - Edit note', 'normal');
        say('  gravity      - Physics mode', 'normal');
        say('  clear        - Clear', 'normal');
        say('  reset        - Reload', 'normal');
        return;
    }

    if (c === 'note') {
        if (parts[1] && parts[1].startsWith('-')) {
            const id = parts[1].substring(1);
            if (parts[2] === '-delete') {
                if (notes.del(id)) say(`Note #${id} deleted.`, 'success');
                else say(`Error: Note #${id} not found.`, 'error');
                return;
            }
            const content = parts.slice(2).join(' ');
            const n = notes.get(id);
            if (!n) {
                say(`Error: Note #${id} not found.`, 'error');
                return;
            }
            if (content) {
                notes.edit(id, content);
                say(`Note #${id} updated.`, 'success');
            } else {
                say(`Current content of #${id}:`, 'info');
                say(n.content, 'normal');
                say(`To update, type: note -${id} [new content]`, 'info');
                say(`To delete, type: note -${id} -delete`, 'info');
                input.value = `note -${id} ${n.content}`;
            }
        } else {
            if (args) {
                const id = notes.add(args);
                say(`Note #${id} created.`, 'success');
            } else {
                say('Usage: note [content] OR note -ID [content]', 'error');
            }
        }
        return;
    }

    askSearch(raw);
}

function askSearch(q) {
    query = q;
    state = 'SEARCH';
    say(`Search "${q}" via:`, 'info');
    say(`[G]oogle  [D]uckDuckGo  [M]Gemini  [A]I Overview`, 'normal');
    say(`[Y]ouTube [I]Drive      [S]ongs (YT Music)`, 'normal');
    output.scrollTop = output.scrollHeight;
}

document.addEventListener('keydown', (e) => {
    if (state !== 'SEARCH') return;
    const k = e.key.toLowerCase();
    if (k === 'escape') {
        state = 'IDLE';
        say('Search cancelled.', 'error');
        input.value = '';
        return;
    }

    let eng = '';
    if (k === 'g' || k === 'enter') eng = 'g';
    else if (k === 'd') eng = 'd';
    else if (k === 'm') eng = 'gemini';
    else if (k === 'a') eng = 'ai';
    else if (k === 'y') eng = 'youtube';
    else if (k === 'i') eng = 'drive';
    else if (k === 's') eng = 'music';

    if (eng) {
        e.preventDefault();
        go(eng, query);
        state = 'IDLE';
        input.value = '';
    }
});

function go(eng, q) {
    let url = '';
    const enc = encodeURIComponent(q);

    switch (eng) {
        case 'g': url = `https://www.google.com/search?q=${enc}&udm=14`; break;
        case 'd': url = `https://duckduckgo.com/?q=${enc}`; break;
        case 'gemini': url = `https://gemini.google.com/app?text=${enc}`; break;
        case 'ai': url = `https://www.google.com/search?q=${enc}`; break;
        case 'youtube': url = `https://www.youtube.com/results?search_query=${enc}`; break;
        case 'drive': url = `https://drive.google.com/drive/search?q=${enc}`; break;
        case 'music': url = `https://music.youtube.com/search?q=${enc}`; break;
    }

    if (url) {
        say(`Searching "${q}" via ${eng}...`, 'success');
        window.open(url, '_blank');
    }
}

let phys = false;
let engine, runner;

function startPhys() {
    if (phys) return;
    phys = true;
    document.body.classList.add('physics-mode');

    const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;

    engine = Engine.create();
    const world = engine.world;
    const els = document.querySelectorAll('.physics-target');
    const map = new Map();
    const bodies = [];

    els.forEach(el => {
        const r = el.getBoundingClientRect();
        const b = Bodies.rectangle(r.left + r.width / 2, r.top + r.height / 2, r.width, r.height, {
            restitution: 0.8, friction: 0.1, density: 0.001
        });
        bodies.push(b);
        map.set(b, el);
        el.style.width = `${r.width}px`;
        el.style.height = `${r.height}px`;
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.margin = '0';
        document.body.appendChild(el);
    });

    const th = 60;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ground = Bodies.rectangle(w / 2, h + th / 2, w, th, { isStatic: true });
    const left = Bodies.rectangle(0 - th / 2, h / 2, th, h, { isStatic: true });
    const right = Bodies.rectangle(w + th / 2, h / 2, th, h, { isStatic: true });
    const ceil = Bodies.rectangle(w / 2, -th * 2, w, th, { isStatic: true });

    Composite.add(world, [...bodies, ground, left, right, ceil]);

    const m = Mouse.create(document.body);
    const mc = MouseConstraint.create(engine, {
        mouse: m, constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(world, mc);

    runner = Runner.create();
    Runner.run(runner, engine);

    function loop() {
        if (!phys) return;
        map.forEach((el, b) => {
            const x = b.position.x - el.offsetWidth / 2;
            const y = b.position.y - el.offsetHeight / 2;
            el.style.transform = `translate(${x}px, ${y}px) rotate(${b.angle}rad)`;
        });
        requestAnimationFrame(loop);
    }
    loop();
}
