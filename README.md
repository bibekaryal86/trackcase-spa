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

* table sort might not be working as expected

TODO
* Move statuses in track case service to database
* Add filing_type in form type
  * filing_type = form, motion, other
* due date cannot be after hearing date if hearing calendar is selected
  * if updating task calendar with hearing calendar
  * display hearing calendar dropdown, but make it not-updatable
