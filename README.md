# trackcase-spa

* A simple app to manage clients and cases for a lawyer's office
* Track filings, manage hearing and task calendars and keep track of collections

* Things to ADD/UPDATE
  * `trackcase-service`
    * MAJOR
      * Separate Filing with RFE
        * add RFE to it's own table
    * MINOR
      * calculate case collection amount remaining
        * case collection MINUS sum of cash collections
      * when updating hearing calendar, update related task calendars if still active
    * `trackcase-spa`
      * All necessary changes after the service changes above
      * MAJOR
        * Disable sorting from table headers
          * Add separate component for sort/filter for tables
        * Besides ref types, courts and judges do not store items on redux
        * react testing library
          * add complete tests including snapshot testing for at least one module
        * Maybe update to be like this free template
          * https://flatlogic.github.io/react-material-admin-full
      * MINOR
        * add new case
          * when adding a new case, allow options to add client, calendar, collections etc

@constants/index
