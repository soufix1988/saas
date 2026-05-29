# Universal SaaS CRM & Booking System
## Source Code — Google Apps Script

Ces fichiers constituent le code source original de l'application.

### Fichiers inclus :
- `Code.gs` — Backend principal (Auth, Forms, CRM, Dashboard)
- `Appointments.gs` — Module Rendez-vous (Calendar, Emails, Bulk actions)
- `Index.html` — Frontend principal (UI complète, Builder, Router)
- `AppointmentsUI.html` — Module UI Rendez-vous

### Fonctionnalités :
- Auth custom (login ID/password + Google)
- Form Builder dynamique (7 types de champs, logique conditionnelle)
- Mode Quiz (score auto, timer, limite participation)
- Mode Rendez-vous (créneaux, capacité, jours off, pause)
- Google Calendar (création/suppression/modification auto)
- Emails automatiques multilingues (FR/EN/ES/DE/AR/HE)
- Dashboard KPI + Graphique + Calendrier mensuel
- Gestion droits granulaires par formulaire
- Actions groupées (bulk confirm/cancel/delete)
- RTL (Arabe + Hébreu)
- Export PDF
- 9 motifs de fond dynamiques

### Stack actuel :
- Google Apps Script (backend)
- Google Sheets (base de données)
- HTML/CSS/JS vanilla (frontend)
- Bootstrap 5 + FontAwesome
- Chart.js + KaTeX
