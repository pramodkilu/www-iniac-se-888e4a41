# Preview the INAC Dashboard

The dashboard is a static page at:

```text
/inac-dashboard/
```

## Why `localhost refused to connect` happens

`localhost` always means **the computer where the browser is running**.

If Codex starts a server inside a remote/container environment, opening `http://localhost:4173/inac-dashboard/` on your own computer will only work when your editor or hosting environment forwards port `4173` to your browser.

## Option 1: View from your local computer

Run these commands in the project folder on your own computer:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:4173/inac-dashboard/
```

## Option 2: View from VS Code / Codespaces / remote IDE

1. Start the server:

   ```bash
   npm run dev
   ```

2. Open the **Ports** tab.
3. Forward port `4173`.
4. Open the forwarded URL.
5. Add `/inac-dashboard/` to the end of the forwarded URL.

Example:

```text
https://your-forwarded-url.app/inac-dashboard/
```

## Option 3: Quick file check without a browser

Run:

```bash
npm run build
```

The validator checks that the dashboard page includes the required sections:

- Dashboard
- Students
- Attendance
- Payments
- LMS
- Robotics Lab
- Messages
- Reports
- Settings
