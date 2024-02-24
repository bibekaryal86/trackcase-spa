# trackcase-spa

* Things to ADD
  * react testing library
  * add pagination to service response
    * similar to check IG/TT API response
    * for calendar view, get for selected month
      * get for selected month as navigate
      * for list view get all
  * add restrictions and filters
    * ADD USERS AND ROLES
    * form can't be added/updated/deleted in closed cases
    * calendars can't be added/updated/deleted in closed cases
    * etc
  * client report
    * when opening case page or client page, show cases, formsReducer, collections, etc all in one
    * maybe like campaign report, utilize tabs in the page to navigate without leaving page
  * check table sort, some working, some not working
    * likely the element ones not working (?)
  * the issue of not re-rendering after adding first row is probably back
    * because reverted back to using useRef
    * eg: in court component, add first court, nothing happens
    * no issue when adding second row
  * unify color palette, create a util module for it
  * reduce code duplication
    * eg: table headers and body
  * adding a case, combine option to add client/form/etc


TODO
* Add filing_type in form type
  * filing_type = form, motion, other
* show calculated collection amount remaining
* Update to this free template
  * https://flatlogic.github.io/react-material-admin-full


single court case - only show task calendar for the case or form in the case
replace `back to xxx` with `Go Back`, place it before `View All xxx`
  search by `&prevPage` to remove the links

add collections to single case page
When adding stuffs from single stuff page, disable stuff selection
  for eg: when adding judge from court page, court is selected by default -> now disable it
  in case of task calendar (which could be form or hearing calendar) -> only allow from the selected case
replace hearing and task calendar with calendarcalendar in single case
