# MotorCheck UK logo and post-search prompt update

This update includes:

- Manufacturer logo rendering via the `simple-icons` package for supported brands, with normalized make-name aliases and a fallback for makes that do not have a supported brand mark.
- The MotorCheck UK shield image as the browser tab favicon and Apple touch icon.
- A post-search advanced-check prompt on live and demo report pages. It appears once per browser session until dismissed, links to the enhanced-check section, and clearly states that the advanced provider is not connected and checkout is disabled until the data is ready.

## Install

Run `npm install` after copying the project files so npm installs the `simple-icons` dependency. Keep your existing `.env.local` file. Restart the dev server after installing dependencies.

The brand mark package provides genuine brand marks for supported makes; not every manufacturer has a mark available in the library. Any unavailable mark uses the existing fallback.
