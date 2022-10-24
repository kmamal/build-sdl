
await $`npm run clean`
process.env.FROM_SOURCE = 1
await $`npm install`
await $`npm run upload-prebuilt`
