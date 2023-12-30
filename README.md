# trackcase-spa

* Things to ADD
  * react testing library

* table sort might not be working
* allow pasting phone numbers (eg: 111-222-3333 is not allowed)
* update spinners to put requests (eg: JUDGE from JUDGE_REQUEST) and check against the set
  * spinner goes away when multiple requests are made (eg: court from store and judge from api)
* set constants for -1, -2, -3, etc used in lieu of ids
  * create util function for Number(id) and return -4 from it from the constants
* when first row is added the page doesn't reload
  * eg: when clients is empty and add new client, it doesn't reload the component to show newly added
  * no issues in adding/updating/deleting after 1st row added
