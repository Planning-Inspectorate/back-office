# NJ Layouts

## Best practices creating layouts

All new layouts should extend the `app.layout.njk` base layout file.

There shouldn't be any other layer in between layouts within the app layouts folder.

## Existing layouts

| File                          | Description
|-------------------------------|---------------------------------------------------------------------------------|
| `app.layout.njk `             | Main layout that contains the base template for every page                      |
| `app-wide.layout.njk `        | Main layout that tailored for larger desktops (container width of 1200px)       |
| `app-two-column.layout.njk`   | Use to display a page with one column that is 2/3 of the full width of the page |
| `app-three-column.layout.njk` | Use to display a three column layout. Extends from 'app-wide.layout.njk'        |
