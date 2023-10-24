const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskCreateContactNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.inputData = config.inputData; 

        // Define the function to call the Freshdesk API directly
        this.createContact = function (msg) {
            // Access the data in the msg object
            let contactData = msg.payload;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            //check if contactData includes a name and email
            if (contactData.hasOwnProperty('name') && contactData.hasOwnProperty('email')) {
                // Make a POST request to create a contact in Freshdesk
                axios.post(`https://${this.domain}.freshdesk.com/api/v2/contacts`, contactData, axiosConfig)
                    .then((response) => {
                        // Handle the API response here
                        const createdContact = response.data;

                        // You can send the createdContact to the next node
                        node.send({ payload: createdContact });
                    })
                    .catch((error) => {
                        if (error.response) {
                            // HTTP response was received, but it's an error (non-2xx status code)
                            node.error('Failed to create contact. HTTP Status: ' + error.response.status + ' ' + error.response.statusText);
                            node.warn('Response data: ' + JSON.stringify(error.response.data));
                        } else if (error.request) {
                            // Request was made, but no response was received
                            node.error('Failed to make the POST request. No response received.');
                        } else {
                            // Something else went wrong
                            node.error('An error occurredduring the POST request: ' + error.message);
                        }
                    });
            } 
            else {
                node.error('Contact data must at least include a name and email to satisfy Freshdesk requirements. To know how to format your data, please refer to the Freshdesk API documentation: https://developers.freshdesk.com/api/#create_contact');
            }
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a contact when a message is received
            node.createContact(msg);
        });
    }

    RED.nodes.registerType('freshdesk-create-contact', FreshdeskCreateContactNode);
};