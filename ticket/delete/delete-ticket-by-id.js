const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskDeleteTicketByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.ticketId = config.ticketId.trim();
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;

        // Define the function to call the Freshdesk API directly
        this.deleteTicketById = function (msg) {
            this.ticketId = msg.id;
            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a DELETE request to the Freshdesk API
            axios.delete(`https://${this.domain}.freshdesk.com/api/v2/tickets/${this.ticketId}`, axiosConfig)
                .then((response) => {
                    // Send the response to the next node
                    node.send({ payload: "Deleted ticket with ID " + this.ticketId + "."});
                })
                .catch((error) => {
                    // Handle errors 
                    node.error('Failed to delete ticket data: ' + error.message + ' Maybe the ticket does not exist?');
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.deleteTicketById(msg);
        });
    }
    RED.nodes.registerType('freshdesk-delete-ticket-by-id', FreshdeskDeleteTicketByIdNode);
};