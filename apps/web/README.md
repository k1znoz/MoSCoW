# MoSCoW Web App

Client-facing SvelteKit questionnaire that produces:
- local Markdown download
- browser print flow for PDF
- submission copy stored in Sanity for admin processing/deletion

## Run

```sh
npm install
npm run dev
```

## Environment variables

Create `.env` from `.env.example`:

```sh
SANITY_PROJECT_ID=x1n0fmhe
SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_write_token
```

`SANITY_WRITE_TOKEN` must allow creating `submission` documents.

## Validate

```sh
npm run check
npm run build
```
