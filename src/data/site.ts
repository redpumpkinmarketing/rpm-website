import rawPages from './pages.json';
export const pages = rawPages.map(p => ({ ...p, route: p.name === 'INSIGHTS' ? '/insights' : p.route }));
export const navigation = [['Work','/work'],['Services','/services'],['About','/about'],['Insights','/insights']];
export const services = [
  { name: 'Brand Strategy & Identity', slug: 'branding', group: 0 },
  { name: 'Marketing Strategy & Consulting', slug: 'marketing-strategy', group: 0 },
  { name: 'Website Design & Development', slug: 'website-development', group: 1 },
  { name: 'App Development & Digital Products', slug: 'app-development', group: 1 },
  { name: 'Performance Advertising', slug: 'performance-marketing', group: 2 },
  { name: 'Social Media & Content', slug: 'social-media', group: 2 },
  { name: 'Creative Campaigns & Advertising Concepts', slug: 'creative-campaigns', group: 2 },
];
export const groups = [
  { name: 'Strategy & Brand', id: 'strategy-brand', description: 'Give the business a recognisable identity and a practical direction.' },
  { name: 'Digital & Technology', id: 'digital-technology', description: 'Build clear customer experiences and useful digital tools.' },
  { name: 'Marketing, Media & Creativity', id: 'marketing-creativity', description: 'Create communication worth noticing, then give it a thoughtful place to reach people.' },
];
const home = pages[0].sections;
export const projects = [
  { name: 'ETPRA Group', slug: 'etpra-group', industry: 'Corporate & Infrastructure', expertise: ['Website Development','Social Media & PR'] },
  { name: "Hill's Polymers", slug: 'hills-polymers', industry: 'Manufacturing & B2B', expertise: ['Website Development','CRM & Backend'] },
  { name: 'India Career Counseling', slug: 'india-career-counseling', industry: 'Education', expertise: ['Website Development','CRM & Backend','Branding & Marketing'] },
  { name: 'Loka Samabaya Pratisthan', slug: 'loka-samabaya-pratisthan', industry: 'Social Impact', expertise: ['Website Development','CRM & Backend'] },
].map((p,i) => {const lines = home[1].lines; const at = lines.findIndex(l => l.startsWith('Card headline:')) + i*4; return {...p, headline: lines[at].replace('Card headline: ',''), description: lines[at+1]};});
export const homepage = home.map(s => ({...s, eyebrow:s.lines[0].replace('Eyebrow: ',''), heading:s.lines[1]}));

// Replace with RPM's real WhatsApp number: country code + number, digits only.
// This placeholder never opens a chat with an invented number.
export const whatsappNumber = 'YOUR_WHATSAPP_NUMBER';
export const whatsappHref = /^\d{7,15}$/.test(whatsappNumber) ? `https://wa.me/${whatsappNumber}` : '/contact?channel=whatsapp-unconfigured#enquiry';

// Set only an approved RPM email address here.
export const contactEmail = '';
export const emailHref = contactEmail.includes('@') ? `mailto:${contactEmail}` : '/contact?channel=email-unconfigured#enquiry';

// Contact and conversion settings. Empty values stay visibly unconfigured.
export const contactCity = '';
export const FORM_ENDPOINT = '';
// Web3Forms requires its public access key as well as https://api.web3forms.com/submit.
export const WEB3FORMS_ACCESS_KEY = '';
export const socialLinks = { Instagram: '', LinkedIn: '', Facebook: '' };
