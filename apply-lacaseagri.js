#!/usr/bin/env node
/**
 * apply-lacaseagri.js  v2
 * Applique la traduction française ET le thème La Case Agri (vert/orange)
 * sur les fichiers sources Angular du portail d'enregistrement.
 * Couvre : traduction (tous textes EN→FR) + design (styles, logo, responsive).
 *
 * Usage : node apply-lacaseagri.js
 * Réinitialiser : node apply-lacaseagri.js --revert
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'frontend', 'src');
const REVERT = process.argv.includes('--revert');

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

function patch(relPath, replacements) {
  const file = path.join(ROOT, relPath);
  let content = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of replacements) {
    const [search, replace] = REVERT ? [to, from] : [from, to];
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`  ✓  ${relPath}  (${changed} remplacement${changed > 1 ? 's' : ''})`);
  } else {
    console.log(`  –  ${relPath}  (déjà à jour)`);
  }
}

function patchFrontend(relPath, replacements) {
  const file = path.join(__dirname, 'frontend', relPath);
  let content = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of replacements) {
    const [search, replace] = REVERT ? [to, from] : [from, to];
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`  ✓  ${relPath}  (${changed} remplacement${changed > 1 ? 's' : ''})`);
  } else {
    console.log(`  –  ${relPath}  (déjà à jour)`);
  }
}

function createOrDelete(relPath, content) {
  const file = path.join(__dirname, 'frontend', relPath);
  if (REVERT) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`  ✓  ${relPath}  (supprimé)`);
    } else {
      console.log(`  –  ${relPath}  (déjà absent)`);
    }
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`  ✓  ${relPath}  (créé)`);
  }
}

// ---------------------------------------------------------------------------
console.log(REVERT ? '\n⟵  Annulation des modifications La Case Agri…\n' : '\n⟶  Application des modifications La Case Agri…\n');
// ---------------------------------------------------------------------------

// ── 1. index.html ── lang + titre + polices
patch('index.html', [
  ['<html lang="en">', '<html lang="fr">'],
  ['<title>On Boarding Portal</title>', "<title>Portail d'Enregistrement — La Case Agri</title>"],
  [
    '  <link rel="icon" type="image/x-icon" href="favicon.ico">\n</head>',
    '  <link rel="icon" type="image/x-icon" href="favicon.ico">\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />\n</head>',
  ],
]);

// ── 2. styles.scss ── thème Material vert + bloc La Case Agri
patch('styles.scss', [
  [
    '@include mat.theme((color: mat.$blue-palette,\n      typography: Roboto,\n      density: 0));',
    '@include mat.theme((color: mat.$green-palette,\n      secondary: mat.$orange-palette,\n      typography: Roboto,\n      density: 0));',
  ],
  [
    'body {\n  margin: 0;\n  box-sizing: content-box;\n}',
    'body {\n  margin: 0;\n  overflow-x: hidden;\n}\n\n*, *::before, *::after {\n  box-sizing: border-box;\n}',
  ],
  [
    'button[color="warn"] {\n  --mat-sys-primary: var(--mat-sys-error);\n  --mat-sys-on-primary: var(--mat-sys-on-error);\n  --mat-sys-primary-container: var(--mat-sys-error-container);\n  --mat-sys-on-primary-container: var(--mat-sys-on-error-container);\n}',
    'button[color="warn"] {\n  --mat-sys-primary: var(--mat-sys-error);\n  --mat-sys-on-primary: var(--mat-sys-on-error);\n  --mat-sys-primary-container: var(--mat-sys-error-container);\n  --mat-sys-on-primary-container: var(--mat-sys-on-error-container);\n}\n\n/* --- Thème La Case Agri --- */\nhtml, body, *:not(mat-icon):not(.material-icons):not(.material-symbols-outlined) {\n  font-family: \'Inter\', \'Roboto\', sans-serif !important;\n}\n\n.material-icons,\nmat-icon {\n  font-family: \'Material Symbols Outlined\' !important;\n  font-weight: normal !important;\n  font-style: normal !important;\n  font-size: 24px !important;\n  line-height: 1 !important;\n  letter-spacing: normal !important;\n  text-transform: none !important;\n  display: inline-block !important;\n  white-space: nowrap !important;\n  word-wrap: normal !important;\n  direction: ltr !important;\n  -webkit-font-feature-settings: \'liga\' !important;\n  -webkit-font-smoothing: antialiased !important;\n}\n\n:root {\n  --mat-toolbar-container-background-color: #ffffff !important;\n  --mdc-filled-button-container-color: #e07a20 !important;\n  --mdc-protected-button-container-color: #e07a20 !important;\n  --mat-primary: #1a4731 !important;\n  --app-navy-gradient: linear-gradient(35deg, #ffffff 0%, #ffffff 100%) !important;\n}\n\n.mat-toolbar.mat-primary, mat-toolbar.mat-primary, .main-header {\n  background-color: #ffffff !important;\n  color: #1a4731 !important;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;\n}\n\n.mat-toolbar .nav-link, .mat-toolbar button, .mat-toolbar .mdc-button__label, .mat-toolbar mat-icon {\n  color: #1a4731 !important;\n}\n\n.mat-mdc-raised-button.mat-primary, .mat-mdc-unelevated-button.mat-primary,\n.mat-mdc-flat-button.mat-primary, button.mat-primary, .mdc-button--raised {\n  --mdc-filled-button-container-color: #e07a20 !important;\n  background-color: #e07a20 !important;\n  color: #ffffff !important;\n}\nbutton.mat-primary mat-icon, button[color="primary"] mat-icon { color: #ffffff !important; }\n\n.mat-mdc-button.mat-primary, .mat-mdc-icon-button.mat-primary, a.mat-primary { color: #1a4731 !important; }\n\n.mat-mdc-card, mat-card { background-color: #ffffff !important; box-shadow: none !important; }\n.mat-mdc-card mat-icon, mat-card mat-icon { color: #1a4731 !important; }\n\n.mat-mdc-form-field {\n  --mdc-outlined-text-field-focus-outline-color: #1a4731 !important;\n  --mdc-outlined-text-field-hover-outline-color: #40916c !important;\n  --mdc-outlined-text-field-caret-color: #1a4731 !important;\n  --mdc-outlined-text-field-focus-label-text-color: #1a4731 !important;\n  --mdc-outlined-text-field-label-text-color: #4a7a5e !important;\n  --mat-form-field-container-text-color: #1a4731 !important;\n}\n.mdc-floating-label, .mat-mdc-floating-label { color: #4a7a5e !important; }\n.mdc-text-field--focused .mdc-floating-label { color: #1a4731 !important; }\n\nh1, h2 { color: #0d2b1a !important; }\n\n.cta-small, button[color="accent"] {\n  background-color: #e07a20 !important;\n  color: #ffffff !important;\n}\n.cta-small .mdc-button__label, button[color="accent"] .mdc-button__label,\n.cta-small mat-icon, button[color="accent"] mat-icon { color: #ffffff !important; }\n.cta-small:hover, button[color="accent"]:hover { background-color: #c96a10 !important; }\n.mat-mdc-menu-panel .mobile-cta {\n  border-radius: 9999px !important; margin: 8px 12px !important;\n  width: calc(100% - 24px) !important; min-height: 40px !important; justify-content: center !important;\n}\n\n.mat-mdc-raised-button[color="warn"], .mat-mdc-unelevated-button[color="warn"],\n.mat-mdc-flat-button[color="warn"], button[matButton="filled"][color="warn"] {\n  color: #ffffff !important;\n}\n\n.mat-stepper-horizontal, .mat-stepper-vertical {\n  --mat-stepper-header-selected-state-icon-background-color: #1a4731 !important;\n  --mat-stepper-header-selected-state-icon-foreground-color: #ffffff !important;\n  --mat-stepper-container-color: #f0f7f2 !important;\n  background-color: #f0f7f2 !important;\n}\n\n.mat-mdc-tab-group {\n  --mdc-tab-indicator-active-indicator-color: #1a4731 !important;\n  --mat-tab-header-active-label-text-color: #1a4731 !important;\n}\n.mdc-tab-indicator__content--underline { border-color: #1a4731 !important; }\n\n.mat-mdc-select-panel { background-color: #f0f7f2 !important; }\n.mat-mdc-option {\n  --mat-option-label-text-color: #1a4731 !important;\n  --mat-option-selected-state-label-text-color: #1a4731 !important;\n}\n.mdc-checkbox {\n  --mdc-checkbox-selected-icon-color: #1a4731 !important;\n  --mdc-checkbox-selected-checkmark-color: #ffffff !important;\n}',
  ],
]);

