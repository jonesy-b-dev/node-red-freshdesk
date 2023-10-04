const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskTicketByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.id = config.ticketId.trim();

        // Define the function to call the Freshdesk API directly
        this.getTickerById = function (msg) {
            // Access the data in the msg object
            this.ticketId = msg.id;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            axios.get(`https://${this.domain}.freshdesk.com/api/v2/tickets/${this.ticketId}`, axiosConfig)
                .then((response) => {
                    // Send the ticketData to the next node
                    node.send({ payload: response.data });
                })
                .catch((error) => {
                    // Handle errors
                    node.error('Failed to fetch ticket data: ' + error.message);
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.getTickerById(msg);
        });
    }

    RED.nodes.registerType('freshdesk-get-ticket-by-id', FreshdeskTicketByIdNode);
};

