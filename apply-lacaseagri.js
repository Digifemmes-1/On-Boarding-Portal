#!/usr/bin/env node
/**
 * apply-lacaseagri.js
 * Applique la traduction française et le thème La Case Agri (vert/orange)
 * sur les fichiers sources Angular du portail d'enregistrement.
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

// ---------------------------------------------------------------------------
// Modifications par fichier
// ---------------------------------------------------------------------------

console.log(REVERT ? '\n⟵  Annulation des modifications La Case Agri…\n' : '\n⟶  Application des modifications La Case Agri…\n');

// index.html
patch('index.html', [
  ['<html lang="en">', '<html lang="fr">'],
  ['<title>On Boarding Portal</title>', "<title>Portail d'Enregistrement — La Case Agri</title>"],
]);

// styles.scss — thème vert + orange
patch('styles.scss', [
  [
    '@include mat.theme((color: mat.$blue-palette,\n      typography: Roboto,\n      density: 0));',
    '@include mat.theme((color: mat.$green-palette,\n      secondary: mat.$orange-palette,\n      typography: Roboto,\n      density: 0));',
  ],
]);

// landing.html
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

// submit.html
patch('app/features/submit/submit.html', [
  ['<span>REGISTER ENTITY</span>', '<span>INSCRIRE UNE ENTITÉ</span>'],
  ['<span>TRACK PROGRESS</span>', '<span>SUIVRE LA PROGRESSION</span>'],
  ['<h2>Resume Onboarding</h2>', "<h2>Reprendre l'Enregistrement</h2>"],
  [
    'Retrieve the status of a previously submitted organization profile.',
    "Retrouvez le statut d'un profil d'organisation précédemment soumis.",
  ],
  ['<mat-label>Application Tracking ID</mat-label>', '<mat-label>Identifiant de suivi de la demande</mat-label>'],
]);

// admin/dashboard/dashboard.html
patch('app/features/admin/dashboard/dashboard.html', [
  ['<mat-card-title>Subscriptions List</mat-card-title>', '<mat-card-title>Liste des Inscriptions</mat-card-title>'],
  [
    '<mat-card-subtitle>Manage and monitor all user registrations</mat-card-subtitle>',
    '<mat-card-subtitle>Gérer et suivre toutes les inscriptions des utilisateurs</mat-card-subtitle>',
  ],
]);

// admin/dashboard/dashboard.ts
patch('app/features/admin/dashboard/dashboard.ts', [
  ["label: 'Email Address',", "label: 'Adresse e-mail',"],
  ["label: 'Current Status',", "label: 'Statut actuel',"],
  [
    'getValue: (row) => row.status.split("_").join(" ")',
    `getValue: (row) => ({"submitted":"Soumis","under_review":"En cours d'examen","action_required":"Action requise","active":"Actif","rejected":"Rejeté"})[row.status] || row.status.split("_").join(" ")`,
  ],
  ["label: 'Registration Date',", "label: \"Date d'inscription\","],
  ["label: 'Last Update',", "label: 'Dernière mise à jour',"],
  [
    "data: { title: 'Delete registration', message: `Are you sure you want to delete the registration for ${row.email}? This action cannot be undone.` }",
    "data: { title: \"Supprimer l'inscription\", message: `Êtes-vous sûr de vouloir supprimer l'inscription pour ${row.email} ? Cette action est irréversible.` }",
  ],
  [
    "this.notificationService.info('Registration deleted successfully'),",
    "this.notificationService.info('Inscription supprimée avec succès'),",
  ],
  [
    "this.notificationService.error('Failed to delete registration');",
    "this.notificationService.error(\"Échec de la suppression de l'inscription\");",
  ],
  ["label: 'Status',", "label: 'Statut',"],
  [
    'label: key.split("_").join(" "),',
    `label: ({"SUBMITTED":"SOUMIS","UNDER_REVIEW":"EN COURS D'EXAMEN","ACTION_REQUIRED":"ACTION REQUISE","ACTIVE":"ACTIF","REJECTED":"REJETÉ"})[key] || key.split("_").join(" "),`,
  ],
]);

// admin/review/review.html
patch('app/features/admin/review/review.html', [
  ['<mat-card-title>Review Registrations</mat-card-title>', '<mat-card-title>Réviser les Inscriptions</mat-card-title>'],
  ['<h2>No Registration Found</h2>', '<h2>Aucune Inscription Trouvée</h2>'],
  [
    "We couldn't find the details for the ID provided. It may have been deleted or you might not have\n                        permission to view it.",
    "Nous n'avons pas trouvé les détails pour l'identifiant fourni. Il a peut-être été supprimé ou vous ne disposez pas des droits nécessaires pour le consulter.",
  ],
  ['RETURN TO DASHBOARD', 'RETOUR AU TABLEAU DE BORD'],
]);

// admin-registration-details.html
patch('app/core/components/admin-registration-details/admin-registration-details.html', [
  ['<span>SUMMARY</span>', '<span>RÉSUMÉ</span>'],
  ['<span>COMPANY INFORMATION</span>', "<span>INFORMATIONS DE L'ENTREPRISE</span>"],
  ['<mat-label>Register Status</mat-label>', "<mat-label>Statut de l'inscription</mat-label>"],
  ['<mat-label>Registration ID</mat-label>', "<mat-label>Identifiant d'inscription</mat-label>"],
  ['<mat-label>Administrative Email</mat-label>', '<mat-label>E-mail administratif</mat-label>'],
  ['<mat-label>Submission Date</mat-label>', '<mat-label>Date de soumission</mat-label>'],
  ['<mat-label>Last Update</mat-label>', '<mat-label>Dernière mise à jour</mat-label>'],
  ['<mat-label class="section-label">Attached Documents</mat-label>', '<mat-label class="section-label">Documents joints</mat-label>'],
  ['\n            Delete\n        </button>', '\n            Supprimer\n        </button>'],
  ['\n            Review\n        </button>', '\n            Réviser\n        </button>'],
  ['\n            Save\n        </button>', '\n            Enregistrer\n        </button>'],
  ['            Cancel\n        </button>', '            Annuler\n        </button>'],
  ['<mat-label>Official Registered Name</mat-label>', '<mat-label>Raison sociale officielle</mat-label>'],
  ['<mat-label>Tax Identifier (VAT/CIF)</mat-label>', '<mat-label>Identifiant fiscal (TVA/NIF)</mat-label>'],
  ['<mat-label>Full Address</mat-label>', '<mat-label>Adresse complète</mat-label>'],
  ['<mat-label>City</mat-label>', '<mat-label>Ville</mat-label>'],
  ['<mat-label>Country</mat-label>', '<mat-label>Pays</mat-label>'],
  ['<mat-label>Postal Code</mat-label>', '<mat-label>Code postal</mat-label>'],
]);

// admin-registration-details.ts
patch('app/core/components/admin-registration-details/admin-registration-details.ts', [
  ["this.notification.show('Registration updated')", "this.notification.show('Inscription mise à jour')"],
  ["this.notification.error('Registration update failed')", "this.notification.error(\"Échec de la mise à jour de l'inscription\")"],
  ['this.notification.error("Error opening file");', "this.notification.error(\"Erreur lors de l'ouverture du fichier\");"],
  [
    "title: 'Delete registration',\n        message: `Are you sure you want to delete the registration for ${this.registration().email}? This action cannot be undone.`",
    "title: \"Supprimer l'inscription\",\n        message: `Êtes-vous sûr de vouloir supprimer l'inscription pour ${this.registration().email} ? Cette action est irréversible.`",
  ],
  [
    "this.notification.info('Registration deleted successfully'),",
    "this.notification.info('Inscription supprimée avec succès'),",
  ],
  [
    "this.notification.error('Failed to delete registration')",
    "this.notification.error(\"Échec de la suppression de l'inscription\")",
  ],
  [
    'prettyStatus(status: string) {\n    return status.split("_").join(" ");\n  }',
    `prettyStatus(status: string) {\n    const map: Record<string, string> = {\n      submitted: 'Soumis',\n      under_review: "En cours d'examen",\n      action_required: 'Action requise',\n      active: 'Actif',\n      rejected: 'Rejeté'\n    };\n    return map[status] ?? status.split("_").join(" ");\n  }`,
  ],
]);

// confirm-dialog.ts
patch('app/core/components/confirm-dialog/confirm-dialog.ts', [
  ["readonly title = this.data.title ?? 'Delete file';", "readonly title = this.data.title ?? 'Supprimer le fichier';"],
  [
    "readonly message = this.data.message ?? 'Are you sure you want to delete this file? This action cannot be undone.';",
    "readonly message = this.data.message ?? 'Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.';",
  ],
  ["readonly confirmText = this.data.confirmText ?? 'Delete';", "readonly confirmText = this.data.confirmText ?? 'Supprimer';"],
  ["readonly cancelText = this.data.cancelText ?? 'Cancel';", "readonly cancelText = this.data.cancelText ?? 'Annuler';"],
]);

// registration-form.html
patch('app/core/components/registration-form/registration-form.html', [
  ['<h2>Organization Registration</h2>', "<h2>Inscription de l'Organisation</h2>"],
  ['<p>Follow the steps to initialize your data space integration.</p>', '<p>Suivez les étapes pour initialiser votre intégration au data space.</p>'],
  ['<ng-template matStepLabel>Company Information</ng-template>', "<ng-template matStepLabel>Informations de l'entreprise</ng-template>"],
  ['<mat-label>Official Registered Name</mat-label>', '<mat-label>Raison sociale officielle</mat-label>'],
  ['placeholder="e.g. Acme Corporation S.L."', 'placeholder="ex. : Acme Corporation S.A.S."'],
  ['<mat-label>Full Address</mat-label>', '<mat-label>Adresse complète</mat-label>'],
  ['placeholder="e.g. 123 Business St. Suite 400"', 'placeholder="ex. : 12 Rue du Commerce, Bât. B"'],
  ['<mat-label>City</mat-label>', '<mat-label>Ville</mat-label>'],
  ['placeholder="e.g. Madrid"', 'placeholder="ex. : Abidjan"'],
  ['<mat-label>Country</mat-label>', '<mat-label>Pays</mat-label>'],
  ['placeholder="e.g. Spain"', "placeholder=\"ex. : Côte d'Ivoire\""],
  ['<mat-label>Postal Code</mat-label>', '<mat-label>Code postal</mat-label>'],
  ['placeholder="e.g. 28001"', 'placeholder="ex. : 01 BP 1234"'],
  ['<mat-label>Tax Identifier (VAT/CIF)</mat-label>', '<mat-label>Identifiant fiscal (TVA/NIF)</mat-label>'],
  ['placeholder="e.g. ESA12345678"', 'placeholder="ex. : CI12345678"'],
  ['matStepperNext [disabled]="orgForm.invalid">NEXT</button>', 'matStepperNext [disabled]="orgForm.invalid">SUIVANT</button>'],
  ['<ng-template matStepLabel>Contact Information</ng-template>', '<ng-template matStepLabel>Informations de contact</ng-template>'],
  ['<mat-label>Administrative Contact Email</mat-label>', '<mat-label>E-mail de contact administratif</mat-label>'],
  ['placeholder="compliance@entity.com"', 'placeholder="conformite@organisation.com"'],
  ['Please enter a <strong>valid</strong> email address', 'Veuillez saisir une adresse e-mail <strong>valide</strong>'],
  ['<mat-hint>Empty field triggers automated DID generation.</mat-hint>', '<mat-hint>Champ vide déclenche la génération automatique du DID.</mat-hint>'],
  [
    'Invalid DID format. It should follow <strong>did:method:id</strong> (e.g., did:web:example.com)',
    'Format DID invalide. Il doit suivre le format <strong>did:méthode:id</strong> (ex. : did:web:example.com)',
  ],
  ['<button mat-button matStepperPrevious>BACK</button>\n                <button mat-flat-button color="primary" matStepperNext [disabled]="contactForm.invalid">NEXT</button>', '<button mat-button matStepperPrevious>RETOUR</button>\n                <button mat-flat-button color="primary" matStepperNext [disabled]="contactForm.invalid">SUIVANT</button>'],
  ['<ng-template matStepLabel>Signed Document</ng-template>', '<ng-template matStepLabel>Document signé</ng-template>'],
  ['Read the following <a class="documentPdfLink" matTooltip="Open acceptance agreement"', "Lisez le <a class=\"documentPdfLink\" matTooltip=\"Ouvrir l'accord d'acceptation\""],
  ['>document</a> and upload it signed.</p>', '>document</a> suivant et téléversez-le signé.</p>'],
  ['label="Signed Acceptance Agreement"', "label=\"Accord d'acceptation signé\""],
  ['<button mat-button matStepperPrevious>BACK</button>\n                    <button mat-flat-button color="primary" [disabled]="legalForm.invalid || isProcessing()"\n                        (click)="submitRegistration()">\n                        SUBMIT APPLICATION', '<button mat-button matStepperPrevious>RETOUR</button>\n                    <button mat-flat-button color="primary" [disabled]="legalForm.invalid || isProcessing()"\n                        (click)="submitRegistration()">\n                        SOUMETTRE LA DEMANDE'],
  ['<h2>Submission Received</h2>', '<h2>Demande reçue</h2>'],
  [
    'The application has been successfully queued for review. A confirmation email has been sent to the\n            administrative address provided. Please save the following Request ID to track the onboarding status.',
    "La demande a été mise en file d'attente pour examen. Un e-mail de confirmation a été envoyé à l'adresse administrative fournie. Veuillez conserver l'identifiant de demande ci-dessous pour suivre le statut de votre enregistrement.",
  ],
  ['label="Registration ID"', 'label="Identifiant de demande"'],
  [
    "hint=\"Use this ID to track your application status in the 'Track Progress' tab.\"",
    "hint=\"Utilisez cet identifiant pour suivre l'état de votre demande dans l'onglet 'Suivre la progression'.\"",
  ],
]);

// registration-form.ts
patch('app/core/components/registration-form/registration-form.ts', [
  ["this.notification.error('Error submitting the application');", "this.notification.error('Erreur lors de la soumission de la demande');"],
]);

// paginated-table.html
patch('app/core/components/paginated-table/paginated-table.html', [
  ['placeholder="Search..."', 'placeholder="Rechercher..."'],
  ['Clear Filters', 'Effacer les filtres'],
]);

// toolbar.html
patch('app/core/components/toolbar/toolbar.html', [
  ['<span>Onboarding Portal</span>', "<span>Portail d'Enregistrement</span>"],
  ['ADMIN PORTAL', 'PORTAIL ADMIN'],
  ['START ONBOARDING PROCESS', "DÉMARRER L'ENREGISTREMENT"],
  ['<button (click)="onLogout()" mat-menu-item>Logout</button>', '<button (click)="onLogout()" mat-menu-item>Déconnexion</button>'],
]);

console.log('\nTerminé.\n');