// ── 3. angular.json ── budget + analytics
patchFrontend('angular.json', [
  ['"packageManager": "npm"', '"packageManager": "npm",\n    "analytics": "e7b5347c-bb9c-4faf-8604-04c5edc69e08"'],
  ['"maximumError": "1MB"', '"maximumError": "1.5MB"'],
]);

// ── 4. toolbar.html ── logo + nav desktop/mobile + textes FR
patch('app/core/components/toolbar/toolbar.html', [
  [
    '            <img src="/favicon.ico" width="80" height="80" />\n            <span>Onboarding Portal</span>',
    '            <img src="/lacaseagri-logo.svg" alt="La Case Agri" height="48" style="width: auto;" />',
  ],
  ['        <div>', '        <div class="desktop-nav">'],
  ['                ADMIN PORTAL', '                PORTAIL ADMIN'],
  ['                START ONBOARDING PROCESS', "                DÉMARRER L'ENREGISTREMENT"],
  [
    '                <button (click)="onLogout()" mat-menu-item>Logout</button>',
    '                <button (click)="onLogout()" mat-menu-item>Déconnexion</button>',
  ],
  [
    '        }\n    </div>\n</mat-toolbar>',
    '        }\n\n        <button mat-icon-button class="mobile-menu-toggle" [matMenuTriggerFor]="mobileMenu">\n            <mat-icon>menu</mat-icon>\n        </button>\n        <mat-menu #mobileMenu="matMenu">\n            @if(showAdminLogin) {\n            <button mat-menu-item (click)="onAdminLogin()">\n                <mat-icon>lock_open</mat-icon>\n                <span>PORTAIL ADMIN</span>\n            </button>\n            }\n            @if(showOnBoarding) {\n            <button mat-menu-item class="cta-small mobile-cta" (click)="onSubmit()">\n                <mat-icon>add_business</mat-icon>\n                <span>DÉMARRER L\'ENREGISTREMENT</span>\n            </button>\n            }\n            @if(showUserMenu && user) {\n            <button mat-menu-item disabled>\n                <p>{{ user.preferred_username }}</p>\n            </button>\n            <button mat-menu-item (click)="onLogout()">\n                <mat-icon>logout</mat-icon>\n                <span>Déconnexion</span>\n            </button>\n            }\n        </mat-menu>\n        }\n    </div>\n</mat-toolbar>',
  ],
]);

