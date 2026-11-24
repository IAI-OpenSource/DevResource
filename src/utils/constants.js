// Central place for every "allowed value" in the project.
// If the club ever needs a new category, this is the ONLY file to change
// (and the README list should be updated too).

export const CATEGORIES = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Mobile Development',
  'Desktop Development',
  'Database',
  'DevOps & Cloud',
  'Cybersecurity',
  'Networking',
  'AI & Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Development Tools',
  'Version Control',
  'Learning Resources',
  'Operating Systems',
];

export const TRACKS = ['ASR', 'GLSI'];

export const TRACK_LABELS = {
  ASR: 'Administration et Sécurité des Réseaux',
  GLSI: "Génie Logiciel et Systèmes d'Information",
};

// Properties every resource JSON file must contain.
export const REQUIRED_FIELDS = [
  'id',
  'name',
  'description',
  'categories',
  'track',
  'addedBy',
  'url',
  'imageUrl',
];

// Optional properties.
export const OPTIONAL_FIELDS = ['addedAt'];

export const SORT_OPTIONS = {
  newest: 'Newest first',
  'name-asc': 'Name (A–Z)',
  'name-desc': 'Name (Z–A)',
  contributor: 'Contributor (A–Z)',
};

export const DEFAULT_SORT = 'newest';
