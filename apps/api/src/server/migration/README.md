# Outstanding Issues

## Legacy IDs
We're going to have an issue with legacy IDs when carrying out migrations. ODW will already know about PINS entities with their IDs from Horizon, so in theory we have to keep IDs the same. This is difficult for a few reasons:

1. We are auto-generating integer IDs for most of our entities (all except documents). We don't know if entities on Horizon have IDs with differing types (e.g. what if cases have GUID IDs)
2. If types on Horizon use auto-generating IDs then we are potentially in big trouble. Without intervention, we'd end up with clashes unless we migrated every piece of data and then reset the auto-incrementing integer counter to the next maximum and continue from there. This would mean not creating any new entities on the back office until everything is migrated though.

Some potential solutions
1. Change types of all IDs to string, and use GUID IDs for all new entities. This is definitely not ideal.
2. Look at the Horizon IDs, figure out the max for each entity, and set a new sensible seed base for all new auto-incrementing IDs. INT type is 32 bit (signed) so we have plenty to play with.
