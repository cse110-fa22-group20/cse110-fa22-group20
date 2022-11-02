# Use arrays for reorderable posts and images
## Context and Problem Statement

- We need a representation for posts and images that allows them to be reordered upon drag

## Considered Options

- Arrays
  - Might be easier for figuring out 
  - Sorting might be more straightforward
- Linked lists
  - Might be too complicated
  - Metadata is not saved in local storage

## Decision Outcome

- Chosen option: arrays
  - Swappability is easier
  - Default representation for query selectors
  - We will reload entire array upon change