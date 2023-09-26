module.exports = function(RED) {
    function FreshdeskCredentials(config) {
        RED.nodes.createNode(this, config);
        this.domain = config.domain;
        this.apiKey = config.apiKey;
    }
    RED.nodes.registerType("freshdeskCredentials",FreshdeskCredentials);
}