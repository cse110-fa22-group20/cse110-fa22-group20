# Use JSON in IndexedDB for post representation
## Context and Problem Statement

- We need to decide how we are going to represent posts in IndexedDB

## Considered Options

- JSON
  - Easy to manipulate and use
  - Can be stored in LocalStorage and IndexedDB
- Javascript classes
  - Too complex and rigid for our use case 

## Decision Outcome

- Chosen option: JSON in IndexedDB
    - Use IndexedDB because LocalStorage is limited to 5MB of storage
    - Representation
      - ``` 
        {
            id: integer, // id used for reordering
            type: text or image,
            content: 
                // text post
                string,
                // image post
                [
                    {
                        id: integer,
                        image: string,
                        caption: string,
                    }
                ],
        } 
        ```