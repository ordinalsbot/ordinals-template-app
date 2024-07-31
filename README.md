
# Overview

This repository is a boilerplate codebase for building a frontend application that interfaces with the Bitcoin Ordinals ecosystem. Out of the box, this application comes with the following technologies.

The application uses Firebase as a SSO and Database resource. After successfully adding Firebase configurations to the project, users will receive an Anonymous account by signing a message with their sats-connect wallet.

In the background, this repository implements Next-Auth with sessions, creating a `customAuthenticationToken` with the use of the Firebase admin SDK.

## Table of contents

- [Overview](#overview)
  - [Utilities](#utilities)
  - [Getting Started](#getting-started)
  - [Learn More](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Firebase Configurations](#firebase-configurations)
  - [Deployment](#deployment)

## Utilities

### NextJS Functionality

NextJS 14 comes built-in with a number of handy features for handling a wide range of common scenarios for your app, such as the throwing of an error and the structuring of your page metadata across your site.

#### Error Pages

The `error.tsx` page is shown when the application throws an error. This page is useful when gracefully handling unexpected things from happening on the application.

The `not-found.tsx` page is shown when the user requests a route that does not exist.

#### Metadata

🔗 [nextjs metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
We recommend that you visit the constants file located at `src/lib/constants/index.ts`. Within this file, it is highly recommended that you change the `APP_NAME` constant to your liking. The name of your app by default will set things like the name of the session token, and the `title` of each of your webpages on your app.

By altering the `DEFAULT_METADATA` constant, you can change the structure of your pages and introduce a range of .favicons and icons for various devices.

#### Layout

Use the `layout.tsx` file to structure the top-level layout of the app. We've included the `Header`, `Footer`, and `Providers` in the base layout.

### SatsConnect

🔗 [sats-connect](https://docs.xverse.app/sats-connect)

Sats Connect is a library for interacting with Bitcoin Wallets that have implemented the sats-connect library. It is the easiest and most streamlined library for enabling the widest array of browser-based bitcoin wallets.

### Tanstack

The template app is typescript through and through. The library that we've selected to perform data querying, routing, and state management responsibilities is Tanstack. It is typescript compatible and works well with NextJS.

#### Query

🔗 [tanstack query](https://tanstack.com/query/latest)
Tanstack query allows us to easily configure queries that our application depends upon. For example, we might write a query to fetch the price of bitcoin like so.

```typescript
const { isFetching, error, data } = useQuery({
  queryKey: ['price', 'btc'],
  queryFn: () => fetchPrice('btc')
});
```

Then conditonally render and alter the behavior of the application based on the many variables that `useQuery` exposes for us.

```typescript
if (isFetching) return <Loading />;
if (error) return <AnErrorComponent />;
if (!data) return <DataWasEmpty />;
return <TheComponentThatUsesData { ...data } />;
```

#### Table

🔗 [tanstack table](https://tanstack.com/table/latest)

Please refer to the documentation when using TanStack Table.

#### Form

🔗 [tanstack form](https://tanstack.com/form/latest)

Please refer to the documentation when using TanStack Form.

### Design

We chose a set of tools that by default, are installed in the app template. However, you do not need to stick with the chosen libraries. There are plenty of great UI libraries that may suit your application better than the ones we have selected.

#### ShadCN.ui

🔗 [shadcn.ui](https://ui.shadcn.com/)
We chose ShadCN for base level UI support. As stated on their home page, [ShadCN is not a UI Library](https://ui.shadcn.com/docs). Unlike other component libraries, ShadUI is not distributed and installed via `npm`. The components found within ShadCN are able to be copied and pasted straight into your application.

Components you wish to use downloaded and added to your project directly using the ShadCN command line tool. [`Button`](https://ui.shadcn.com/docs/components/button) may be added to your project using this command. `npx shadcn-ui@latest add button`. After this point, button is completely customizable to your style and functionality needs.

ShadCN comes built-in with light/dark/system theming, and provides a number of common and easy to use components from their [component showcase](https://ui.shadcn.com/docs/components/accordion).

#### Tailwind

Hate it or love it, Tailwind is a consistent and widely adopted CSS approach that allows developers to rapidly prototype new pages and applications.

At the same time that Tailwind is installed and in use, custom style sheets may still be included in components or pages that you are working on. As per Tailwind's documentation, developers may want to use caution when mixing Tailwind with custom styles.

## Getting Started

First, install dependencies with your preferred node package manager (we recommend `pnpm`).

### Install

```bash
npm i
# or
yarn i
# or
pnpm i

```

### Configure

If you are using firebase, you will need to fill in both the private backend firebase credentials (without the NEXT_PUBLIC prefix) and the public frontend firebase credentials (with the NEXT_PUBLIC prefix).

Change `.env.local` to `.env` and proceed with the steps to run the app.

See [firebase configurations](#firebase-configurations) for setting up your own account and obtaining credentials.

```bash
FIREBASE_ADMIN_PROJECT_ID=""
FIREBASE_ADMIN_PRIVATE_KEY=""
FIREBASE_ADMIN_CLIENT_EMAIL=""

NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

NEXTAUTH_SECRET=""
NEXTAUTH_URL=http://localhost:3000/

ORDINALSBOT_API_KEY=""
EXPLORER_URL="https://explorer.ordinalsbot.com"
```

### Run

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Roboto Mono.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Firebase Configurations

To hook up your Firebase project to this applcation, follow these steps.

### Initialization

1. Go to firebase.google.com and start a new project
2. Follow the prompts, naming your project and selecting the elements of firebase you wish to use (e.g. Analytics)

### Authentication

This template assumes that you wish to make use of an account and authentication system. By default, the only login method established in this template is anonymous login through the issuance of a custom authentication token after the user has signed a message with their connected wallet. In order to enable anonymous login, visit the Authentication service in Firebase and click through the prompts to finish the setup.

Turn on "Anonymous" authentication after completing the setup.

This will allow users to sign a message using their connected and configured wallet (e.g. [xverse](https://www.xverse.app/)). The wallet signing confirms that the signer of the message is the owner of the transaction. This will issue the user a custom authentication token from firebase that is bound to the **taproot address** connected to the wallet.

### Firestore

This template assumes that you wish to make use of Firebase' Firestore Database. Visit the Firestore service and click through the prompts to complete setup.

You may start your database in test or production mode. If you start your database in test mode, make sure to set robust Firebase Rules before going to production with your application.

### Obtaining Credentials for .env

There are two places to look for credentials in the firebase admin dashboard.

1. Public Credentials: ⚙️ *> Project Settings > General*
Copy the relevant environment variables to your `.env`

2. Private Credentials: ⚙️ > *Project Settings > Service Accounts > Generate New Private Key (button)*
This will download a `service_account.json` file, in which you will find the strings you need to seed your `.env with`

🔥 **Danger** 🔥: Be careful with the keys in `service_account.json`. Exposing this to the public will give the possessor `admin` access to your entire firebase project.

## Deployment

The template app may be deployed anywhere a NextJS is supported. Many NextJS developers naturally choose [Vercel](https://vercel.com/) to host the application as they are the core developer behind NextJS.

To deploy the application on Vercel, follow these steps.

1. Sign up for a Vercel Account
2. Connect your GitHub Account and import the template app. You will prompted to select a branch that Vercel will consider your `production` branch. We recommend using `main`.
3. Configure environment variables on Vercel
4. Redeploy for the environment variables to take effect
5. Optionally, connect a domain from your domain name host
