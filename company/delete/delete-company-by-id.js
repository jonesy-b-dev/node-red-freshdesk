const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskDeleteCompanyByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.companyId = config.companyId.trim();
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;

        // Define the function to call the Freshdesk API directly
        this.deleteCompanyById = function (msg) {
            this.companyId = msg.id;
            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a DELETE request to the Freshdesk API
            axios.delete(`https://${this.domain}.freshdesk.com/api/v2/companies/${this.companyId}`, axiosConfig)
                .then((response) => {
                    // Return confirmation message
                    node.send({ payload: "Deleted company with ID " + this.companyId + "."});
                })
                .catch((error) => {
                    // Handle errors 
                    node.error('Failed to delete company data: ' + error.message + ' Maybe the company does not exist?');
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.deleteCompanyById(msg);
        });
    }
    RED.nodes.registerType('freshdesk-delete-company-by-id', FreshdeskDeleteCompanyByIdNode);
};