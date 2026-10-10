# Portfolio architecture
- Store editable supplemental homepage copy in about_profile.site_content and merge it with shared defaults, so admin edits do not require code changes.
- Project pagination animates a single page container and never hides project cards behind a nested visibility observer, so saved builds remain visible.
- Keep the persisted resume storage reference separate from the public signed download URL, so unrelated profile saves cannot replace the reference with an expiring link.