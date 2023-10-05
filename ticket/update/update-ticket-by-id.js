const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskUpdateTicketByIDNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.inputData = config.inputData; 

        // Define the function to call the Freshdesk API directly
        this.updateTicket = function (msg) {
            // Access the data in the msg object
            let ticketData = msg.payload;
            let ticketId = msg.id;

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
                    // Handle errors here and log the response
                    if (error.response) {
                        node.error('Failed to update ticket: ' + error.response.status + ' ' + error.response.statusText);
                        node.warn('Response data: ' + JSON.stringify(error.response.data));
                    } else {
                        node.error('Failed to update ticket: ' + error.message);
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