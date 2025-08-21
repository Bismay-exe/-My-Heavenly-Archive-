// ---------- Theme Toggle ----------
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// ---------- Filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const mediaItems = document.querySelectorAll('.media-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    mediaItems.forEach(item => {
      item.style.display = (filter==='all' || item.classList.contains(filter)) ? 'block' : 'none';
    });
    animateVisibleItems();
  });
});

// ---------- Sort ----------
const sortSelect = document.getElementById('sort-options');
sortSelect.addEventListener('change', () => {
  const gallery = document.getElementById('gallery');
  const items = Array.from(mediaItems);
  if(sortSelect.value === "name-asc") items.sort((a,b)=>a.alt?.localeCompare(b.alt) || a.querySelector('p')?.textContent.localeCompare(b.querySelector('p')?.textContent));
  if(sortSelect.value === "name-desc") items.sort((a,b)=>b.alt?.localeCompare(a.alt) || b.querySelector('p')?.textContent.localeCompare(a.querySelector('p')?.textContent));
  if(sortSelect.value === "type") items.sort((a,b)=>a.className.localeCompare(b.className));
  gallery.innerHTML = "";
  items.forEach(i=>gallery.appendChild(i));
  animateVisibleItems();
});

// ---------- Lazy Load ----------
const lazyItems = document.querySelectorAll('[data-src]');
lazyItems.forEach(item => { item.src = item.dataset.src; });

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.querySelector('.close');
mediaItems.forEach(item => {
  item.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    if(item.tagName==='IMG'){
      lightboxImg.src = item.src; lightboxImg.style.display='block'; lightboxVideo.style.display='none';
    }
    if(item.tagName==='VIDEO'){
      lightboxVideo.src = item.dataset.src; lightboxVideo.style.display='block'; lightboxImg.style.display='none';
    }
  });
});
closeBtn.addEventListener('click', ()=>{ lightbox.style.display='none'; lightboxVideo.pause(); });
lightbox.addEventListener('click',(e)=>{ if(e.target!==lightboxImg && e.target!==lightboxVideo){ lightbox.style.display='none'; lightboxVideo.pause(); }});

// ---------- Fade-in Animation ----------
function animateVisibleItems(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold:0.1 });
  mediaItems.forEach(item => observer.observe(item));
}
animateVisibleItems();

// ---------- Dynamic GitHub Background Gallery with Fallback ----------
const bgGallery = document.getElementById('bg-gallery');
const githubUser = 'YOUR_USERNAME'; // Replace
const githubRepo = 'YOUR_REPO';     // Replace
const githubFolder = 'backgrounds';
const fallbackBg = 'bg.jpg';

async function loadGithubBackgrounds() {
  try {
    const apiUrl = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${githubFolder}`;
    const res = await fetch(apiUrl);
    if(!res.ok) throw new Error('GitHub API error');
    const files = await res.json();
    let loadedAny = false;
    files.forEach(file => {
      if(file.type === "file" && /\.(jpg|jpeg|png|webp)$/i.test(file.name)){
        const img = document.createElement('img');
        img.src = file.download_url;
        img.className = 'bg-thumb';
        img.alt = file.name;
        img.addEventListener('click', () => {
          document.body.style.background = `url('${img.src}') no-repeat center center fixed`;
          document.body.style.backgroundSize = 'cover';
          localStorage.setItem('bgImage', img.src);
        });
        bgGallery.appendChild(img);
        loadedAny = true;
      }
    });
    if(!loadedAny) setFallbackBackground();
  } catch (err) {
    console.error("Failed to load GitHub backgrounds:", err);
    setFallbackBackground();
  }
}
function setFallbackBackground() {
  document.body.style.background = `url('${fallbackBg}') no-repeat center center fixed`;
  document.body.style.backgroundSize = 'cover';
}
loadGithubBackgrounds();

// ---------- Load last background ----------
window.addEventListener('load', () => {
  const savedBg = localStorage.getItem('bgImage');
  if(savedBg) { document.body.style.background = `url('${savedBg}') no-repeat center center fixed`; document.body.style.backgroundSize = 'cover'; }
});

// ---------- Credits Modal ----------
const creditsBtn = document.getElementById('credits-btn');
const creditsModal = document.getElementById('credits-modal');
const closeModal = document.querySelector('.close-modal');

creditsBtn.addEventListener('click', () => { creditsModal.style.display = 'flex'; });
closeModal.addEventListener('click', () => { creditsModal.style.display = 'none'; });
window.addEventListener('click', (e) => {
  if(e.target === creditsModal){ creditsModal.style.display = 'none'; }
});
