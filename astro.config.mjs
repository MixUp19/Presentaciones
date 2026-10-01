import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.local',
  server: { host: true, port: 4321 },
  devToolbar: { enabled: false },
});
