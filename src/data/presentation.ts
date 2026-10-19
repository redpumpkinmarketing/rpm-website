// Explicit editorial instructions embedded in otherwise visible source paragraphs.
// Preserve the supplied master unchanged; remove only these production directions.
const internalNotes = [
  ' This establishes engagement scope, not a verified campaign-performance result.',
  ' That engagement is not an initial published portfolio case study; it is referenced here only as unlinked experience. No booking increases, lead counts, ROAS or campaign outcomes are claimed.',
  'Be truthful about authors: Use a verified author or Red Pumpkin Marketing attribution, never fabricated experts.',
  '; no donor portal, volunteer system, seed inventory or specialised dashboard is claimed',
  'Individual internal modules must be described only when verified in the final client build. ',
  'These examples evidence web-based/internal systems; they must not be described as launched Android or iOS applications.',
  '; exact current functions must be verified before screen-caption claims',
  ' Staff roles, admissions modules, follow-up tools or automations must only be detailed after functional evidence and permission are reviewed.',
  ' The nature and results of community or conservation activity must not be presented as software outcomes produced by RPM.',
  ' This is evidence of a communications relationship, not a standalone published advertising-campaign case study.',
  'For campaign-specific artwork, publish only actual client-authorised assets once available. Do not fill a creative gallery with speculative client projects or fake outcomes.',
  '; no claim of named publications or earned-media results',
  ' This is the claim: delivered scope and an ongoing support relationship.',
  ' We do not claim increases in reputation, reach, revenue, search visibility or PR placements without verified evidence.',
  ' We do not claim sales increases, time savings, automation between contact form and CRM or service capacity figures without independent confirmation.',
  ' We do not claim enquiry conversion, admission success, reduced staff workloads or business growth without approved evidence.',
  ', not an assertion that every website enquiry automatically becomes a quotation',
  'Each project has its own context; no revenue, traffic, placement or other unverified outcomes are implied. ',
  ' The case study does not present unverified donor tools, inventories or specialised dashboards.',
  '; no public app-store release is claimed as existing portfolio evidence',
  'We do not use unverified public app-store launches as portfolio claims. ',
  ', with no unverified infrastructure or certification claims',
  ' The case study tells the confirmed project story without assigning unverified modules or measured business effects to the software.',
  ' We do not invent fundraising success, conservation numbers or technical features for this case.',
];
export function visibleCopy(line: string) {
  return internalNotes.reduce((copy, note) => copy.replace(note, ''), line).replace(/^Signature:\s*/, '').trim();
}
export function labeledCopy(line: string) {
  return line.match(/^\d{2}\s*—\s*([^\.]+)\.\s*(.+)$/s) ?? line.match(/^([^:]{2,90}):\s*(.+)$/s);
}
export function primaryAction(lines: string[], route: string) {
  const source = lines.find(line => line.startsWith('Primary CTA: '));
  const local = source?.match(/^Primary CTA: (.+?)\s*[↗↓↑]\s*→\s*(\/[^\s]+)/);
  if (local) return { label: local[1], href: local[2].replace(/\.$/, '') };
  if (route === '/contact') return { label: 'Start the Conversation', href: '#enquiry' };
  if (route === '/work') return { label: 'Explore the Projects', href: '#projects' };
  if (route.startsWith('/work/')) return { label: 'Explore the Project', href: '#chapter-1' };
  if (route === '/insights') return { label: 'Explore the Thinking', href: '#reading-room' };
  return { label: 'Start a Project', href: '/contact' };
}

export function sectionPresentation(section: {label:string;lines:string[]}) {
 const excluded=/^(Visual direction:|Publication |Project overview:|External client site:|Footer:|Use the Global Footer|INTERNAL|NEXT PROJECT:|END-OF-COLLECTION|Headline:|When articles|Published state|No published feature|Filter:|Filters:|Clear action:|Result label:|No-results |Search |Sort:|Count:|Article card:|Pagination:|No search results:|Empty category:|No published articles|FORM |FIELD |Label:|Input:|Options:|Placeholder|Help text:|Default:|Visible only|Group [ABCD] \/|Alternative,|SUBMIT:|Loading:|Under-button|Form title:|Checkbox label:|Link:|Microcopy:)/;
 const lines=section.lines.map(visibleCopy).flatMap(l=>(l.match(/→/g)||[]).length>1?l.split(/;\s+|\.\s+(?=[A-Z])/):[l]).filter(l=>l&&!excluded.test(l));
 const faq=/FAQ/i.test(section.label);
 const heading=section.label.includes('RELATED SERVICES')?'Related services':faq?lines.find(l=>!l.startsWith('Eyebrow:')&&!l.includes('?'))??'A few useful answers.':lines.find(l=>!l.startsWith('Eyebrow:'))??section.label;
 return {heading,faq,eyebrow:lines.find(l=>l.startsWith('Eyebrow: '))?.replace('Eyebrow: ','')??section.label,body:lines.filter(l=>!l.startsWith('Eyebrow:')&&l!==heading)};
}