// ── 5. toolbar.scss ── responsive mobile
patch('app/core/components/toolbar/toolbar.scss', [
  [
    '.spacer {\n    flex: 1 1 auto;\n}',
    '.spacer {\n    flex: 1 1 auto;\n}\n\n.desktop-nav {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    .nav-link {\n        border-radius: 20px;\n        background-color: rgba(26,71,49,0.08);\n        transition: background-color 0.2s ease;\n        &:hover { background-color: rgba(26,71,49,0.18); }\n    }\n}\n\n.mobile-menu-toggle { display: none; }\n\n@media (max-width: 768px) {\n    .desktop-nav { display: none !important; }\n    .mobile-menu-toggle { display: inline-flex !important; }\n}',
  ],
]);

// ── 6. landing.html ── textes FR
patch('app/features/landing/landing.html', [
  ['Scale Trust in your <br>Data Space', 'Renforcez la confiance dans votre <br>Data Space'],
  [
    'Streamlining the integration of organizations into the Data Space, providing a simple and\n                secure environment for managing corporate Verifiable Credentials. Successful completion of the\n                onboarding process enables participation as a trusted ecosystem member.',
    "Simplifiez l'intégration des organisations dans le Data Space, dans un environnement sécurisé\n                dédié à la gestion des Justificatifs Vérifiables. La finalisation du processus d'enregistrement\n                permet de participer en tant que membre de confiance de l'écosystème.",
  ],
  ['START ONBOARDING PROCESS', "DÉMARRER L'ENREGISTREMENT"],
  ['CHECK ONBOARDING STATUS', 'VÉRIFIER MON STATUT'],
  ['Digital Identity', 'Identité Numérique'],
  [
    "Link your organization's legal identity with decentralized identifiers (DID) for secure interoperability.",
    "Associez l'identité juridique de votre organisation à des identifiants décentralisés (DID) pour une interopérabilité sécurisée.",
  ],
  ['Trust Framework', 'Cadre de Confiance'],
  [
    'Validated onboarding ensures all participants comply with the specific governance rules of the data space.',
    "L'enregistrement validé garantit que tous les participants respectent les règles de gouvernance spécifiques du data space.",
  ],
  ['Wallet Ready', 'Portefeuille Prêt'],
  [
    'Once approved, your organization will be fully authorized to participate in the data spaces and interact\n            with other ecosystem members.',
    "Une fois approuvée, votre organisation sera pleinement autorisée à participer aux data spaces et à interagir avec les autres membres de l'écosystème.",
  ],
]);

