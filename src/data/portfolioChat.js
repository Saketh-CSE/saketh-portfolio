import { careerPreferences } from './careerPreferences.js';
import { certifications, education, profile, projects, skillGroups, socialLinks } from './portfolio.js';

const link = (label, href) => ({ label, href });
const text = (value) => ({ text: value });

const topics = [
  { id: 'attendance', pattern: /attendance|facial recognition|face recognition|eye.?blink|liveness|geolocation|location.?based/i, projectTitle: 'Smart Attendance System' },
  { id: 'andhra', pattern: /discover andhra|andhra pradesh|tourism|districts|heritage/i, projectTitle: 'Discover Andhra Pradesh' },
  { id: 'restaurant', pattern: /restaurant|landing page|menu|reservation/i, projectTitle: 'Restaurant Landing Page' },
];

const findTopic = (question) => topics.find(({ pattern }) => pattern.test(question));
const projectForTopic = (topic) => projects.find(({ title }) => title === topic?.projectTitle);
const isBroadProjectQuestion = (query) => /\b(projects?|portfolio work|what (?:has|did|does) (?:saketh|he) (?:built|developed|worked on|made)|what did he develop|what has saketh worked on|tell me about (?:his|saketh'?s) work|what has saketh built|what did saketh (?:build|develop)|what did he build)\b/i.test(query);
const hasUnknownCareerDetail = /\b(current salary|minimum salary|minimum stipend|notice period|salary breakdown|benefits|internship duration|preferred city|relocat|visa|work authorization|travel|office attendance|schedule|academic constraints|already applied|applied to|exact joining date|contract(?:or)?|freelance|part.time)\b/i;
const hasUnverifiedExperience = /\b(?:has|does|did) (?:he|saketh) (?:ever )?(?:(?:have|had|do|done) )?(?:any )?(?:an? )?(?:internships?|interned|professional experience|job experience|work experience)|worked at|previous employer|years of experience|how experienced|proficiency level/i;

function topicFromHistory(history) {
  const userQuestions = [...history].reverse()
    .filter((message) => message.role === 'user' && typeof message.content === 'string');
  for (const message of userQuestions) {
    const topic = findTopic(message.content);
    if (topic) return topic;
    if (isBroadProjectQuestion(message.content) || /\b(skills?|education|university|degree|certifications?|contact|email|background|who is|career|salary|stipend|roles?|work mode|availability)\b/i.test(message.content)) return undefined;
  }
  return undefined;
}

function projectLinks(project) {
  const links = [];
  if (project.liveUrl) links.push(link('Live site', project.liveUrl));
  if (project.repositoryUrl) links.push(link('GitHub repository', project.repositoryUrl));
  return links;
}

function projectOverview() {
  const response = [text('Saketh has three featured projects: ')];
  projects.forEach((project, index) => {
    response.push(link(project.title, project.liveUrl ?? project.repositoryUrl));
    response.push(text(` — ${project.description} It uses ${project.technologies.join(', ')}.${index === projects.length - 1 ? '' : ' '} `));
  });
  response.push(link('Browse all projects', '/#projects'));
  return response;
}

function projectDescription(project) {
  return [text(`${project.description} The documented technologies are ${project.technologies.join(', ')}.`), ...projectLinks(project)];
}

function projectStack(project) {
  return [text(`For ${project.title}, the listed technologies are ${project.technologies.join(', ')}.`), ...projectLinks(project)];
}

function portfolioHomeHref() {
  if (typeof window === 'undefined') return profile.homePath;
  const { hostname, origin, pathname } = window.location;
  if (/^(localhost|127(?:\.\d{1,3}){3}|\[::1\])$/i.test(hostname)) return profile.homePath;
  return `${origin}${pathname}`;
}

function careerContextFromHistory(history) {
  const userQuestions = [...history].reverse()
    .filter((message) => message.role === 'user' && typeof message.content === 'string');
  for (const { content } of userQuestions) {
    const lower = content.toLowerCase();
    if (/\b(stipend|internship pay|internship salary)\b/.test(lower)) return 'stipend';
    if (/\b(ctc|salary|compensation|package|pay expectation|expected pay)\b/.test(lower)) return 'ctc';
    if (/\b(role|roles|career|position|looking for|seeking)\b/.test(lower)) return 'roles';
    if (/\b(remote|hybrid|on.site|work mode|work model)\b/.test(lower)) return 'work-mode';
    if (/\b(internship|full.time|opportunity types|job type)\b/.test(lower)) return 'opportunity-types';
    if (findTopic(content) || isBroadProjectQuestion(content) || /\b(skill|education|university|degree|certification|contact|email|background)\b/.test(lower)) return undefined;
  }
  return undefined;
}

function roleAnswer() {
  return [text(`He’s looking for roles such as ${careerPreferences.preferredRoles.join(', ')}. These are preferences; the portfolio doesn’t claim the same experience level in each area.`)];
}

function careerReply(lower, context) {
  if (/\b(current salary|minimum salary|salary breakdown|benefits|notice period|relocat|visa|work authorization|travel|preferred city|office attendance|internship duration|stipend flexibility|stipend negotiable|already applied|applied to)\b/i.test(lower)) {
    if (/salary|stipend/.test(lower) && /negotiab|flexib/.test(lower)) {
      return [text(/stipend/.test(lower)
        ? 'The stated internship stipend expectation is ₹15,000 per month. Whether it’s negotiable isn’t documented.'
        : `The full-time CTC expectation is ${careerPreferences.expectedFullTimeCtc.amount}, ${careerPreferences.expectedFullTimeCtc.negotiationTerms}.` )];
    }
    return [text('That preference isn’t listed in the portfolio, so I can’t confirm it.')];
  }

  if (/\b(eligib\w*|qualif\w*|academic constraints|specific opening|particular role)\b/i.test(lower)) {
    return [text('Joining availability is immediate if eligible. Eligibility depends on the employer’s requirements and Saketh’s circumstances, which aren’t detailed here.')];
  }

  if (context === 'roles' && /\b(those|them|these|all of them|all those|all of those)\b/i.test(lower)) {
    return [text(`Yes, those are the roles Saketh is looking for. That preference doesn’t establish the same experience level in each one.`)];
  }
  if (context === 'opportunity-types' && /\b(both|either|those|them|all of them)\b/i.test(lower)) {
    return [text(`Yes, he’s open to both ${careerPreferences.opportunityTypes.join(' and ')}.`)];
  }
  if (context === 'work-mode' && /\b(all|any|those|them|either|both)\b/i.test(lower)) {
    return [text(`Yes, remote, hybrid, and on-site opportunities are all acceptable.`)];
  }

  const interestedRoles = careerPreferences.preferredRoles.filter((role) => lower.includes(role.toLowerCase())
    || (role === 'Frontend Developer' && /front.?end/.test(lower))
    || (role === 'React Developer' && /\breact\b/.test(lower))
    || (role === 'Python Developer' && /\bpython\b/.test(lower))
    || (role === 'AI/ML Intern' && /ai.?ml|machine learning/.test(lower))
    || (role === 'Full-Stack Developer' && /full.?stack/.test(lower)));
  if (interestedRoles.length && /open|interested|opportun|consider/.test(lower)) {
    return [text(interestedRoles.length === 1
      ? `Yes, ${interestedRoles[0]} is one of his preferred roles.`
      : `Yes, he’s looking at roles such as ${interestedRoles.join(', ')}. That preference doesn’t establish the same experience level in each one.`)];
  }

  if (/\b(negotiab|negotiat|flexib)\w*\b/i.test(lower) && context === 'stipend') {
    return [text(`The stated internship stipend expectation is ${careerPreferences.expectedInternshipStipend.amount}. Whether it’s negotiable isn’t documented.`)];
  }
  if (/\b(negotiab|negotiat|flexib)\w*\b/i.test(lower) && context === 'ctc') {
    return [text(`Expected full-time CTC: ${careerPreferences.expectedFullTimeCtc.amount}, negotiable ${careerPreferences.expectedFullTimeCtc.negotiationTerms}.`)];
  }
  if (/\b(how much|what amount|what is the amount)\b/i.test(lower) && context === 'stipend') {
    return [text(`Expected stipend: ${careerPreferences.expectedInternshipStipend.amount}.`)];
  }
  if (/\b(how much|what amount|what is the amount)\b/i.test(lower) && context === 'ctc') {
    return [text(`Expected full-time CTC: ${careerPreferences.expectedFullTimeCtc.amount}, negotiable ${careerPreferences.expectedFullTimeCtc.negotiationTerms}.`)];
  }

  if (/\b(ctc|salary|compensation|package|pay expectation|expected pay)\b/i.test(lower)) {
    return [text(`Expected full-time CTC: ${careerPreferences.expectedFullTimeCtc.amount}, negotiable ${careerPreferences.expectedFullTimeCtc.negotiationTerms}.`)];
  }

  if (/\b(stipend|internship pay|internship salary)\b/i.test(lower)) {
    return [text(`Expected stipend: ${careerPreferences.expectedInternshipStipend.amount}.${/negotiab|flexib/.test(lower) ? ' Whether it’s negotiable isn’t documented.' : ''}`)];
  }

  if (/\b(join|joining|start date|available|availability|when can he start)\b/i.test(lower)) {
    return [text(`Available to join ${careerPreferences.joiningAvailability.timing}, subject to eligibility.`)];
  }

  if (/\b(remote|hybrid|on.site|work mode|work model|location preference|where does he want to work|open to (?:working|work))\b/i.test(lower)) {
    return [text(`Remote, hybrid, and on-site opportunities are all acceptable. The portfolio doesn’t list a preferred city or relocation preference.`)];
  }

  if (/\b(internship|internships|full.time|opportunity types|job type|employment type)\b/i.test(lower)) {
    return [text(`He’s open to ${careerPreferences.opportunityTypes.join(' and ')}.`)];
  }

  if (/\b(role|roles|job|career|position|frontend|front.end|software developer|react developer|full.stack|python developer|ai.?ml|looking for|seeking)\b/i.test(lower)) {
    return roleAnswer();
  }

  if (/\bopen to work|looking for work|job search|career preference|career preferences|what is he looking for\b/i.test(lower)) {
    return [text(`He’s open to ${careerPreferences.opportunityTypes.join(' and ')} in roles like ${careerPreferences.preferredRoles.join(', ')}.`)];
  }

  return null;
}

function makeReply(question, history = []) {
  const turn = history.filter((message) => message.role === 'assistant').length;
  const query = question.trim();
  const lower = query.toLowerCase();

  if (/\b(who am i talking to|are you saketh|are you the real saketh|are you a person|who are you)\b/i.test(lower)) {
    return [text('I’m Saketh’s AI assistant, not Saketh himself. I can help explain his projects, skills, career preferences, and background.')];
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b[!. ]*$/i.test(query)) {
    return [text(turn % 2 === 0
      ? 'Hey! I’m Saketh’s AI assistant. Ask me about his projects, skills, or the roles he’s looking for.'
      : 'Hey, what would you like to know about Saketh’s work?')];
  }
  if (/\b(thanks|thank you|thx)\b/i.test(lower)) return [text('You’re welcome!')];

  if (hasUnverifiedExperience.test(lower)) {
    return [text('I don’t see prior internship or professional experience documented in the portfolio, so I can’t confirm that.')];
  }
  if (hasUnknownCareerDetail.test(lower)) {
    return [text('That detail isn’t documented in the portfolio, so I can’t confirm it.')];
  }

  const careerAnswer = careerReply(lower, careerContextFromHistory(history));
  if (careerAnswer) return careerAnswer;

  if (/\b(what is his location|where is he based|location|where does he live|where is saketh)\b/i.test(lower)) {
    return [text(`The portfolio lists his location as ${profile.location}. It doesn’t give a more precise address.`)];
  }
  if (/\b(where does he want to (?:work|live)|preferred city|where is he willing to relocate|relocation preference)\b/i.test(lower)) {
    return [text('A preferred work city or relocation preference isn’t listed in the portfolio.')];
  }

  const currentTopic = findTopic(query);
  const contextTopic = currentTopic ?? topicFromHistory(history);
  const project = projectForTopic(contextTopic);

  if (/\b(complete|finished|launched|production|users|customers|accuracy|results|impact|statistics)\b/i.test(lower)) {
    return [text(`I can describe the features listed for ${project?.title ?? 'the projects'}, but the portfolio doesn’t document ${/complete|finished/.test(lower) ? 'whether this project is complete' : 'that result'}.`)];
  }

  if (/\b(which|what) project (?:is )?(?:the )?most technical\b|\bmost technical project\b/i.test(lower)) {
    const attendance = projects.find(({ title }) => title === 'Smart Attendance System');
    return [text(`Based on the listed technologies and features, the Smart Attendance System looks like the most technically involved: it combines ${attendance.technologies.join(', ')} with face recognition, eye-blink checks, and geolocation access control.`), ...projectLinks(attendance)];
  }

  if (/\b(why|how come)\b/i.test(lower) && /react/.test(lower)) {
    return [text('Mainly, React makes it easier to build a UI from reusable pieces. This portfolio uses components for its sections and chatbot.')];
  }
  if (/\b(why|how come)\b/i.test(lower) && project) {
    return [text(`The portfolio describes ${project.title} this way: ${project.description} It doesn’t give a specific reason for each design choice, so I don’t want to guess.`)];
  }
  if (/\b(interesting|looks cool|nice project|impressive)\b/i.test(lower) && project) {
    return [text(`Yeah, the main idea is ${project.description.toLowerCase()} Want to know about its stack or a specific feature?`)];
  }

  if (/\b(where can i see|show me|link to|open|visit|github|repository|live site|demo)\b/i.test(lower) && project) {
    return [text(`Here’s ${project.title}:`), ...projectLinks(project)];
  }
  if (/\b(technolog\w*|tech stack|stack|framework|database|what (?:did|does) (?:he|saketh) use|what did he build it with)\b/i.test(lower) && project) {
    return projectStack(project);
  }
  if (currentTopic) return projectDescription(project);
  if (isBroadProjectQuestion(query)) return projectOverview();
  if (/\b(project|it|its|that|this)\b|\b(tell me more|and the features)\b/i.test(lower) && /(technolog|stack|link|see|show|work|feature|how does|what did he use|more)/i.test(lower)) {
    if (project) {
      if (/link|see|show/.test(lower)) return [text(`Here’s ${project.title}:`), ...projectLinks(project)];
      if (/feature|how does|how it work|what does it do|tell me more|work\b/i.test(lower)) return projectDescription(project);
      return projectStack(project);
    }
    return [text('Which project do you mean: Discover Andhra Pradesh, Smart Attendance System, or Restaurant Landing Page?')];
  }

  if (/help me with python|teach me python|learn python/i.test(lower)) {
    return [text('I can talk about where Python appears in Saketh’s work, but I’m not set up as a general Python tutor. Want to know how it’s used in his attendance project?')];
  }

  if (/\b(skill|skills|language|tools|python|react|database|cloud|technolog\w*)\b/i.test(lower)) {
    const skills = skillGroups.map(({ title, skills: items }) => `${title}: ${items.join(', ')}`).join('. ');
    return [text(`The portfolio lists these skills: ${skills}.`), link('See the skills section', '/#skills')];
  }
  if (/\b(education|university|degree|college|study|studying|gpa|grade)\b/i.test(lower)) {
    return [text(`Saketh is studying for a ${education.degree} at ${education.institution} (${education.dates}).`), link('See education', '/#education')];
  }
  if (/\b(certif|certificate|nptel|english test|aws certified|course|learning)\b/i.test(lower)) {
    const names = certifications.map(({ name }) => name).join(', ');
    return [text(`The portfolio lists ${names}. Some dates aren’t specified.`), link('See certifications', '/#certifications')];
  }
  if (/\b(contact|email|reach|linkedin|github|resume|hire|connect)\b/i.test(lower)) {
    const github = socialLinks.find(({ label }) => label === 'GitHub');
    const linkedin = socialLinks.find(({ label }) => label === 'LinkedIn');
    return [text('You can email Saketh at '), link(profile.email, `mailto:${profile.email}`), text(', or find him on '), link(github.label, github.href), text(' and '), link(linkedin.label, linkedin.href), text('.'), link('Go to contact', '/#contact')];
  }
  if (/\b(who|about|background|introduc|saketha|person|what do you do|what does he do)\b/i.test(lower)) {
    return [text(`Bhimavarapu Saketha Ram is a computer science undergraduate at ${education.institution}. He’s interested in ${profile.interests.join(', ')}.`), link('Read the about section', '/#about')];
  }
  if (/\b(joke|weather|recipe|capital of|write me|solve this)\b/i.test(lower)) {
    return [text('I’m focused on Saketh’s portfolio, so I can’t help much with that one. Want to hear about a project, a skill, or the roles he’s looking for?')];
  }
  if (/\b(portfolio (?:url|website|link)|website url|site url|personal website)\b/i.test(lower)) {
    return [text('You’re already on Saketh’s portfolio. Here’s the home page: '), link('Portfolio home', portfolioHomeHref())];
  }
  if (/\b(help|can you|what can you)\b/i.test(lower)) {
    return [text('I can explain Saketh’s projects, skills, education, or career preferences. What are you curious about?')];
  }

  return [text('I don’t have that detail in the portfolio. I can help with Saketh’s projects, skills, education, or career preferences, though.')];
}

export function getPortfolioReply(question, history = []) {
  return makeReply(question, history);
}

export function replyToText(reply) {
  return reply.map((part) => part.href ? ` ${part.label}` : part.text).join('');
}
