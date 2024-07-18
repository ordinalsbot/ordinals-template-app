This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

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
This template assumes that you wish to make sure of an account and authentication system. By default, the only login method established in this template is anonymous login through the issuance of a custom authentication token after the user has signed a message with their connected wallet. In order to enable anonymous login, visit the Authentication service in Firebase and click through the prompts to finish the setup.

Turn on "Anonymous" authentication after completing the setup.

### Firestore

This template assumes that you wish to make use of Firebase' Firestore Database. Visit the Firestore service and click through the prompts to complete setup.

You may start your database in test or production mode. If you start your database in test mode, make sure to set robust Firebase Rules before going to production with your application.


### Deployment

The other way that we recommend deploying this application, is through the hosting service provided by Firebase. There are tradeoffs to be made either way, but since Firebase is built into this app template, it is a natural choice for hosting the app.

Follow these steps to deploy your app on Firebase.
