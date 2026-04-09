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
  initReveal();
  initTyping();
  initNavbar();
  initContactForm();
  initScrollProgress();
  initChatbot();
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
    'databse':'database','datbase':'database','darabase':'database'
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
    ['platformtopurpose','platform to purpose'],['p2p','platform to purpose'],
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
    ['tellmeabout','tell me about'],['whatdoyoudo','what do you do']
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
      reply:"<strong>Django + Python</strong> - Strong expertise. Jarshin builds full-stack web apps with Django, creates RESTful APIs, and has deployed production apps on platforms like Render.",
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
      reply:"<strong>Featured Projects:</strong><br><br>1. <strong>Personal Developer Portfolio</strong><br>Responsive portfolio with semantic HTML5 and direct resume access.<br><br>2. <strong>Password Generator & Strength Checker</strong><br>Client-side JavaScript tool with real-time strength scoring. Zero dependencies.<br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Live Demo</a><br><br>3. <strong>Platform to Purpose</strong><br>Full-stack Django app for community resource distribution. Built at SamHita Hackathon.<br><a href='https://platform-to-purpose.onrender.com/' target='_blank'>Live Demo</a>",
      topic:'projects' },

    { keys:['password','password generator','password checker','password strength','strength checker','pass gen','password tool','security tool'],
      reply:"<strong>Password Generator & Strength Checker</strong><br><br><strong>Problem:</strong> Users create weak passwords without feedback.<br><strong>Solution:</strong> Client-side JavaScript tool with real-time strength scoring.<br><strong>Impact:</strong> Makes security accessible, zero dependencies.<br><br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Live Demo</a> | <a href='https://github.com/JarshinJS' target='_blank'>GitHub</a>",
      topic:'projects' },
    { keys:['platform','platform to purpose','p2p','donation','orphanage','food waste','render','community','social impact','hackathon project','samhita'],
      reply:"<strong>Platform to Purpose</strong><br><br><strong>Problem:</strong> Communities need better workflows to route surplus resources.<br><strong>Solution:</strong> Full-stack Django platform built at the SamHita Hackathon.<br><strong>Impact:</strong> Live social-impact prototype showcasing end-to-end delivery.<br><br><a href='https://platform-to-purpose.onrender.com/' target='_blank'>Live Demo</a> | <a href='https://github.com/JarshinJS/Platform-to-Purpose' target='_blank'>GitHub</a>",
      topic:'projects' },
    { keys:['portfolio','this site','this portfolio','this page','your website','this website','portfolio website','personal website','personal site'],
      reply:"<strong>This Portfolio</strong> - Built with semantic HTML5, Apple-inspired CSS design, vanilla JavaScript (including this AI chatbot!), and Bootstrap 5 for layout. Fully responsive and accessible.",
      topic:'projects' },
    { keys:['live demo','demo link','demo','deployed','hosting','hosted','url','website link','view project','see demo','show demo','live link','live site','live'],
      reply:"<strong>Live Demos:</strong><br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>Password Generator & Strength Checker</a><br><a href='https://platform-to-purpose.onrender.com/' target='_blank'>Platform to Purpose</a>",
      topic:'projects' },

    { keys:['certification','certifications','certificate','certificates','credential','credentials','achievement','achievements','award','awards','certified','badge','accomplishment','qualified'],
      reply:"<strong>Certifications & Hackathons:</strong><br><br>Professional Certification - Industry credential validating technical foundations.<br><br>Electra 2026 Hackathon - Certificate of Participation at CIT.<br><br>MIT Certificate - SamHita Hackathon participation & prototype delivery.",
      topic:'certifications' },
    { keys:['mit','mit certificate','mit cert','massachusetts','samhita'],
      reply:"<strong>MIT Certificate</strong> - Earned through the SamHita Hackathon where Jarshin built and presented a functional web prototype under competitive conditions.",
      topic:'certifications' },
    { keys:['hackathon','electra','electra hackathon','competition','event','participate','compete','coding competition','hack'],
      reply:"<strong>Hackathon Experience:</strong><br>- <strong>Electra 2026</strong> at CIT - built and presented under time pressure<br>- <strong>SamHita Hackathon</strong> - created Platform to Purpose<br><br>Jarshin thrives in competitive, fast-paced environments!",
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
      reply:"<strong>I can help with:</strong><br><br><strong>Skills</strong> - HTML, CSS, JS, Django, Git, IoT<br><strong>Projects</strong> - Portfolio, Password Checker, Platform to Purpose<br><strong>Credentials</strong> - Certifications & hackathons<br><strong>Education</strong> - Computer Science (IoT) at SKCET<br><strong>Contact</strong> - Email, WhatsApp, LinkedIn, GitHub<br><strong>Hiring</strong> - Freelance, internships, full-time<br><br>I understand <strong>typos</strong> too - just type naturally!",
      topic:'help' },

    { keys:['joke','funny','humor','laugh','tell me a joke','make me laugh','fun fact'],
      reply:"Why do programmers prefer dark mode? Because light attracts bugs!<br><br>Now, ask me something about Jarshin's work!",
      topic:'fun' },
    { keys:['love','i love you','date','marry','relationship','crush','single','girlfriend','boyfriend'],
      reply:"Ha! That's flattering! But I'm just an AI assistant. I <em>can</em> tell you about Jarshin's <strong>projects</strong> and <strong>skills</strong> though!",
      topic:'fun' },
    { keys:['weather','time','news','sports','movie','music','song','game','play'],
      reply:"I specialize in Jarshin's portfolio! For general questions, try Google. But ask me about <strong>skills</strong>, <strong>projects</strong>, or how to <strong>contact Jarshin</strong>!",
      topic:'outofscope' }
  ];

  var SUGGESTIONS = ['WhatsApp','Email','Skills','Projects','Links','Hire'];

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
