# Profielgegevens Database Mapping

## Overzicht van alle velden in ProfileSettings en hun database mapping

| Formulier Veld | Database Kolom | Type | Status |
|----------------|----------------|------|--------|
| Naam | `name` | TEXT | ✅ Bestaat |
| Geboortedatum | `geboortedatum` | DATE | ✅ Toegevoegd via migratie |
| Email | `email` | TEXT | ✅ Bestaat |
| Telefoon | `phone` | TEXT | ✅ Bestaat |
| Bedrijfsnaam | `company_name` | VARCHAR(255) | ✅ Bestaat |
| Vertegenwoordiger | `vertegenwoordiger` | VARCHAR(255) | ✅ Bestaat |
| Bedrijf | `company` | TEXT | ✅ Bestaat |
| Website | `website` | TEXT | ✅ Bestaat |
| Beschrijving | `description` | TEXT | ✅ Bestaat |
| Store | `store` | VARCHAR(10) | ✅ Bestaat |
| Datum | `datum` | DATE | ✅ Bestaat |

## Migratie uitvoeren

Voer het volgende SQL script uit in je Supabase database om de `geboortedatum` kolom toe te voegen:

```sql
-- Zie: add_geboortedatum_migration.sql
```

## Code Status

De code in `ProfileSettings.tsx` probeert al alle velden op te slaan, inclusief `geboortedatum`. Na het uitvoeren van de migratie zullen alle velden correct worden opgeslagen.