// ── 7. landing.scss ── design vert + responsive
patch('app/features/landing/landing.scss', [
  ['.container {\n  margin: 0 auto;\n  width: 100%;\n  padding: 0 24px;\n}', '.container {\n  margin: 0 auto;\n  width: 100%;\n  padding: 0 24px;\n  box-sizing: border-box;\n}'],
  ['.hero-bg {\n  padding: 80px 0;\n}', '.hero-bg {\n  padding: 80px 0;\n  background: #ffffff;\n}'],
  ['.main-card {\n  padding: 40px;\n  overflow: hidden;\n', '.main-card {\n  padding: 40px;\n  overflow: hidden;\n  box-shadow: 0 20px 50px rgba(13,43,26,0.15);\n'],
  ['    color: var(--mat-sys-on-primary-fixed);', '    color: #0d2b1a;'],
  ['    color: #555;', '    color: #4a7a5e;'],
  [
    '.feature-card {\n  transition: transform 0.3s ease;\n  &:hover {\n    transform: translateY(-5px);\n  }\n\n  .icon-box {',
    '.feature-card {\n  transition: transform 0.3s ease;\n  border-color: rgba(26,71,49,0.12);\n  &:hover {\n    transform: translateY(-5px);\n    box-shadow: 0 12px 28px rgba(26,71,49,0.18);\n  }\n  mat-card-title { color: #0d2b1a; }\n  mat-card-content p { color: #4a7a5e; }\n  .icon-box {',
  ],
  ['    background: #f0f2ff;\n    color: #3f51b5;\n    display: flex;', '    background: #1a4731;\n    color: #ffffff;\n    display: flex;'],
  ['    border-radius: 12px;\n  }\n}\n\n.action-row {', '    border-radius: 12px;\n    mat-icon { color: #ffffff !important; }\n  }\n}\n\n.action-row {'],
  [
    '.action-row {\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  gap: 16px;\n}\n// Animations',
    '.action-row {\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  gap: 16px;\n  button:first-of-type {\n    background-color: #e07a20; color: #ffffff;\n    &:hover { background-color: #c96a10; }\n    mat-icon, .mdc-button__label { color: #ffffff !important; }\n  }\n  button:nth-of-type(2) {\n    background-color: #1a4731; color: #ffffff;\n    &:hover { background-color: #2d6b4a; }\n    mat-icon, .mdc-button__label { color: #ffffff !important; }\n  }\n}\n\n*:focus-visible { outline-color: #40916c; }\n\n@media (max-width: 768px) {\n  .container { padding: 0 16px; }\n  .hero-bg { padding: 32px 0; }\n  .main-card { padding: 24px 18px; margin-left: 16px; margin-right: 16px;\n    .title { font-size: 2rem; } .subtitle { font-size: 1rem; } }\n  .feature-card { margin-left: 16px; margin-right: 16px; }\n  .action-row { flex-direction: column; width: 100%; gap: 12px;\n    button { width: 100%; justify-content: center; } }\n}\n\n@media (max-width: 480px) {\n  .main-card { padding: 20px 14px;\n    .title { font-size: 1.6rem; line-height: 1.2; } .subtitle { font-size: 0.95rem; } }\n  .feature-card { padding: 4px; mat-card-title { font-size: 17px; } }\n}\n\n// Animations',
  ],
]);

