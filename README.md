# trackcase-spa

* Things to ADD/UPDATE
  * `trackcase-service`
    * MAJOR
      * Add `component_status`table to maintain status of tables
      * Add `app_user, app_role, app_permission, app_user_role, app_role_permission`to main user, roles and permissions
      * Add `is_deleted, deleted_date`column to allow only soft delete of columns
        * Allow hard delete as an option for the new`superuser`role
    * MINOR
      * Add pagination to service response
        * For calendar view, this will be current month only
        * if for one case, get all
      * calculate case collection amount remaining
        * case collection MINUS sum of cash collections
    * `trackcase-spa`
      * All necessary changes after the service changes above
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
