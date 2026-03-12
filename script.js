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
      keys: ['skill','skills','skillset', 'tech', 'technology', 'stack', 'techstack', 'toolkit', 'tool', 'expertise', 'capability', 'proficiency', 'know', 'language', 'what do you know', 'technical'],
      reply: "\uD83D\uDEE0\uFE0F <strong>Technical Skills:</strong><br>\u2022 HTML \u2014 95%<br>\u2022 JavaScript \u2014 85%<br>\u2022 VS Code \u2014 90%<br>\u2022 GitHub \u2014 85%<br>\u2022 Django (Python) \u2014 80%<br>\u2022 Git \u2014 75%<br><br><strong>Also Experienced With:</strong><br>\u2022 Bootstrap 5 \u2014 Responsive design<br>\u2022 CSS3 & Animations \u2014 Flexbox, Grid, transitions<br>\u2022 AOS (Animate On Scroll)<br>\u2022 REST APIs \u2014 Design & integration<br>\u2022 Web3Forms \u2014 Backend form handling<br>\u2022 IoT Integration \u2014 Sensors & microcontrollers<br>\u2022 DOM Manipulation \u2014 Dynamic JS<br>\u2022 Responsive Web Design \u2014 Mobile-first<br><br>Ask about any specific skill for deep dive! \ud83d\ude0b"
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
      reply: "\uD83D\uDE80 <strong>Featured Projects:</strong><br><br>\uD83D\uDCC1 <strong>1. Portfolio Website</strong> (This Site!)<br>Bootstrap 5 + Vanilla JS + AOS animations. Features: typing effect, skill bars, dark mode, AI chatbot, contact form.<br><a href='#home' onclick='window.scrollTo(0,0)'>↑ Scroll to top</a><br><br>\uD83D\uDD10 <strong>2. Password Strength Checker</strong><br>Pure JavaScript real-time password validator. Zero dependencies, fast, deployed on GitHub Pages.<br><a href='https://jarshinjs.github.io/password-strength-checker/' target='_blank'>\uD83C\uDF10 Try live \u2192</a>&nbsp;&nbsp;<a href='https://github.com/JarshinJS' target='_blank'>\uD83D\uDC19 Code \u2192</a><br><br>\uD83C\uDF7D\uFE0F <strong>3. Platter to Purpose</strong><br>Django full-stack food donation platform. Connects hotels with orphanages to reduce waste. Deployed on Render.<br><a href='https://platter-to-purpose.onrender.com' target='_blank'>\uD83C\uDF10 See live \u2192</a>&nbsp;&nbsp;<a href='https://github.com/JarshinJS' target='_blank'>\uD83D\uDC19 Code \u2192</a><br><br>\ud83d\udccc Need details on any project? Just ask!"
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
      keys: ['certification', 'certifications','certificate', 'credential', 'achievement', 'award', 'certified', 'credentials', 'badge', 'accomplishment'],
      reply: "\uD83C\uDFC6 <strong>Certifications:</strong><br><br>\uD83D\uDCDC <strong>Professional Certification</strong> \u2014 Industry-recognized credential validating technical expertise and skills.<br><br>\u26A1 <strong>Electra Hackathon</strong> \u2014 Certificate of Participation for competing in the Electra hackathon.<br><br>\uD83C\uDF86 <strong>MIT Certificate</strong> \u2014 Professional certification from MIT validating advanced technical knowledge."
    },

    /* ===== MIT CERTIFICATE ===== */
    {
      keys: ['mit', 'mit certificate', 'mit cert', 'massachusetts institute of technology'],
      reply: "\uD83C\uDF86 <strong>MIT Certificate</strong><br>Jarshin holds a professional certification from MIT (Massachusetts Institute of Technology) that validates advanced technical knowledge and expertise in cutting-edge technologies.<br><br>This credential demonstrates commitment to continuous learning and mastery of complex technical concepts!"
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

    /* ===== PROJECT TECH STACK - PASSWORD CHECKER ===== */
    {
      keys: ['password checker tech', 'password strength technology', 'password checker built with', 'password checker how made', 'password strength checker technologies'],
      reply: "\uD83D\uDD10 <strong>Password Strength Checker Tech Stack:</strong><br>\u2022 <strong>Vanilla JavaScript</strong> \u2014 Zero dependencies, pure JS for real-time validation<br>\u2022 <strong>DOM Manipulation</strong> \u2014 Dynamic UI updates as you type<br>\u2022 <strong>HTML5 & CSS3</strong> \u2014 Semantic markup with responsive design<br>\u2022 <strong>GitHub Pages</strong> \u2014 Deployed & live for instant access<br><br>No frameworks bloat \u2014 just fast, efficient code! \u26A1"
    },

    /* ===== SHOW ME CODE ===== */
    {
      keys: ['code', 'github', 'source', 'open source', 'show code', 'view code', 'code on github', 'repository', 'repo', 'coding style'],
      reply: "\uD83D\uDC19 <strong>All Code is Open Source!</strong><br><br>\ud83d\udeaa <a href='https://github.com/JarshinJS' target='_blank'>\ud83d\udc19 Visit GitHub \u2192</a><br><br>See Jarshin's coding style, version control practices, and all project repositories. Follow best practices like meaningful commits, clear comments, and clean code structure."
    },

    /* ===== RESUME DOWNLOAD ===== */
    {
      keys: ['resume', 'cv', 'download', 'curriculum', 'curriculum vitae', 'download resume', 'get resume', 'download cv', 'pdf'],
      reply: "\uD83D\uDCC4 <strong>Download Resume:</strong><br><br>Look for the <strong>\"Resume\"</strong> button in the hero section (top of page) with the download icon. Click it to get Jarshin's latest CV as a PDF!"
    },

    /* ===== QUICK PORTFOLIO TIPS ===== */
    {
      keys: ['tip', 'guide', 'how to', 'advice', 'suggestion', 'recommend', 'what should', 'where to', 'start here', 'first time'],
      reply: "\ud83d\udca1 <strong>Quick Tips for Exploring:</strong><br><br>\ud83c\udf50 <strong>First Time Here?</strong><br>1. Check the <strong>Hero Section</strong> \u2014 See Jarshin's animated title & download CV<br>2. Scroll through <strong>Skills</strong> \u2014 Watch the skill bars animate!<br>3. Explore <strong>Projects</strong> \u2014 Click \"Live Demo\" to see live apps<br>4. View <strong>Certifications</strong> \u2014 See credentials & achievements<br><br>\ud83d\udd0c <strong>Want More?</strong><br>\ud83d\udcf1 Contact via WhatsApp or email<br>\ud83d\udc19 Check the code on GitHub<br>\uD83c\uDCBC Connect on LinkedIn<br>\ud83d\ude4b Use this chatbot for questions!<br><br>Enjoy exploring! \ud83d\ude0a"
    },

    /* ===== PROJECT TECH STACK - PLATTER TO PURPOSE ===== */
    {
      keys: ['platter to purpose tech', 'platter tech stack', 'platter technologies', 'platter built with', 'food donation platform tech', 'p2p tech'],
      reply: "\uD83C\uDF7D\uFE0F <strong>Platter to Purpose Tech Stack:</strong><br>\u2022 <strong>Django + Python</strong> \u2014 Robust backend framework<br>\u2022 <strong>SQLite / PostgreSQL</strong> \u2014 Relational database for storing users & donations<br>\u2022 <strong>Django REST Framework</strong> \u2014 RESTful API design<br>\u2022 <strong>HTML/CSS + Bootstrap</strong> \u2014 Responsive frontend<br>\u2022 <strong>Render</strong> \u2014 Deployed & live on the cloud<br><br>Full-stack impact solving real social problems! \uD83C\uDF10"
    },

    /* ===== PROJECT TECH STACK - PORTFOLIO ===== */
    {
      keys: ['portfolio tech', 'portfolio stack', 'portfolio built with', 'portfolio technologies', 'portfolio how made'],
      reply: "\uD83D\uDCC1 <strong>This Portfolio's Tech Stack:</strong><br>\u2022 <strong>HTML5</strong> \u2014 Semantic, accessible structure<br>\u2022 <strong>CSS3</strong> \u2014 Custom styling with animations & gradients<br>\u2022 <strong>Vanilla JavaScript</strong> \u2014 Typing effect, skill counters, dark mode, AI chatbot<br>\u2022 <strong>Bootstrap 5</strong> \u2014 Responsive grid & components<br>\u2022 <strong>AOS (Animate On Scroll)</strong> \u2014 Smooth scroll animations<br>\u2022 <strong>Web3Forms</strong> \u2014 Contact form backend<br>\u2022 <strong>GitHub Pages</strong> \u2014 Hosting<br><br>A modern, interactive, feature-rich portfolio built from the ground up! \uD83D\uDE80"
    },

    /* ===== PORTFOLIO FEATURES ===== */
    {
      keys: ['portfolio features', 'what features does', 'features of site', 'site features', 'portfolio capabilities', 'what can i do on this site'],
      reply: "\u2728 <strong>Portfolio Features:</strong><br>\u2022 <strong>Typing Effect</strong> \u2014 Animated title text that cycles through roles<br>\u2022 <strong>Animated Skill Bars</strong> \u2014 Visual skill proficiency with counters<br>\u2022 <strong>Project Cards</strong> \u2014 Live demo & GitHub links for every project<br>\u2022 <strong>Certification Gallery</strong> \u2014 Achievement showcase with credentials<br>\u2022 <strong>Scroll Animations</strong> \u2014 Smooth AOS fade/zoom effects on scroll<br>\u2022 <strong>Dark/Light Mode</strong> \u2014 Toggle in the chatbot header<br>\u2022 <strong>Contact Form</strong> \u2014 Direct messaging via Web3Forms<br>\u2022 <strong>AI Chatbot</strong> \u2014 Me! Ask anything about Jarshin! \uD83E\uDD16<br>\u2022 <strong>Mobile Responsive</strong> \u2014 Perfect on all screen sizes<br>\u2022 <strong>Social Integration</strong> \u2014 Quick links to all profiles"
    },

    /* ===== PORTFOLIO NAVIGATION ===== */
    {
      keys: ['how to navigate', 'how to use', 'navigate portfolio', 'scroll', 'sections', 'menu', 'navbar', 'navigation', 'where is', 'find section', 'go to', 'explore portfolio'],
      reply: "\uD83D\uDDE3\uFE0F <strong>How to Explore:</strong><br><br>\uD83D\uDD17 <strong>Navbar</strong> at the top has links to all main sections:<br>\u2022 <strong>Home</strong> \u2014 Intro & typing effect<br>\u2022 <strong>About</strong> \u2014 Technical skills & proficiency bars<br>\u2022 <strong>Projects</strong> \u2014 Featured work with live links<br>\u2022 <strong>Contact</strong> \u2014 Contact form & social links<br><br>\uD83D\uDC47 Or just scroll down to explore everything!<br><br>\uD83E\uDD16 Ask me specific questions for deep dives into any section!"
    },

    /* ===== WHY FULL STACK ===== */
    {
      keys: ['why full stack', 'full stack benefits', 'advantages of full stack', 'full stack programmer', 'end to end'],
      reply: "\uD83D\uDEE0\uFE0F <strong>Why Full-Stack?</strong><br><br>Jarshin can:\u2022 Prototype complete ideas solo \u2014 no waiting for other team members<br>\u2022 Understand the full product flow \u2014 from user interface to database<br>\u2022 Optimize the entire pipeline \u2014 frontend performance + backend efficiency<br>\u2022 Ship faster \u2014 fewer handoffs, smoother communication<br>\u2022 Build truly integrated solutions \u2014 like Platter to Purpose!<br><br>Full-stack = complete control over quality & delivery! \u26A1"
    },

    /* ===== PORTFOLIO HIGHLIGHTS ===== */
    {
      keys: ['highlights', 'best part', 'standout', 'impressive', 'showcase', 'what should i see', 'what is impressive', 'most important', 'key achievements'],
      reply: "\ud83c\udf1f <strong>Portfolio Highlights:</strong><br><br>\ud83d\ude80 <strong>Platter to Purpose</strong> \u2014 A live Django app solving real-world food waste. Shows full-stack chops + social impact.<br><br>\ud83d\udd10 <strong>Password Checker</strong> \u2014 Pure JS with zero dependencies. Shows JavaScript mastery & live deployment.<br><br>\ud83e\udd16 <strong>This AI Chatbot</strong> \u2014 Built from scratch! Shows JavaScript prowess, NLP thinking, & attention to user experience.<br><br>\ud83c\udfc6 <strong>MIT Certificate</strong> \u2014 Proof of advanced technical knowledge & continuous learning commitment.<br><br>\ud83d\udcc1 <strong>The Portfolio Itself</strong> \u2014 Interactive, modern, responsive. Built with care using Bootstrap, AOS animations & custom CSS. Shows design thinking!"
    },

    /* ===== ASK ANYTHING ===== */
    {
      keys: ['ask', 'question', 'help', 'what can you', 'what can i ask', 'capabilities', 'what do you know', 'what can you help', 'what can you tell', 'anything', 'more info'],
      reply: "\ud83e\udd17 <strong>I can help with:</strong><br>\ud83d\udcbc Skills \u2014 HTML, CSS, JS, Django, Git, GitHub, Bootstrap, IoT<br>\ud83d\ude80 Projects \u2014 Password Checker, Platter to Purpose, Portfolio<br>\ud83c\udfc6 Certifications \u2014 Professional, Electra Hackathon, MIT<br>\ud83d\udcc7 Education \u2014 Computer Science, self-taught developer<br>\ud83d\udcf1 Contact \u2014 Email, WhatsApp, LinkedIn, GitHub<br>\ud83d\udcbc Hiring \u2014 Freelance, internships, full-time opportunities<br>\ud83e\uddda Portfolio Features \u2014 Navigation, tech stack, design choices<br><br>Go ahead, ask away! Or pick a suggestion button below! \ud83d\ude0a"
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
    ['reachout', 'reach out'], ['linkedinprofile', 'linkedin profile'],
    ['passwordchecker', 'password checker'], ['platterTopurpose', 'platter to purpose'],
    ['portfoliofeatures', 'portfolio features'], ['whyfulstack', 'why full stack'],
    ['projectstech', 'project tech'], ['portfoliotech', 'portfolio tech']
  ];

  function normalise(input) {
    let out = input;
    EXPANSIONS.forEach(([from, to]) => { out = out.split(from).join(to); });
    return out;
  }

  function getText(selector) {
    const el = document.querySelector(selector);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function getPortfolioData() {
    return {
      heroTitle: getText('#home h1'),
      heroDescription: getText('#home .lead-text'),
      aboutHeading: getText('#about h2'),
      aboutDescription: getText('#about .section-header p'),
      projectHeading: getText('#projects h2'),
      projectDescription: getText('#projects .section-header p'),
      certificationHeading: getText('#certifications h2'),
      certificationDescription: getText('#certifications .section-header p'),
      contactHeading: getText('#contact h2'),
      contactDescription: getText('#contact .section-header p'),
      navSections: Array.from(document.querySelectorAll('.nav-link')).map((link) => link.textContent.trim()).filter(Boolean),
      skills: Array.from(document.querySelectorAll('#about .skill-card h6')).map((item) => {
        const raw = item.textContent.replace(/\s+/g, ' ').trim();
        const match = raw.match(/^(.*?)(\d+)%$/);
        return { name: match ? match[1].trim() : raw, level: match ? `${match[2]}%` : '' };
      }),
      projects: Array.from(document.querySelectorAll('#projects .project-card')).map((card) => ({
        title: card.querySelector('h5')?.textContent.trim() || '',
        description: card.querySelector('p')?.textContent.replace(/\s+/g, ' ').trim() || '',
        links: Array.from(card.querySelectorAll('a')).map((link) => ({
          label: link.textContent.replace(/\s+/g, ' ').trim(),
          href: link.getAttribute('href') || '#'
        }))
      })),
      certifications: Array.from(document.querySelectorAll('#certifications .project-card')).map((card) => ({
        title: card.querySelector('h5')?.textContent.trim() || '',
        description: card.querySelector('p')?.textContent.replace(/\s+/g, ' ').trim() || '',
        credential: card.querySelector('a')?.getAttribute('href') || '#'
      })),
      resumeHref: document.querySelector('a[download]')?.getAttribute('href') || 'Jarshin Resume.pdf'
    };
  }

  const PORTFOLIO = getPortfolioData();
  let lastTopic = null;

  function extractTerms(input) {
    return normalise(input.toLowerCase())
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  function scoreTextMatch(query, candidate) {
    const haystack = normalise(candidate.toLowerCase());
    return extractTerms(query).reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
  }

  function formatLinks(links) {
    return links
      .filter((link) => link.href && link.href !== '#')
      .map((link) => `<a href='${link.href}' target='_blank'>${link.label}</a>`)
      .join(' · ');
  }

  function formatProject(project) {
    const links = formatLinks(project.links);
    return `<strong>${project.title}</strong><br>${project.description}${links ? `<br>${links}` : ''}`;
  }

  function getSmartPortfolioReply(text) {
    const query = normalise(text.toLowerCase().trim());

    if (/(all projects|list projects|show projects|what projects|featured projects)/.test(query)) {
      lastTopic = 'projects';
      return `\uD83D\uDE80 <strong>${PORTFOLIO.projectHeading || 'Featured Projects'}</strong><br>${PORTFOLIO.projectDescription}<br><br>${PORTFOLIO.projects.map(formatProject).join('<br><br>')}`;
    }

    if (/(all certifications|list certifications|what certifications|achievements|credentials)/.test(query)) {
      lastTopic = 'certifications';
      return `\uD83C\uDFC6 <strong>${PORTFOLIO.certificationHeading || 'Certifications'}</strong><br>${PORTFOLIO.certifications.map((cert) => `• <strong>${cert.title}</strong> — ${cert.description}`).join('<br>')}`;
    }

    if (/(all skills|list skills|technical skills|skills|expertise|tech stack|tools)/.test(query)) {
      lastTopic = 'skills';
      return `\uD83D\uDEE0\uFE0F <strong>${PORTFOLIO.aboutHeading || 'Technical Expertise'}</strong><br>${PORTFOLIO.aboutDescription}<br><br>${PORTFOLIO.skills.map((skill) => `• ${skill.name}${skill.level ? ` — ${skill.level}` : ''}`).join('<br>')}`;
    }

    if (/(about|introduction|intro|summary|profile|who is jarshin|tell me about jarshin)/.test(query)) {
      lastTopic = 'about';
      return `<strong>${PORTFOLIO.heroTitle}</strong><br>${PORTFOLIO.heroDescription}`;
    }

    if (/(contact|reach|email|mail|phone|whatsapp|linkedin|github|social)/.test(query)) {
      lastTopic = 'contact';
      return `\uD83D\uDCEC <strong>${PORTFOLIO.contactHeading || 'Get In Touch'}</strong><br>${PORTFOLIO.contactDescription}<br><br>\uD83D\uDCF1 <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a><br>\uD83D\uDCE7 <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a><br>\uD83D\uDCBC <a href='https://www.linkedin.com/in/jarshinjs/' target='_blank'>LinkedIn</a><br>\uD83D\uDCBB <a href='https://github.com/JarshinJS' target='_blank'>GitHub</a>`;
    }

    if (/(resume|cv)/.test(query)) {
      lastTopic = 'resume';
      return `\uD83D\uDCC4 Jarshin's resume is available from the hero section. <a href='${PORTFOLIO.resumeHref}' download>Download Resume</a>`;
    }

    if (/(navigate|navigation|sections|menu|where can i find|where is)/.test(query)) {
      lastTopic = 'navigation';
      return `\uD83D\uDDD2\uFE0F <strong>Portfolio sections</strong><br>${PORTFOLIO.navSections.map((item) => `• ${item}`).join('<br>')}`;
    }

    const projectScores = PORTFOLIO.projects.map((project) => ({
      project,
      score: scoreTextMatch(query, `${project.title} ${project.description}`)
    })).sort((a, b) => b.score - a.score);

    if (projectScores[0] && projectScores[0].score > 0) {
      lastTopic = 'project';
      return `\uD83D\uDCC1 ${formatProject(projectScores[0].project)}`;
    }

    const certificationScores = PORTFOLIO.certifications.map((cert) => ({
      cert,
      score: scoreTextMatch(query, `${cert.title} ${cert.description}`)
    })).sort((a, b) => b.score - a.score);

    if (certificationScores[0] && certificationScores[0].score > 0) {
      lastTopic = 'certification';
      return `\uD83C\uDFC6 <strong>${certificationScores[0].cert.title}</strong><br>${certificationScores[0].cert.description}${certificationScores[0].cert.credential !== '#' ? `<br><a href='${certificationScores[0].cert.credential}' target='_blank'>View Credential</a>` : ''}`;
    }

    const skillScores = PORTFOLIO.skills.map((skill) => ({
      skill,
      score: scoreTextMatch(query, `${skill.name} ${PORTFOLIO.aboutDescription}`)
    })).sort((a, b) => b.score - a.score);

    if (skillScores[0] && skillScores[0].score > 0) {
      lastTopic = 'skill';
      return `\uD83D\uDEE0\uFE0F <strong>${skillScores[0].skill.name}</strong>${skillScores[0].skill.level ? ` — ${skillScores[0].skill.level}` : ''}<br>${PORTFOLIO.aboutDescription}`;
    }

    if (/(this|that|it|more|details|explain further|tell me more)/.test(query) && lastTopic) {
      if (lastTopic === 'projects' || lastTopic === 'project') {
        return `Jarshin's portfolio highlights ${PORTFOLIO.projects.length} main projects: ${PORTFOLIO.projects.map((project) => project.title).join(', ')}. Ask for any one by name for more detail.`;
      }
      if (lastTopic === 'certifications' || lastTopic === 'certification') {
        return `The portfolio currently shows ${PORTFOLIO.certifications.length} certifications: ${PORTFOLIO.certifications.map((cert) => cert.title).join(', ')}.`;
      }
      if (lastTopic === 'skills' || lastTopic === 'skill') {
        return `The visible skill ratings are ${PORTFOLIO.skills.map((skill) => `${skill.name} ${skill.level}`).join(', ')}.`;
      }
      if (lastTopic === 'contact') {
        return `The fastest ways to reach Jarshin are WhatsApp at <a href='https://wa.me/919345511293' target='_blank'>+91 93455 11293</a> and email at <a href='mailto:jarshin07@gmail.com'>jarshin07@gmail.com</a>.`;
      }
    }

    const snippets = [
      PORTFOLIO.heroDescription,
      PORTFOLIO.aboutDescription,
      PORTFOLIO.projectDescription,
      PORTFOLIO.certificationDescription,
      PORTFOLIO.contactDescription,
      ...PORTFOLIO.projects.map((project) => `${project.title} ${project.description}`),
      ...PORTFOLIO.certifications.map((cert) => `${cert.title} ${cert.description}`)
    ];

    const related = snippets
      .map((snippet) => ({ snippet, score: scoreTextMatch(query, snippet) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (related.length) {
      return `Here’s what I found in the portfolio:<br><br>${related.map((item) => `• ${item.snippet}`).join('<br>')}`;
    }

    return `I can answer questions about everything on this portfolio: <strong>about</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>certifications</strong>, <strong>resume</strong>, <strong>contact</strong>, and <strong>social links</strong>. Try asking “Tell me about Platter to Purpose”, “What certifications does Jarshin have?”, or “How can I contact him?”`;
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

    if (bestEntry && bestScore > 0) {
      if (/(project|work|built|made|created|developed|application|app)/.test(lower)) lastTopic = 'projects';
      else if (/(certification|certificate|credential|achievement|award)/.test(lower)) lastTopic = 'certifications';
      else if (/(skill|skills|tech|technology|stack|toolkit|expertise|proficiency)/.test(lower)) lastTopic = 'skills';
      else if (/(contact|phone|email|linkedin|github|social|whatsapp)/.test(lower)) lastTopic = 'contact';
      else if (/(about|introduce|yourself|tell me about|describe)/.test(lower)) lastTopic = 'about';
      return bestEntry.reply;
    }

    return getSmartPortfolioReply(text);
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
        appendMsg("\uD83D\uDC4B Hi! I'm <strong>Jarshin's AI assistant</strong>. I can answer detailed questions about this portfolio, including Jarshin's background, skills, projects, certifications, resume, contact details, and social links.", 'bot');
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
