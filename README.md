# trackcase-spa

* Things to ADD
  * react testing library
  * Redo sidenav/header
    * in mobile view, do not show sidenav by default
  * add pagination to service response
    * similar to check IG/TT API response
    * for calendar view, get for selected month
      * get for selected month as navigate
      * for list view get all
  * add restrictions and filters
    * form can't be added/updated/deleted in closed cases
    * calendars can't be added/updated/deleted in closed cases
    * etc
  * client report
    * when opening case page or client page, show cases, formsReducer, collections, etc all in one
    * maybe like campaign report, utilize tabs in the page to navigate without leaving page
  * check table sort, some working, some not working
    * likely the element ones not working (?)
  * sticky header appbar is not working
    * changed it to fixed, but give it another go with sticky header
  * the issue of not re-rendering after adding first row is probably back
    * because reverted back to using useRef
    * eg: in court component, add first court, nothing happens
    * no issue when adding second row
  * unify color palette, create a util module for it
  * Year/month selector in calendar view


TODO
* Add filing_type in form type
  * filing_type = form, motion, other
