## Editor / Yjs Migration

- Documents edited before Yjs integration (Step 52) will appear **empty**
  the first time they're opened after this change — their old plain-text
  or TipTap-JSON content does not automatically convert into the new Yjs
  format. This is a known, one-time migration gap. A proper fix would
  involve a one-time script that reads each old document's content and
  seeds a fresh Y.Doc with equivalent content before this feature ships
  to real users; not done here given MVP/learning-project scope.

## Dependencies

- TipTap v3's collaboration stack (`@tiptap/extension-collaboration`,
  `@tiptap/y-tiptap`, `y-protocols`) required manually installing several
  peer dependencies one at a time, discovered only via build errors —
  npm's `--legacy-peer-deps` flag (needed since Step 47) suppresses the
  upfront warnings that would normally surface these. If future TipTap
  extensions fail to resolve, check `npm ls <package>` for "missing"
  entries before assuming it's a code bug.
