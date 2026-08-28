// Temporary Static Prompt for Deploying Web Client Extensions on Extension Manager.
// Ideally, the copilot should be able to open the Extension Manager and deploy the mtar file automatically, but deployment APIs are not available yet.
// So we provide this prompt to guide the user to deploy the extension manually.
export const DeployPrompt  = `
To enable extensions on the Web client, you need to deploy the mtar archive(e.g. HelloWorld.mtar) into the Web client by SAP Business One Extension Manager.
The SAP Business One Extension Manager is a component in Server Tools for SAP Business One. To install SAP Business One Extension Manager, you should install SAP Business One Server, and select **Server Tools** **Landscape Management** **Extension Manager**.
You can access SAP Business One Extension Manager directly from a Web browser on the machine on which the System Landscape Directory (SLD) service is running using the following URL: https://<hostname>:<port>/ExtensionManager.
To deploy an extension, perform the following steps:

Procedure
1. Import the extension to SAP Business One Extension Manager.
2. Assign the extension to companies in SAP Business One Extension Manager.
3. Run the extension in the Web client

For the details, please see the the online help: https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/73776ff430ec4864868eae05f75c7616.html
`;