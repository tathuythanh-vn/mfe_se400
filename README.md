`# mfe (Monorepo)

Minimal mono-repo that contains multiple micro frontends (MFE) located in subfolders: `auth`, `admin`, `manager`, `member`, `chat`, `home`.

This repository uses pnpm and each sub-package has its own `package.json`. The root `package.json` provides two convenience scripts to install all package dependencies and to start all dev servers concurrently.

Quick start

1. Install dependencies for all packages (runs `pnpm install` in each package):

```bash
pnpm run pkg:install
```

2. Start all micro frontends in parallel (uses `concurrently`):

```bash
pnpm run dev
```

Repository layout

- auth/ - authentication MFE
- admin/ - admin MFE
- manager/ - manager MFE
- member/ - member-area MFE
- chat/ - chat MFE
- home/ - home MFE

Notes

- This project expects `pnpm` to be installed globally. If you don't have it, install it with `npm i -g pnpm`.
- Each package has its own `dev` script. If you need to run a single package, `cd` into its folder and run `pnpm run dev`.
- Ignore rules are provided in the root `.gitignore` to filter out OS, editor, and Node/pnpm artifacts.

Contributing

- Open an issue or submit a pull request with a description of what you changed and why.

License

This repository is private by default (see `package.json`), so choose and add a license if you plan to publish.