// ── 8. submit.html ── bouton fermer + textes FR
patch('app/features/submit/submit.html', [
  [
    '        <mat-card class="main-container animate-fade-in">\n\n            <mat-tab-group',
    '        <mat-card class="main-container animate-fade-in">\n            <button mat-icon-button class="close-btn" (click)="close()" aria-label="Fermer">\n                <mat-icon>close</mat-icon>\n            </button>\n\n            <mat-tab-group',
  ],
  ['<span>REGISTER ENTITY</span>', '<span>INSCRIRE UNE ENTITÉ</span>'],
  ['<span>TRACK PROGRESS</span>', '<span>SUIVRE LA PROGRESSION</span>'],
  ['<h2>Resume Onboarding</h2>', "<h2>Reprendre l'Enregistrement</h2>"],
  ['Retrieve the status of a previously submitted organization profile.', "Retrouvez le statut d'un profil d'organisation précédemment soumis."],
  ['<mat-label>Application Tracking ID</mat-label>', '<mat-label>Identifiant de suivi de la demande</mat-label>'],
]);

// ── 9. submit.scss ── bouton fermer
patch('app/features/submit/submit.scss', [
  ['.page-container {', '.page-container {\n  position: relative;'],
  ['.onboarding-wrapper {', '.close-btn {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  z-index: 10;\n}\n\n.onboarding-wrapper {'],
]);

// ── 10. submit.ts ── méthode close()
patch('app/features/submit/submit.ts', [
  [
    '  protected updateAnchor(index: number) {',
    "  close(): void {\n    this.router.navigate(['/']);\n  }\n\n  protected updateAnchor(index: number) {",
  ],
]);

// ── 11. admin/dashboard/dashboard.html ── titre + icône FR
patch('app/features/admin/dashboard/dashboard.html', [
  [
    '                    <mat-card-title>Subscriptions List</mat-card-title>\n                    <mat-card-subtitle>Manage and monitor all user registrations</mat-card-subtitle>',
    '                    <div class="title-row">\n                        <mat-icon class="title-icon">assignment</mat-icon>\n                        <mat-card-title>Liste des Inscriptions</mat-card-title>\n                    </div>\n                    <mat-card-subtitle>Gérer et suivre toutes les inscriptions des utilisateurs</mat-card-subtitle>',
  ],
]);

// ── 12. admin/dashboard/dashboard.scss ── styles titre + card
patch('app/features/admin/dashboard/dashboard.scss', [
  [
    '  box-shadow: var(--mat-sys-level2);',
    '  box-shadow: none !important;\n}\n.header-container { padding-left: 14px; }\n.title-row {\n  display: flex; align-items: center; gap: 10px;\n  .title-icon { color: #1a4731; }\n  ::ng-deep mat-card-title { font-weight: 700 !important; color: #1a4731 !important; }\n}\n::ng-deep mat-card-subtitle { color: #4a7a5e !important; margin-top: 2px !important;',
  ],
]);

// ── 13. admin/dashboard/dashboard.ts ── import MatIconModule + colonnes FR + statuts FR
patch('app/features/admin/dashboard/dashboard.ts', [
  [
    "import { PaginatedTable } from '../../core/components/paginated-table/paginated-table';",
    "import { MatIconModule } from '@angular/material/icon';\nimport { PaginatedTable } from '../../core/components/paginated-table/paginated-table';",
  ],
  ["  imports: [PaginatedTable, Toolbar, MatCardModule],", "  imports: [PaginatedTable, Toolbar, MatCardModule, MatIconModule],"],
  ["label: 'Email Address',", "label: 'Adresse e-mail',"],
  ["label: 'Current Status',", "label: 'Statut actuel',"],
  [
    'getValue: (row) => row.status.split("_").join(" ")',
    'getValue: (row) => ({"submitted":"Soumis","under_review":"En cours d\'examen","action_required":"Action requise","active":"Actif","rejected":"Rejeté"})[row.status] || row.status.split("_").join(" ")',
  ],
  ["label: 'Registration Date',", "label: \"Date d'inscription\","],
  ["label: 'Last Update',", "label: 'Dernière mise à jour',"],
  [
    "data: { title: 'Delete registration', message: `Are you sure you want to delete the registration for ${row.email}? This action cannot be undone.` }",
    "data: { title: \"Supprimer l'inscription\", message: `Êtes-vous sûr de vouloir supprimer l'inscription pour ${row.email} ? Cette action est irréversible.` }",
  ],
  ["this.notificationService.info('Registration deleted successfully'),", "this.notificationService.info('Inscription supprimée avec succès'),"],
  ["this.notificationService.error('Failed to delete registration');", "this.notificationService.error(\"Échec de la suppression de l'inscription\");"],
  ["label: 'Status',", "label: 'Statut',"],
  [
    'label: key.split("_").join(" "),',
    'label: ({"SUBMITTED":"SOUMIS","UNDER_REVIEW":"EN COURS D\'EXAMEN","ACTION_REQUIRED":"ACTION REQUISE","ACTIVE":"ACTIF","REJECTED":"REJETÉ"})[key] || key.split("_").join(" "),',
  ],
]);

