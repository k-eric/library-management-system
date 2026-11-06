# Library Management System - Data Layer

## Schema Decisions

### Why Book References Genre Rather Than Embedding It
- **Data Integrity & Normalization:** Storing genres in a separate table and referencing them via a foreign key (`genreId`) prevents data duplication and anomalies.
- **Relational Integrity:** Prisma's `@relation` enforces referential integrity.
- **Scalability:** Separating genres allows attaching additional metadata later without bloating the book schema.

## Relational vs. Document Database Modeling
- **Relational (Prisma/PostgreSQL):** Uses normalized tables and foreign keys with explicit relations (`include`).
- **Document Database:** Embeds related data directly, reducing joins for reads but risking duplication on updates.
