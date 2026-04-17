/* ============================================================
   JARSHIN J S — Portfolio Script
   Apple-Style Clean Architecture
   ============================================================ */
'use strict';

/* -- Helpers -- */
const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => (c || document).querySelectorAll(s);
const on = (el, ev, fn, opts) => { if (el) el.addEventListener(ev, fn, opts); };

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initGate();       // Gate must initialize first
  initReveal();
  initTyping();
  initNavbar();
  initContactForm();
  initScrollProgress();
  initChatbot();
  initResetIdentity();
});

/* Preloader */
on(window, 'load', () => {
  const pre = $('#preloader');
  if (!pre) return;
  setTimeout(() => {
    pre.classList.add('hidden');
    setTimeout(() => pre.remove(), 400);
  }, 200);
});

/* ============================================================
   LANDING GATE — Name Unlock System
   Checks localStorage for "visitorName":
   - If found → skip gate, show portfolio + welcome banner
   - If not found → show gate, blur portfolio background
   ============================================================ */
function initGate() {
  const gate      = $('#landing-gate');
  const gateForm  = $('#gateForm');
  const gateInput = $('#gate-name-input');
  const gateError = $('#gate-error');
  const banner    = $('#welcome-banner');
  const welcomeEl = $('#welcome-text');

  if (!gate) return;

  const storedName = localStorage.getItem('visitorName');

  /* -- If visitor already identified, skip the gate -- */
  if (storedName) {
    gate.classList.add('hidden');
    gate.style.display = 'none';
    document.body.classList.remove('gate-active');
    showWelcome(storedName);
    return;
  }

  /* -- First visit: show the gate and blur the background -- */
  document.body.classList.add('gate-active');

  /* Focus the input after a small delay (allows preloader to clear) */
  setTimeout(() => {
    if (gateInput) gateInput.focus();
  }, 800);

  /* -- Form submission handler -- */
  if (gateForm) {
    on(gateForm, 'submit', (e) => {
      e.preventDefault();

      const name = gateInput ? gateInput.value.trim() : '';

      /* Validate: non-empty name */
      if (!name) {
        if (gateInput) {
          gateInput.classList.add('invalid', 'shake');
          setTimeout(() => gateInput.classList.remove('shake'), 400);
        }
        if (gateError) {
          gateError.textContent = 'Please enter your name to continue.';
          gateError.classList.add('visible');
        }
        return;
      }

      /* Clear any previous error */
      if (gateInput) gateInput.classList.remove('invalid');
      if (gateError) {
        gateError.textContent = '';
        gateError.classList.remove('visible');
      }

      /* Store the name in localStorage */
      localStorage.setItem('visitorName', name);

      /* Send visitor name to Gmail via Web3Forms (fire-and-forget) */
      notifyVisitor(name);

      /* Unlock the portfolio with smooth transition */
      unlockPortfolio(name);
    });
  }

  /* Clear error on input */
  if (gateInput) {
    on(gateInput, 'input', () => {
      gateInput.classList.remove('invalid');
      if (gateError) {
        gateError.textContent = '';
        gateError.classList.remove('visible');
      }
    });
  }

  /**
   * Send visitor name to Gmail via Web3Forms API
   * Uses the same access_key as the contact form
   * Fire-and-forget — doesn't block the unlock flow
   */
  function notifyVisitor(name) {
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    const formData = new FormData();
    formData.append('access_key', '69fc3b47-da3d-41cd-8a67-f2d27015f5a5');
    formData.append('subject', '🔓 New Portfolio Visitor');
    formData.append('from_name', 'Portfolio Gate');
    formData.append('Visitor Name', name);
    formData.append('Visited At', timestamp);
    formData.append('Page', window.location.href);

    /* Async fire-and-forget — errors are silently caught */
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    }).catch(() => { /* Silent fail — visitor UX is not affected */ });
  }

  /**
   * Unlock animation sequence:
   * 1. Fade out the gate card
   * 2. Remove blur from portfolio
   * 3. Show welcome banner
   */
  function unlockPortfolio(name) {
    /* Step 1: Hide the gate overlay */
    gate.classList.add('hidden');
    document.body.classList.remove('gate-active');

    /* Step 2: Remove gate from DOM after transition completes */
    setTimeout(() => {
      gate.style.display = 'none';
    }, 700);

    /* Step 3: Show welcome banner after a brief delay */
    setTimeout(() => {
      showWelcome(name);
    }, 400);
  }

  /**
   * Display the welcome banner with the visitor's name
   */
  function showWelcome(name) {
    if (!banner || !welcomeEl) return;

    /* Capitalize first letter of name */
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    welcomeEl.textContent = `👋 Welcome, ${displayName}! Glad you're here.`;

    /* Trigger the reveal animation */
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });

    /* Auto-hide after 5 seconds */
    setTimeout(() => {
      banner.classList.remove('visible');
    }, 5000);
  }
}

/* ============================================================
   RESET IDENTITY — clears localStorage and reloads
   ============================================================ */
function initResetIdentity() {
  const resetBtn = $('#reset-identity-btn');
  if (!resetBtn) return;

  on(resetBtn, 'click', () => {
    /* Confirm with a brief visual feedback before clearing */
    localStorage.removeItem('visitorName');

    /* Smooth scroll to top before reload */
    window.scrollTo({ top: 0, behavior: 'smooth' });

    /* Reload after a brief delay for smooth UX */
    setTimeout(() => {
      location.reload();
    }, 300);
  });
}


/* ============================================================
   REVEAL ON SCROLL - replaces AOS
   ============================================================ */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = (i % 3 * 80) + 'ms';
    observer.observe(el);
  });
}

/* ============================================================
   TYPING EFFECT
   ============================================================ */
function initTyping() {
  const el = $('#typed-text');
  if (!el) return;

  const phrases = ['Django Developer', 'Full-Stack Problem Solver', 'Frontend Builder', 'IoT Innovator'];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const word = phrases[pi];
    el.textContent = del ? word.substring(0, --ci) : word.substring(0, ++ci);

    let speed = del ? 45 : 80;
    if (!del && ci === word.length)  { speed = 2200; del = true; }
    else if (del && ci === 0)       { del = false; pi = (pi + 1) % phrases.length; speed = 400; }

    setTimeout(tick, speed);
  }
  tick();
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  /* Hamburger toggle */
  on(toggle, 'click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  /* Close on link click (mobile) */
  $$('.nav-link, .nav-cta', menu).forEach(link => {
    on(link, 'click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Active link on scroll */
  const sections = $$('section[id]');
  const links    = $$('.nav-link');

  on(window, 'scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id));
      }
    });
  }, { passive: true });
}