// ── 14. admin/review/review.html ── textes FR
patch('app/features/admin/review/review.html', [
  ['<mat-card-title>Review Registrations</mat-card-title>', '<mat-card-title>Réviser les Inscriptions</mat-card-title>'],
  ['<h2>No Registration Found</h2>', '<h2>Aucune Inscription Trouvée</h2>'],
  [
    "We couldn't find the details for the ID provided. It may have been deleted or you might not have\n                        permission to view it.",
    "Nous n'avons pas trouvé les détails pour l'identifiant fourni. Il a peut-être été supprimé ou vous ne disposez pas des droits nécessaires pour le consulter.",
  ],
  ['RETURN TO DASHBOARD', 'RETOUR AU TABLEAU DE BORD'],
]);

// ── 15. admin-registration-details.html ── labels FR + boutons FR
patch('app/core/components/admin-registration-details/admin-registration-details.html', [
  ['<span>SUMMARY</span>', '<span>RÉSUMÉ</span>'],
  ['<span>COMPANY INFORMATION</span>', "<span>INFORMATIONS DE L'ENTREPRISE</span>"],
  ['<mat-label>Register Status</mat-label>', "<mat-label>Statut de l'inscription</mat-label>"],
  ['<mat-label>Registration ID</mat-label>', "<mat-label>Identifiant d'inscription</mat-label>"],
  ['<mat-label>Administrative Email</mat-label>', '<mat-label>E-mail administratif</mat-label>'],
  ['<mat-label>Submission Date</mat-label>', '<mat-label>Date de soumission</mat-label>'],
  ['<mat-label>Last Update</mat-label>', '<mat-label>Dernière mise à jour</mat-label>'],
  ['<mat-label class="section-label">Attached Documents</mat-label>', '<mat-label class="section-label">Documents joints</mat-label>'],
  ['        <button type="button" mat-flat-button color="warn" class="delete-action" (click)="deleteRegistration()">', '        <button type="button" matButton="filled" color="warn" class="delete-action" (click)="deleteRegistration()">'],
  ['            Delete\n', '            Supprimer\n'],
  ['            Review\n', '            Réviser\n'],
  ['            Save\n', '            Enregistrer\n'],
  ['            Cancel\n', '            Annuler\n'],
]);

// ── 16. admin-registration-details.scss ── fond vert pâle
patch('app/core/components/admin-registration-details/admin-registration-details.scss', [
  ['$main-bg-color: #f9f9f9;', '$main-bg-color: #f0f7f2;'],
  [
    '    border: 1px solid #e0e0e0;',
    '    ::ng-deep .mat-form-field-disabled {\n        .mdc-text-field, .mat-mdc-text-field-wrapper { background-color: transparent !important; }\n        input.mat-mdc-input-element { -webkit-text-fill-color: #1a4731 !important; }\n    }\n  ::ng-deep button[color="warn"] mat-icon,\n  ::ng-deep button[color="accent"] mat-icon,\n  ::ng-deep button[color="primary"] mat-icon { color: #ffffff !important; }',
  ],
]);

