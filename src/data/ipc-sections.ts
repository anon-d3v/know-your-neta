



export interface IPCSection {
  section: string;
  description: string;
  isSerious: boolean;
  bnsSection?: string; 
  category: string;
}


export const ipcSections: Record<string, IPCSection> = {
  
  '34': {
    section: '34',
    description: 'Acts done by several persons in furtherance of common intention',
    isSerious: false,
    bnsSection: '3(5)',
    category: 'General Provisions',
  },
  '88': {
    section: '88',
    description: 'Act not intended to cause death, done by consent in good faith for person\'s benefit',
    isSerious: false,
    bnsSection: '26',
    category: 'General Exceptions',
  },

  
  '107': {
    section: '107',
    description: 'Abetment of a thing',
    isSerious: false,
    bnsSection: '45',
    category: 'Abetment',
  },
  '109': {
    section: '109',
    description: 'Punishment of abetment if the act abetted is committed',
    isSerious: false,
    bnsSection: '49',
    category: 'Abetment',
  },
  '114': {
    section: '114',
    description: 'Abettor present when offence is committed',
    isSerious: false,
    bnsSection: '54',
    category: 'Abetment',
  },
  '115': {
    section: '115',
    description: 'Abetment of offence punishable with death or imprisonment for life',
    isSerious: true,
    bnsSection: '55',
    category: 'Abetment',
  },
  '117': {
    section: '117',
    description: 'Abetting commission of offence by the public or by more than ten persons',
    isSerious: false,
    bnsSection: '57',
    category: 'Abetment',
  },

  
  '120A': {
    section: '120A',
    description: 'Definition of criminal conspiracy',
    isSerious: false,
    bnsSection: '61(1)',
    category: 'Criminal Conspiracy',
  },
  '120B': {
    section: '120B',
    description: 'Punishment of criminal conspiracy',
    isSerious: false, 
    bnsSection: '61(2)',
    category: 'Criminal Conspiracy',
  },

  
  '121': {
    section: '121',
    description: 'Waging or attempting to wage war against the Government of India',
    isSerious: true,
    bnsSection: '147',
    category: 'Offences Against State',
  },
  '121A': {
    section: '121A',
    description: 'Conspiracy to commit offences punishable by section 121',
    isSerious: true,
    bnsSection: '148',
    category: 'Offences Against State',
  },
  '122': {
    section: '122',
    description: 'Collecting arms with intention of waging war against Government of India',
    isSerious: true,
    bnsSection: '149',
    category: 'Offences Against State',
  },
  '124': {
    section: '124',
    description: 'Assaulting President, Governor with intent to compel or restrain exercise of lawful power',
    isSerious: true,
    bnsSection: '151',
    category: 'Offences Against State',
  },
  '124A': {
    section: '124A',
    description: 'Sedition',
    isSerious: true,
    bnsSection: '152', 
    category: 'Offences Against State',
  },

  
  '141': {
    section: '141',
    description: 'Unlawful assembly',
    isSerious: false,
    bnsSection: '189(1)',
    category: 'Public Tranquility',
  },
  '143': {
    section: '143',
    description: 'Punishment for being member of unlawful assembly',
    isSerious: false,
    bnsSection: '189(2)',
    category: 'Public Tranquility',
  },
  '144': {
    section: '144',
    description: 'Joining unlawful assembly armed with deadly weapon',
    isSerious: false,
    bnsSection: '189(4)',
    category: 'Public Tranquility',
  },
  '146': {
    section: '146',
    description: 'Rioting',
    isSerious: false,
    bnsSection: '191(1)',
    category: 'Public Tranquility',
  },
  '147': {
    section: '147',
    description: 'Punishment for rioting',
    isSerious: false, 
    bnsSection: '191(2)',
    category: 'Public Tranquility',
  },
  '148': {
    section: '148',
    description: 'Rioting armed with deadly weapon',
    isSerious: false, 
    bnsSection: '191(3)',
    category: 'Public Tranquility',
  },
  '149': {
    section: '149',
    description: 'Every member of unlawful assembly guilty of offence committed in prosecution of common object',
    isSerious: false, 
    bnsSection: '190',
    category: 'Public Tranquility',
  },
  '152': {
    section: '152',
    description: 'Assaulting or obstructing public servant when suppressing riot',
    isSerious: false,
    bnsSection: '195',
    category: 'Public Tranquility',
  },
  '153': {
    section: '153',
    description: 'Wantonly giving provocation with intent to cause riot',
    isSerious: false,
    bnsSection: '192',
    category: 'Public Tranquility',
  },
  '153A': {
    section: '153A',
    description: 'Promoting enmity between different groups on grounds of religion, race, place of birth, residence, language',
    isSerious: true,
    bnsSection: '196',
    category: 'Public Tranquility',
  },
  '153B': {
    section: '153B',
    description: 'Imputations, assertions prejudicial to national integration',
    isSerious: true,
    bnsSection: '197',
    category: 'Public Tranquility',
  },

  
  '171A': {
    section: '171A',
    description: 'Candidate, electoral right defined',
    isSerious: false,
    bnsSection: '169',
    category: 'Election Offences',
  },
  '171B': {
    section: '171B',
    description: 'Bribery in elections',
    isSerious: true,
    bnsSection: '170',
    category: 'Election Offences',
  },
  '171C': {
    section: '171C',
    description: 'Undue influence at elections',
    isSerious: true, 
    bnsSection: '171',
    category: 'Election Offences',
  },
  '171D': {
    section: '171D',
    description: 'Personation at elections',
    isSerious: true,
    bnsSection: '172',
    category: 'Election Offences',
  },
  '171E': {
    section: '171E',
    description: 'Punishment for bribery',
    isSerious: true,
    bnsSection: '173',
    category: 'Election Offences',
  },
  '171F': {
    section: '171F',
    description: 'Punishment for undue influence or personation at an election',
    isSerious: true, 
    bnsSection: '174',
    category: 'Election Offences',
  },
  '171G': {
    section: '171G',
    description: 'False statement in connection with an election',
    isSerious: true,
    bnsSection: '175',
    category: 'Election Offences',
  },
  '171H': {
    section: '171H',
    description: 'Illegal payments in connection with an election',
    isSerious: true, 
    bnsSection: '176',
    category: 'Election Offences',
  },

  
  '186': {
    section: '186',
    description: 'Obstructing public servant in discharge of public functions',
    isSerious: false,
    bnsSection: '221',
    category: 'Contempt of Authority',
  },
  '188': {
    section: '188',
    description: 'Disobedience to order duly promulgated by public servant',
    isSerious: false,
    bnsSection: '223',
    category: 'Contempt of Authority',
  },
  '189': {
    section: '189',
    description: 'Threat of injury to public servant',
    isSerious: false,
    bnsSection: '224',
    category: 'Contempt of Authority',
  },

  
  '193': {
    section: '193',
    description: 'Punishment for false evidence',
    isSerious: false,
    bnsSection: '229',
    category: 'False Evidence',
  },
  '195A': {
    section: '195A',
    description: 'Threatening any person to give false evidence',
    isSerious: true,
    bnsSection: '232',
    category: 'False Evidence',
  },
  '201': {
    section: '201',
    description: 'Causing disappearance of evidence of offence or giving false information to screen offender',
    isSerious: true,
    bnsSection: '238',
    category: 'False Evidence',
  },
  '212': {
    section: '212',
    description: 'Harbouring offender',
    isSerious: true, 
    bnsSection: '249',
    category: 'False Evidence',
  },
  '216': {
    section: '216',
    description: 'Harbouring offender who has escaped from custody or whose apprehension has been ordered',
    isSerious: true, 
    bnsSection: '253',
    category: 'False Evidence',
  },
  '216A': {
    section: '216A',
    description: 'Penalty for harbouring robbers or dacoits',
    isSerious: true,
    bnsSection: '254',
    category: 'False Evidence',
  },

  
  '268': {
    section: '268',
    description: 'Public nuisance',
    isSerious: false,
    bnsSection: '270',
    category: 'Public Nuisance',
  },
  '269': {
    section: '269',
    description: 'Negligent act likely to spread infection of disease dangerous to life',
    isSerious: false,
    bnsSection: '271',
    category: 'Public Health',
  },
  '270': {
    section: '270',
    description: 'Malignant act likely to spread infection of disease dangerous to life',
    isSerious: false, 
    bnsSection: '272',
    category: 'Public Health',
  },
  '279': {
    section: '279',
    description: 'Rash driving or riding on a public way',
    isSerious: false,
    bnsSection: '281',
    category: 'Public Safety',
  },
  '283': {
    section: '283',
    description: 'Danger or obstruction in public way or line of navigation',
    isSerious: false,
    bnsSection: '285',
    category: 'Public Safety',
  },
  '290': {
    section: '290',
    description: 'Punishment for public nuisance in cases not otherwise provided for',
    isSerious: false,
    bnsSection: '292',
    category: 'Public Nuisance',
  },
  '294': {
    section: '294',
    description: 'Obscene acts and songs',
    isSerious: false,
    bnsSection: '296',
    category: 'Public Morals',
  },
  '295A': {
    section: '295A',
    description: 'Deliberate and malicious acts intended to outrage religious feelings',
    isSerious: true,
    bnsSection: '299',
    category: 'Religion',
  },
  '297': {
    section: '297',
    description: 'Trespassing on burial places, etc.',
    isSerious: false,
    bnsSection: '301',
    category: 'Religion',
  },

  
  '299': {
    section: '299',
    description: 'Culpable homicide',
    isSerious: true,
    bnsSection: '100',
    category: 'Offences Against Body',
  },
  '300': {
    section: '300',
    description: 'Murder',
    isSerious: true,
    bnsSection: '101',
    category: 'Offences Against Body',
  },
  '302': {
    section: '302',
    description: 'Punishment for murder',
    isSerious: true,
    bnsSection: '103',
    category: 'Offences Against Body',
  },
  '303': {
    section: '303',
    description: 'Punishment for murder by life-convict',
    isSerious: true,
    bnsSection: '104',
    category: 'Offences Against Body',
  },
  '304': {
    section: '304',
    description: 'Punishment for culpable homicide not amounting to murder',
    isSerious: true,
    bnsSection: '105',
    category: 'Offences Against Body',
  },
  '304A': {
    section: '304A',
    description: 'Causing death by negligence',
    isSerious: false,
    bnsSection: '106',
    category: 'Offences Against Body',
  },
  '304B': {
    section: '304B',
    description: 'Dowry death',
    isSerious: true,
    bnsSection: '80',
    category: 'Offences Against Body',
  },
  '306': {
    section: '306',
    description: 'Abetment of suicide',
    isSerious: true,
    bnsSection: '108',
    category: 'Offences Against Body',
  },
  '307': {
    section: '307',
    description: 'Attempt to murder',
    isSerious: true,
    bnsSection: '109',
    category: 'Offences Against Body',
  },
  '308': {
    section: '308',
    description: 'Attempt to commit culpable homicide',
    isSerious: true,
    bnsSection: '110',
    category: 'Offences Against Body',
  },

  
  '323': {
    section: '323',
    description: 'Punishment for voluntarily causing hurt',
    isSerious: false, 
    bnsSection: '115(2)',
    category: 'Offences Against Body',
  },
  '324': {
    section: '324',
    description: 'Voluntarily causing hurt by dangerous weapons or means',
    isSerious: true,
    bnsSection: '118(1)',
    category: 'Offences Against Body',
  },
  '325': {
    section: '325',
    description: 'Punishment for voluntarily causing grievous hurt',
    isSerious: true,
    bnsSection: '117(2)',
    category: 'Offences Against Body',
  },
  '326': {
    section: '326',
    description: 'Voluntarily causing grievous hurt by dangerous weapons or means',
    isSerious: true,
    bnsSection: '118',
    category: 'Offences Against Body',
  },
  '326A': {
    section: '326A',
    description: 'Voluntarily causing grievous hurt by use of acid',
    isSerious: true,
    bnsSection: '124(1)',
    category: 'Offences Against Body',
  },
  '326B': {
    section: '326B',
    description: 'Voluntarily throwing or attempting to throw acid',
    isSerious: true,
    bnsSection: '124(2)',
    category: 'Offences Against Body',
  },
  '327': {
    section: '327',
    description: 'Voluntarily causing hurt to extort property, or to constrain to an illegal act',
    isSerious: true,
    bnsSection: '119',
    category: 'Offences Against Body',
  },
  '328': {
    section: '328',
    description: 'Causing hurt by means of poison, etc., with intent to commit an offence',
    isSerious: true,
    bnsSection: '123',
    category: 'Offences Against Body',
  },
  '332': {
    section: '332',
    description: 'Voluntarily causing hurt to deter public servant from his duty',
    isSerious: true, 
    bnsSection: '121',
    category: 'Offences Against Body',
  },
  '333': {
    section: '333',
    description: 'Voluntarily causing grievous hurt to deter public servant from his duty',
    isSerious: true,
    bnsSection: '121',
    category: 'Offences Against Body',
  },
  '336': {
    section: '336',
    description: 'Act endangering life or personal safety of others',
    isSerious: false,
    bnsSection: '125',
    category: 'Offences Against Body',
  },

  
  '341': {
    section: '341',
    description: 'Punishment for wrongful restraint',
    isSerious: false,
    bnsSection: '126(2)',
    category: 'Offences Against Body',
  },
  '342': {
    section: '342',
    description: 'Punishment for wrongful confinement',
    isSerious: false,
    bnsSection: '127(2)',
    category: 'Offences Against Body',
  },

  
  '352': {
    section: '352',
    description: 'Punishment for assault or criminal force otherwise than on grave provocation',
    isSerious: false,
    bnsSection: '131',
    category: 'Offences Against Body',
  },
  '353': {
    section: '353',
    description: 'Assault or criminal force to deter public servant from discharge of duty',
    isSerious: false, 
    bnsSection: '132',
    category: 'Offences Against Body',
  },
  '354': {
    section: '354',
    description: 'Assault or criminal force to woman with intent to outrage her modesty',
    isSerious: true,
    bnsSection: '74',
    category: 'Offences Against Women',
  },
  '354A': {
    section: '354A',
    description: 'Sexual harassment',
    isSerious: true,
    bnsSection: '75',
    category: 'Offences Against Women',
  },
  '354B': {
    section: '354B',
    description: 'Assault or use of criminal force to woman with intent to disrobe',
    isSerious: true,
    bnsSection: '76',
    category: 'Offences Against Women',
  },
  '354C': {
    section: '354C',
    description: 'Voyeurism',
    isSerious: true,
    bnsSection: '77',
    category: 'Offences Against Women',
  },
  '354D': {
    section: '354D',
    description: 'Stalking',
    isSerious: true,
    bnsSection: '78',
    category: 'Offences Against Women',
  },

  
  '363': {
    section: '363',
    description: 'Punishment for kidnapping',
    isSerious: true,
    bnsSection: '137(2)',
    category: 'Kidnapping',
  },
  '363A': {
    section: '363A',
    description: 'Kidnapping or maiming a minor for purposes of begging',
    isSerious: true,
    bnsSection: '139',
    category: 'Kidnapping',
  },
  '364': {
    section: '364',
    description: 'Kidnapping or abducting in order to murder',
    isSerious: true,
    bnsSection: '140',
    category: 'Kidnapping',
  },
  '364A': {
    section: '364A',
    description: 'Kidnapping for ransom',
    isSerious: true,
    bnsSection: '140',
    category: 'Kidnapping',
  },
  '365': {
    section: '365',
    description: 'Kidnapping or abducting with intent to secretly and wrongfully confine person',
    isSerious: true,
    bnsSection: '140(3)',
    category: 'Kidnapping',
  },
  '366': {
    section: '366',
    description: 'Kidnapping, abducting or inducing woman to compel her marriage',
    isSerious: true,
    bnsSection: '87',
    category: 'Kidnapping',
  },
  '366A': {
    section: '366A',
    description: 'Procuration of minor girl',
    isSerious: true,
    bnsSection: '96',
    category: 'Kidnapping',
  },
  '366B': {
    section: '366B',
    description: 'Importation of girl from foreign country',
    isSerious: true,
    bnsSection: '141',
    category: 'Kidnapping',
  },
  '367': {
    section: '367',
    description: 'Kidnapping or abducting to subject person to grievous hurt, slavery',
    isSerious: true,
    bnsSection: '140(4)',
    category: 'Kidnapping',
  },
  '370': {
    section: '370',
    description: 'Trafficking of person',
    isSerious: true,
    bnsSection: '143',
    category: 'Human Trafficking',
  },
  '370A': {
    section: '370A',
    description: 'Exploitation of a trafficked person',
    isSerious: true,
    bnsSection: '144',
    category: 'Human Trafficking',
  },

  
  '375': {
    section: '375',
    description: 'Rape',
    isSerious: true,
    bnsSection: '63',
    category: 'Sexual Offences',
  },
  '376': {
    section: '376',
    description: 'Punishment for rape',
    isSerious: true,
    bnsSection: '64',
    category: 'Sexual Offences',
  },
  '376A': {
    section: '376A',
    description: 'Punishment for causing death or resulting in persistent vegetative state of victim',
    isSerious: true,
    bnsSection: '66',
    category: 'Sexual Offences',
  },
  '376AB': {
    section: '376AB',
    description: 'Punishment for rape on woman under twelve years of age',
    isSerious: true,
    bnsSection: '65(2)',
    category: 'Sexual Offences',
  },
  '376B': {
    section: '376B',
    description: 'Sexual intercourse by husband upon his wife during separation',
    isSerious: true,
    bnsSection: '67',
    category: 'Sexual Offences',
  },
  '376C': {
    section: '376C',
    description: 'Sexual intercourse by a person in authority',
    isSerious: true,
    bnsSection: '68',
    category: 'Sexual Offences',
  },
  '376D': {
    section: '376D',
    description: 'Gang rape',
    isSerious: true,
    bnsSection: '70',
    category: 'Sexual Offences',
  },
  '376E': {
    section: '376E',
    description: 'Punishment for repeat offenders',
    isSerious: true,
    bnsSection: '71',
    category: 'Sexual Offences',
  },

  
  '379': {
    section: '379',
    description: 'Punishment for theft',
    isSerious: false,
    bnsSection: '303(2)',
    category: 'Property Offences',
  },
  '380': {
    section: '380',
    description: 'Theft in dwelling house',
    isSerious: false,
    bnsSection: '305',
    category: 'Property Offences',
  },
  '382': {
    section: '382',
    description: 'Theft after preparation made for causing death, hurt or restraint',
    isSerious: true,
    bnsSection: '307',
    category: 'Property Offences',
  },

  
  '384': {
    section: '384',
    description: 'Punishment for extortion',
    isSerious: true,
    bnsSection: '308(2)',
    category: 'Extortion',
  },
  '386': {
    section: '386',
    description: 'Extortion by putting a person in fear of death or grievous hurt',
    isSerious: true,
    bnsSection: '308(4)',
    category: 'Extortion',
  },
  '387': {
    section: '387',
    description: 'Putting person in fear of death or grievous hurt in order to commit extortion',
    isSerious: true,
    bnsSection: '308(5)',
    category: 'Extortion',
  },

  
  '392': {
    section: '392',
    description: 'Punishment for robbery',
    isSerious: true,
    bnsSection: '309',
    category: 'Robbery & Dacoity',
  },
  '393': {
    section: '393',
    description: 'Attempt to commit robbery',
    isSerious: true,
    bnsSection: '309',
    category: 'Robbery & Dacoity',
  },
  '394': {
    section: '394',
    description: 'Voluntarily causing hurt in committing robbery',
    isSerious: true,
    bnsSection: '309',
    category: 'Robbery & Dacoity',
  },
  '395': {
    section: '395',
    description: 'Punishment for dacoity',
    isSerious: true,
    bnsSection: '310',
    category: 'Robbery & Dacoity',
  },
  '396': {
    section: '396',
    description: 'Dacoity with murder',
    isSerious: true,
    bnsSection: '310(3)',
    category: 'Robbery & Dacoity',
  },
  '397': {
    section: '397',
    description: 'Robbery or dacoity with attempt to cause death or grievous hurt',
    isSerious: true,
    bnsSection: '311',
    category: 'Robbery & Dacoity',
  },
  '398': {
    section: '398',
    description: 'Attempt to commit robbery or dacoity when armed with deadly weapon',
    isSerious: true,
    bnsSection: '312',
    category: 'Robbery & Dacoity',
  },
  '399': {
    section: '399',
    description: 'Making preparation to commit dacoity',
    isSerious: true,
    bnsSection: '310(4)',
    category: 'Robbery & Dacoity',
  },
  '402': {
    section: '402',
    description: 'Assembling for purpose of committing dacoity',
    isSerious: true,
    bnsSection: '310(5)',
    category: 'Robbery & Dacoity',
  },

  
  '406': {
    section: '406',
    description: 'Punishment for criminal breach of trust',
    isSerious: true,
    bnsSection: '316(2)',
    category: 'Breach of Trust',
  },
  '408': {
    section: '408',
    description: 'Criminal breach of trust by clerk or servant',
    isSerious: true,
    bnsSection: '316(4)',
    category: 'Breach of Trust',
  },
  '409': {
    section: '409',
    description: 'Criminal breach of trust by public servant, banker, merchant or agent',
    isSerious: true,
    bnsSection: '316(5)',
    category: 'Breach of Trust',
  },

  
  '411': {
    section: '411',
    description: 'Dishonestly receiving stolen property',
    isSerious: false,
    bnsSection: '317(2)',
    category: 'Stolen Property',
  },
  '412': {
    section: '412',
    description: 'Dishonestly receiving property stolen in dacoity',
    isSerious: true,
    bnsSection: '317(3)',
    category: 'Stolen Property',
  },
  '414': {
    section: '414',
    description: 'Assisting in concealment of stolen property',
    isSerious: true, 
    bnsSection: '317(5)',
    category: 'Stolen Property',
  },

  
  '417': {
    section: '417',
    description: 'Punishment for cheating',
    isSerious: false,
    bnsSection: '318(2)',
    category: 'Cheating',
  },
  '419': {
    section: '419',
    description: 'Punishment for cheating by personation',
    isSerious: true, 
    bnsSection: '319(2)',
    category: 'Cheating',
  },
  '420': {
    section: '420',
    description: 'Cheating and dishonestly inducing delivery of property',
    isSerious: true,
    bnsSection: '318(4)',
    category: 'Cheating',
  },

  
  '426': {
    section: '426',
    description: 'Punishment for mischief',
    isSerious: false,
    bnsSection: '324(2)',
    category: 'Mischief',
  },
  '427': {
    section: '427',
    description: 'Mischief causing damage to the amount of fifty rupees',
    isSerious: false,
    bnsSection: '324(4)',
    category: 'Mischief',
  },
  '431': {
    section: '431',
    description: 'Mischief by injury to public road, bridge, river or channel',
    isSerious: false,
    bnsSection: '326(b)',
    category: 'Mischief',
  },
  '433': {
    section: '433',
    description: 'Mischief by destroying or moving lighthouse or sea-mark',
    isSerious: false,
    bnsSection: '326(d)',
    category: 'Mischief',
  },
  '435': {
    section: '435',
    description: 'Mischief by fire or explosive substance with intent to cause damage',
    isSerious: true, 
    bnsSection: '326(f)',
    category: 'Mischief',
  },
  '436': {
    section: '436',
    description: 'Mischief by fire or explosive substance with intent to destroy house',
    isSerious: true,
    bnsSection: '326(g)',
    category: 'Mischief',
  },

  
  '447': {
    section: '447',
    description: 'Punishment for criminal trespass',
    isSerious: false,
    bnsSection: '329(3)',
    category: 'Trespass',
  },
  '448': {
    section: '448',
    description: 'Punishment for house-trespass',
    isSerious: false,
    bnsSection: '331',
    category: 'Trespass',
  },
  '449': {
    section: '449',
    description: 'House-trespass in order to commit offence punishable with death',
    isSerious: true,
    bnsSection: '332(a)',
    category: 'Trespass',
  },
  '452': {
    section: '452',
    description: 'House-trespass after preparation for hurt, assault or wrongful restraint',
    isSerious: true,
    bnsSection: '333',
    category: 'Trespass',
  },

  
  '465': {
    section: '465',
    description: 'Punishment for forgery',
    isSerious: true, 
    bnsSection: '336(2)',
    category: 'Forgery',
  },
  '466': {
    section: '466',
    description: 'Forgery of record of Court or of public register, etc.',
    isSerious: true,
    bnsSection: '337',
    category: 'Forgery',
  },
  '467': {
    section: '467',
    description: 'Forgery of valuable security, will, etc.',
    isSerious: true,
    bnsSection: '338',
    category: 'Forgery',
  },
  '468': {
    section: '468',
    description: 'Forgery for purpose of cheating',
    isSerious: true,
    bnsSection: '336(3)',
    category: 'Forgery',
  },
  '469': {
    section: '469',
    description: 'Forgery for purpose of harming reputation',
    isSerious: true,
    bnsSection: '336(4)',
    category: 'Forgery',
  },
  '471': {
    section: '471',
    description: 'Using as genuine a forged document',
    isSerious: true,
    bnsSection: '340(2)',
    category: 'Forgery',
  },
  '472': {
    section: '472',
    description: 'Making or possessing counterfeit seal with intent to commit forgery',
    isSerious: true,
    bnsSection: '341(1)',
    category: 'Forgery',
  },
  '474': {
    section: '474',
    description: 'Having possession of forged document knowing it to be forged',
    isSerious: true,
    bnsSection: '339',
    category: 'Forgery',
  },
  '477A': {
    section: '477A',
    description: 'Falsification of accounts',
    isSerious: true,
    bnsSection: '344',
    category: 'Forgery',
  },

  
  '489A': {
    section: '489A',
    description: 'Counterfeiting currency-notes or bank-notes',
    isSerious: true,
    bnsSection: '178',
    category: 'Counterfeiting',
  },
  '489B': {
    section: '489B',
    description: 'Using as genuine, forged or counterfeit currency-notes or bank-notes',
    isSerious: true,
    bnsSection: '179',
    category: 'Counterfeiting',
  },
  '489C': {
    section: '489C',
    description: 'Possession of forged or counterfeit currency-notes or bank-notes',
    isSerious: true,
    bnsSection: '180',
    category: 'Counterfeiting',
  },

  
  '498A': {
    section: '498A',
    description: 'Husband or relative of husband of a woman subjecting her to cruelty',
    isSerious: true,
    bnsSection: '85',
    category: 'Domestic Violence',
  },

  
  '499': {
    section: '499',
    description: 'Defamation',
    isSerious: false,
    bnsSection: '356',
    category: 'Defamation',
  },
  '500': {
    section: '500',
    description: 'Punishment for defamation',
    isSerious: false,
    bnsSection: '356',
    category: 'Defamation',
  },

  
  '503': {
    section: '503',
    description: 'Criminal intimidation',
    isSerious: true, 
    bnsSection: '351',
    category: 'Criminal Intimidation',
  },
  '504': {
    section: '504',
    description: 'Intentional insult with intent to provoke breach of the peace',
    isSerious: false,
    bnsSection: '352',
    category: 'Criminal Intimidation',
  },
  '505': {
    section: '505',
    description: 'Statements conducing to public mischief',
    isSerious: true, 
    bnsSection: '353',
    category: 'Criminal Intimidation',
  },
  '505(1)(b)': {
    section: '505(1)(b)',
    description: 'Statements conducing to public mischief - causing fear or alarm',
    isSerious: true,
    bnsSection: '353',
    category: 'Criminal Intimidation',
  },
  '505(1)(c)': {
    section: '505(1)(c)',
    description: 'Statements conducing to public mischief - inciting offence against public',
    isSerious: true,
    bnsSection: '353',
    category: 'Criminal Intimidation',
  },
  '505(2)': {
    section: '505(2)',
    description: 'Statements creating or promoting enmity, hatred or ill-will between classes',
    isSerious: true,
    bnsSection: '353',
    category: 'Criminal Intimidation',
  },
  '506': {
    section: '506',
    description: 'Punishment for criminal intimidation',
    isSerious: true, 
    bnsSection: '351',
    category: 'Criminal Intimidation',
  },
  '509': {
    section: '509',
    description: 'Word, gesture or act intended to insult the modesty of a woman',
    isSerious: false,
    bnsSection: '79',
    category: 'Offences Against Women',
  },
  '511': {
    section: '511',
    description: 'Punishment for attempting to commit offences punishable with imprisonment for life or other imprisonment',
    isSerious: false,
    bnsSection: '62',
    category: 'Attempts',
  },
};


