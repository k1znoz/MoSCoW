# MoSCoW Studio

Sanity Studio admin for the MoSCoW intake flow.

## Included

- `question` document schema
- `questionnaireTemplate` document schema
- `submission` document schema
- custom document action on submission: `Handle export and delete`

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Purge expired submissions

Submissions include `expiresAt` (set to +7 days by the web app).

```sh
SANITY_PROJECT_ID=x1n0fmhe SANITY_DATASET=production SANITY_WRITE_TOKEN=your_write_token npm run purge:expired
```

Use this command in a daily cron/GitHub Action for automatic cleanup.
