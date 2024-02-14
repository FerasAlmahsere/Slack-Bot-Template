# Support Workflows

Workflows for two-way integration between Lumofy's support channel and Jira development project.

## Guide Outline

- [Support Workflows](#support-workflows)
  - [Guide Outline](#guide-outline)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Resources](#resources)
  - [Environment Variables](#environment-variables)
  - [Running Your Project Locally](#running-your-project-locally)
  - [Creating Triggers](#creating-triggers)
    - [Manual Trigger Creation](#manual-trigger-creation)
  - [Datastores](#datastores)
  - [Testing](#testing)
  - [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
  - [Project Structure](#project-structure)
    - [`.slack/`](#slack)
    - [`datastores/`](#datastores-1)
    - [`functions/`](#functions)
    - [`triggers/`](#triggers)
    - [`workflows/`](#workflows)
    - [`manifest.ts`](#manifestts)
    - [`slack.json`](#slackjson)

---

## Install the Slack CLI

To start developing, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

## Resources

To learn more about developing automations on Slack, visit the following:

- [Automation Overview](https://api.slack.com/automation)
- [CLI Quick Reference](https://api.slack.com/automation/cli/quick-reference)
- [Samples and Templates](https://api.slack.com/automation/samples)

## Environment Variables

Local environment variables are stored in a .env file at the root of the project
and made available for use in custom functions via the env context property.

When your app is deployed, it will no longer use the .env file. Instead, you will
have to add the environment variables using the env add command. Environment
variables added with env add will be made available to your deployed app's custom
functions just as they are locally; see examples in the next section.

For the above example, we could run the following command before deploying our app:

```zsh
$ slack env add MY_ENV_VAR asdf1234
```

If your token contains non-alphanumeric characters, wrap it in quotes like this:

```zsh
$ slack env add MY_ENV_VAR "asdf-1234"
```

Your environment variables are always encrypted before being stored on our servers
and will be automatically decrypted when you use them—including when listing
environment variables with slack env list.

## Running Your Project Locally

While developing your app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Creating Triggers

[Triggers](https://api.slack.com/automation/triggers) are what cause workflows
to run. These triggers can be invoked by a user, or automatically as a response
to an event within Slack.

When you `run` or `deploy` your project for the first time, the CLI will prompt
you to create a trigger if one is found in the `triggers/` directory. For any
subsequent triggers added to the application, each must be
[manually added using the `trigger create` command](#manual-trigger-creation).

When creating triggers, you must select the workspace and environment that you'd
like to create the trigger in. Each workspace can have a local development
version (denoted by `(local)`), as well as a deployed version. _Triggers created
in a local environment will only be available to use when running the
application locally._

### Manual Trigger Creation

To manually create a trigger, use the following command:

```zsh
$ slack trigger create --trigger-def triggers/<YOUR_TRIGGER_FILE>.ts
```

## Datastores

For storing data related to your app, datastores offer secure storage on Slack
infrastructure. The use of a datastore requires the
`datastore:write`/`datastore:read` scopes to be present in your manifest.

## Testing

Test filenames should be suffixed with `_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```

## Deploying Your App

Once development is complete, deploy the app to Slack infrastructure using
`slack deploy`:

```zsh
$ slack deploy
```

When deploying for the first time, you'll be prompted to
[create a new link trigger](#creating-triggers) for the deployed version of your
app. When that trigger is invoked, the workflow should run just as it did when
developing locally (but without requiring your server to be running).

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `datastores/`

[Datastores](https://api.slack.com/automation/datastores) securely store data
for your application on Slack infrastructure. Required scopes to use datastores
include `datastore:write` and `datastore:read`.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.
