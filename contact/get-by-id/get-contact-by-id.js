const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskContactByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.id = config.contactId.trim();

        // Define the function to call the Freshdesk API directly
        this.getContactById = function (msg) {
            // Access the data in the msg object
            this.contactId = msg.id;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            axios.get(`https://${this.domain}.freshdesk.com/api/v2/contacts/${this.contactId}`, axiosConfig)
                .then((response) => {
                    // Send the contactData to the next node
                    node.send({ payload: response.data });
                })
                .catch((error) => {
                    if (error.response) {
                        // Handle the specific case of a 404 Not Found error
                        if (error.response.status === 404) {
                            node.error('Contact not found. Failed to get contact data. HTTP Status: ' + error.response.status);
                        } else {
                            // Handle other non-404 errors
                            node.error('Failed to get contact data. HTTP Status: ' + error.response.status);
                        }
                        node.warn('Response data: ' + JSON.stringify(error.response.data));
                    } else if (error.request) {
                        // Request was made, but no response was received
                        node.error('Failed to make the GET request. No response received.');
                    } else {
                        // Something else went wrong
                        node.error('An error occurred during the GET request: ' + error.message);
                    }
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.getContactById(msg);
        });
    }

    RED.nodes.registerType('freshdesk-get-contact-by-id', FreshdeskContactByIdNode);
};

