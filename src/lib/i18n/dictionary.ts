// Single source of truth for all UI copy. Every locale must satisfy `Dict`.
export const LOCALES = ["it", "en", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";

export type ErrorKey =
  | "firstNameRequired" | "lastNameRequired" | "birthDateRequired" | "birthDateInvalid"
  | "birthDateFuture" | "emailRequired" | "emailInvalid" | "phoneRequired" | "phoneInvalid"
  | "ackRequired";

const it = {
  langName: "Italiano",
  common: {
    languageLabel: "Lingua",
    previewOnly: "Solo anteprima · dati di esempio",
    unavailable: "Azione non disponibile in anteprima.",
    staffAccess: "Accesso staff",
  },
  hero: {
    eyebrow: "Su invito",
    when: "BRUXELLES · SABATO, ORE 23:00",
    tagline: "Una notte. Un invito.",
    question: "Vuoi accedere a questo evento?",
    cta: "Sì, accedi",
    footnote: "L'accesso è riservato agli ospiti con un codice personale.",
  },
  code: {
    eyebrow: "After Dark · Accesso",
    title: "Il tuo codice",
    label: "Codice regalo",
    submit: "Invia",
    checking: "Verifica…",
    notAvailable: "Le registrazioni non sono ancora aperte. Riprova più tardi.",
    invalid: "Codice non valido. Controlla e riprova.",
    sampleHint: (c: string) => `Esempio, non è un accesso reale: ${c}`,
  },
  form: {
    eyebrow: "After Dark · Invito",
    title: "Completa il tuo invito",
    firstName: "Nome",
    lastName: "Cognome",
    birthDate: "Data di nascita",
    email: "Indirizzo email",
    emailPlaceholder: "nome@esempio.com",
    phone: "Telefono",
    prefix: "Prefisso internazionale",
    ack: "Anteprima: i dati inseriti non vengono salvati né inviati.",
    privacy: "Informativa privacy da predisporre prima del lancio.",
    submit: "Continua",
    errorCount: (n: number) => (n === 1 ? "1 campo da correggere." : `${n} campi da correggere.`),
  },
  errors: {
    firstNameRequired: "Inserisci il tuo nome.",
    lastNameRequired: "Inserisci il tuo cognome.",
    birthDateRequired: "Inserisci la data di nascita.",
    birthDateInvalid: "Data non valida.",
    birthDateFuture: "La data non può essere nel futuro.",
    emailRequired: "Inserisci il tuo indirizzo email.",
    emailInvalid: "Indirizzo email non valido.",
    phoneRequired: "Inserisci il numero di telefono.",
    phoneInvalid: "Numero di telefono non plausibile.",
    ackRequired: "Conferma di aver letto la nota.",
  } satisfies Record<ErrorKey, string>,
  done: {
    badge: "Anteprima · nessuna email inviata",
    title: "Verifica la tua email",
    body: "Nella versione reale riceverai un'email per confermare il tuo indirizzo. La conferma di presenza (RSVP) è un passaggio successivo e separato.",
    step1: "1 · Verifica email",
    step2: "2 · Conferma presenza",
    restart: "Ricomincia",
  },
  review: {
    title: "Revisione design",
    note: "Solo anteprima. Dati sintetici, nessun accesso reale, nessun dato salvato o inviato.",
    publicFlow: "Percorso pubblico (comportamento reale senza backend)",
    sampleFlow: "Percorso completo con codice di esempio",
    backoffice: "Back-office di esempio",
    staffLogin: "Login staff",
  },
  staff: {
    loginEyebrow: "Night Life Event · Staff",
    loginTitle: "Accesso staff",
    username: "Nome utente",
    password: "Password",
    show: "Mostra password",
    hide: "Nascondi password",
    signIn: "Accedi",
    usernameRequired: "Inserisci il nome utente.",
    passwordRequired: "Inserisci la password.",
    loginUnavailable: "Accesso non ancora disponibile: il servizio di autenticazione non è collegato.",
    lockedTitle: "Area riservata",
    lockedBody: "Il pannello è visibile solo dopo un accesso autenticato.",
    goLogin: "Vai al login",
    sampleData: "DATI DI ESEMPIO",
    nav: { overview: "Panoramica", events: "Eventi", codes: "Codici", guests: "Ospiti", team: "Staff" },
    event: "Evento",
    newEvent: "Nuovo evento",
    eventName: "Nome evento",
    venue: "Luogo",
    date: "Data e ora",
    capacity: "Capienza",
    cancel: "Annulla",
    save: "Salva",
    stats: { invited: "Invitati", verified: "Email verificate", rsvp: "RSVP confermati", checkedIn: "Check-in" },
    generator: "Generatore codici",
    type: "Tipo",
    personal: "Personale",
    shared: "Condiviso",
    quota: "Quota",
    expiry: "Scadenza",
    generate: "Genera codici",
    export: "Esporta CSV",
    scanner: "Apri scanner",
    code: "Codice",
    uses: "Utilizzi",
    status: "Stato",
    name: "Nome",
    email: "Email",
    role: "Ruolo",
    statusLabels: { active: "Attivo", used: "Usato", expired: "Scaduto", revoked: "Revocato" },
    guestLabels: { verified: "Verificata", pending: "In attesa", yes: "Sì", no: "No", in: "Entrato", out: "—" },
    roles: { owner: "Titolare", manager: "Manager", door: "Ingresso" },
    rsvp: "RSVP",
    checkin: "Check-in",
  },
};

export type Dict = typeof it;

const en: Dict = {
  langName: "English",
  common: { languageLabel: "Language", previewOnly: "Preview only · sample data", unavailable: "Action unavailable in preview.", staffAccess: "Staff access" },
  hero: {
    eyebrow: "By invitation", when: "BRUSSELS · SATURDAY, 11 PM", tagline: "One night. One invitation.",
    question: "Would you like to access this event?", cta: "Yes, enter",
    footnote: "Access is reserved for guests holding a personal code.",
  },
  code: {
    eyebrow: "After Dark · Access", title: "Your code", label: "Gift code", submit: "Send", checking: "Checking…",
    notAvailable: "Registrations are not open yet. Please try again later.",
    invalid: "Invalid code. Please check and try again.",
    sampleHint: (c) => `Sample, not real access: ${c}`,
  },
  form: {
    eyebrow: "After Dark · Invitation", title: "Complete your invitation", firstName: "First name", lastName: "Last name",
    birthDate: "Date of birth", email: "Email address", emailPlaceholder: "name@example.com", phone: "Phone",
    prefix: "Country code", ack: "Preview: entered data is neither saved nor sent.",
    privacy: "Privacy notice to be provided before launch.", submit: "Continue",
    errorCount: (n) => (n === 1 ? "1 field to fix." : `${n} fields to fix.`),
  },
  errors: {
    firstNameRequired: "Enter your first name.", lastNameRequired: "Enter your last name.",
    birthDateRequired: "Enter your date of birth.", birthDateInvalid: "Invalid date.",
    birthDateFuture: "The date cannot be in the future.", emailRequired: "Enter your email address.",
    emailInvalid: "Invalid email address.", phoneRequired: "Enter your phone number.",
    phoneInvalid: "Phone number doesn't look right.", ackRequired: "Please confirm you have read the note.",
  },
  done: {
    badge: "Preview · no email sent", title: "Verify your email",
    body: "In the live version you will receive an email to confirm your address. Confirming attendance (RSVP) is a later, separate step.",
    step1: "1 · Verify email", step2: "2 · Confirm attendance", restart: "Start over",
  },
  review: {
    title: "Design review", note: "Preview only. Synthetic data, no real access, nothing saved or sent.",
    publicFlow: "Public flow (real behaviour without backend)", sampleFlow: "Full flow with sample code",
    backoffice: "Sample back-office", staffLogin: "Staff login",
  },
  staff: {
    loginEyebrow: "Night Life Event · Staff", loginTitle: "Staff sign in", username: "Username", password: "Password",
    show: "Show password", hide: "Hide password", signIn: "Sign in",
    usernameRequired: "Enter your username.", passwordRequired: "Enter your password.",
    loginUnavailable: "Sign-in is not available yet: the authentication service is not connected.",
    lockedTitle: "Restricted area", lockedBody: "The dashboard is only shown after authenticated sign-in.", goLogin: "Go to sign in",
    sampleData: "SAMPLE DATA",
    nav: { overview: "Overview", events: "Events", codes: "Codes", guests: "Guests", team: "Staff" },
    event: "Event", newEvent: "New event", eventName: "Event name", venue: "Venue", date: "Date & time", capacity: "Capacity",
    cancel: "Cancel", save: "Save",
    stats: { invited: "Invited", verified: "Emails verified", rsvp: "RSVP confirmed", checkedIn: "Checked in" },
    generator: "Code generator", type: "Type", personal: "Personal", shared: "Shared", quota: "Quota", expiry: "Expiry",
    generate: "Generate codes", export: "Export CSV", scanner: "Open scanner", code: "Code", uses: "Uses", status: "Status",
    name: "Name", email: "Email", role: "Role",
    statusLabels: { active: "Active", used: "Used", expired: "Expired", revoked: "Revoked" },
    guestLabels: { verified: "Verified", pending: "Pending", yes: "Yes", no: "No", in: "In", out: "—" },
    roles: { owner: "Owner", manager: "Manager", door: "Door" }, rsvp: "RSVP", checkin: "Check-in",
  },
};

const fr: Dict = {
  langName: "Français",
  common: { languageLabel: "Langue", previewOnly: "Aperçu uniquement · données fictives", unavailable: "Action indisponible en aperçu.", staffAccess: "Accès staff" },
  hero: {
    eyebrow: "Sur invitation", when: "BRUXELLES · SAMEDI, 23 H", tagline: "Une nuit. Une invitation.",
    question: "Souhaitez-vous accéder à cet événement ?", cta: "Oui, entrer",
    footnote: "L'accès est réservé aux invités munis d'un code personnel.",
  },
  code: {
    eyebrow: "After Dark · Accès", title: "Votre code", label: "Code d'invitation", submit: "Envoyer", checking: "Vérification…",
    notAvailable: "Les inscriptions ne sont pas encore ouvertes. Réessayez plus tard.",
    invalid: "Code invalide. Vérifiez et réessayez.",
    sampleHint: (c) => `Exemple, sans accès réel : ${c}`,
  },
  form: {
    eyebrow: "After Dark · Invitation", title: "Complétez votre invitation", firstName: "Prénom", lastName: "Nom",
    birthDate: "Date de naissance", email: "Adresse e-mail", emailPlaceholder: "nom@exemple.com", phone: "Téléphone",
    prefix: "Indicatif international", ack: "Aperçu : les données saisies ne sont ni enregistrées ni envoyées.",
    privacy: "Politique de confidentialité à fournir avant le lancement.", submit: "Continuer",
    errorCount: (n) => (n === 1 ? "1 champ à corriger." : `${n} champs à corriger.`),
  },
  errors: {
    firstNameRequired: "Saisissez votre prénom.", lastNameRequired: "Saisissez votre nom.",
    birthDateRequired: "Saisissez votre date de naissance.", birthDateInvalid: "Date invalide.",
    birthDateFuture: "La date ne peut pas être dans le futur.", emailRequired: "Saisissez votre adresse e-mail.",
    emailInvalid: "Adresse e-mail invalide.", phoneRequired: "Saisissez votre numéro de téléphone.",
    phoneInvalid: "Numéro de téléphone peu plausible.", ackRequired: "Confirmez avoir lu la note.",
  },
  done: {
    badge: "Aperçu · aucun e-mail envoyé", title: "Vérifiez votre e-mail",
    body: "Dans la version réelle, vous recevrez un e-mail pour confirmer votre adresse. La confirmation de présence (RSVP) est une étape ultérieure et distincte.",
    step1: "1 · Vérifier l'e-mail", step2: "2 · Confirmer la présence", restart: "Recommencer",
  },
  review: {
    title: "Revue du design", note: "Aperçu uniquement. Données fictives, aucun accès réel, rien n'est enregistré ni envoyé.",
    publicFlow: "Parcours public (comportement réel sans backend)", sampleFlow: "Parcours complet avec code d'exemple",
    backoffice: "Back-office d'exemple", staffLogin: "Connexion staff",
  },
  staff: {
    loginEyebrow: "Night Life Event · Staff", loginTitle: "Connexion staff", username: "Nom d'utilisateur", password: "Mot de passe",
    show: "Afficher le mot de passe", hide: "Masquer le mot de passe", signIn: "Se connecter",
    usernameRequired: "Saisissez le nom d'utilisateur.", passwordRequired: "Saisissez le mot de passe.",
    loginUnavailable: "Connexion pas encore disponible : le service d'authentification n'est pas relié.",
    lockedTitle: "Zone réservée", lockedBody: "Le tableau de bord n'apparaît qu'après une connexion authentifiée.", goLogin: "Aller à la connexion",
    sampleData: "DONNÉES FICTIVES",
    nav: { overview: "Aperçu", events: "Événements", codes: "Codes", guests: "Invités", team: "Staff" },
    event: "Événement", newEvent: "Nouvel événement", eventName: "Nom de l'événement", venue: "Lieu", date: "Date et heure", capacity: "Capacité",
    cancel: "Annuler", save: "Enregistrer",
    stats: { invited: "Invités", verified: "E-mails vérifiés", rsvp: "RSVP confirmés", checkedIn: "Entrées" },
    generator: "Générateur de codes", type: "Type", personal: "Personnel", shared: "Partagé", quota: "Quota", expiry: "Expiration",
    generate: "Générer des codes", export: "Exporter CSV", scanner: "Ouvrir le scanner", code: "Code", uses: "Utilisations", status: "Statut",
    name: "Nom", email: "E-mail", role: "Rôle",
    statusLabels: { active: "Actif", used: "Utilisé", expired: "Expiré", revoked: "Révoqué" },
    guestLabels: { verified: "Vérifié", pending: "En attente", yes: "Oui", no: "Non", in: "Entré", out: "—" },
    roles: { owner: "Propriétaire", manager: "Manager", door: "Entrée" }, rsvp: "RSVP", checkin: "Entrée",
  },
};

const nl: Dict = {
  langName: "Nederlands",
  common: { languageLabel: "Taal", previewOnly: "Alleen voorbeeld · voorbeelddata", unavailable: "Actie niet beschikbaar in voorbeeld.", staffAccess: "Toegang staff" },
  hero: {
    eyebrow: "Op uitnodiging", when: "BRUSSEL · ZATERDAG, 23:00", tagline: "Eén nacht. Eén uitnodiging.",
    question: "Wil je toegang tot dit evenement?", cta: "Ja, ga verder",
    footnote: "Toegang is voorbehouden aan gasten met een persoonlijke code.",
  },
  code: {
    eyebrow: "After Dark · Toegang", title: "Jouw code", label: "Cadeaucode", submit: "Verzenden", checking: "Controleren…",
    notAvailable: "Registraties zijn nog niet geopend. Probeer het later opnieuw.",
    invalid: "Ongeldige code. Controleer en probeer opnieuw.",
    sampleHint: (c) => `Voorbeeld, geen echte toegang: ${c}`,
  },
  form: {
    eyebrow: "After Dark · Uitnodiging", title: "Vervolledig je uitnodiging", firstName: "Voornaam", lastName: "Achternaam",
    birthDate: "Geboortedatum", email: "E-mailadres", emailPlaceholder: "naam@voorbeeld.be", phone: "Telefoon",
    prefix: "Landcode", ack: "Voorbeeld: ingevoerde gegevens worden niet opgeslagen of verzonden.",
    privacy: "Privacyverklaring wordt vóór de lancering voorzien.", submit: "Doorgaan",
    errorCount: (n) => (n === 1 ? "1 veld te corrigeren." : `${n} velden te corrigeren.`),
  },
  errors: {
    firstNameRequired: "Vul je voornaam in.", lastNameRequired: "Vul je achternaam in.",
    birthDateRequired: "Vul je geboortedatum in.", birthDateInvalid: "Ongeldige datum.",
    birthDateFuture: "De datum kan niet in de toekomst liggen.", emailRequired: "Vul je e-mailadres in.",
    emailInvalid: "Ongeldig e-mailadres.", phoneRequired: "Vul je telefoonnummer in.",
    phoneInvalid: "Telefoonnummer lijkt niet te kloppen.", ackRequired: "Bevestig dat je de opmerking hebt gelezen.",
  },
  done: {
    badge: "Voorbeeld · geen e-mail verzonden", title: "Bevestig je e-mail",
    body: "In de echte versie ontvang je een e-mail om je adres te bevestigen. Je aanwezigheid bevestigen (RSVP) is een latere, aparte stap.",
    step1: "1 · E-mail bevestigen", step2: "2 · Aanwezigheid bevestigen", restart: "Opnieuw beginnen",
  },
  review: {
    title: "Designreview", note: "Alleen voorbeeld. Synthetische data, geen echte toegang, niets opgeslagen of verzonden.",
    publicFlow: "Publieke flow (echt gedrag zonder backend)", sampleFlow: "Volledige flow met voorbeeldcode",
    backoffice: "Voorbeeld back-office", staffLogin: "Staff login",
  },
  staff: {
    loginEyebrow: "Night Life Event · Staff", loginTitle: "Staff aanmelden", username: "Gebruikersnaam", password: "Wachtwoord",
    show: "Wachtwoord tonen", hide: "Wachtwoord verbergen", signIn: "Aanmelden",
    usernameRequired: "Vul je gebruikersnaam in.", passwordRequired: "Vul je wachtwoord in.",
    loginUnavailable: "Aanmelden is nog niet beschikbaar: de authenticatiedienst is niet gekoppeld.",
    lockedTitle: "Beveiligde zone", lockedBody: "Het dashboard verschijnt pas na een geverifieerde aanmelding.", goLogin: "Naar aanmelden",
    sampleData: "VOORBEELDDATA",
    nav: { overview: "Overzicht", events: "Evenementen", codes: "Codes", guests: "Gasten", team: "Staff" },
    event: "Evenement", newEvent: "Nieuw evenement", eventName: "Naam evenement", venue: "Locatie", date: "Datum en uur", capacity: "Capaciteit",
    cancel: "Annuleren", save: "Opslaan",
    stats: { invited: "Uitgenodigd", verified: "E-mails bevestigd", rsvp: "RSVP bevestigd", checkedIn: "Ingecheckt" },
    generator: "Codegenerator", type: "Type", personal: "Persoonlijk", shared: "Gedeeld", quota: "Quotum", expiry: "Vervaldatum",
    generate: "Codes genereren", export: "CSV exporteren", scanner: "Scanner openen", code: "Code", uses: "Gebruik", status: "Status",
    name: "Naam", email: "E-mail", role: "Rol",
    statusLabels: { active: "Actief", used: "Gebruikt", expired: "Verlopen", revoked: "Ingetrokken" },
    guestLabels: { verified: "Bevestigd", pending: "In afwachting", yes: "Ja", no: "Nee", in: "Binnen", out: "—" },
    roles: { owner: "Eigenaar", manager: "Manager", door: "Deur" }, rsvp: "RSVP", checkin: "Check-in",
  },
};

export const DICTIONARY: Record<Locale, Dict> = { it, en, fr, nl };

export function detectLocale(languages: readonly string[]): Locale {
  for (const l of languages) {
    const base = l.toLowerCase().split("-")[0] as Locale;
    if ((LOCALES as readonly string[]).includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

const INTL: Record<Locale, string> = { it: "it-IT", en: "en-GB", fr: "fr-BE", nl: "nl-BE" };
export function formatDate(d: Date, locale: Locale, withTime = false): string {
  return new Intl.DateTimeFormat(INTL[locale], {
    dateStyle: "medium", ...(withTime ? { timeStyle: "short" } : {}), timeZone: "Europe/Brussels",
  }).format(d);
}