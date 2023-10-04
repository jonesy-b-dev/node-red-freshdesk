# node-red-freshdesk
Freshdesk API nodes to use in Node-Red

I never expected this would actually get downloads so let me make this clear.
I started development of these nodes for my own internship and free to use for others.
Since I created all the nodes that I need, I might not add anything new to this project. 

Any support I greatly appreciate and you can support the project on GitHub.

## Installation
```bash
npm install node-red-freshdesk
```

## Notes
* Nodes are made in `node.js v18.18.0`, `npm 10.1.0` and `Node-Red v3.0.0`, though I set the minimum versions to node.js v18.0.0 and npm v10.0.0 since I expect them to work in those older versions too. I have not tested this though. If something doesn't work in a older version, please report it on GitHub.
* All nodes are based on the official Freshdesk API documentation. https://developers.freshdesk.com/api/
* All nodes return their response in the `msg.payload`

## Warnings
* The delete company node will permanently delete a company without warnings. This can be dangerous. Any contacts associated with the company will NOT be removed.

## Report bugs
https://github.com/jonesy-b-dev/node-red-freshdesk/issues

## Supported API endpoints

### Contact
* Get contact by ID
* Create company
* Update contact by ID
* Delete contact by ID

### Company
* Get company by ID
* Create contact
* Update company by ID
* Delete company by ID

## Ticket
* Get ticket by ID
* Delete ticket by ID

## Next up
* Ticket CRUD
* I don't know yet what nodes I will create now but feel free to request nodes on GitHub issues linked above.
* Currently I created all the nodes I need for now. I will update this when I need more nodes or feel like adding more nodes. I think I will do this since I quite enjoyed making it.