# MERN PROJECT DEPLOY

## Deploy to Vercel

Our previous project (React) was deployed to Netlify, but nodejs applicatons cannot be deployed there.
There are not many options/platforms which allow us to deploy a back-end for free.
Amongst those few options, our prefered one is **Vercel** (the creators of NextJS).
We will do two deployments, one for our back-end and a different one for our front-end.
That means that if you prefer to deploy your client to another service like Netlify, is totally possible.

🧹🧽 **Before starting**: get rid of all errors and warnings. A simple unused variable, or any warning from Typescript, won't allow our app to build (a production-ready version of our app, including compiling our javascript/typescript code into a more understandable javascript version).
Run `npm run build` in your front-end folder to make sure your React project will build successfully. If it doesn't, fix the listed errors, and run `nmp run build` again, until the build is able to compleate.

We'll also need to add a `vercel.json` file to the root of each project. This is where we set the [configuration settings](https://vercel.com/docs/concepts/projects/project-configuration).

To use Vercel, you'll need an account. We can choose to create one or just use our github's credentials (my preferred option.).

## Deploy Back-End

Add the `vercel.json` file at the root's folder, then add, commit, and push to GitHub:

```json
{
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/",
      "status": 200
    }
  ]
}
```

- Click in **Add New Project** to select the repository of your project.

- Select the `server` folder.

- Add your `ENV variables` : below you will find the **Environmental Variables** dropdown. You can manually type them there, or just copy the whole content of the `.env` file and paste it there.

- Click in **Deploy**. The build will start and might take some minutes.

- If the Build breaks, check the logs to see the error that produced it and try to fix it.

- If it got completed succesfully, check the domain created by Vercel (it can be modifed, either when selecting the folder, or after the deployment has finished). Put that domain in your browser and add any of your _not authorized_ GET endpoints. You should be able to see the response in your browser.

## Deploy Front-End

You usually don't need a vercel.json file because Vercel automatically detects and configures React apps. However, if you need custom routing or other configurations, you can add a vercel.json file.
If you need it, add the `vercel.json`, then add, commit, and push to GitHub:

```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

- Go back to the main overview, and click **Add New...** again to add another project.

- If you want to, modify vercel's suggested domain, for another one you like more.

- For the **Root Directory** select your `client`.

- Add your `ENV variables`.

- Remember that the fetch URLS will no longer start with `http://localhost:5000` , but something like `https://your-app-server.vercel.app`. Make sure you modified them accordingly, commited and pushed the updated code.

- **Continues deployment**. As it happened with Netlify, every push to github will (or should) trigger a redeployment.

If everything goes alright, you can visit the deployed url and check that your app is fully working.

## PWA configuration

When we started with React, we talked about **Progressive Web App (PWA)**, a term coined by Google, refering to **Single Page Apps (SPAs)** which provide a user experience like platform-specific appps (native apps): off-line mode, puh messages, engaging, etc..

To achieve this, we have to start by adding a `manifest.json` which gives the browser [instructions](https://web.dev/add-manifest/) on how the app should behave when installed on the device.

The two major plaforms are **IOS** and **Android** . The steps explained have only be tested in **Android**.

Given that we bundled our client with **Vite**, we will use Vite's PWA plugin.
Check the [documentation](https://vite-pwa-org.netlify.app/).

- Install the plugin in your `client` with `-D` flag, to add it as a dev dependendy (not to be deployed).

```node.js
npm install -D vite-plugin-pwa
```

- On our `vite.config.ts` (or `.js` if you haven't used Typescript) we will create a `manifestForPlugIn` object that needs to be passed to the `VitePWA()` method imported from the package. The TS type is inclued in the package ([example](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/examples/react-router/vite.config.ts)).

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest: {
    name: "Petrol Raccoons MERN Spikes App",
    short_name: "PR MERN",
    description:
      "This app was created during live demos of MERN stack technologies.",
    icons: [
      {
        src: "assets/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "assets/maskable_icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#000000",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
});
```

A Web App manifest **must** include at least:

- a `name`, to be shown at the top of the app window.
- a `short_name` to be shown under the icon on the screen.
- a description
- an icon with `192x192` size
- an icon with `512x512` size. These icons should be stored in `public/` folder (e.g. `public/assets/`). There are websites to transform `.png` files into app icons like [Maskable](https://maskable.app/editor)

Check additional [properties](https://web.dev/add-manifest/#manifest-properties) and for your manifest to help you personalise it even more.

After creating the manifest object, run `npm run build` from the `client` to create a local build. Make sure the `index.html` in the `dist/` folder has a link to the generated `manifest` file similar to:

```html
<link rel="manifest" href="manifest.webmanifest" />
```

In the `dist/` folder we will find other files generated by Vite's plugin.

Push the changes to github, redeploy your app, and type the URL from your client in your phone's browser.

- **Android** : click in the options of your browser. If you are using chrome :

  - Open the browser with vercel's client URL, and click in the three dots in the up right corner.
  - Select _Add to Home screen_.
  - A modal will open, click _Install_.
  - Find the icon in your apps drawer or home screen.
    ![screenshots](installMERNapp.jpeg)

- **IOS** : In February 2024, apple disabled PWAs, to comply with an EU regulation. They reversed that decision a couple of months later, but that led to some difficulties to make them work properly.

  - Open Safari.
  - Navigate to vercel client's URL.
  - Tap the _Share_ button.
  - Select _Add to Home Screen_ from the share options.
  - To have Full-screen mode include in your `.html` file the following:

    ```html
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    ```

⚠️⚠️ DISCLAIMER: be aware that these steps have not been tested, hence I really don't know if it works or not 😬.
