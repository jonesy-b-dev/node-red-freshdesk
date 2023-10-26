const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskUpdateTicketByIDNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;

        // Define the function to call the Freshdesk API directly
        this.updateTicket = function (msg) {
            // Access the data in the msg object
            let ticketData = msg[config.inputData];
            let ticketId = msg[config.ticketId];

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a POST request to create a contact in Freshdesk
            axios.put(`https://${this.domain}.freshdesk.com/api/v2/tickets/${ticketId}`, ticketData, axiosConfig)
                .then((response) => {
                    // Send the response to the next node
                    node.send({ payload:  response.data });
                })
                .catch((error) => {
                    if (error.response) {
                        // Handle the specific case of a 404 Not Found error
                        if (error.response.status === 404) {
                            node.error('Ticket not found. Failed to get ticket data. HTTP Status: ' + error.response.status);
                        } else {
                            // Handle other non-404 errors
                            node.error('Failed to get ticket data. HTTP Status: ' + error.response.status);
                        }
                        node.warn('Response data: ' + JSON.stringify(error.response.data));
                    } else if (error.request) {
                        // Request was made, but no response was received
                        node.error('Failed to make the PUT request. No response received.');
                    } else {
                        // Something else went wrong
                        node.error('An error occurred during the PUT request: ' + error.message);
                    }
                });
            };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a ticket when a message is received
            node.updateTicket(msg);
        });
    }

    RED.nodes.registerType('freshdesk-update-ticket-by-id', FreshdeskUpdateTicketByIDNode);
};