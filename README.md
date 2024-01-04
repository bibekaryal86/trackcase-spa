# trackcase-spa

* Things to ADD
  * react testing library
* In service response, add count of each list of objects (eg: in court add count judges, in judges add count clients, etc)

* when first row is added the page doesn't reload
  * eg: when clients is empty and add new client, it doesn't reload the component to show newly added
  * no issues in adding/updating/deleting after 1st row added

--> also needs update in trackcase_service
  --> convert snake_case to camelCase for schemas so that request/response are in camelCase
    --> at least response, we can leave response as is
      --> but test to make sure if `convert.py` works as is now
