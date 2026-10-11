# ShopEasy - Frontend Export Blueprint

This directory contains the essential documentation required to rebuild the frontend UI of the ShopEasy E-Commerce application using external AI tools (like Lovable, v0, etc.), without breaking the underlying Node.js and PostgreSQL backend.

## Contents
1. **\`API_CONTRACT.md\`**: Exact HTTP methods, endpoints, request shapes, and response structures. Use this to wire up frontend data fetching (e.g. \`fetch\` or \`axios\`).
2. **\`DATA_MODELS.ts\`**: TypeScript interfaces defining the database shapes. Use this to heavily type your new React/Vue/Svelte components.
3. **\`COMPONENT_MAP.md\`**: Defines the routing structure and which components are expected on each page, including auth-guard logic.
4. **\`MOCK_DATA.json\`**: Sample JSON responses straight from the database to use as placeholder data while designing the UI components before wiring them up to the API.

## Critical Instructions for UI Builders
- **DO NOT** create a new backend or database. The existing Node.js server (running on \`http://localhost:3000\`) and PostgreSQL database are fully functional.
- **DO NOT** modify the API routes. 
- Ensure your new frontend submits the exact JSON payloads outlined in the API contract.
- Authentication state is entirely client-side driven via \`localStorage\` for UI display, while the backend relies on hardcoded user IDs for non-auth routes (demo purposes). Stick to this architecture to avoid breaking backend expectations.
