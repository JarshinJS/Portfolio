AOS.init({ once: true, duration: 700, easing: 'ease-out-quart', offset: 60 });

// Typing Effect
const typedText = document.getElementById("typed-text");
const texts = ["Full-Stack Developer", "Django Specialist", "JavaScript Enthusiast", "IoT Innovator"];
let textIndex = 0, charIndex = 0, isDeleting = false;
function typeEffect() {
  const current = texts[textIndex];
  typedText.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) { speed = 900; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; speed = 300; }
  setTimeout(typeEffect, speed);
}
typeEffect();

// Animate Skill Bars
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".skill-counter");
  const progressBars = document.querySelectorAll(".skill-progress");
  counters.forEach((counter, i) => {
    const target = +counter.dataset.target;
    let count = 0;
    function update() {
      if (count < target) { count++; counter.textContent = count; requestAnimationFrame(update); }
      else counter.textContent = target;
    }
    update();
    setTimeout(() => progressBars[i].style.width = progressBars[i].dataset.progress, 300);
  });
});

// Dark Mode (toggle lives inside chatbot header)
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggle.innerHTML = document.body.classList.contains('dark-mode')
    ? '<i class="bi bi-sun"></i>'
    : '<i class="bi bi-moon-stars"></i>';
});

// ===== Chatbot =====
(function () {

  // ---- Knowledge Base ----
  // Each entry: keys[] (words/phrases to match), reply (HTML string)
  const KB = [

    /* ===== GREETINGS ===== */
    {
      keys: ['hello', 'hi', 'hey', 'greet', 'sup', 'howdy', 'good morning', 'good evening', 'good afternoon', 'hola', 'namaste'],
      reply: "Hey there! \uD83D\uDC4B I'm Jarshin's AI assistant. Ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>contact details</strong>, <strong>social media</strong>, or anything on this portfolio!"
    },

    /* ===== NAME ===== */
    {
      keys: ['name', 'full name', 'your name', "what's your name", 'who are you'],
      reply: "The name is <strong>Jarshin J S</strong> \u2014 a Full-Stack Developer & IoT Enthusiast from India! \uD83C\uDDEE\uD83C\uDDF3"
    },

    /* ===== ABOUT ===== */
    {
      keys: ['about', 'introduce', 'yourself', 'tell me about', 'describe', 'who is jarshin', 'jarshin js', 'about jarshin'],
      reply: "<strong>Jarshin J S</strong> is a Full-Stack Developer & IoT Enthusiast who builds scalable, accessible, high-performance web solutions that solve real-world problems. Based in India \uD83C\uDDEE\uD83C\uDDF3"
    },

    /* ===== LOCATION ===== */
    {
      keys: ['location', 'country', 'city', 'where', 'based', 'india', 'from', 'place', 'state', 'hometown'],
      reply: "\uD83D\uDCCD Jarshin is based in <strong>India \uD83C\uDDEE\uD83C\uDDF3</strong> and is available to work remotely with clients and teams worldwide."
    },

    /* ===== ROLE / DEVELOPER ===== */
    {
      keys: ['full stack', 'fullstack', 'full-stack', 'frontend', 'front-end', 'front end', 'backend', 'back-end', 'back end', 'web dev', 'webdev', 'web developer', 'webdeveloper', 'developer', 'programmer', 'coder', 'engineer'],
      reply: "Jarshin is a <strong>Full-Stack Developer</strong> \u2014 skilled in frontend (HTML, CSS, JS, Bootstrap) <em>and</em> backend (Django, Python, REST APIs). He builds complete end-to-end web solutions!"
    },

    /* ===== SKILLS - OVERVIEW ===== */
    {
      keys: ['skill', 'tech', 'technology', 'stack', 'techstack', 'toolkit', 'tool', 'expertise', 'capability', 'proficiency', 'know', 'language', 'what do you know', 'technical'],
      reply: "\uD83D\uDEE0\uFE0F <strong>Technical Skills:</strong><br>\u2022 HTML \u2014 95%<br>\u2022 JavaScript \u2014 85%<br>\u2022 VS Code \u2014 90%<br>\u2022 GitHub \u2014 85%<br>\u2022 Django (Python) \u2014 80%<br>\u2022 Git \u2014 75%<br><br>Also experienced with Bootstrap, AOS animations, REST APIs & IoT integration."
    },

    /* ===== HTML ===== */
    {
      keys: ['html', 'markup', 'semantic'],
      reply: "Jarshin has <strong>95% proficiency in HTML</strong> \u2014 writing semantically correct, accessible, SEO-friendly markup as the foundation of every project."
    },

    /* ===== CSS ===== */
    {
      keys: ['css', 'stylesheet', 'styling', 'flexbox', 'grid', 'responsive'],
      reply: "Strong <strong>CSS</strong> skills \u2014 CSS variables, Grid, Flexbox, animations, and responsive design for beautiful UIs across all screen sizes."
    },

    /* ===== JAVASCRIPT ===== */
    {
      keys: ['javascript', 'vanillajs', 'ecmascript', 'es6', 'dom', 'js'],
      reply: "JavaScript is one of Jarshin's core strengths \u2014 rated <strong>85%</strong>. He uses it for DOM manipulation, async operations, animations, and complex logic like this very chatbot! \uD83D\uDE04"
    },

    /* ===== DJANGO / PYTHON ===== */
    {
      keys: ['django', 'python', 'backend', 'server', 'rest framework', 'api'],
      reply: "Jarshin works with <strong>Django (Python)</strong> for backend development \u2014 rated <strong>80%</strong>. He's built RESTful web apps and deployed them on Render."
    },

    /* ===== GIT ===== */
    {
      keys: ['git', 'version control', 'commit', 'branch', 'merge'],
      reply: "<strong>Git</strong> \u2014 75% proficiency. Jarshin follows best practices: meaningful commits, branching, pull requests, and code reviews."
    },

    /* ===== GITHUB ===== */
    {
      keys: ['github', 'git hub', 'open source', 'repository', 'repo', 'source code'],
      reply: "\uD83D\uDC19 <strong>GitHub:</strong> <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br>Rated 85%. Check out all of Jarshin's open-source projects and contributions here!"
    },

    /* ===== VS CODE ===== */
    {
      keys: ['vscode', 'vs code', 'visual studio code', 'editor', 'ide', 'code editor'],
      reply: "Jarshin's editor of choice is <strong>VS Code</strong> \u2014 90% proficiency. He leverages extensions for productivity, linting, and debugging."
    },

    /* ===== BOOTSTRAP ===== */
    {
      keys: ['bootstrap', 'ui framework', 'css framework', 'grid system'],
      reply: "Jarshin uses <strong>Bootstrap 5</strong> to build responsive, mobile-first layouts \u2014 you can see it in action right here on this very portfolio!"
    },

    /* ===== IOT ===== */
    {
      keys: ['iot', 'internet of things', 'hardware', 'embedded', 'sensor', 'arduino', 'microcontroller'],
      reply: "Jarshin is an <strong>IoT Enthusiast</strong> \uD83D\uDD0C \u2014 passionate about bridging physical devices with software through sensors, microcontrollers, and smart systems."
    },

    /* ===== AOS ===== */
    {
      keys: ['aos', 'animation', 'scroll animation', 'scroll effect'],
      reply: "This portfolio uses the <strong>AOS (Animate On Scroll)</strong> library for smooth, scroll-triggered animations that bring the page to life as you scroll!"
    },

    /* ===== ALL PROJECTS ===== */
    {
      keys: ['project', 'work', 'built', 'made', 'created', 'developed', 'application', 'app', 'show me', 'all project', 'what have you', 'what did you build', 'portfolio project'],
      reply: "\uD83D\uDE80 <strong>Featured Projects:</strong><br><br>\uD83D\uDCC1 <strong>Portfolio Website</strong> \u2014 This site! Bootstrap, JS & AOS.<br><br>\uD83D\uDD10 <strong>Password Strength Checker</strong> \u2014 Real-time JS evaluator. <a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Live \u2192</a><br><br>\uD83C\uDF7D\uFE0F <strong>Platter to Purpose</strong> \u2014 Django food donation app. <a href='https://platter-to-purpose.onrender.com' target='_blank'>Live \u2192</a>"
    },

    /* ===== PASSWORD CHECKER ===== */
    {
      keys: ['password', 'password checker', 'password strength', 'strength checker'],
      reply: "\uD83D\uDD10 <strong>Password Strength Checker</strong><br>A JavaScript tool that evaluates password strength in real-time with live visual feedback.<br><br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>\uD83C\uDF10 Try the live demo \u2192</a>&nbsp;&nbsp;<a href='https://github.com/JarshinJS' target='_blank'>\uD83D\uDC19 GitHub \u2192</a>"
    },

    /* ===== PLATTER TO PURPOSE ===== */
    {
      keys: ['platter', 'platter to purpose', 'food', 'donation', 'orphanage', 'hotel', 'food waste', 'render'],
      reply: "\uD83C\uDF7D\uFE0F <strong>Platter to Purpose</strong><br>A Django-based food donation platform connecting hotels with orphanages to eliminate food waste.<br><br><a href='https://platter-to-purpose.onrender.com' target='_blank'>\uD83C\uDF10 See the live site \u2192</a>&nbsp;&nbsp;<a href='https://github.com/JarshinJS' target='_blank'>\uD83D\uDC19 GitHub \u2192</a>"
    },

    /* ===== THIS PORTFOLIO ===== */
    {
      keys: ['portfolio website', 'this site', 'this portfolio', 'this page', 'your website', 'this website'],
      reply: "\uD83D\uDCC1 <strong>Portfolio Website</strong> \u2014 This very site! Built with Bootstrap 5, Vanilla JavaScript, AOS animations, typing effect, animated skill bars, project cards, certifications, and this AI chatbot! \uD83E\uDD16"
    },

    /* ===== LIVE DEMOS ===== */
    {
      keys: ['live demo', 'live site', 'demo link', 'deployed', 'hosting', 'hosted', 'url', 'website link', 'view project', 'see demo'],
      reply: "\uD83C\uDF10 <strong>Live Demos:</strong><br>\u2022 <a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Password Strength Checker</a><br>\u2022 <a href='https://platter-to-purpose.onrender.com' target='_blank'>Platter to Purpose</a>"
    },

    /* ===== CERTIFICATIONS ===== */
    {
      keys: ['certification', 'certificate', 'credential', 'achievement', 'award', 'certified', 'credentials', 'badge', 'accomplishment'],
      reply: "\uD83C\uDFC6 <strong>Certifications:</strong><br><br>\uD83D\uDCDC <strong>Professional Certification</strong> \u2014 Industry-recognized credential validating technical expertise and skills.<br><br>\u26A1 <strong>Electra Hackathon</strong> \u2014 Certificate of Participation for competing in the Electra hackathon."
    },

    /* ===== HACKATHON ===== */
    {
      keys: ['hackathon', 'electra', 'electra hackathon', 'competition', 'event', 'participate', 'compete'],
      reply: "\u26A1 Jarshin participated in the <strong>Electra Hackathon</strong> and earned a Certificate of Participation. He loves competitive coding and building products under time pressure! \uD83D\uDCA1"
    },

    /* ===== EDUCATION ===== */
    {
      keys: ['education', 'study', 'college', 'degree', 'university', 'school', 'academic', 'qualification', 'student', 'course', 'major', 'stream', 'class', 'cse', 'it', 'computer science', 'information technology'],
      reply: "\uD83C\uDF93 Jarshin is pursuing a degree in <strong>Computer Science / Information Technology</strong> \u2014 with a strong focus on full-stack web development and IoT. He continuously learns through real-world projects and open-source contributions."
    },

    /* ===== PHONE / WHATSAPP ===== */
    {
      keys: ['phone', 'mobile', 'mobile number', 'mobilenumber', 'phone number', 'phonenumber', 'number', 'call', 'whatsapp', 'whatsappnumber', 'wa', 'ring', 'dial', 'telephone', 'cell', 'contact number', 'contactnumber', 'reach by phone', 'call him', 'whatsapp number', 'wa number', 'phone no', 'mob no'],
      reply: "\uD83D\uDCF1 <strong>Phone & WhatsApp:</strong><br><strong>+91 93455 11293</strong><br><br><a href='https://wa.me/919345511293' target='_blank'>\uD83D\uDCAC Open WhatsApp Chat \u2192</a>"
    },

    /* ===== EMAIL ===== */
    {
      keys: ['email', 'mail', 'gmail', 'inbox', 'e-mail', 'send mail', 'send email', 'email address', 'mail id', 'email id', 'email him', 'write to', 'drop a mail'],
      reply: "\uD83D\uDCE7 <strong>Email:</strong> <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br><br>Feel free to drop a message anytime \u2014 Jarshin typically responds within 24 hours!"
    },

    /* ===== LINKEDIN ===== */
    {
      keys: ['linkedin', 'linked in', 'professional network', 'linkedin profile', 'linkedin link'],
      reply: "\uD83D\uDCBC <strong>LinkedIn:</strong><br><a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>linkedin.com/in/jarshinjs</a><br><br>Connect with Jarshin for professional networking, job opportunities & collaborations! \uD83E\uDD1D"
    },

    /* ===== ALL SOCIAL MEDIA ===== */
    {
      keys: ['social', 'social media', 'socialmedia', 'socials', 'handle', 'profile', 'account', 'find him', 'follow', 'all links', 'all contact', 'online presence', 'find online', 'all social', 'all profiles', 'my profiles'],
      reply: "\uD83C\uDF10 <strong>All of Jarshin's Profiles:</strong><br><br>\uD83D\uDCBC LinkedIn: <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>linkedin.com/in/jarshinjs</a><br>\uD83D\uDC19 GitHub: <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br>\uD83D\uDCE7 Email: <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br>\uD83D\uDCF1 WhatsApp: <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a>"
    },

    /* ===== ALL CONTACT ===== */
    {
      keys: ['contact', 'reach', 'get in touch', 'getintouch', 'connect with', 'how to contact', 'howtocotact', 'contact him', 'contact you', 'contact details', 'contactdetails', 'contact info', 'contactinfo', 'reach out', 'talk to', 'speak to', 'message him', 'get hold', 'communicate'],
      reply: "\uD83D\uDCEC <strong>All Ways to Reach Jarshin:</strong><br><br>\uD83D\uDCF1 WhatsApp: <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a><br>\uD83D\uDCE7 Email: <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br>\uD83D\uDCBC LinkedIn: <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>linkedin.com/in/jarshinjs</a><br>\uD83D\uDC19 GitHub: <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br><br>Or fill the <strong>Contact Form</strong> on this page!"
    },

    /* ===== RESUME ===== */
    {
      keys: ['resume', 'cv', 'download', 'curriculum', 'curriculum vitae', 'download resume', 'get resume'],
      reply: "\uD83D\uDCC4 Click the <strong>Resume</strong> button in the hero section at the top of this page to download Jarshin's latest CV for free!"
    },

    /* ===== HIRE / COLLABORATE ===== */
    {
      keys: ['hire', 'freelance', 'available', 'job', 'opportunity', 'internship', 'work with', 'collaborate', 'contract', 'open to work', 'looking for work', 'working together', 'partner', 'team up', 'recruit'],
      reply: "\uD83D\uDCBC Jarshin is <strong>open to opportunities</strong> \u2014 freelance projects, full-time roles & internships!<br><br>\uD83D\uDCF1 <a href='https://wa.me/919345511293' target='_blank'>WhatsApp: +91 93455 11293</a><br>\uD83D\uDCE7 <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br>\uD83D\uDCBC <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>LinkedIn</a>"
    },

    /* ===== WHY HIRE ME ===== */
    {
      keys: ['why hire', 'why should i hire', 'why hire you', 'why hire him', 'why should we hire', 'should i hire', 'reason to hire', 'reason for hiring', 'what makes you special', 'what makes him special', 'unique', 'value', 'why you', 'why him', 'convince me', 'impress me', 'stand out', 'different from others', 'why choose', 'why choose you', 'why choose him', 'what can you offer', 'what does he offer', 'strengths', 'strong points', 'best quality', 'qualification', 'fit for'],
      reply: "\uD83D\uDCA1 <strong>Why Hire Jarshin?</strong><br><br>\u2705 <strong>Full-Stack, End-to-End</strong> \u2014 From pixel-perfect UIs to robust Django backends, Jarshin ships complete products \u2014 no handoffs needed.<br><br>\uD83D\uDE80 <strong>Proven, Shipped Work</strong> \u2014 Real deployed projects like <em>Platter to Purpose</em> (live on Render) and a <em>Password Strength Checker</em> (live on GitHub Pages) \u2014 not just toy demos.<br><br>\uD83D\uDD0C <strong>IoT + Web Breadth</strong> \u2014 Rare combination of hardware & software thinking. Jarshin bridges both worlds to build smarter solutions.<br><br>\u26A1 <strong>Fast Learner, Driven Builder</strong> \u2014 Certified, hackathon-tested, and constantly levelling up through hands-on projects.<br><br>\uD83E\uDD1D <strong>Clean Code & Collaboration</strong> \u2014 Git-disciplined, Bootstrap-fluent, and easy to work with in any team setup.<br><br>\uD83D\uDCEC Ready to bring value from day one. Reach out:<br>\uD83D\uDCF1 <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a> \u00B7 <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a>"
    },

    /* ===== EXPERIENCE ===== */
    {
      keys: ['experience', 'year', 'senior', 'junior', 'intern', 'professional', 'background', 'work history'],
      reply: "\uD83C\uDF31 Jarshin is an emerging <strong>Full-Stack Developer</strong> with real-world hands-on experience in web apps, IoT projects, and open-source tools. He's constantly growing and building!"
    },

    /* ===== HOBBY / INTEREST ===== */
    {
      keys: ['hobby', 'interest', 'passion', 'like', 'love', 'enjoy', 'free time', 'outside work', 'personal interest'],
      reply: "\uD83D\uDCA1 Beyond code, Jarshin is passionate about <strong>IoT tinkering</strong>, open-source contribution, and turning ideas into live products that solve real-world problems!"
    },

    /* ===== DARK MODE ===== */
    {
      keys: ['dark mode', 'light mode', 'theme', 'night mode', 'dark theme', 'light theme', 'switch theme'],
      reply: "\uD83C\uDF19 Toggle <strong>dark/light mode</strong> using the moon or sun icon in this chat header!"
    },

    /* ===== THANKS ===== */
    {
      keys: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'amazing', 'wonderful', 'good', 'nice', 'cool', 'perfect', 'excellent', 'helpful', 'superb'],
      reply: "You're very welcome! \uD83D\uDE0A Feel free to ask anything else about Jarshin."
    },

    /* ===== BYE ===== */
    {
      keys: ['bye', 'goodbye', 'see you', 'later', 'ciao', 'take care', 'farewell', 'good night'],
      reply: "Thanks for stopping by! Hope to connect soon. Have a great day! \uD83D\uDC4B"
    }
  ];

  const SUGGESTIONS = ['\uD83D\uDCF1 Phone/WhatsApp', '\uD83D\uDCE7 Email', '\uD83D\uDEE0\uFE0F Skills', '\uD83D\uDE80 Projects', '\uD83D\uDD17 Social Media', '\uD83D\uDCBC Hire me'];

  // ---- Helpers ----
  const win = document.getElementById('chatbot-window');
  const toggle2 = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const msgs = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const sugg = document.getElementById('chatbot-suggestions');

  function appendMsg(text, who) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'typing-indicator';
    el.id = 'typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  // Score-based matching with whole-word regex to prevent substring false positives
  // e.g. 'linkedin' must NOT match the key 'link'
  function wordMatch(text, keyword) {
    // Single-word keywords use \b boundary; multi-word phrases use plain includes
    if (/\s/.test(keyword)) return text.includes(keyword);
    try {
      return new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(text);
    } catch (e) { return text.includes(keyword); }
  }

  // Normalise merged words users commonly type without spaces
  const EXPANSIONS = [
    ['socialmedia', 'social media'], ['socials', 'social media'],
    ['fullstack', 'full stack'], ['webdev', 'web developer'],
    ['mobilenumber', 'mobile number'], ['phonenumber', 'phone number'],
    ['whatsappnumber', 'whatsapp number'], ['contactdetails', 'contact details'],
    ['contactinfo', 'contact info'], ['getintouch', 'get in touch'],
    ['techstack', 'tech stack'], ['opensource', 'open source'],
    ['reachout', 'reach out'], ['linkedinprofile', 'linkedin profile']
  ];

  function normalise(input) {
    let out = input;
    EXPANSIONS.forEach(([from, to]) => { out = out.split(from).join(to); });
    return out;
  }

  function getBotReply(text) {
    const lower = normalise(text.toLowerCase().trim());
    let bestEntry = null;
    let bestScore = 0;

    for (const entry of KB) {
      let score = 0;
      for (const k of entry.keys) {
        if (wordMatch(lower, k)) score += k.split(' ').length; // longer phrases score higher
      }
      if (score > bestScore) { bestScore = score; bestEntry = entry; }
    }

    if (bestEntry && bestScore > 0) return bestEntry.reply;

    return "Hmm, I'm not sure about that \uD83E\uDD14 Try asking about Jarshin's <strong>skills</strong>, <strong>projects</strong>, <strong>contact</strong>, <strong>phone number</strong>, or <strong>social media</strong>!";
  }

  function handleSend(text) {
    text = text.trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';
    sugg.innerHTML = '';

    const typing = showTyping();
    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      typing.remove();
      appendMsg(getBotReply(text), 'bot');
    }, delay);
  }

  function buildSuggestions() {
    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = s;
      btn.addEventListener('click', () => handleSend(s));
      sugg.appendChild(btn);
    });
  }

  // ---- Events ----
  toggle2.addEventListener('click', () => {
    const isOpen = win.classList.toggle('open');
    toggle2.innerHTML = isOpen
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-robot"></i>';
    if (isOpen && msgs.children.length === 0) {
      setTimeout(() => {
        appendMsg("\uD83D\uDC4B Hi! I'm <strong>Jarshin's AI assistant</strong>. Ask me anything about his skills, projects, contact details, or social media!", 'bot');
        setTimeout(buildSuggestions, 400);
      }, 200);
    }
    if (isOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    win.classList.remove('open');
    toggle2.innerHTML = '<i class="bi bi-robot"></i>';
  });

  send.addEventListener('click', () => handleSend(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend(input.value);
  });

})();

// Close Navbar on Click (Mobile)
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.getElementById('navbarNav');
const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbarCollapse.classList.contains('show')) {
      bsCollapse.hide();
    }
  });
});