// ── 17. admin-registration-details.ts ── notifications + dialog + statuts FR
patch('app/core/components/admin-registration-details/admin-registration-details.ts', [
  ["this.notification.show('Registration updated')", "this.notification.show('Inscription mise à jour')"],
  ["this.notification.error('Registration update failed')", "this.notification.error(\"Échec de la mise à jour de l'inscription\")"],
  ['this.notification.error("Error opening file");', "this.notification.error(\"Erreur lors de l'ouverture du fichier\");"],
  [
    "title: 'Delete registration',\n        message: `Are you sure you want to delete the registration for ${this.registration().email}? This action cannot be undone.`",
    "title: \"Supprimer l'inscription\",\n        message: `Êtes-vous sûr de vouloir supprimer l'inscription pour ${this.registration().email} ? Cette action est irréversible.`",
  ],
  ["this.notification.info('Registration deleted successfully'),", "this.notification.info('Inscription supprimée avec succès'),"],
  ["this.notification.error('Failed to delete registration')", "this.notification.error(\"Échec de la suppression de l'inscription\")"],
  [
    'return status.split("_").join(" ");',
    'const map = { submitted: "Soumis", under_review: "En cours d\'examen", action_required: "Action requise", active: "Actif", rejected: "Rejeté" };\n    return map[status] ?? status.split("_").join(" ");',
  ],
]);

// ── 18. confirm-dialog.ts ── textes par défaut FR
patch('app/core/components/confirm-dialog/confirm-dialog.ts', [
  ["readonly title = this.data.title ?? 'Delete file';", "readonly title = this.data.title ?? 'Supprimer le fichier';"],
  [
    "readonly message = this.data.message ?? 'Are you sure you want to delete this file? This action cannot be undone.';",
    "readonly message = this.data.message ?? 'Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.';",
  ],
  ["readonly confirmText = this.data.confirmText ?? 'Delete';", "readonly confirmText = this.data.confirmText ?? 'Supprimer';"],
  ["readonly cancelText = this.data.cancelText ?? 'Cancel';", "readonly cancelText = this.data.cancelText ?? 'Annuler';"],
]);

// ── 19. paginated-table.html ── textes FR
patch('app/core/components/paginated-table/paginated-table.html', [
  ['placeholder="Search..."', 'placeholder="Rechercher..."'],
  ['            Clear Filters', '            Effacer les filtres'],
]);

// ── 20. paginated-table.scss ── fond vert pâle + table
patch('app/core/components/paginated-table/paginated-table.scss', [
  [
    '  box-shadow: var(--mat-sys-level1);\n  background-color: var(--mat-sys-surface-container-low);',
    '  background-color: #f0f7f2;\n    ::ng-deep button[color="warn"] {\n      border-radius: 20px;\n      background-color: rgba(211,47,47,0.08);\n      transition: background-color 0.2s ease;\n      mat-icon { color: currentColor !important; }\n      &:hover { background-color: rgba(211,47,47,0.16); }\n    }',
  ],
  ['  background-color: var(--mat-sys-surface);\n', '  background-color: #f0f7f2;\n  --mat-table-row-item-outline-color: rgba(26,71,49,0.12);\n  --mdc-data-table-divider-color: rgba(26,71,49,0.12);\n'],
  ['    background-color: var(--mat-sys-surface-container-low);\n  }\n\n  .paginator', '    background-color: #f0f7f2;\n  }\n\n  .paginator'],
  ['  background-color: var(--mat-sys-surface-container-low);', '  background-color: #f0f7f2;'],
]);

// ── 21. registration-details.scss ── fond vert pâle
patch('app/core/components/registration-details/registration-details.scss', [
  ['$main-bg-color: #f9f9f9;', '$main-bg-color: #f0f7f2;'],
  ['    border: 1px solid #e0e0e0;\n', '\n'],
]);

