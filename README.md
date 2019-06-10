# AlexNotes

[![Build Status](https://travis-ci.org/eiskalteschatten/AlexNotes.svg?branch=master)](https://travis-ci.org/eiskalteschatten/AlexNotes)


This project is yet another note-taking application. Why create another one? The answer is because I needed a way to take notes that is cross-platform, available online, is private and is not proprietary. The basic concept behind it is to save all notes in a text file using Markdown for formatting. These files are then committed into a git repository and pushed to a remote server of choice. This allows safe versioning of notes, backups and even the ability to update notes without even opening the application.

**The project is still in its infancy, however, and doesn't really do much yet.** You can always check up on it via the issues tab above.


## Table of Contents

- <a href="#requirements">Requirements</a>
- <a href="#setting-up-the-project">Setting up the Project</a>
    - <a href="#config">Config</a>
- <a href="#starting-the-application">Starting the Application</a>
- <a href="#lerna">Lerna</a>
    - <a href="#bootstrapping-the-project">Bootstrapping the Project</a>
    - <a href="#adding-dependencies">Adding Dependencies</a>
    - <a href="#cleaning">Cleaning</a>
- <a href="#building">Building</a>
- <a href="#linting-and-testing">Linting and Testing</a>
- <a href="#docker">Docker</a>
    - <a href="#docker-hub">Docker Hub</a>
- <a href="#contributing">Contributing</a>


## Requirements

- Node 10 or 11 (support for Node 12 will be included as soon as a few dependencies support it)
- git installed locally. AlexNotes uses [simple-git](https://github.com/steveukx/git-js), so see its requirements for more details.


## Setting up the Project

1. Run `npm install` in the root directory. This will install Lerna and the linting tools.
2. Run `npm run bootstrap` in the root directory. This will run `npm install` in all of the sub-packages and set up the symlinks for the shared dependencies.
3. Copy `config.example.js` and rename it to `config.js`. You will need to configure a default user here as well as the git repository.

### Config

The config file has two main components:

- the default user that is created when using the `SETUP_DEFAULT_USER` environmental variable (see <a href="#starting-the-application">Starting the Application</a> for more about that)
- the config for the git repo

The following options are available in the `config.js` file:

```
{
    defaultUser: {
        firstName: 'New',  // required
        lastName: 'User',  // required
        username: 'admin', // required
        password: 'admin', // required
        emailAddress: ''   // required, but can be blank
    },
    git: {
        url: '',           // required
        branch: 'master',  // required
        auth: {
            type: '',      // required: ssh or https
            username: '',  // only required when type is https
            password: ''   // only required when type is https
        },
        localPath: ''      // required; using Node's 'path' module is recommended (see config.example.js)
    }
}
```

An example for a git repository with SSH:

```
{
    defaultUser: {
        firstName: 'New',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        emailAddress: ''
    },
    git: {
        url: 'git@github.com:eiskalteschatten/AlexNotes.git',
        branch: 'master',
        auth: {
            type: 'ssh'
        },
        localPath: path.resolve(__dirname, 'repo')
    }
};
```


An example for a git repository with HTTPS:

```
{
    defaultUser: {
        firstName: 'New',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        emailAddress: ''
    },
    git: {
        url: 'https://github.com/eiskalteschatten/AlexNotes.git',
        branch: 'master',
        auth: {
            type: 'https',
            username: 'myusername',
            password: 'somepassword'
        },
        localPath: path.resolve(__dirname, 'repo')
    }
};
```

AlexNotes uses [simple-git](https://github.com/steveukx/git-js) for git which is just a Node-based wrapper for your local git installation. That means any SSH keys you use to access your git repositories in the terminal will automatically work.


## Starting the Application

**Important!** If you are running the application for the first time, you will have to set the `SETUP_DEFAULT_USER` environment variable to true to set up the default user. For example:

```
SETUP_DEFAULT_USER=true npm start
```

The default user credentials can be set up in the config file at `config.js`. See the section <a href="#setting-up-the-project">Setting up the Project</a> for more information.

To start the application after setting up the project, run one of the following in the project's root directory:

### Development

```
npm start
```


### Production

Before starting the application for production, you will need to build it.

```
npm run build && npm run start:prod
```


## Lerna

AlexNotes uses [Lerna](https://github.com/lerna/lerna) to manage its multiple packages.

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


## Docker

AlexNotes comes with support for Docker and Docker Compose. To run it in docker, use the following in the project's root directory:

```
docker-compose up --build
```

This will build the application and start it in production mode.

### Docker Hub

AlexNotes can also be found on [Docker Hub](https://hub.docker.com/r/alexseifert/alexnotes). If for examples using the image from Docker Hub, see the `docker-examples` folder.


## Contributing

If you would like to contribute to the project, feel free to fork the repository and make a pull request. It is recommended to lint any changes before committing by running `npm run lint`.

If you find a bug or any other issues or have any feature requests, don't hesitate to create a GitHub issue.

---

Alex Seifert - https://www.alexseifert.com
