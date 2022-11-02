# Use JSON file download to save local storage
## Context and Problem Statement

- We need to find out a way to save local storage so the webpage works across multiple browsers on the same device

## Considered Options

- File download
  - Easy to do
  - Low developmental costs on our part

## Decision Outcome

- Chosen option: file upload/download
  - Users will have the option to download a JSON representation of their page
  - When a new browser is used, that file can be uploaded and altered
    - Upon alteration, it will need to be redownloaded if the user wants to upload it to another browser