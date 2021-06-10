# Contributing to skintest

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

First, ensure you have the latest [`yarn`](https://yarnpkg.com/getting-started/install) and [`nodejs`](https://nodejs.org/en/).

To get started with the repo:

```sh
$ git clone https://github.com/codetheflow/skintest.git && cd skintest
$ yarn install
```

To get started with development:

In the first terminal:
```sh
yarn build:watch
```
In the second terminal:
```sh
yarn sandbox
```

# Debugging

https://code.visualstudio.com/docs/nodejs/nodejs-debugging

## Code Structure

Currently, the [source](https://github.com/codetheflow/skintest/tree/master) is split up into a few categories:

* [packages/common](https://github.com/codetheflow/skintest/tree/master/packages/common): shared utils, guards and errors.
* [packages/sdk](https://github.com/codetheflow/skintest/tree/master/packages/sdk): end user api to write test scenarios, recipes and selectors.
* [packages/platform](https://github.com/codetheflow/skintest/tree/master/packages/platfom): infrastructure to run scenarios and plugins.
* [packages/plugins](https://github.com/codetheflow/skintest/tree/master/packages/plugins): browser launcher and lifecycle plugins.
* [sandbox](https://github.com/codetheflow/skintest/tree/master/sandbox): examples of test scenarios and recipes.

### Linting

```sh
$ yarn lint
```

It's also a good idea to hook up your editor to an eslint plugin.

To fix lint errors from the command line:

```sh
$ yarn lint:fix
```

### Submitting Pull Requests

This project follows [GitHub's standard forking model](https://guides.github.com/activities/forking/). Please fork the project to submit pull requests. 

### Releasing

If you have read-write privileges in skintest's [npm org](https://www.npmjs.com/org/skintest) _with 2-factor auth enabled_, congratulations, you can cut a release!

Once that's done, run the release script:

```sh
yarn lint
yarn build
yarn release
```

Use `--canary` flag for the `alpha` releases or `--preid` flag to setup prerelease identifier.

https://github.com/lerna/lerna/blob/main/commands/publish/README.md#--canary