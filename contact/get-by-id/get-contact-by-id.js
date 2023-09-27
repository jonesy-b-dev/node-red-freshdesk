const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskContactByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;

        // Define the function to call the Freshdesk API directly
        this.getContactById = function (msg) {
            this.contactId = msg.id;

            // Set up the Axios request with Basic Authentication header
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
                    // You can send the contactData to the next node
                    node.send({ payload: response.data });
                })
                .catch((error) => {
                    // Handle errors here
                    node.error('Failed to fetch contact data: ' + error.message);
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

