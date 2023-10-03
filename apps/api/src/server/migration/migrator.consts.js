// The identity for all 'new' entities (i.e. ones created outside of migration) have their ID seeded starting at 100 million
// If any entities are attempted to be migrated on or above this ceiling, we'll be over-writing new entities
export const MigratedEntityIdCeiling = 100_000_000;
