# AlexNotes

More information coming soon.


## Setting up the Project for Development

1. Run `npm install` in the root directory. This will install Lerna and the linting tools.
2. Run `npm run bootstrap` in the root directory. This will run `npm install` in all of the sub-packages and set up the symlinks for the shared dependencies.


## Bootstrapping the Project

**It is important to bootstrap the project before starting it! This will install all dependencies in the sub-packages and create all necessary symlinks between the project dependencies.**

To do so, run the following in the project's root directory:

```
npm run bootstrap
```


## Linting

To lint the entire project, run the following in the project's root directory:

```
npm run lint
```


## Building

To build the entire project, run the following in the project's root directory:

```
npm run build
```


## Adding Dependencies

### Shared Dependencies

To install dependencies that should be shared between all packages, do the following:

1. Install them normally in the project's root directory: `npm install whatever --save(-dev)`
2. Bootstrap the project again: `npm run bootstrap`

### Depenencies for Single Packages

To install a dependency for a single package, run the following in the project's root directory:

**For the frontend:**
```
npm run add some-npm-module -- --scope=frontend (--dev)
```
**For the server:**
```
npm run add some-npm-module -- --scope=server (--dev)
```

`npm run add` is just a shortcut for Lerna's `add` command. See https://github.com/lerna/lerna/tree/master/commands/add#readme for more details about the `lerna add` command.


## Cleaning

To remove the `node_modules` folders from all sub-packages, run the following in the project's root directory:

```
npm run clean
```

See https://github.com/lerna/lerna/tree/master/commands/clean#readme for more details.

---

Alex Seifert - https://www.alexseifert.com
