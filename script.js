const REPO_OWNER="mtrenovationgta-netizen";
const REPO_NAME="mt-renovations.com";
const IMAGES_FOLDER="images";

const menuBtn=document.getElementById("menuBtn");
const mainNav=document.getElementById("mainNav");
menuBtn.addEventListener("click",()=>mainNav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>mainNav.classList.remove("open")));

const imageExtensions=[".jpg",".jpeg",".png",".webp",".gif"];

function isImage(name){
  const n=name.toLowerCase();
  return imageExtensions.some(ext=>n.endsWith(ext));
}

function titleFromFileName(name){
  return name.replace(/\.[^/.]+$/,"").replace(/[-_]/g," ").replace(/\b\w/g,c=>c.toUpperCase());
}

function setLogo(files){
  const logo=files.find(f=>f.name.toLowerCase().startsWith("logo")&&isImage(f.name));
  if(!logo) return;
  const siteLogo=document.getElementById("siteLogo");
  const textLogo=document.getElementById("textLogo");
  siteLogo.src=logo.download_url;
  siteLogo.style.display="block";
  textLogo.style.display="none";
}

function setHero(files){
  const hero=files.find(f=>f.name.toLowerCase().startsWith("hero")&&isImage(f.name));
  if(!hero) return;
  const heroImage=document.getElementById("heroImage");
  heroImage.src=hero.download_url;
  heroImage.style.display="block";
}

function renderGallery(files){
  const galleryFiles=files.filter(f=>{
    const n=f.name.toLowerCase();
    return isImage(n)&&!n.startsWith("logo")&&!n.startsWith("hero");
  });

  const grid=document.getElementById("galleryGrid");
  const empty=document.getElementById("galleryEmpty");

  if(!galleryFiles.length){
    empty.style.display="block";
    return;
  }

  empty.style.display="none";
  grid.innerHTML=galleryFiles.map(f=>`
    <article class="gallery-card" data-src="${f.download_url}">
      <img src="${f.download_url}" alt="${titleFromFileName(f.name)}" loading="lazy">
      <div class="gallery-caption">${titleFromFileName(f.name)}</div>
    </article>
  `).join("");

  document.querySelectorAll(".gallery-card").forEach(card=>{
    card.addEventListener("click",()=>{
      document.getElementById("lightboxImage").src=card.dataset.src;
      document.getElementById("lightbox").classList.add("open");
    });
  });
}

document.getElementById("closeLightbox").addEventListener("click",()=>{
  document.getElementById("lightbox").classList.remove("open");
});
document.getElementById("lightbox").addEventListener("click",(e)=>{
  if(e.target.id==="lightbox") document.getElementById("lightbox").classList.remove("open");
});

async function loadImagesFromGitHub(){
  const apiUrl=`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${IMAGES_FOLDER}`;
  try{
    const response=await fetch(apiUrl);
    if(!response.ok) return;
    const files=await response.json();
    const imageFiles=files.filter(f=>f.type==="file"&&isImage(f.name));
    setLogo(imageFiles);
    setHero(imageFiles);
    renderGallery(imageFiles);
  }catch(error){
    console.error("Could not load images:",error);
  }
}
loadImagesFromGitHub();