export function getIPCSection(sectionNumber: string): IPCSection | null {
  
  const normalized = sectionNumber.replace(/\s+/g, '').toUpperCase();
  return ipcSections[normalized] || ipcSections[sectionNumber] || null;
}


export function isSeriousSection(sectionNumber: string): boolean {
  const section = getIPCSection(sectionNumber);
  return section?.isSerious ?? false;
}


export function getBNSEquivalent(ipcSection: string): string | null {
  const section = getIPCSection(ipcSection);
  return section?.bnsSection ?? null;
}


export function findIPCSectionFromDescription(description: string): IPCSection | null {
  const lowerDesc = description.toLowerCase();

  
  for (const [, section] of Object.entries(ipcSections)) {
    if (lowerDesc.includes(section.description.toLowerCase())) {
      return section;
    }
  }

  
  const patterns: { pattern: RegExp; section: string }[] = [
    { pattern: /murder/i, section: '302' },
    { pattern: /attempt to murder/i, section: '307' },
    { pattern: /culpable homicide/i, section: '304' },
    { pattern: /waging.*war/i, section: '121' },
    { pattern: /conspiracy.*section 121/i, section: '121A' },
    { pattern: /sedition/i, section: '124A' },
    { pattern: /promoting enmity/i, section: '153A' },
    { pattern: /rioting.*armed|armed.*deadly weapon/i, section: '148' },
    { pattern: /rioting/i, section: '147' },
    { pattern: /unlawful assembly.*guilty/i, section: '149' },
    { pattern: /being member.*unlawful assembly/i, section: '143' },
    { pattern: /kidnap.*ransom/i, section: '364A' },
    { pattern: /kidnap.*murder/i, section: '364' },
    { pattern: /kidnap.*begging/i, section: '363A' },
    { pattern: /kidnapping|abduction/i, section: '363' },
    { pattern: /trafficking/i, section: '370' },
    { pattern: /gang rape/i, section: '376D' },
    { pattern: /rape/i, section: '376' },
    { pattern: /sexual harassment/i, section: '354A' },
    { pattern: /stalking/i, section: '354D' },
    { pattern: /voyeurism/i, section: '354C' },
    { pattern: /disrobe/i, section: '354B' },
    { pattern: /outrage.*modesty/i, section: '354' },
    { pattern: /grievous hurt.*acid/i, section: '326A' },
    { pattern: /throwing.*acid/i, section: '326B' },
    { pattern: /grievous hurt.*dangerous/i, section: '326' },
    { pattern: /grievous hurt.*public servant/i, section: '333' },
    { pattern: /grievous hurt/i, section: '325' },
    { pattern: /voluntarily causing hurt.*dangerous/i, section: '324' },
    { pattern: /voluntarily causing hurt.*public servant|hurt.*deter.*public servant/i, section: '332' },
    { pattern: /voluntarily causing hurt.*extort/i, section: '327' },
    { pattern: /voluntarily causing hurt/i, section: '323' },
    { pattern: /wrongful restraint/i, section: '341' },
    { pattern: /wrongful confinement/i, section: '342' },
    { pattern: /dacoity.*murder/i, section: '396' },
    { pattern: /dacoity/i, section: '395' },
    { pattern: /robbery.*death|robbery.*grievous/i, section: '397' },
    { pattern: /attempt.*robbery/i, section: '393' },
    { pattern: /robbery/i, section: '392' },
    { pattern: /extortion.*death|extortion.*grievous/i, section: '386' },
    { pattern: /extortion/i, section: '384' },
    { pattern: /criminal breach of trust.*public servant|criminal breach of trust.*banker/i, section: '409' },
    { pattern: /criminal breach of trust.*clerk|criminal breach of trust.*servant/i, section: '408' },
    { pattern: /criminal breach of trust/i, section: '406' },
    { pattern: /cheating.*inducing delivery|cheating.*dishonestly/i, section: '420' },
    { pattern: /cheating.*personation/i, section: '419' },
    { pattern: /cheating/i, section: '417' },
    { pattern: /falsification of accounts/i, section: '477A' },
    { pattern: /forgery.*valuable security|forgery.*will/i, section: '467' },
    { pattern: /forgery.*cheating/i, section: '468' },
    { pattern: /forgery.*harming reputation/i, section: '469' },
    { pattern: /forgery.*record.*court|forgery.*public register/i, section: '466' },
    { pattern: /using.*forged document/i, section: '471' },
    { pattern: /possession.*forged document/i, section: '474' },
    { pattern: /forgery/i, section: '465' },
    { pattern: /counterfeit.*currency|counterfeit.*bank.?note/i, section: '489A' },
    { pattern: /cruelty.*husband|husband.*cruelty/i, section: '498A' },
    { pattern: /dowry death/i, section: '304B' },
    { pattern: /abetment.*suicide/i, section: '306' },
    { pattern: /criminal conspiracy/i, section: '120B' },
    { pattern: /criminal intimidation/i, section: '506' },
    { pattern: /statements.*public mischief/i, section: '505' },
    { pattern: /statements.*enmity.*classes/i, section: '505(2)' },
    { pattern: /intentional insult.*provoke/i, section: '504' },
    { pattern: /insult.*modesty.*woman/i, section: '509' },
    { pattern: /defamation/i, section: '500' },
    { pattern: /mischief.*fire.*house|mischief.*explosive.*house/i, section: '436' },
    { pattern: /mischief.*fire|mischief.*explosive/i, section: '435' },
    { pattern: /mischief.*damage/i, section: '427' },
    { pattern: /house.?trespass.*preparation/i, section: '452' },
    { pattern: /house.?trespass/i, section: '448' },
    { pattern: /criminal trespass/i, section: '447' },
    { pattern: /theft.*preparation.*death|theft.*preparation.*hurt/i, section: '382' },
    { pattern: /theft/i, section: '379' },
    { pattern: /harbouring.*robber|harbouring.*dacoit/i, section: '216A' },
    { pattern: /harbouring offender/i, section: '212' },
    { pattern: /false evidence/i, section: '193' },
    { pattern: /disobedience.*order.*public servant/i, section: '188' },
    { pattern: /obstructing public servant/i, section: '186' },
    { pattern: /undue influence.*election/i, section: '171C' },
    { pattern: /illegal payment.*election/i, section: '171H' },
    { pattern: /bribery.*election/i, section: '171B' },
    { pattern: /personation.*election/i, section: '171F' },
    { pattern: /abettor present/i, section: '114' },
    { pattern: /spread.*infection|disease dangerous/i, section: '269' },
    { pattern: /assault.*deter.*public servant/i, section: '353' },
    { pattern: /assault.*criminal force.*woman/i, section: '354' },
    { pattern: /assault.*criminal force/i, section: '352' },
    { pattern: /common intention|furtherance of common/i, section: '34' },
    { pattern: /rash driving/i, section: '279' },
    { pattern: /obscene acts/i, section: '294' },
    { pattern: /acts done by several persons/i, section: '34' },
  ];

  for (const { pattern, section } of patterns) {
    if (pattern.test(description)) {
      return ipcSections[section] || null;
    }
  }

  return null;
}


export function isSeriousCharge(description: string): boolean {
  const section = findIPCSectionFromDescription(description);
  if (section) {
    return section.isSerious;
  }

  
  const seriousKeywords = [
    'murder', 'homicide', 'death', 'kill',
    'rape', 'sexual assault', 'gang',
    'kidnap', 'abduct', 'trafficking',
    'robbery', 'dacoity', 'extortion',
    'grievous hurt', 'acid',
    'waging war', 'against the state',
    'forgery', 'falsification',
    'criminal breach of trust',
    'counterfeiting', 'currency',
    'cruelty.*husband', 'dowry',
    'criminal intimidation',
    'mischief.*fire', 'mischief.*explosive',
    'cheating.*inducing',
    'undue influence.*election',
    'illegal payment.*election',
  ];

  const lowerDesc = description.toLowerCase();
  return seriousKeywords.some(keyword => {
    if (keyword.includes('.*')) {
      return new RegExp(keyword, 'i').test(description);
    }
    return lowerDesc.includes(keyword);
  });
}


export function getSeriousSections(): IPCSection[] {
  return Object.values(ipcSections).filter(section => section.isSerious);
}


export function getOtherSections(): IPCSection[] {
  return Object.values(ipcSections).filter(section => !section.isSerious);
}
