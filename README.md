# trackcase-spa

* Things to ADD
  * react testing library
  * add pagination to service response
    * similar to check IG/TT API response
  * add restrictions and filters
    * form can't be added to closed cases (filter court case dropdown in forms page)
    * form can't be added to task calendars in the past
    * task calendars can't be added to closed cases
    * task calendars can't be updated if in the past
    * no deleting after cases close
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


TODO
* Move statuses in track case service to database
* Add filing_type in form type
  * filing_type = form, motion, other
* remove pages for hearing and task calendars
  * upon clicking on calendar date link, open a popup for that date
* task calendars on hearing calendar popup

