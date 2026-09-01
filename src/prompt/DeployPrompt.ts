// Temporary Static Prompt for Deploying Web Client Extensions on Extension Manager.
// Ideally, the extension should be able to open the Extension Manager and deploy the mtar file automatically, but deployment APIs are not publicly available yet.
// So we provide this prompt to guide the user to deploy the extension manually.
export const DeployPrompt = `
To enable a Web Client extension, deploy its **mtar archive** (e.g. \`HelloWorld.mtar\`) using **SAP Business One Extension Manager**.

## Prerequisites
Extension Manager is part of SAP Business One Server. During server installation, select:
**Server Tools** > **Landscape Management** > **Extension Manager**

## Access
Open a browser on the machine running the System Landscape Directory (SLD) service:
\`https://<hostname>:<port>/ExtensionManager\`

## Deployment Steps
1. **Import** the mtar archive into SAP Business One Extension Manager.
2. **Assign** the extension to the target companies.
3. **Reload** the Web client — the extension is now active.

For details, see the [online help](https://help.sap.com/docs/SAP_BUSINESS_ONE_WEB_CLIENT/e6ac71d18c7543828bd4463f77d67ff7/73776ff430ec4864868eae05f75c7616.html).
`;
