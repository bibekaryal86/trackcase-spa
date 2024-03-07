# trackcase-spa

* Things to ADD/UPDATE
  * `trackcase-service`
    * MAJOR
    * MINOR
      * calculate case collection amount remaining
        * case collection MINUS sum of cash collections
      * when updating hearing calendar, update related task calendars if still active
    * `trackcase-spa`
      * All necessary changes after the service changes above
      * Allow hard delete as an option for `superuser` role
      * Show option for `superuser` role to view soft deleted rows
      * MAJOR
        * react testing library
          * add complete tests including snapshot testing for at least one module
        * address code duplication
          * actions/reducers/components feels like duplicated
          * eg: table headers and body
          * eg: page navigation (links on top, view all, back, etc)
        * fully refactor forms to be filings (after service changes for the same)
        * Maybe update to be like this free template
          * https://flatlogic.github.io/react-material-admin-full
      * MINOR
        * add new case
          * when adding a new case, allow options to add client, calendar, collections etc
        * unify color palette
          * create a util module for it
