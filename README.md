# AlexNotes

[![Build Status](https://travis-ci.org/eiskalteschatten/AlexNotes.svg?branch=master)](https://travis-ci.org/eiskalteschatten/AlexNotes)


This project is yet another note-taking application. Why create another one? The answer is because I needed a way to take notes that is cross-platform, available online, is private and is not proprietary. The basic concept behind it is to save all notes in a text file using Markdown for formatting. These files are then committed into a git repository and pushed to a remote server of choice. This allows safe versioning of notes, backups and even the ability to update notes without even opening the application.

The project is still in its infancy, however, and doesn't really do much yet. You can always check up on it via the issues tab above.


## Table of Contents

- <a href="#requirements">Requirements</a>
- <a href="#setting-up-the-project-for-development">Setting up the Project for Development</a>
- <a href="#lerna">Lerna</a>
- <a href="#building">Building</a>
- <a href="#linting-and-testing">Linting and Testing</a>
- <a href="#contributing">Contributing</a>


## Requirements

- Node 10 or 11 (support for Node 12 will be included as soon as a few dependencies support it)


## Setting up the Project for Development

1. Run `npm install` in the root directory. This will install Lerna and the linting tools.
2. Run `npm run bootstrap` in the root directory. This will run `npm install` in all of the sub-packages and set up the symlinks for the shared dependencies.


## Lerna

AlexNotes uses Lerna to manage its multiple packages.

### Bootstrapping the Project

It is therefore important to bootstrap the project before starting it! This will install all dependencies in the sub-packages and create all necessary symlinks between the project dependencies.

To do so, run the following in the project's root directory:

```
npm run bootstrap
```

### Adding Dependencies

#### Shared Dependencies

To install dependencies that should be shared between all packages, do the following:

1. Install them normally in the project's root directory: `npm install whatever --save(-dev)`
2. Bootstrap the project again: `npm run bootstrap`

#### Depenencies for Single Packages

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

### Cleaning

To remove the `node_modules` folders from all sub-packages, run the following in the project's root directory:

```
npm run clean
```

See https://github.com/lerna/lerna/tree/master/commands/clean#readme for more details.


## Building

To build the entire project, run the following in the project's root directory:

```
npm run build
```

The project **must** be bootstrapped (see above) in order to build it.


## Linting and Testing

To lint the entire project, run the following in the project's root directory:

```
npm run lint
```

There are no other tests yet.


## Contributing

If you would like to contribute to the project, feel free to fork the repository and make a pull request. It is recommended to lint any changes before committing by running `npm run lint`.

If you find a bug or any other issues or have any feature requests, don't hesitate to create a GitHub issue.

---

Alex Seifert - https://www.alexseifert.com
