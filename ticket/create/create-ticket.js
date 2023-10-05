const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskCreateTicketNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.inputData = config.inputData; 

        // Define the function to call the Freshdesk API directly
        this.createTicket = function (msg) {
            // Access the data in the msg object
            let ticketData = msg.payload;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            //check if ticketData includes one of the mandatory fields
            if ('requester_id' in ticketData || 'email' in ticketData || 'facebook_id' in ticketData || 'phone' in ticketData || 'twitter_id' in ticketData || 'unique_external_id' in ticketData) {
                // Make a POST request to create a contact in Freshdesk
                axios.post(`https://${this.domain}.freshdesk.com/api/v2/tickets`, ticketData, axiosConfig)
                    .then((response) => {
                        // Send the createdContact to the next node
                        node.send({ payload: response.data });
                    })
                    .catch((error, response) => {
                        // Handle errors here
                        node.error('Failed to create ticket: ' + error.message);
                    });
            } 
            else {
                node.error('Ticket data must at least include one of the following fields: "requester_id", "email", "favebook_id", "phone", "twitter_id", "unique_external_id" to satisfy Freshdesk requirements. To know how to format your data, please refer to the Freshdesk API documentation: https://developers.freshdesk.com/api/#create_contact');
            }
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a contact when a message is received
            node.createTicket(msg);
        });
    }

    RED.nodes.registerType('freshdesk-create-ticket', FreshdeskCreateTicketNode);
};