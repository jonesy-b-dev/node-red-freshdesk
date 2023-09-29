const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskCompanyByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.apiKey = this.credentials.apiKey;
        this.domain = this.credentials.domain;

        // Define the function to call the Freshdesk API directly
        this.getCompanyById = function (msg) {
            this.companyId = msg.id;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            axios.get(`https://${this.domain}.freshdesk.com/api/v2/companies/${this.companyId}`, axiosConfig)
                .then((response) => {
                    //Send the companyData to the next node
                    node.send({ payload: response.data });
                })
                .catch((error) => {
                    // Handle errors
                    node.error('Failed to fetch company data: ' + error.message);
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.getCompanyById(msg);
        });
    }
    RED.nodes.registerType('freshdesk-company-by-id', FreshdeskCompanyByIdNode);
};
