-- Lead-Drip-Erweiterung der leads-Tabelle
-- Generated via shared-core/scripts/gen-lead-drip.py

alter table leads add column if not exists drip_step int not null default 0;
alter table leads add column if not exists last_email_at timestamptz;

-- Index für Cron-Selection
create index if not exists idx_leads_drip
  on leads(drip_step, created_at)
  where unsubscribed_at is null;

comment on column leads.drip_step is
  'Aktueller Drip-Step: 0 = nur Welcome, 1-3 = Folge-Mails versendet';
comment on column leads.last_email_at is
  'Zeitpunkt der letzten E-Mail — für Drip-Frequenz-Steuerung';
