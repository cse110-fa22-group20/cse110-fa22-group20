# Create branches for individual issues
## Context and Problem Statement

- We need to decide how our branches are going to be structured

## Considered Options

- Unique branches for each associated issue
  - When work is completed, create a PR to the main branch or associated staging branch (if necessary)

## Decision Outcome

- Chosen option: unique branches for each associated issue
    - This will make sure that there is no non-functional code on main at any point
    - Some larger features will have staging branches where also associated sub-issues can be brought together before being ported to the main branch