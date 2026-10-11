<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Frontend architecture
- Keep all existing backend calls in the typed browser API adapter; no replacement backend is provisioned because this frontend plugs into an external service.
- Preserve literal .html URLs using escaped-dot route filenames; shared shop views live in components and each leaf owns its metadata.
- Use client-only route loaders to prime TanStack Query because the external localhost API is reachable only from the browser; unavailable reads return explicitly labeled uploaded samples, never simulated successful writes.
- Store only the existing API user display object in localStorage and enforce the specified admin UI guard before loading its page; backend authorization remains the external service's responsibility.
- Cart quantity and removal are local previews only because the contract supplies no update or delete endpoint; checkout always refreshes the actual API cart.
