// text animation
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40) * 2;
      const end = start + Math.floor(Math.random() * 40) * 2;
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }}


const phrases = [
'Hi,',
'I\'m Daan Hessen.',
'I\'m studying ICT at Hogeschool Utrecht, focusing on software development.',
'I\'m still working on a portfolio website.',
'Interested in my projects and contributions?',
'Check out my GitHub, Instagram, LinkedIn or download my resume.',
'Feel free to contact me through social media or email.',
'Full website coming soon...'];


const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    let timeoutDuration = 2500; 
    if (counter === phrases.length - 1) {
      timeoutDuration = 8000; 
    }
    setTimeout(() => {
      counter = (counter + 1) % phrases.length;
      setTimeout(next, 1000); // Additional delay before going to the next text
    }, timeoutDuration);
  });
};

next();

document.querySelectorAll('.popup').forEach(popup => {
  popup.fx = new TextScramble(popup);
});

// Function to initiate shift based on a larger estimated width
function initiateShift(item) {
  let popup = item.querySelector('.popup');
  if (popup) {

    let estimatedWidth = Math.min(300, Math.max(120, popup.textContent.length * 10)); 
    let nextSiblings = getNextSiblings(item);

    nextSiblings.forEach(sib => {
      sib.style.transform = `translateX(${estimatedWidth + 15}px)`; 
    });
  }
}


document.querySelectorAll('.social-icon').forEach(item => {
  item.addEventListener('mouseenter', event => {
    initiateShift(item);

    const popup = item.querySelector('.popup');
    if (popup) {
      popup.fx.setText(popup.textContent || '');
    }
  });

  item.addEventListener('mouseleave', event => {
    let nextSiblings = getNextSiblings(item);
    nextSiblings.forEach(sib => {
      sib.style.transform = `translateX(0px)`;
    });
  });
});

// Function to get all next siblings
function getNextSiblings(elem) {
  let siblings = [];
  while (elem = elem.nextSibling) {
    if (elem.nodeType === 1) {
      siblings.push(elem);
    }
  }
  return siblings;
}