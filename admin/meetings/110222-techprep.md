# CSE 110 Group 20 Meeting Minutes
## Meeting Information
**Meeting Date**: 11/02/2022 <br>
**Meeting Location**: Wong Avery <br>
**Meeting Purpose**: Finalize/Review Design/Implementation Plans <br>
**Meeting Start Time**: 2:00 <br>
**Meeting End Time**: 3:00 <br>

## Attendance
Present:
- Ari Brin
- Benjamin Kim
- Jiaying Yang
- Joseph Mikhail
- Koa Calloway
- Mariel Chua
- Navid Boloorian
- Roland Wen
- Zixian Wang

Absent:
- Ryan Vanny 

## Agenda

### New Business
- Design overview - using figma
- ADR
  - Implement draggable with args
  - Query Selector 
  - use arrays
- Issues with switching browsers 
  - use downoladable JSON file 
  - upload to other browser
- We are using Indexed DB instread of local storage
  - string w/ key value pairs
  - store JS data
  - 2 GB to work with 
  - alternative: storing file/path instead of full image (local storage only has 5 MB of storage)
  - this is risky because if the file is moved the path is no longer valid 
- General design notes
  - Test/Image paired to make editing easier
  - User details stored as strings
- TimeLine
  - 4.5 weeks left
  - Week 1(current week): finish HTML & ideally CSS (at least main pages except popups)
  - Week 2: Finish CSS (including popups), create & read functionality done 
  - Week 3: Update/Delete functionality with reorderable items (requirements of assignment met by end of week 3)
  - Week 4: Stretch features, final round of QA 
- Style standard   
  - File names: lowercase, dashs 
    - ex: file-name.js
  - Function names: camelCase 
    - ex: myFunctionName
  - Variable names: camelCase ^
  - Class names : camelcase but first letter is always capitalized 
    - ex: MyClassName   
  - HTML style
    - classes: lowercase dashed  
    - ex: .new-students , #new-student 
- Document code as you write
  - write description of what function does
  - single lined comments above code (or to the right if it's short)
  - legibility of code is paramount
- Issues/Github Board
  - located at: org -> project
  - tasks are issues
  - week one is a good time to expiriment with how to approach issues (individual vs small groups)
  - push to before final push to main       

### Unresolved Business
- I'm hungry
