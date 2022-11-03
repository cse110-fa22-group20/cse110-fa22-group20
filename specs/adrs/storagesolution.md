# Use IndexedDB as our local storage solution
## Context and Problem Statement

- We need to decide what we're going to use to store information locally 
- 
## Considered Options

- IndexedDB
  - More complex 
  - Stores all JS elements
  - 2GB limit
- LocalStorage
  - Straightforward
  - Can only store strings
  - 5MB limit

## Decision Outcome

- Chosen option: IndexedDB
    -  Allows to store images in browser so that they can be ported from system to system, browser to browser
    -  Unlike LocalStorage it can story JS objects without need to stringify, this will reduce our overhead and parsing complexity