/* ============================================================
   CONTACT FORM — with client-side validation
   ============================================================ */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  let feedback = form.querySelector('.form-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    form.appendChild(feedback);
  }

  const nameEl    = $('#contact-name');
  const emailEl   = $('#contact-email');
  const messageEl = $('#contact-message');

  const nameErr    = $('#contact-name-error');
  const emailErr   = $('#contact-email-error');
  const messageErr = $('#contact-message-error');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* -- helpers -- */
  function showFieldError(field, errorEl, msg) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(field, errorEl) {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearAllErrors() {
    clearFieldError(nameEl, nameErr);
    clearFieldError(emailEl, emailErr);
    clearFieldError(messageEl, messageErr);
  }

  function validateForm() {
    let valid = true;
    clearAllErrors();

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (!name) {
      showFieldError(nameEl, nameErr, 'Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showFieldError(nameEl, nameErr, 'Name must be at least 2 characters.');
      valid = false;
    }

    if (!email) {
      showFieldError(emailEl, emailErr, 'Please enter your email address.');
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      showFieldError(emailEl, emailErr, 'Please enter a valid email address.');
      valid = false;
    }

    if (!message) {
      showFieldError(messageEl, messageErr, 'Please enter a message.');
      valid = false;
    } else if (message.length < 10) {
      showFieldError(messageEl, messageErr, 'Message must be at least 10 characters.');
      valid = false;
    }

    return valid;
  }

  /* -- clear errors on input (real-time) -- */
  [nameEl, emailEl, messageEl].forEach(field => {
    if (!field) return;
    const errorEl = field.id === 'contact-name'    ? nameErr
                  : field.id === 'contact-email'   ? emailErr
                  : messageErr;
    on(field, 'input', () => clearFieldError(field, errorEl));
  });

  /* -- submit handler -- */
  on(form, 'submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      /* Focus the first invalid field for accessibility */
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Trim values before sending */
    nameEl.value    = nameEl.value.trim();
    emailEl.value   = emailEl.value.trim();
    messageEl.value = messageEl.value.trim();

    const btn = form.querySelector('button[type="submit"]');
    const og  = btn ? btn.innerHTML : '';

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    try {
      const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const json = await res.json().catch(() => ({ success: res.ok }));

      if (json.success || res.ok) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message sent successfully!';
        form.reset();
        clearAllErrors();
      } else {
        throw new Error('fail');
      }
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Something went wrong. Email <a href="mailto:jarshin07@gmail.com">jarshin07@gmail.com</a>';
    } finally {
      feedback.style.display = 'flex';
      if (btn) { btn.disabled = false; btn.innerHTML = og; }
      setTimeout(() => { feedback.style.display = 'none'; }, 6000);
    }
  });
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  on(window, 'scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ============================================================
   CHATBOT - Advanced NLP with Fuzzy Matching
   ============================================================ */
function initChatbot() {

  /* -- LEVENSHTEIN DISTANCE -- */
  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b[i - 1] === a[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  }

  /* -- COMMON MISSPELLING CORRECTIONS -- */
  const TYPO_MAP = {
    'javscript':'javascript','javascrip':'javascript','javacript':'javascript','javascipt':'javascript',
    'javasript':'javascript','javacsript':'javascript','javascrit':'javascript','javasxript':'javascript',
    'htlm':'html','hmtl':'html','hml':'html','htmll':'html','htm':'html','htmml':'html',
    'ccs':'css','csss':'css','ccss':'css',
    'boostrap':'bootstrap','bootrap':'bootstrap','bootsrap':'bootstrap','booststrap':'bootstrap',
    'bootsrtap':'bootstrap','boorstrap':'bootstrap','botstrap':'bootstrap',
    'pyhton':'python','pythno':'python','pythn':'python','pyton':'python','phyton':'python',
    'pythonn':'python','pyhon':'python','pathon':'python','pythan':'python',
    'djnago':'django','djanogo':'django','djangoo':'django','djago':'django','jango':'django',
    'dajngo':'django','djngo':'django','djanog':'django',
    'gihub':'github','githb':'github','guthub':'github','gitub':'github','githup':'github',
    'gihtub':'github','githhub':'github','gthub':'github','githbu':'github',
    'lnkedin':'linkedin','linkdin':'linkedin','linkdein':'linkedin','linkedn':'linkedin',
    'linekdin':'linkedin','likedin':'linkedin','linkedinn':'linkedin','linkein':'linkedin',
    'linkin':'linkedin','linikedin':'linkedin',
    'whtsapp':'whatsapp','watsapp':'whatsapp','whatapp':'whatsapp','whatsap':'whatsapp',
    'whtasapp':'whatsapp','whattsapp':'whatsapp','whatsaap':'whatsapp','whatspp':'whatsapp',
    'wahtsapp':'whatsapp','whasapp':'whatsapp',
    'donload':'download','downlaod':'download','dowload':'download','downlod':'download',
    'donwload':'download','dwnload':'download','downnload':'download',
    'resmue':'resume','rsume':'resume','reusme':'resume','resurme':'resume','resme':'resume',
    'resumee':'resume','resum':'resume','resuma':'resume',
    'contct':'contact','conact':'contact','contac':'contact','cotact':'contact','cntact':'contact',
    'conatct':'contact','contcat':'contact','contakt':'contact',
    'emal':'email','emial':'email','eamil':'email','emali':'email','emaol':'email','ameil':'email',
    'emaik':'email','gmial':'gmail','gmal':'gmail','gmaill':'gmail',
    'porfolio':'portfolio','portolio':'portfolio','potfolio':'portfolio','portfolo':'portfolio',
    'portflio':'portfolio','porfoilo':'portfolio',
    'certficate':'certificate','certificte':'certificate','certifcate':'certificate',
    'certiciate':'certificate','certicate':'certificate','certificat':'certificate',
    'certifiacte':'certificate',
    'hackthon':'hackathon','hacakthon':'hackathon','hackhaton':'hackathon','hackaton':'hackathon',
    'hckathon':'hackathon','hacathon':'hackathon',
    'educaton':'education','educatin':'education','eduction':'education','eduaction':'education',
    'educaion':'education','educashon':'education',
    'proect':'project','projct':'project','porject':'project','projec':'project','poject':'project',
    'proejct':'project','projecr':'project','projext':'project',
    'skils':'skills','skilss':'skills','skll':'skills','skiils':'skills',
    'sklls':'skills','skillz':'skills','sills':'skills',
    'intrested':'interested','intersted':'interested','intrsted':'interested',
    'expereince':'experience','experince':'experience','expreience':'experience',
    'experiance':'experience','experienc':'experience',
    'achivement':'achievement','achievment':'achievement','acheivement':'achievement',
    'freelnce':'freelance','freelanc':'freelance','frelance':'freelance',
    'oppertunity':'opportunity','oportunity':'opportunity','oppurtunity':'opportunity',
    'internshp':'internship','intership':'internship','inernship':'internship',
    'colloborate':'collaborate','colaborate':'collaborate','collabrate':'collaborate',
    'availble':'available','avaliable':'available','availabe':'available',
    'thnaks':'thanks','thnks':'thanks','thanx':'thanks','thx':'thanks','tnx':'thanks',
    'helo':'hello','hllo':'hello','helllo':'hello','hellow':'hello',
    'gooodbye':'goodbye','gudbye':'goodbye','goodby':'goodbye',
    'fullstak':'full stack',
    'frotend':'frontend','forntend':'frontend','frntend':'frontend',
    'bakend':'backend','bacend':'backend','bckend':'backend',
    'iott':'iot',
    'softwre':'software','sofware':'software','softwar':'software',
    'algoritm':'algorithm','algorthm':'algorithm','alogrithm':'algorithm',
    'databse':'database','datbase':'database','darabase':'database',
    'repsonsive':'responsive','responsve':'responsive','responisve':'responsive',
    'depllyment':'deployment','deployement':'deployment','deploment':'deployment','deplpyment':'deployment',
    'securty':'security','secuirty':'security','secrity':'security','seurity':'security',
    'perfomance':'performance','performace':'performance','preformance':'performance',
    'accesibility':'accessibility','accessbility':'accessibility','accessibilty':'accessibility',
    'authenication':'authentication','authenticaton':'authentication','authentcation':'authentication',
    'freelncr':'freelancer','freelanser':'freelancer',
    'rectjs':'react','reactt':'react','recat':'react','reatc':'react',
    'nodjs':'node','nodee':'node',
    'devloper':'developer','developr':'developer','develper':'developer','devlpr':'developer',
    'portfoilo':'portfolio','portfollio':'portfolio','protofolio':'portfolio',
    'coimbatroe':'coimbatore','coimbtor':'coimbatore','coimbatote':'coimbatore',
    'motivaton':'motivation','motivatin':'motivation',
    'availabilty':'availability','availablity':'availability',
    'servcies':'services','servics':'services','serivces':'services',
    'workflw':'workflow','wrokflow':'workflow',
    'languag':'language','langauge':'language','languge':'language',
    'desgin':'design','desgn':'design','deisgn':'design','desing':'design',
    'mentro':'mentor','mentorr':'mentor',
    'chalenge':'challenge','challange':'challenge','challeneg':'challenge',
    'tutoral':'tutorial','tutoiral':'tutorial','tutoriel':'tutorial',
    'pricng':'pricing','priicng':'pricing','priceing':'pricing'
  };

  /* -- WORD EXPANSION -- */
  const EXPAND = [
    ['socialmedia','social media'],['socials','social media'],
    ['fullstack','full stack'],['webdev','web developer'],['webdeveloper','web developer'],
    ['mobilenumber','mobile number'],['phonenumber','phone number'],
    ['whatsappnumber','whatsapp number'],['contactdetails','contact details'],
    ['contactinfo','contact info'],['getintouch','get in touch'],
    ['techstack','tech stack'],['opensource','open source'],
    ['passwordchecker','password checker'],['passwordgenerator','password generator'],
    ['plattertopurpose','platter to purpose'],['p2p','platter to purpose'],
    ['portfoliofeatures','portfolio features'],['whyfullstack','why full stack'],
    ['whyhire','why hire'],['howtocontact','how to contact'],
    ['reachout','reach out'],['linkedinprofile','linkedin profile'],
    ['emailaddress','email address'],['emailid','email address'],
    ['mailid','email address'],['contactnumber','phone number'],
    ['mobileno','mobile number'],['phoneno','phone number'],
    ['workexperience','work experience'],['softskills','soft skills'],
    ['softskill','soft skills'],['interestarea','interest area'],
    ['personalinfo','personal info'],['aboutme','about me'],
    ['aboutyou','about you'],['telmeabout','tell me about'],
    ['tellmeabout','tell me about'],['whatdoyoudo','what do you do'],
    ['remotewerk','remote work'],['remotework','remote work'],['workfromhome','work from home'],
    ['howmuch','how much'],['howlong','how long'],['howfast','how fast'],
    ['darkmode','dark mode'],['lightmode','light mode'],
    ['devsetup','dev setup'],['codeeditor','code editor'],
    ['futureplans','future plans'],['futuregoals','future goals'],
    ['currentlylearning','currently learning'],['learningnow','learning now'],
    ['bestproject','best project'],['topproject','top project'],
    ['canibuild','can i build'],['buildfor','build for'],
    ['freelancework','freelance work'],['parttime','part time'],
    ['pairprogramming','pair programming'],['codereview','code review'],
    ['tamilnadu','tamil nadu'],['southindia','south india'],
    ['whyshould','why should'],['howcanhelp','how can help'],
    ['goodmorning','good morning'],['goodnight','good night'],
    ['goodevening','good evening'],['goodafternoon','good afternoon'],
    ['progressivewebapp','progressive web app'],['serviceworker','service worker'],
    ['machinelearning','machine learning'],['deeplearning','deep learning'],
    ['artificialintelligence','artificial intelligence'],
    ['builtwith','built with'],['madewith','made with'],['techstackused','tech stack used']
  ];

  /* -- KNOWLEDGE BASE -- */
  const KB = [
    { keys:['hello','hi','hey','greet','sup','howdy','good morning','good evening','good afternoon','hola','namaste','yo','whats up','hii','hiii','helloo'],
      reply:"Hey there! <strong>I am Jarshin's AI assistant</strong>. Ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or how to <strong>get in touch</strong>!",
      topic:'greeting' },

    { keys:['name','full name','your name',"what's your name",'who are you','whats your name','what is your name','ur name'],
      reply:"<strong>Jarshin J S</strong> - Full-Stack Developer & IoT Enthusiast from India",
      topic:'about' },
    { keys:['about','introduce','yourself','tell me about','describe','who is jarshin','about jarshin','about him','tell me about jarshin','about you','who is he','about yourself'],
      reply:"<strong>Jarshin J S</strong> is a Full-Stack Developer & IoT Enthusiast who builds scalable, accessible, high-performance web solutions. He combines frontend finesse (HTML, CSS, JS) with backend strength (Django, Python) and IoT curiosity. Based in India.",
      topic:'about' },
    { keys:['what do you do','what does he do','what does jarshin do','role','job title','profession','occupation','designation'],
      reply:"Jarshin is a <strong>Full-Stack Developer & IoT Innovator</strong>. He builds responsive web applications, practical automation workflows, and user-centered interfaces.",
      topic:'about' },

    { keys:['location','country','city','where','based','india','from','place','state','hometown','address','lives','living','town','region'],
      reply:"Based in <strong>India</strong> (Coimbatore, Tamil Nadu). Available for remote work worldwide.",
      topic:'location' },

    { keys:['full stack','fullstack','full-stack','frontend','front-end','front end','backend','back-end','back end','web dev','web developer','developer','programmer','coder','engineer','software engineer','software developer'],
      reply:"Jarshin is a <strong>Full-Stack Developer</strong> - skilled in frontend (HTML, CSS, JS, Bootstrap) <em>and</em> backend (Django, Python, REST APIs). He builds complete end-to-end web solutions!",
      topic:'skills' },

    { keys:['skill','skills','tech','technology','stack','toolkit','expertise','proficiency','technical','competency','abilities','ability','what can he do','technologies','tech tree','skillset','technical skills','hard skills'],
      reply:"<strong>Technical Skills:</strong><br><br><strong>Frontend:</strong> HTML5, CSS3, JavaScript, Bootstrap 5<br><strong>Backend:</strong> Python, Django, REST APIs<br><strong>Tools:</strong> Git, GitHub, VS Code<br><strong>Other:</strong> IoT Integration, Responsive Design<br><br>Ask about any specific skill for details!",
      topic:'skills' },

    { keys:['html','html5','markup','semantic','semantic html','hypertext'],
      reply:"<strong>HTML5</strong> - Master-level proficiency. Semantic, accessible, SEO-friendly markup. Foundation of every project Jarshin builds.",
      topic:'skills' },
    { keys:['css','css3','stylesheet','styling','flexbox','grid','responsive','responsive design','animation','animations','media query','media queries'],
      reply:"<strong>CSS3</strong> - Advanced skills in Grid, Flexbox, custom properties, animations, transitions, and fully responsive layouts across all screen sizes.",
      topic:'skills' },
    { keys:['javascript','vanillajs','ecmascript','es6','dom','js','vanilla js','scripting','typescript'],
      reply:"<strong>JavaScript</strong> - Advanced proficiency. DOM manipulation, async/await, event handling, API integration, and interactive UI logic. This chatbot itself runs on vanilla JS!",
      topic:'skills' },
    { keys:['django','python','python3','py','flask','backend framework'],
      reply:"<strong>Django + Python</strong> - Strong expertise. Jarshin builds full-stack web apps with Django, creates RESTful APIs, and has deployed production apps on platters like Render.",
      topic:'skills' },
    { keys:['git','version control','commit','branch','merge','pull request','pr','version'],
      reply:"<strong>Git</strong> - Solid proficiency. Meaningful commits, feature branching, pull requests, and collaborative code reviews.",
      topic:'skills' },
    { keys:['github','git hub','open source','repository','repo','source code','code','coding style','show code','view code'],
      reply:"<strong>GitHub:</strong> <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br><br>All projects are open-source. See Jarshin's coding style, commit history, and project repos!",
      topic:'skills' },
    { keys:['vscode','vs code','visual studio code','editor','ide','code editor','visual studio'],
      reply:"<strong>VS Code</strong> - Primary IDE. Leverages extensions for productivity, linting, debugging, and Git integration.",
      topic:'skills' },
    { keys:['bootstrap','bootstrap5','ui framework','css framework','grid system','responsive framework'],
      reply:"<strong>Bootstrap 5</strong> - Proficient in building responsive, mobile-first layouts. This portfolio uses Bootstrap for its grid system!",
      topic:'skills' },
    { keys:['iot','internet of things','hardware','embedded','sensor','arduino','microcontroller','raspberry','smart','automation','circuit'],
      reply:"<strong>IoT Enthusiast</strong> - Passionate about bridging physical devices with software through sensors, microcontrollers, and smart automation. Studying IoT as part of his B.E. degree.",
      topic:'skills' },
    { keys:['rest','rest api','api','apis','restful','web service','endpoint','backend api'],
      reply:"<strong>REST APIs</strong> - Builds and integrates RESTful web services using Django REST Framework. Understands API design, authentication, and data serialization.",
      topic:'skills' },
    { keys:['database','sql','sqlite','postgres','postgresql','mysql','db','data','data structure','data structures','dsa','algorithm'],
      reply:"<strong>Databases & DSA</strong> - Familiar with SQLite, PostgreSQL. Studying Data Structures & Algorithms as part of B.E. coursework at SKCET.",
      topic:'skills' },

    { keys:['soft skill','soft skills','communication','teamwork','team collaboration','leadership','time management','problem solving','quick learner','self motivated','attention to detail'],
      reply:"<strong>Soft Skills:</strong><br>- Problem Solving<br>- Team Collaboration<br>- Attention to Detail<br>- Quick Learner<br>- Written & Verbal Communication<br>- Time Management<br>- Self-Motivated",
      topic:'skills' },

    { keys:['interest','interests','hobby','hobbies','passion','passionate','like','love','enjoy','free time','outside work','personal interest','what do you like'],
      reply:"<strong>Interests:</strong><br>- Web Development & UI/UX<br>- Cybersecurity & IoT<br>- Open Source Contributing<br>- Competitive Hackathons<br>- Modern JavaScript Ecosystems",
      topic:'interests' },

    { keys:['project','projects','work','built','made','created','developed','application','app','featured','all project','show project','show me','what have you built','portfolio project','your work','his work'],
      reply:"<strong>Featured Projects:</strong><br><br>1. <strong>Personal Developer Portfolio</strong><br>Responsive portfolio with semantic HTML5 and direct resume access.<br><br>2. <strong>Password Generator & Strength Checker</strong><br>Client-side JavaScript tool with real-time strength scoring. Zero dependencies.<br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Live Demo</a><br><br>3. <strong>platter to Purpose</strong><br>Full-stack Django app for community resource distribution. Built at SamHita Hackathon.<br><a href='https://platter-to-purpose.onrender.com/' target='_blank'>Live Demo</a>",
      topic:'projects' },

    { keys:['password','password generator','password checker','password strength','strength checker','pass gen','password tool','security tool'],
      reply:"<strong>Password Generator & Strength Checker</strong><br><br><strong>Problem:</strong> Users create weak passwords without feedback.<br><strong>Solution:</strong> Client-side JavaScript tool with real-time strength scoring.<br><strong>Impact:</strong> Makes security accessible, zero dependencies.<br><br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Live Demo</a> | <a href='https://github.com/JarshinJS' target='_blank'>GitHub</a>",
      topic:'projects' },
    { keys:['platter','platter to purpose','p2p','donation','orphanage','food waste','render','community','social impact','hackathon project','samhita'],
      reply:"<strong>platter to Purpose</strong><br><br><strong>Problem:</strong> Communities need better workflows to route surplus resources.<br><strong>Solution:</strong> Full-stack Django platter built at the SamHita Hackathon.<br><strong>Impact:</strong> Live social-impact prototype showcasing end-to-end delivery.<br><br><a href='https://platter-to-purpose.onrender.com/' target='_blank'>Live Demo</a> | <a href='https://github.com/JarshinJS/platter_to_purpose' target='_blank'>GitHub</a>",
      topic:'projects' },
    { keys:['portfolio','this site','this portfolio','this page','your website','this website','portfolio website','personal website','personal site'],
      reply:"<strong>This Portfolio</strong> - Built with semantic HTML5, Apple-inspired CSS design, vanilla JavaScript (including this AI chatbot!), and Bootstrap 5 for layout. Fully responsive and accessible.",
      topic:'projects' },
    { keys:['live demo','demo link','demo','deployed','hosting','hosted','url','website link','view project','see demo','show demo','live link','live site','live'],
      reply:"<strong>Live Demos:</strong><br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Password Generator & Strength Checker</a><br><a href='https://platter-to-purpose.onrender.com/' target='_blank'>platter to Purpose</a>",
      topic:'projects' },

    { keys:['certification','certifications','certificate','certificates','credential','credentials','achievement','achievements','award','awards','certified','badge','accomplishment','qualified'],
      reply:"<strong>Certifications & Hackathons:</strong><br><br>Professional Certification - Industry credential validating technical foundations.<br><br>Electra 2026 Hackathon - Certificate of Participation at CIT.<br><br>MIT Certificate - SamHita Hackathon participation & prototype delivery.",
      topic:'certifications' },
    { keys:['mit','mit certificate','mit cert','massachusetts','samhita'],
      reply:"<strong>MIT Certificate</strong> - Earned through the SamHita Hackathon where Jarshin built and presented a functional web prototype under competitive conditions.",
      topic:'certifications' },
    { keys:['hackathon','electra','electra hackathon','competition','event','participate','compete','coding competition','hack'],
      reply:"<strong>Hackathon Experience:</strong><br>- <strong>Electra 2026</strong> at CIT - built and presented under time pressure<br>- <strong>SamHita Hackathon</strong> - created platter to Purpose<br><br>Jarshin thrives in competitive, fast-paced environments!",
      topic:'certifications' },

    { keys:['education','study','studying','college','degree','university','school','academic','qualification','student','course','major','stream','class','cse','computer science','information technology','bachelor','skcet','sri krishna','coimbatore','coursework','subject','curriculum','learning'],
      reply:"<strong>Education:</strong><br><br><strong>B.E. Computer Science & Engineering (IoT)</strong><br>Sri Krishna College of Engineering and Technology, Coimbatore<br>2025 - Present<br><br><strong>Coursework:</strong> Data Structures, Algorithms, Software Engineering, IoT, DBMS, Web Development.",
      topic:'education' },
    { keys:['gpa','cgpa','marks','grade','score','percentage','result','academic performance'],
      reply:"For the latest academic details, please contact Jarshin directly via <a href='mailto:jarshin07@gmail.com'>email</a> or <a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a>.",
      topic:'education' },

    { keys:['phone','mobile','mobile number','phone number','number','call','whatsapp','wa','ring','dial','telephone','cell','contact number','mob','phno','ph no'],
      reply:"<strong>Phone & WhatsApp:</strong><br><strong>+91 93455 11293</strong><br><br><a href='https://wa.me/919345511293' target='_blank'>Open WhatsApp Chat</a>",
      topic:'contact' },
    { keys:['email','mail','gmail','inbox','e-mail','send mail','send email','email address','mail id','email id','email him','write to','drop a mail','mail address','em','ema'],
      reply:"<strong>Email:</strong> <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br><br>Jarshin typically responds within 24 hours!",
      topic:'contact' },
    { keys:['linkedin','linked in','professional network','linkedin profile','linkedin link','linkd','ln','professional profile'],
      reply:"<strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>linkedin.com/in/jarshinjs</a><br><br>Connect for professional networking & collaborations!",
      topic:'contact' },
    { keys:['social','social media','socials','handle','profile','account','find him','follow','all links','all contact','online presence','find online','all social','all profiles','profiles','links'],
      reply:"<strong>All Profiles:</strong><br><br><a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>LinkedIn</a><br><a href='https://github.com/JarshinJS' target='_blank'>GitHub</a><br><a href='mailto:jarshin07@gmail.com'>Email</a><br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp: +91 93455 11293</a>",
      topic:'contact' },
    { keys:['contact','reach','get in touch','connect with','how to contact','contact him','contact you','contact details','contact info','reach out','talk to','speak to','message him','get hold','communicate','connect'],
      reply:"<strong>All Ways to Reach Jarshin:</strong><br><br>WhatsApp: <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a><br>Email: <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br>LinkedIn: <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>linkedin.com/in/jarshinjs</a><br>GitHub: <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br><br>Or fill the <strong>contact form</strong> on this page!",
      topic:'contact' },

    { keys:['resume','cv','download','curriculum','curriculum vitae','download resume','get resume','download cv','pdf','document','file'],
      reply:"Download Jarshin's resume using the <strong>Resume</strong> button in the navigation bar.<br><br><a href='Jarshin_JS.pdf' download>Direct Download</a>",
      topic:'resume' },

    { keys:['hire','freelance','available','job','opportunity','internship','work with','collaborate','contract','open to work','looking for work','partner','team up','recruit','career','vacancy','position','role','apply','application','employ','employment'],
      reply:"Jarshin is <strong>open to opportunities</strong> - freelance, full-time roles, and internships!<br><br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a> | <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>LinkedIn</a>",
      topic:'hiring' },
    { keys:['why hire','why should i hire','why hire you','why hire him','convince me','impress me','stand out','unique','value','why you','why him','what makes you special','strengths','strong points','best quality','fit for','reason to hire','what can you offer','advantages','benefit'],
      reply:"<strong>Why Hire Jarshin?</strong><br><br><strong>Full-Stack Delivery</strong> - From UI to Django backend, ships complete products.<br><strong>Proven Work</strong> - Deployed apps on Render & GitHub Pages.<br><strong>IoT + Web</strong> - Rare hardware & software breadth.<br><strong>Fast Learner</strong> - Hackathon-tested, constantly learning.<br><strong>Clean Code</strong> - Git-disciplined, collaborative, well-documented.<br><br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a>",
      topic:'hiring' },

    { keys:['experience','year','years','senior','junior','intern','professional','background','work history','how long','how many years','fresher','entry level'],
      reply:"Jarshin is an <strong>emerging Full-Stack Developer</strong> currently pursuing his B.E. degree. He has hands-on experience through deployed projects, hackathons, and open-source contributions.",
      topic:'experience' },

    { keys:['age','how old','old are you','birthday','birth','born','dob','date of birth'],
      reply:"Jarshin is a B.E. Computer Science student (2025-present). For personal details, reach out directly via <a href='mailto:jarshin07@gmail.com'>email</a>.",
      topic:'about' },

    { keys:['chatbot','bot','ai','navi','assistant','who built you','how do you work','are you ai','artificial intelligence','machine learning','who made you','who created you'],
      reply:"I am Jarshin's <strong>AI Assistant</strong>, built entirely with vanilla JavaScript! I use fuzzy matching and Levenshtein distance to understand your questions - even with typos. No external APIs needed!",
      topic:'chatbot' },

    { keys:['how to navigate','how to use','navigate','scroll','sections','menu','navbar','navigation','where is','find section','go to','explore'],
      reply:"<strong>Portfolio Sections:</strong><br>- <strong>Hero</strong> - Introduction & resume download<br>- <strong>Skills</strong> - Technical expertise grid<br>- <strong>Education</strong> - Academic background<br>- <strong>Projects</strong> - Featured work with live demos<br>- <strong>Credentials</strong> - Certifications & hackathons<br>- <strong>Contact</strong> - Form & social links<br><br>Use the <strong>navbar</strong> at the top to jump to any section!",
      topic:'navigation' },

    { keys:['dark mode','light mode','theme','night mode','dark theme','light theme','switch theme','color mode'],
      reply:"This portfolio currently uses a clean <strong>light/white theme</strong> inspired by Apple's design language - optimized for readability and professionalism.",
      topic:'ui' },

    { keys:['tip','guide','how to','advice','suggestion','recommend','what should','start here','first time','new here','help me','guide me','where to start'],
      reply:"<strong>Quick Tips:</strong><br><br>1. Browse <strong>Skills</strong> to see Jarshin's tech stack<br>2. Check <strong>Projects</strong> - click 'Live Demo' for deployed apps<br>3. View <strong>Credentials</strong> for certifications<br>4. Use the <strong>Contact Form</strong> or grab his <strong>Resume</strong><br>5. Ask <strong>me</strong> anything! I handle typos too!",
      topic:'tips' },

    { keys:['thank','thanks','thanku','thank you','thankyou','thx','tnx','appreciate','great','awesome','amazing','wonderful','good','nice','cool','perfect','excellent','helpful','superb','fantastic','brilliant','love it','loved it','well done','impressive','wow','outstanding'],
      reply:"Thank you! I'm glad I could help. Ask me anything else!",
      topic:'thanks' },

    { keys:['bye','goodbye','see you','later','ciao','take care','farewell','good night','gn','good bye','see ya','ttyl','catch you later'],
      reply:"Thanks for visiting! Hope to connect soon. Have a great day!",
      topic:'bye' },

    { keys:['help','ask','question','what can you','what can i ask','capabilities','what can you tell','anything','more info','how can you help','what do you know','commands','features','options','menu','what should i ask'],
      reply:"<strong>I can help with:</strong><br><br><strong>Skills</strong> - HTML, CSS, JS, Django, Git, IoT<br><strong>Projects</strong> - Portfolio, Password Checker, platter to Purpose<br><strong>Credentials</strong> - Certifications & hackathons<br><strong>Education</strong> - Computer Science (IoT) at SKCET<br><strong>Contact</strong> - Email, WhatsApp, LinkedIn, GitHub<br><strong>Hiring</strong> - Freelance, internships, full-time<br><br>I understand <strong>typos</strong> too - just type naturally!",
      topic:'help' },

    { keys:['joke','funny','humor','laugh','tell me a joke','make me laugh','fun fact'],
      reply:"Why do programmers prefer dark mode? Because light attracts bugs!<br><br>Now, ask me something about Jarshin's work!",
      topic:'fun' },
    { keys:['love','i love you','date','marry','relationship','crush','single','girlfriend','boyfriend'],
      reply:"Ha! That's flattering! But I'm just an AI assistant. I <em>can</em> tell you about Jarshin's <strong>projects</strong> and <strong>skills</strong> though!",
      topic:'fun' },
    { keys:['weather','time','news','sports','movie','music','song','game','play'],
      reply:"I specialize in Jarshin's portfolio! For general questions, try Google. But ask me about <strong>skills</strong>, <strong>projects</strong>, or how to <strong>contact Jarshin</strong>!",
      topic:'outofscope' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Development Workflow & Process
       ============================================================ */
    { keys:['workflow','process','development process','how do you work','methodology','approach','sdlc','development cycle','development workflow'],
      reply:"<strong>Development Workflow:</strong><br><br>1. <strong>Understand</strong> — Gather requirements & define scope<br>2. <strong>Design</strong> — Wireframes, UI/UX planning<br>3. <strong>Build</strong> — Clean, modular code with Git version control<br>4. <strong>Test</strong> — Manual & automated testing<br>5. <strong>Deploy</strong> — Ship to production (Render, GitHub Pages)<br>6. <strong>Iterate</strong> — Feedback-driven improvements<br><br>Every project follows this disciplined approach!",
      topic:'workflow' },

    { keys:['agile','scrum','kanban','sprint','standup','waterfall','lean','jira','trello','project management'],
      reply:"Jarshin follows <strong>Agile principles</strong> — iterative development, frequent feedback, and working software over heavy documentation. Experienced with sprint-based workflows from hackathon environments where rapid delivery is essential.",
      topic:'workflow' },

    { keys:['testing','test','unit test','debug','debugging','bug','bugs','quality','qa','quality assurance','error handling','error','exception','try catch','fix bug','troubleshoot','troubleshooting'],
      reply:"<strong>Testing & Debugging:</strong><br><br>- Manual testing across browsers & devices<br>- Console-based debugging & DevTools proficiency<br>- Error handling with try/catch patterns<br>- Django's built-in test framework familiarity<br>- Attention to edge cases & input validation<br><br>Clean code = fewer bugs!",
      topic:'workflow' },

    { keys:['deploy','deployment','ci cd','ci/cd','continuous','pipeline','devops','docker','containerization','cloud','aws','azure','gcp','heroku','netlify','vercel','render deploy','server','production'],
      reply:"<strong>Deployment Experience:</strong><br><br>- <strong>Render</strong> — Django apps with PostgreSQL<br>- <strong>GitHub Pages</strong> — Static sites & JS tools<br>- Familiar with CI/CD concepts & automated deployments<br>- Learning containerization (Docker) & cloud platforms<br><br>Ships production-ready applications!",
      topic:'deployment' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Design & UX
       ============================================================ */
    { keys:['design','ui','ux','ui ux','user interface','user experience','wireframe','mockup','prototype','figma','adobe','photoshop','canva','design tool','design skills'],
      reply:"<strong>Design & UX:</strong><br><br>Jarshin builds with a <strong>design-first mindset</strong>:<br>- Clean, Apple-inspired aesthetic<br>- User-centered layouts with clear information hierarchy<br>- Responsive design for all screen sizes<br>- Accessibility-conscious implementation<br>- Smooth animations & micro-interactions<br><br>This portfolio itself showcases his design sensibility!",
      topic:'design' },

    { keys:['accessibility','a11y','screen reader','aria','wcag','accessible','disability','inclusive','inclusive design','keyboard navigation','alt text'],
      reply:"<strong>Accessibility:</strong><br><br>Jarshin builds with accessibility in mind:<br>- Semantic HTML5 elements<br>- ARIA labels & roles<br>- Keyboard navigation support<br>- Alt text for images<br>- Color contrast compliance<br>- Screen reader-friendly content<br><br>Inclusive design is a priority, not an afterthought!",
      topic:'design' },

    { keys:['seo','search engine','google','ranking','meta','sitemap','crawl','index','page speed','core web vitals','lighthouse','page rank'],
      reply:"<strong>SEO Knowledge:</strong><br><br>- Semantic HTML5 structure<br>- Proper meta tags & descriptions<br>- Fast page load times<br>- Mobile-first responsive design<br>- Clean URL structures<br>- Optimized images & lazy loading<br>- Structured heading hierarchy (H1 → H6)<br><br>This portfolio scores high on Lighthouse!",
      topic:'design' },

    { keys:['performance','speed','fast','slow','loading','load time','optimize','optimization','lazy load','minify','compress','cache','caching','bundle','webpack','vite','build tool'],
      reply:"<strong>Performance Optimization:</strong><br><br>- Lazy loading for images & components<br>- Minimal dependencies (this portfolio has zero npm packages!)<br>- Efficient DOM manipulation<br>- CSS transitions over JS animations<br>- Optimized asset delivery<br>- IntersectionObserver for scroll effects<br><br>Speed is a feature, not an afterthought!",
      topic:'design' },

    { keys:['responsive','mobile friendly','mobile responsive','tablet','phone','screen size','breakpoint','breakpoints','mobile first','viewport','device','devices','cross browser','browser support','compatible','compatibility'],
      reply:"<strong>Responsive Design:</strong><br><br>Every project Jarshin builds is <strong>fully responsive</strong>:<br>- Mobile-first approach<br>- Fluid typography & flexible grids<br>- Tested across devices & browsers<br>- Touch-friendly interactions<br>- Optimized for screens from 320px to 4K<br><br>Try resizing this page — everything adapts beautifully!",
      topic:'design' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Security
       ============================================================ */
    { keys:['security','cybersecurity','cyber security','hacking','ethical hacking','penetration','pentest','vulnerability','secure','encryption','https','ssl','xss','csrf','sql injection','owasp','firewall','malware','virus','phishing','privacy','data protection'],
      reply:"<strong>Security Awareness:</strong><br><br>- CSRF protection in Django apps<br>- Input validation & sanitization<br>- HTTPS enforcement<br>- Secure password practices (built a password strength checker!)<br>- Awareness of OWASP top vulnerabilities<br>- Interest in <strong>Cybersecurity & IoT security</strong><br><br>Security is woven into every project!",
      topic:'security' },

    { keys:['api key','token','secret key','access key','env','environment variable','config','configuration','credentials','authentication','auth','login','signup','register','oauth','jwt','session'],
      reply:"<strong>Authentication & Security:</strong><br><br>- Django's built-in authentication system<br>- Session management & CSRF protection<br>- Environment variables for sensitive data<br>- API key management<br>- Understanding of OAuth & JWT concepts<br><br>Security-first approach in every project!",
      topic:'security' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Learning & Growth
       ============================================================ */
    { keys:['learning','currently learning','what are you learning','studying now','future','goal','goals','plan','plans','roadmap','next','upcoming','aspire','aspiration','dream','ambition','vision','where do you see','five years','5 years','career goal','future plan','future goals'],
      reply:"<strong>Currently Learning & Future Goals:</strong><br><br>- <strong>React.js</strong> — Modern component-based frontend<br>- <strong>Node.js</strong> — JavaScript backend ecosystem<br>- <strong>Docker</strong> — Containerization & DevOps<br>- <strong>Advanced IoT</strong> — Edge computing & smart systems<br>- <strong>Cloud Platforms</strong> — AWS/GCP deployment<br><br><strong>Goal:</strong> Become a versatile full-stack engineer building impactful products at scale.",
      topic:'learning' },

    { keys:['react','reactjs','react js','next','nextjs','next js','vue','vuejs','angular','svelte','component','jsx','virtual dom','hooks','state management','redux','framework comparison'],
      reply:"<strong>Modern Frameworks:</strong><br><br>Jarshin is currently expanding into <strong>React.js</strong> and <strong>Next.js</strong>. His strong vanilla JavaScript foundation makes framework adoption natural.<br><br>Current stack: Django + vanilla JS (production-proven)<br>Learning: React ecosystem for component-based UIs<br><br>Strong fundamentals first, frameworks second!",
      topic:'learning' },


    { keys:['book','books','reading','read','resource','resources','tutorial','tutorials','course','courses','online learning','udemy','coursera','youtube','learn from','study material','documentation','docs','reference'],
      reply:"<strong>Learning Resources:</strong><br><br>- Official documentation (MDN, Django Docs, Python Docs)<br>- YouTube tutorials & coding channels<br>- Hackathons for hands-on learning<br>- Open source project exploration on GitHub<br>- University coursework at SKCET<br>- Practice through building real projects<br><br>Jarshin believes in <strong>learning by building</strong>!",
      topic:'learning' },

    { keys:['motivation','inspire','inspired','inspiration','why coding','why programming','why developer','passion for','what drives','driven','purpose','reason','why tech','why computer science'],
      reply:"<strong>What Drives Jarshin:</strong><br><br>The ability to turn ideas into working products that people actually use. From a hackathon prototype helping communities to a password tool making security accessible — <strong>building things that matter</strong> is the motivation.<br><br>Technology is the most powerful tool for positive change!",
      topic:'learning' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Work Style & Personality
       ============================================================ */
    { keys:['remote','remote work','work from home','wfh','onsite','on site','hybrid','office','work location','work mode','work preference','relocate','relocation'],
      reply:"<strong>Work Preference:</strong><br><br>Jarshin is <strong>flexible</strong> — comfortable with remote, hybrid, or onsite work. Based in <strong>Coimbatore, India</strong> and available for:<br>- Remote work worldwide<br>- On-site in Coimbatore/Tamil Nadu<br>- Open to relocation for the right opportunity<br><br>Timezone: IST (UTC+5:30)",
      topic:'workstyle' },

    { keys:['timezone','time zone','ist','utc','gmt','hours','working hours','availability hours','when available','office hours','schedule','timing','timings','shift'],
      reply:"<strong>Availability:</strong><br><br>- <strong>Timezone:</strong> IST (UTC+5:30)<br>- Flexible with hours for international collaboration<br>- Quick response time on WhatsApp & email<br>- Available for evening/night syncs with US/EU teams<br><br>Typically responds within <strong>24 hours</strong>!",
      topic:'workstyle' },

    { keys:['work ethic','work style','how does he work','discipline','consistent','reliable','dependable','punctual','deadline','deadlines','deliver','delivery','commitment','dedicated','dedication'],
      reply:"<strong>Work Ethic:</strong><br><br>- <strong>Deadline-driven</strong> — Hackathon-tested time management<br>- <strong>Git-disciplined</strong> — Clean commits, feature branching<br>- <strong>Detail-oriented</strong> — Pixel-perfect implementations<br>- <strong>Self-motivated</strong> — Consistently builds & ships side projects<br>- <strong>Collaborative</strong> — Clear communication, open to feedback<br><br>Reliable deliveries, every time!",
      topic:'workstyle' },

    { keys:['team','team size','team work','team project','group','group project','collaboration','collaborative','pair programming','code review','working together','colleagues','coworkers'],
      reply:"<strong>Team Experience:</strong><br><br>- <strong>Hackathon teams</strong> — Collaborated under tight deadlines at Electra & SamHita<br>- <strong>Code reviews</strong> — Practices constructive peer review<br>- <strong>Git collaboration</strong> — Feature branching, pull requests, merge management<br>- <strong>Communication</strong> — Clear, proactive, and responsive<br><br>A true team player who elevates everyone around him!",
      topic:'workstyle' },

    { keys:['language','languages','speak','spoken','english','hindi','tamil','mother tongue','native language','communication language','multilingual'],
      reply:"<strong>Languages:</strong><br><br>- <strong>English</strong> — Professional proficiency (written & verbal)<br>- <strong>Tamil</strong> — Native language<br>- <strong>Hindi</strong> — Conversational<br><br>Comfortable communicating with international teams!",
      topic:'about' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Services & Offerings
       ============================================================ */
    { keys:['service','services','what can you build','what do you offer','offer','offering','build for me','can you make','can you build','hire for','need developer','need website','website development','web development service','freelance service'],
      reply:"<strong>Services Jarshin Can Deliver:</strong><br><br>- <strong>Portfolio & Personal Websites</strong><br>- <strong>Business Landing Pages</strong><br>- <strong>Full-Stack Web Applications</strong> (Django)<br>- <strong>REST API Development</strong><br>- <strong>Responsive UI/Frontend</strong> builds<br>- <strong>IoT Dashboard Interfaces</strong><br>- <strong>Password/Security Tools</strong><br><br>Have a project? <a href='https://wa.me/919345511293' target='_blank'>Let's discuss on WhatsApp!</a>",
      topic:'services' },

    { keys:['price','pricing','cost','rate','rates','charge','charges','how much','budget','fee','fees','quote','quotation','estimate','expensive','cheap','affordable','payment','pay'],
      reply:"<strong>Pricing:</strong><br><br>Pricing depends on project scope, complexity, and timeline. Jarshin offers competitive rates for:<br>- <strong>Freelance projects</strong><br>- <strong>Hourly consulting</strong><br>- <strong>Fixed-price deliverables</strong><br><br>For a <strong>free quote</strong>, reach out:<br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a>",
      topic:'services' },

    { keys:['timeline','how long','duration','turnaround','delivery time','when done','time to build','how fast','eta','when ready','how many days','how many weeks'],
      reply:"<strong>Project Timelines:</strong><br><br>- <strong>Landing Page:</strong> 2–5 days<br>- <strong>Portfolio Website:</strong> 1–2 weeks<br>- <strong>Full-Stack Web App:</strong> 2–6 weeks<br>- <strong>API Development:</strong> 1–3 weeks<br><br>Timelines vary with complexity. Let's discuss your project!<br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a>",
      topic:'services' },

    { keys:['salary','ctc','package','compensation','stipend','expected salary','salary expectation','how much do you charge','negotiable','lpa','per month','per hour','hourly rate'],
      reply:"Salary/pricing is flexible and depends on:<br>- Project scope & complexity<br>- Duration & commitment level<br>- Type (freelance/internship/full-time)<br><br>Jarshin is open to discussing fair compensation. Let's talk!<br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a>",
      topic:'hiring' },

    { keys:['freelance platform','upwork','fiverr','freelancer','toptal','contra','gig','side project','side hustle','moonlight','part time','part-time'],
      reply:"Jarshin is <strong>available for freelance work</strong>! He takes direct clients for:<br>- Web development projects<br>- Portfolio & landing pages<br>- Django applications<br>- API development<br><br>Direct contact is preferred:<br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> | <a href='mailto:jarshin07@gmail.com'>Email</a>",
      topic:'hiring' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Industry & Technology Trends
       ============================================================ */
    { keys:['trend','trends','latest','modern','new technology','emerging','innovation','tech industry','software industry','it industry','market','demand','popular','trending','hot','buzzword'],
      reply:"<strong>Tech Trends Jarshin Follows:</strong><br><br>- <strong>AI-Assisted Development</strong> — Leveraging AI tools for productivity<br>- <strong>Edge Computing & IoT</strong> — Smart devices at the network edge<br>- <strong>Serverless & Jamstack</strong> — Modern deployment architectures<br>- <strong>Web Components</strong> — Framework-agnostic UI<br>- <strong>Progressive Web Apps</strong> — App-like web experiences<br><br>Always staying current with the evolving landscape!",
      topic:'trends' },

    { keys:['artificial intelligence','openai','chatgpt','gpt','gemini','copilot','ai tools','machine learning','ml','deep learning','neural network','nlp','natural language','llm','large language model'],
      reply:"<strong>AI & Machine Learning:</strong><br><br>While Jarshin's current focus is <strong>full-stack web development</strong>, he's keenly exploring:<br>- AI-assisted coding tools (Copilot, ChatGPT)<br>- NLP concepts (this chatbot uses fuzzy matching!)<br>- Automation workflows combining IoT + AI<br>- ML fundamentals through coursework<br><br>The intersection of AI and IoT is especially exciting!",
      topic:'trends' },

    { keys:['pwa','progressive web app','service worker','manifest','offline','installable','app like','native app','mobile app','android','ios','flutter','react native','mobile development','cross platform','hybrid app'],
      reply:"<strong>Mobile & PWA:</strong><br><br>Jarshin builds <strong>mobile-first responsive websites</strong> that work beautifully on any device. Currently exploring:<br>- Progressive Web Apps (PWA)<br>- Service Workers for offline capability<br>- Cross-platform development concepts<br><br>His responsive design skills ensure every project is mobile-ready!",
      topic:'trends' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Portfolio Details
       ============================================================ */
    { keys:['portfolio design','how was this built','tech stack used','stack used','built with','made with','how did you make','tools used','technology used','what technology','which language','which framework'],
      reply:"<strong>This Portfolio's Tech Stack:</strong><br><br>- <strong>HTML5</strong> — Semantic, accessible markup<br>- <strong>CSS3</strong> — Custom properties, Apple-inspired tokens<br>- <strong>Vanilla JavaScript</strong> — Zero frameworks, pure performance<br>- <strong>Bootstrap 5</strong> — Grid system only<br>- <strong>Web3Forms</strong> — Contact form API<br>- <strong>AI Chatbot</strong> — Custom NLP with Levenshtein distance<br><br>No React, no jQuery — just clean, fast code!",
      topic:'projects' },

    { keys:['best project','favorite project','proudest','proud','most proud','best work','top project','highlight','standout','showcase'],
      reply:"<strong>Proudest Work:</strong><br><br><strong>Platter to Purpose</strong> — Because it combines technical skill with social impact. Built at a hackathon, deployed live, and serves a real community need for resource distribution.<br><br><a href='https://platter-to-purpose.onrender.com/' target='_blank'>Live Demo</a> | <a href='https://github.com/JarshinJS/platter_to_purpose' target='_blank'>GitHub</a><br><br>Building tech that helps people is the ultimate motivation!",
      topic:'projects' },

    { keys:['version','version number','latest version','update','updates','changelog','portfolio version','iteration','release'],
      reply:"<strong>Portfolio Version:</strong><br><br>This is the latest iteration featuring:<br>- Apple-inspired clean design<br>- AI chatbot with fuzzy matching<br>- Form validation with inline error messages<br>- Scroll animations & progress indicators<br>- Fully responsive mobile experience<br><br>Continuously improved with each iteration!",
      topic:'projects' },

    { keys:['contribution','contribute','open source contribution','fork','star','github activity','github stats','commit history','streak','contribution graph','active'],
      reply:"<strong>Open Source Activity:</strong><br><br>Jarshin maintains active repositories on GitHub with consistent commits. All his projects are open-source:<br>- Portfolio website<br>- Password Strength Checker<br>- Platter to Purpose<br><br>Check his contribution graph: <a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a>",
      topic:'projects' },

    { keys:['copy','clone','steal','template','use your','download portfolio','can i use','can i copy','inspired by','credit','open source portfolio'],
      reply:"The portfolio source code is on GitHub! You can explore it for inspiration:<br><br><a href='https://github.com/JarshinJS' target='_blank'>github.com/JarshinJS</a><br><br>If you'd like Jarshin to <strong>build a custom portfolio for you</strong>, reach out via <a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a>!<br><br>Credit is always appreciated if you use ideas from this site. 🙏",
      topic:'projects' },

    /* ============================================================
       EXPANDED KNOWLEDGE — References & Credibility
       ============================================================ */
    { keys:['reference','referral','recommendation','testimonial','review','feedback','client','portfolio review','endorsement','rating','reputation'],
      reply:"Jarshin's work speaks for itself! Check out:<br><br>- <strong>Live deployed projects</strong> on Render & GitHub Pages<br>- <strong>Open source code</strong> on GitHub for code quality review<br>- <strong>Hackathon certifications</strong> validating competitive performance<br><br>For professional references, contact via <a href='mailto:jarshin07@gmail.com'>email</a>.",
      topic:'hiring' },

    { keys:['compare','comparison','better','better than','versus','vs','differ','difference','competitor','alternative','other developer','other portfolio'],
      reply:"Every developer brings unique strengths! Jarshin's differentiators:<br><br>- <strong>Full-Stack + IoT</strong> — Rare combination<br>- <strong>Hackathon-proven</strong> — Delivers under pressure<br>- <strong>Clean code culture</strong> — Git-disciplined from day one<br>- <strong>Deployed products</strong> — Not just tutorials, real apps in production<br><br>Want to see the proof? Check his <strong>projects</strong>!",
      topic:'hiring' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Challenges & Growth
       ============================================================ */
    { keys:['challenge','challenges','difficult','difficulty','hard','hardest','toughest','struggle','obstacle','problem faced','biggest challenge','overcome','failure','fail','mistake','lesson','learned'],
      reply:"<strong>Challenges & Growth:</strong><br><br>Every challenge is a learning opportunity! Key lessons:<br>- <strong>Hackathon time pressure</strong> taught prioritization & MVP thinking<br>- <strong>Debugging deployment issues</strong> deepened DevOps understanding<br>- <strong>Building this chatbot</strong> from scratch improved NLP knowledge<br>- <strong>Responsive design</strong> challenges sharpened cross-browser skills<br><br>Embracing challenges is how Jarshin grows!",
      topic:'experience' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Mentoring & Teaching
       ============================================================ */
    { keys:['mentor','mentorship','teach','teaching','tutor','tutoring','coaching','coach','guidance','learn from you','train','training','workshop','lecture'],
      reply:"Jarshin is passionate about <strong>knowledge sharing</strong>! While primarily focused on building, he's open to:<br>- Peer programming sessions<br>- Helping beginners with web development fundamentals<br>- Sharing hackathon strategies<br>- Open source collaboration & code reviews<br><br>Reach out via <a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> to connect!",
      topic:'about' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Setup & Tools
       ============================================================ */
    { keys:['setup','dev setup','workstation','desk','monitor','laptop','computer','pc','mac','keyboard','mouse','hardware setup','equipment'],
      reply:"<strong>Dev Setup:</strong><br><br>- <strong>Editor:</strong> VS Code with productivity extensions<br>- <strong>Version Control:</strong> Git + GitHub<br>- <strong>Browser:</strong> Chrome DevTools for debugging<br>- <strong>Design:</strong> Clean, minimal workspace<br>- <strong>Workflow:</strong> Keyboard shortcuts + efficient Git aliases<br><br>Jarshin optimizes his setup for maximum productivity!",
      topic:'about' },

    { keys:['npm','package','packages','library','libraries','module','modules','dependency','dependencies','third party','external','cdn','import'],
      reply:"<strong>Libraries & Tools:</strong><br><br>Jarshin uses a balanced approach:<br>- <strong>Bootstrap 5</strong> — Responsive grid & components<br>- <strong>Django REST Framework</strong> — API development<br>- <strong>Vanilla JS</strong> — Minimal dependencies for performance<br>- <strong>CDN delivery</strong> — Bootstrap, Google Fonts<br><br>Philosophy: Use libraries wisely, understand fundamentals deeply!",
      topic:'skills' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Tech Explanations
       ============================================================ */
    { keys:['what is html','explain html','html meaning','what is css','explain css','css meaning','what is javascript','explain javascript','what is python','explain python','what is django','explain django','what is iot','explain iot','what is api','explain api'],
      reply:"Great question! Here's a quick overview:<br><br>- <strong>HTML</strong> — Structure of web pages (the skeleton)<br>- <strong>CSS</strong> — Styling & visual design (the skin)<br>- <strong>JavaScript</strong> — Interactivity & logic (the brain)<br>- <strong>Python</strong> — Versatile programming language<br>- <strong>Django</strong> — Python web framework for rapid development<br>- <strong>IoT</strong> — Connecting physical devices to the internet<br>- <strong>API</strong> — Bridge between different software systems<br><br>Jarshin is proficient in all of these!",
      topic:'skills' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Location & Regional
       ============================================================ */
    { keys:['tamil nadu','tn','south india','indian developer','indian','desi','india developer','india engineer','coimbatore city','kovai'],
      reply:"<strong>Based in Coimbatore, Tamil Nadu 🇮🇳</strong><br><br>Coimbatore is a major IT hub and educational center in South India. Jarshin studies at <strong>SKCET</strong>, one of the region's top engineering colleges.<br><br>Available for remote work worldwide & open to relocation!",
      topic:'location' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Fun, Easter Eggs & Personality
       ============================================================ */
    { keys:['tell me a fact','fun fact','interesting','random','did you know','trivia','surprise','curious','curiosity'],
      reply:"<strong>Fun Fact:</strong> This chatbot understands over <strong>350+ keywords</strong>, handles typos using the Levenshtein distance algorithm, and was built entirely without any external API — pure vanilla JavaScript!<br><br>Try misspelling something and watch it still understand you! 🧠",
      topic:'fun' },

    { keys:['coffee','tea','chai','beverage','drink','food','pizza','biryani','favorite food','snack','energy','fuel'],
      reply:"Fun question! Every great developer runs on <strong>chai</strong> ☕ and dedication! But seriously — Jarshin's fuel is the excitement of seeing a project come to life.<br><br>Now, want to know about his actual <strong>projects</strong> or <strong>skills</strong>?",
      topic:'fun' },

    { keys:['favorite','favourite','best','prefer','preference','top','most used','go to','goto'],
      reply:"<strong>Jarshin's Favorites:</strong><br><br>- <strong>Language:</strong> Python (for backend) & JavaScript (for frontend)<br>- <strong>Framework:</strong> Django<br>- <strong>Editor:</strong> VS Code<br>- <strong>OS:</strong> Windows + Linux<br>- <strong>Design Style:</strong> Apple-inspired minimalism<br>- <strong>Learning Style:</strong> Build-first approach<br><br>Ask about any specific topic!",
      topic:'fun' },

    { keys:['stupid','dumb','idiot','useless','bad','worst','hate','terrible','horrible','pathetic','rubbish','trash','suck','sucks','lame','boring','ugly','awful'],
      reply:"I appreciate all feedback! I'm constantly being improved. If I couldn't answer your question, try rephrasing it or ask about:<br><br><strong>Skills</strong> | <strong>Projects</strong> | <strong>Contact</strong> | <strong>Education</strong><br><br>I'm here to help! 😊",
      topic:'fun' },

    { keys:['are you real','are you human','human or bot','bot or human','real person','talking to','are you alive','sentient','conscious','think','feel','emotion','feelings'],
      reply:"I'm Jarshin's <strong>AI Assistant</strong> — not human, but pretty smart! 🤖 I was built with vanilla JavaScript, fuzzy matching, and a comprehensive knowledge base about Jarshin's portfolio.<br><br>I can't feel emotions, but I <em>can</em> help you learn everything about Jarshin!",
      topic:'chatbot' },

    { keys:['secret','easter egg','hidden','surprise me','magic','trick','special','cheat','cheat code','konami'],
      reply:"🎉 You found a hidden response! Here's a secret: this chatbot can understand your questions even if you misspell <strong>every single word</strong>! Try typing 'wht r jarshins skils' and watch it work!<br><br>Built with 💙 using pure JavaScript. No AI APIs, no frameworks — just clever algorithms!",
      topic:'fun' },

    { keys:['who built this','who made this','who designed this','who created this','developer of this','made by','built by','designed by','created by','author','creator','owner'],
      reply:"This entire portfolio — including this AI chatbot — was <strong>designed and built by Jarshin J S</strong>! 🚀<br><br>No templates, no drag-and-drop builders. Hand-coded with HTML, CSS, and vanilla JavaScript.<br><br>Want him to build something for you? <a href='https://wa.me/919345511293' target='_blank'>Let's talk!</a>",
      topic:'about' },

    /* ============================================================
       EXPANDED KNOWLEDGE — Conversational & Acknowledgments
       ============================================================ */
    { keys:['good morning','gm'],
      reply:"Good morning! ☀️ Hope you're having a great start to your day! I'm Jarshin's AI assistant — how can I help you today?<br><br>Ask about <strong>skills</strong>, <strong>projects</strong>, or <strong>contact info</strong>!",
      topic:'greeting' },

    { keys:['good night','sleep','night night','nighty','bedtime'],
      reply:"Good night! 🌙 Thanks for visiting Jarshin's portfolio. Before you go — feel free to <a href='https://wa.me/919345511293' target='_blank'>save his WhatsApp</a> or <a href='Jarshin_JS.pdf' download>download his resume</a> for later!<br><br>Sweet dreams! 💤",
      topic:'bye' },

    { keys:['ok','okay','sure','alright','hmm','hmmm','ohh','oh','i see','got it','understood','right','yep','yup','ya','yeah','yes','nope','nah','fine','acha','thik'],
      reply:"Got it! Feel free to ask me anything about:<br><br>• <strong>Skills & Tech Stack</strong><br>• <strong>Projects & Live Demos</strong><br>• <strong>Education & Credentials</strong><br>• <strong>Contact & Social Links</strong><br>• <strong>Hiring & Collaboration</strong><br><br>I'm here whenever you need info!",
      topic:'help' },

    { keys:['what','huh','confused','dont understand','unclear','not clear','what do you mean','clarify','wdym','idk'],
      reply:"No worries! Let me clarify — I can answer questions about Jarshin's:<br><br>• <strong>Technical Skills</strong> — HTML, CSS, JS, Django, IoT<br>• <strong>Projects</strong> — Portfolio, Password Checker, Platter to Purpose<br>• <strong>Education</strong> — B.E. CSE (IoT) at SKCET<br>• <strong>Contact Info</strong> — WhatsApp, Email, LinkedIn<br><br>Just type your question naturally — I even handle typos!",
      topic:'help' },

    { keys:['how are you','how r u','how you doing','wassup','what\'s up','how is it going','how do you do','how have you been','hru'],
      reply:"I'm doing great, thanks for asking! 😊 I'm always here and ready to help.<br><br>What would you like to know about Jarshin? Try asking about his <strong>skills</strong>, <strong>projects</strong>, or <strong>experience</strong>!",
      topic:'greeting' },

    { keys:['what time','current time','date','today','what day'],
      reply:"I don't track real-time data, but Jarshin is based in <strong>IST (UTC+5:30)</strong>. For real-time communication:<br><br><a href='https://wa.me/919345511293' target='_blank'>WhatsApp</a> — Usually responds within hours!<br><a href='mailto:jarshin07@gmail.com'>Email</a> — Within 24 hours",
      topic:'contact' },

    { keys:['no','nope','not helpful','wrong','incorrect','that\'s wrong','not what i asked','different','something else','other','change topic','next topic','another','skip'],
      reply:"Sorry about that! Let me help you better. You can ask about:<br><br>• <strong>Skills</strong> — 'What technologies does Jarshin know?'<br>• <strong>Projects</strong> — 'Show me his projects'<br>• <strong>Contact</strong> — 'How to reach Jarshin?'<br>• <strong>Education</strong> — 'Where does he study?'<br>• <strong>Hiring</strong> — 'Is he available for work?'<br><br>Try being specific, and I'll do my best!",
      topic:'help' },

    { keys:['repeat','say again','again','come again','pardon','sorry what','once more','rephrase','what did you say','can you repeat'],
      reply:"No problem! Ask me your question again, and I'll do my best to answer it clearly. I'm great with:<br><br>• Skills & Technologies<br>• Projects & Demos<br>• Contact Information<br>• Education & Credentials<br>• Hiring & Freelance<br><br>Fire away!",
      topic:'help' },

    { keys:['more jokes','another joke','one more joke','joke2','funny2','tell another','more humor','more fun'],
      reply:"Here are some developer classics:<br><br>🤓 A SQL query walks into a bar, sees two tables, and asks: <em>'Can I JOIN you?'</em><br><br>💀 Why was the JavaScript developer sad? Because he didn't Node how to Express himself!<br><br>🐛 99 little bugs in the code, 99 little bugs... Take one down, patch it around — 127 little bugs in the code.<br><br>Now, anything about Jarshin's work? 😄",
      topic:'fun' },

    { keys:['programming language','coding language','which language','language used','languages known','how many languages','other languages','all languages'],
      reply:"<strong>Programming Languages:</strong><br><br>- <strong>Python</strong> — Primary backend language (Django)<br>- <strong>JavaScript</strong> — Frontend & full-stack scripting<br>- <strong>HTML5/CSS3</strong> — Markup & styling (technically not 'programming' languages!)<br>- <strong>SQL</strong> — Database queries<br>- Exploring: <strong>TypeScript</strong><br><br>Versatile across the full web stack!",
      topic:'skills' },

    { keys:['linux','ubuntu','windows','os','operating system','terminal','command line','cli','bash','shell','powershell','wsl'],
      reply:"<strong>Operating Systems:</strong><br><br>- <strong>Windows</strong> — Primary development OS<br>- <strong>Linux</strong> — Familiar with Ubuntu & command line<br>- Terminal/CLI proficiency for Git, Python, and server management<br>- VS Code's integrated terminal for seamless workflow<br><br>Comfortable across platforms!",
      topic:'skills' },

    { keys:['interview','interview tips','prepare','preparation','technical interview','coding interview','hr interview','aptitude','placement','campus placement','job interview'],
      reply:"<strong>Interview Readiness:</strong><br><br>Jarshin is well-prepared with:<br>- <strong>DSA practice</strong> through coursework<br>- <strong>Deployed projects</strong> to demonstrate real-world skills<br>- <strong>Hackathon experience</strong> showing team collaboration<br>- <strong>Clean GitHub</strong> for code quality review<br>- Strong communication skills<br><br>Ready for technical and behavioral rounds!",
      topic:'hiring' },

    { keys:['emoji','emoticon','smiley','icon','fun response','casual','informal'],
      reply:"Hey! 🎉 I can be fun too!<br><br>🚀 <strong>Skills?</strong> Jarshin's a rocket!<br>💻 <strong>Projects?</strong> All deployed & live!<br>🎓 <strong>Education?</strong> B.E. at top college!<br>📱 <strong>Contact?</strong> One WhatsApp away!<br>🏆 <strong>Hackathons?</strong> Multiple certifications!<br><br>What do you want to explore? 😄",
      topic:'fun' }
  ];

  var SUGGESTIONS = ['Skills','Projects','Contact','Hire','Resume','Services','Education','Demos'];

  /* -- DOM ELEMENTS -- */
  var win    = $('#chatbot-window');
  var toggle = $('#chatbot-toggle');
  var close  = $('#chatbot-close');
  var msgs   = $('#chatbot-messages');
  var input  = $('#chatbot-input');
  var send   = $('#chatbot-send');
  var sugg   = $('#chatbot-suggestions');

  if (!win || !toggle || !msgs || !input) return;

  var lastTopic = null;
  var msgCount  = 0;

  /* -- RENDERING -- */
  function appendMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'chat-msg ' + who;
    d.innerHTML = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    msgCount++;
  }

  function showTyping() {
    var d = document.createElement('div');
    d.className = 'typing-indicator';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  /* -- NLP ENGINE -- */

  function normalize(str) {
    var out = str.toLowerCase().trim();
    out = out.replace(/[^\w\s']/g, ' ');
    EXPAND.forEach(function(pair) { out = out.split(pair[0]).join(pair[1]); });
    out = out.split(/\s+/).map(function(word) { return TYPO_MAP[word] || word; }).join(' ');
    return out;
  }

  function exactMatch(text, keyword) {
    if (/\s/.test(keyword)) return text.indexOf(keyword) !== -1;
    try {
      return new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(text);
    } catch (e) { return text.indexOf(keyword) !== -1; }
  }

  function fuzzyMatch(text, keyword) {
    if (/\s/.test(keyword)) return text.indexOf(keyword) !== -1;
    var words = text.split(/\s+/);
    var threshold = keyword.length <= 5 ? 1 : 2;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.length < 3) continue;
      if (Math.abs(word.length - keyword.length) > threshold) continue;
      if (levenshtein(word, keyword) <= threshold) return true;
    }
    return false;
  }

  function scoreEntry(normalizedInput, entry) {
    var score = 0;
    for (var i = 0; i < entry.keys.length; i++) {
      var key = entry.keys[i];
      if (exactMatch(normalizedInput, key)) {
        score += key.split(' ').length * 3;
      } else if (fuzzyMatch(normalizedInput, key)) {
        score += key.split(' ').length * 1.5;
      }
    }
    return score;
  }

  /* -- DOM-AWARE PORTFOLIO DATA -- */
  function getPortfolioData() {
    try {
      return {
        projects: Array.from($$('.project-card')).map(function(c) {
          return {
            title: (c.querySelector('.project-title') || {}).textContent || '',
            points: Array.from(c.querySelectorAll('.project-points li')).map(function(l) { return l.textContent.replace(/\s+/g,' ').trim(); }),
            links: Array.from(c.querySelectorAll('.project-links a')).map(function(a) { return { text: a.textContent.trim(), href: a.href }; })
          };
        }),
        skills: Array.from($$('.skill-chip span')).map(function(s) { return s.textContent.trim(); }),
        certTitles: Array.from($$('.cert-title')).map(function(t) { return t.textContent.trim(); })
      };
    } catch (e) { return { projects: [], skills: [], certTitles: [] }; }
  }

  function searchPortfolioDOM(query) {
    var data = getPortfolioData();
    var terms = query.split(/\s+/).filter(function(w) { return w.length > 2; });
    for (var p = 0; p < data.projects.length; p++) {
      var proj = data.projects[p];
      var corpus = (proj.title + ' ' + proj.points.join(' ')).toLowerCase();
      var matches = terms.filter(function(t) { return corpus.indexOf(t) !== -1 || fuzzyMatch(corpus, t); });
      if (matches.length >= 1) {
        var linksHtml = proj.links.map(function(l) { return "<a href='" + l.href + "' target='_blank'>" + l.text + "</a>"; }).join(' | ');
        return "<strong>" + proj.title + "</strong><br>" + proj.points.map(function(pt) { return '- ' + pt; }).join('<br>') + (linksHtml ? '<br><br>' + linksHtml : '');
      }
    }
    var matchedSkills = data.skills.filter(function(s) {
      var sl = s.toLowerCase();
      return terms.some(function(t) { return sl.indexOf(t) !== -1 || levenshtein(sl, t) <= 2; });
    });
    if (matchedSkills.length > 0) {
      return "Found matching skills: <strong>" + matchedSkills.join(', ') + "</strong>. Jarshin is proficient in all of these!";
    }
    return null;
  }

  /* -- MAIN REPLY ENGINE -- */
  function getBotReply(text) {
    var normalized = normalize(text);
    var scored = KB.map(function(entry) { return { entry: entry, score: scoreEntry(normalized, entry) }; })
                   .filter(function(e) { return e.score > 0; })
                   .sort(function(a, b) { return b.score - a.score; });

    if (scored.length > 0 && scored[0].score >= 1.5) {
      var match = scored[0].entry;
      lastTopic = match.topic || null;
      return match.reply;
    }

    if (/(?:more|detail|explain|elaborate|continue|go on|tell me more|what else|also|further)/.test(normalized) && lastTopic) {
      var topicEntries = KB.filter(function(e) { return e.topic === lastTopic; });
      if (topicEntries.length > 0) {
        topicEntries.sort(function(a, b) { return b.reply.length - a.reply.length; });
        return topicEntries[0].reply;
      }
    }

    var domResult = searchPortfolioDOM(normalized);
    if (domResult) return domResult;

    return "I wasn't sure about that, but I can answer questions about:<br><br><strong>Skills</strong> | <strong>Projects</strong> | <strong>Credentials</strong><br><strong>Education</strong> | <strong>Contact</strong> | <strong>Hiring</strong><br><br>Try: <em>'What are Jarshin's skills?'</em> or <em>'Show me projects'</em>";
  }

  /* -- SEND / SUGGESTIONS / EVENTS -- */
  function handleSend(text) {
    if (typeof text === 'string') text = text.trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';
    sugg.innerHTML = '';

    var typing = showTyping();
    var delay = 450 + Math.random() * 400;
    setTimeout(function() {
      typing.remove();
      var reply = getBotReply(text);
      appendMsg(reply, 'bot');
      if (msgCount % 4 === 0) {
        setTimeout(buildSuggestions, 300);
      }
    }, delay);
  }

  function buildSuggestions() {
    sugg.innerHTML = '';
    SUGGESTIONS.forEach(function(s) {
      var b = document.createElement('button');
      b.className = 'chat-suggestion';
      b.textContent = s;
      b.type = 'button';
      on(b, 'click', function() { handleSend(s); });
      sugg.appendChild(b);
    });
  }

  var SVG_CHAT = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg>';
  var SVG_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>';

  /* -- Toggle chatbot open/close -- */
  on(toggle, 'click', function() {
    var isOpen = win.classList.toggle('open');
    toggle.innerHTML = isOpen ? SVG_CLOSE : SVG_CHAT;
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && msgs.children.length === 0) {
      setTimeout(function() {
        appendMsg("Hi! I'm Jarshin's <strong>AI assistant</strong>. I understand typos too - just ask me anything about his skills, projects, or contact info!", 'bot');
        setTimeout(buildSuggestions, 300);
      }, 150);
    }
    if (isOpen) input.focus();
  });

  /* -- Close button -- */
  if (close) {
    on(close, 'click', function() {
      win.classList.remove('open');
      toggle.innerHTML = SVG_CHAT;
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* -- Send button & Enter key -- */
  if (send) on(send, 'click', function() { handleSend(input.value); });
  on(input, 'keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input.value);
    }
  });
}