// ── 22. registration-form.html ── textes + placeholders FR
patch('app/core/components/registration-form/registration-form.html', [
  ['        <h2>Organization Registration</h2>', "        <h2>Inscription de l'Organisation</h2>"],
  ['        <p>Follow the steps to initialize your data space integration.</p>', '        <p>Suivez les étapes pour initialiser votre intégration au data space.</p>'],
  ['<ng-template matStepLabel>Company Information</ng-template>', "<ng-template matStepLabel>Informations de l'entreprise</ng-template>"],
  ['<mat-label>Official Registered Name</mat-label>', '<mat-label>Raison sociale officielle</mat-label>'],
  ['placeholder="e.g. Acme Corporation S.L."', 'placeholder="ex. : Acme Corporation S.A.S."'],
  ['<mat-label>Full Address</mat-label>', '<mat-label>Adresse complète</mat-label>'],
  ['placeholder="e.g. 123 Business St. Suite 400"', 'placeholder="ex. : 12 Rue du Commerce, Bât. B"'],
  ['<mat-label>City</mat-label>', '<mat-label>Ville</mat-label>'],
  ['placeholder="e.g. Madrid"', 'placeholder="ex. : Abidjan"'],
  ['<mat-label>Country</mat-label>', '<mat-label>Pays</mat-label>'],
  ['placeholder="e.g. Spain"', "placeholder=\"ex. : Côte d'Ivoire\""],
  ['<mat-label>Postal Code</mat-label>', '<mat-label>Code postal</mat-label>'],
  ['placeholder="e.g. 28001"', 'placeholder="ex. : 01 BP 1234"'],
  ['<mat-label>Tax Identifier (VAT/CIF)</mat-label>', '<mat-label>Identifiant fiscal (TVA/NIF)</mat-label>'],
  ['placeholder="e.g. ESA12345678"', 'placeholder="ex. : CI12345678"'],
  ['[disabled]="orgForm.invalid">NEXT</button>', '[disabled]="orgForm.invalid">SUIVANT</button>'],
  ['<ng-template matStepLabel>Contact Information</ng-template>', '<ng-template matStepLabel>Informations de contact</ng-template>'],
  ['<mat-label>Administrative Contact Email</mat-label>', '<mat-label>E-mail de contact administratif</mat-label>'],
  ['placeholder="compliance@entity.com"', 'placeholder="conformite@organisation.com"'],
  ['                        Please enter a <strong>valid</strong> email address', '                        Veuillez saisir une adresse e-mail <strong>valide</strong>'],
  ['<mat-hint>Empty field triggers automated DID generation.</mat-hint>', '<mat-hint>Champ vide déclenche la génération automatique du DID.</mat-hint>'],
  ['Invalid DID format. It should follow <strong>did:method:id</strong> (e.g., did:web:example.com)', 'Format DID invalide. Il doit suivre le format <strong>did:méthode:id</strong> (ex. : did:web:example.com)'],
  ['matStepperPrevious>BACK</button>\n                <button mat-flat-button color="primary" matStepperNext', 'matStepperPrevious>RETOUR</button>\n                <button mat-flat-button color="primary" matStepperNext'],
  ['[disabled]="contactForm.invalid">NEXT</button>', '[disabled]="contactForm.invalid">SUIVANT</button>'],
  ['<ng-template matStepLabel>Signed Document</ng-template>', '<ng-template matStepLabel>Document signé</ng-template>'],
  ['matTooltip="Open acceptance agreement"', "matTooltip=\"Ouvrir l'accord d'acceptation\""],
  ['Read the following <a', 'Lisez le <a'],
  ['and upload it signed.</p>', 'et téléversez-le signé.</p>'],
  ['<app-upload-file label="Signed Acceptance Agreement"', "<app-upload-file label=\"Accord d'acceptation signé\""],
  ['matStepperPrevious>BACK</button>', 'matStepperPrevious>RETOUR</button>'],
  ['                        SUBMIT APPLICATION', '                        SOUMETTRE LA DEMANDE'],
  ['<h2>Submission Received</h2>', '<h2>Demande reçue</h2>'],
]);

// ── 23. registration-form.ts ── notification FR
patch('app/core/components/registration-form/registration-form.ts', [
  [
    "this.notification.error('Error submitting the application');",
    "this.notification.error('Erreur lors de la soumission de la demande');",
  ],
]);

// ── 24. Logo SVG La Case Agri
const logoSvg = '<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <rect width="200" height="60" rx="8" fill="#f0f7f2"/>\n  <text x="12" y="38" font-family="Inter, Roboto, sans-serif" font-size="26" font-weight="800" fill="#1a4731">La Case</text>\n  <text x="12" y="55" font-family="Inter, Roboto, sans-serif" font-size="14" font-weight="600" fill="#e07a20" letter-spacing="2">AGRI</text>\n</svg>';
createOrDelete('public/lacaseagri-logo.svg', logoSvg);

console.log('\nTerminé.\n');
