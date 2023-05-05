# Types

Though we use JavaScript, which uses [dynamic & weak typing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dynamic_and_weak_typing), we want to be type safe to help reduce bugs. To do this we define types using [jsdoc](https://jsdoc.app/), [Prisma](https://www.prisma.io/) (for database types), and [TypeScript](https://www.typescriptlang.org/) (only type defintion files, no code).

To check the types are valid, both when defined and when used, we use [eslint](https://eslint.org/) and the [TypeScript cli](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Prisma Types

In the `api` app, to import Prisma types in jsdoc, use

```
import('@prisma/client').MyType
```

If you need a variation of a type - perhaps a type with no `id` set, for a create request, you can use:

```
import('@prisma/client').Prisma.MyTypeUncheckedCreateInput
// or
import('@prisma/client').Prisma.MyTypeUncheckedUpdateInput
```
