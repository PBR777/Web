const map = new Map();
/**@type Map<HTMLElement, [HTMLElement, HTMLElement]> */
const visibleElement = new Map();

const observer = new IntersectionObserver(entries => {
  for(const entry of entries) {
    if(entry.isIntersecting) {
      visibleElement.set(entry.target, map.get(entry.target));
    } else {
      visibleElement.delete(entry.target);
      console.log("Out!");
      
    }
  }
});

function tick() {
  visibleElement.forEach(([mask, cursor], parent) => {
    const cursorRect = cursor.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const scale = parseFloat(parent.style.scale);
    
    mask.style.maskPosition = `calc(50% + ${(cursorRect.x - parentRect.x) / scale}px) calc(50% + ${(cursorRect.y - parentRect.y) / scale}px)`;
  }); 
}

setInterval(tick, 50);

export function bind(easyband, mask) {
  const cursorElement = document.getElementById(easyband).querySelector(".demo-cursor");
  const maskElement = document.getElementById(mask);
  const parent = maskElement.parentElement;

  map.set(parent, [maskElement, cursorElement]);
  observer.observe(parent)
}
