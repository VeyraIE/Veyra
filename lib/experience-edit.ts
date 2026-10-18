export const categories = [
  { slug: 'all', label: 'All experiences' },
  { slug: 'wellness', label: 'Wellness & reset' },
  { slug: 'adventure', label: 'Outdoors & adventure' },
  { slug: 'fitness', label: 'Movement & sport' },
  { slug: 'learning', label: 'Arts & culture' },
  { slug: 'family', label: 'Time together' },
] as const

export const experiences = [
  { slug: 'atlantic-surf', title: 'A little Atlantic perspective.', category: 'adventure', county: 'Donegal', image: 'exp-surf', tag: 'Out of the ordinary', duration: 'Half a day', description: 'Trade the everyday for salt air, open water and a fresh perspective. Let us help you plan a surf experience on Ireland’s Atlantic coast.', includes: ['A session suited to your experience', 'Equipment and local guidance to be confirmed', 'Time to explore the coast afterwards'] },
  { slug: 'coastal-reset', title: 'Switch off. Dip in.', category: 'wellness', county: 'Galway', image: 'exp-coldwater', tag: 'The slower side', duration: 'A few good hours', description: 'An invigorating sea dip, a warming sauna and nowhere else to be. A coastal reset shaped around your pace.', includes: ['A coastal wellness experience', 'Sauna and sea-dip options on request', 'A plan that makes room to slow down'] },
  { slug: 'private-pilates', title: 'Make time for movement.', category: 'fitness', county: 'Dublin', image: 'exp-pilates', tag: 'Your own rhythm', duration: 'Around an hour', description: 'Find your focus with a private reformer Pilates experience. Tell us what you enjoy and we’ll help find a session that feels right.', includes: ['Private or small-group options', 'A session matched to your level', 'Studio and instructor details before booking'] },
  { slug: 'wicklow-retreat', title: 'A deeper kind of weekend.', category: 'wellness', county: 'Wicklow', image: 'exp-yoga', tag: 'A change of pace', duration: 'A day or a weekend', description: 'Breathe a little deeper in the Wicklow countryside. Bring together restorative movement, green space and time for yourself.', includes: ['Yoga and retreat options', 'Day or overnight plans on request', 'A personalised proposal before you commit'] },
  { slug: 'creative-afternoon', title: 'An afternoon well made.', category: 'learning', county: 'Dublin', image: 'learn', tag: 'Find a new favourite', duration: 'A few good hours', description: 'Get hands-on with a creative workshop. From pottery to a new craft, make something of your afternoon with local expertise.', includes: ['Creative workshop suggestions', 'Private and small-group options', 'Materials and venue confirmed in your proposal'] },
  { slug: 'family-outdoors', title: 'Less screen time. More this.', category: 'family', county: 'Wicklow', image: 'family', tag: 'Better together', duration: 'Half a day', description: 'Make space for a family adventure. We’ll help shape a day outdoors around the ages, interests and energy of your group.', includes: ['Age-appropriate activity suggestions', 'A plan around your group', 'Practical details confirmed before booking'] },
]

export function editImage(name: string) {
  return `/veyra/${name}.png`
}

export function requestLink(type = 'concierge', experience?: string) {
  const params = new URLSearchParams({ type })
  if (experience) params.set('experience', experience)
  return `/request?${params.toString()}`
}

