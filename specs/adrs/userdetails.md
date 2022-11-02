# Use JSON in IndexedDB for user details
## Context and Problem Statement

- We need to decide how we are going to represent the user's details in IndexedDB

## Considered Options

- JSON
  - Easy to manipulate and use
  - Can be stored in LocalStorage and IndexedDB

## Decision Outcome
- Chosen option: JSON in IndexedDB
    - Representation
      - ``` 
        {
            name: string,
            image: string,
            description: string,
            primaryColor: string, 
            secondaryColor: string,
        }
        ```