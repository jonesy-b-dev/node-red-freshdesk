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
            // Set up the Axios request with Basic Authentication header
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            axios.delete(`https://${this.domain}.freshdesk.com/api/v2/companies/${this.companyId}`, axiosConfig)
                .then((response) => {
                    // Send the companyData to the next node
                    node.send({ payload: "Deleted contact"});
                })
                .catch((error) => {
                    // Handle errors here
                    node.error('Failed to delete contact data: ' + error.message + ' Maybe the contact does not exist?');
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