# `yaml` + `mdx`

For piecing together the installation documentation *and* to allow writers to control how information is shown and when it is shown, I am proposing that we use a combination of `.mdx` files and a `yaml` file. An example file structure is shown below:

```
install-docs/
├─ java/
│  ├─ content/
│  │  ├─ app-info.mdx
│  │  ├─ agent-config.mdx
│  │  ├─ create-an account.mdx
│  │  ├─ download/
│  │  │  ├─ default.mdx
│  │  │  ├─ application-server.mdx
│  │  │  ├─ docker.mdx
│  │  ├─ framework-installation/
│  │  │  ├─ default.mdx
│  │  │  ├─ tomcat.mdx
│  │  ├─ create-directory.mdx
│  │  ├─ move-directory.mdx
│  ├─ config.yml 

```
in this example file structure, we have a `config.yml` file and various mdx snippets.

Instead of having one large mdx file, we will have small mdx files that will each represent a step. These files will have frontmatter that will specify what type of step they are, so specialized content (such as the agent config file) can take in values through the frontmatter.

## `config.yml`
This file holds the information for how to order content and when to swap out content based on the information the user provides. This file looks like this: 

```yaml
agentLanguage: Java
agentType: APM
title: 'Monitor your java app'
introFile: 'content/intro.mdx'
appInfoOptions: 
  - type: deployment
    label: 'Where is your app deployed?'
    options: 
      - value: 'applicationServer'
        displayName: 'on an application server'
        recommendGuided: true
      - value: 'maven'
        displayName: 'built with Maven'
      - value: 'docker'
        displayName: 'in a Docker Container'
  - type: framework
    label: 'What framework are you using?'
    options: 
      - value: 'tomcat'
        displayName: 'Tomcat'
      - folderName: 'jetty'
        displayName: 'Jetty'
steps: 
  - file: 'content/createAnAccount.mdx'
  - file: 'content/appInfo.mdx'
  - file: 'content/download/default.mdx'
    overrides: 
      - type: deployment
        overrideConfig: 
        - value: 'applicationServer'
          file: 'download/applicationServer.mdx'
          overrides: 
            - type: 'framework'
              overrideConfig: 
                - value: 'tomcat'
                  skip: true
        - value: 'docker'
          file: 'download/docker.mdx'
    - file: 'agentConfig.mdx'
      overrides: 
        - type: deployment
          overrideConfig: 
            - value: 'docker'
              skip: true
    - file: 'createDirectory.mdx'
    - file: 'moveFiles.mdx'
    - file: 'frameworkInstallation/default.mdx'
      overrides: 
        - type: 'framework'
          overrideConfig: 
            - value: 'tomcat'
              file: 'frameworkInstallation/tomcat.mdx'
whatsNextMdx: |
  Monitor your app data in New Relic and get comfortable with (the user interface)[].
```

#### `agentLanguage`, `agentType`, `title`, `introFile`, 

These four properties populate some general information for the page. 
* `agentLanguage` is the language of the installation doc, which for the first page will be java
* `agentType` either browser, APM, ect.
* `title` is the main title of the page
* `introFile` is a path to an mdx file that will populate the content prior to the start of the steps

```yaml
agentLanguage: Java
agentType: APM
title: 'Monitor your java app'
introFile: 'content/intro.mdx'
```

#### `appInfoOptions`

This property defines what dropdowns will appear in the `appInfo` step as well as defines the values that can change the structure and content of the page. For Java, we have two different dropdowns, one for deployment options and one for frameworks. `appInfoOptions` takes a list of values with four properties properties:
* `type` is a name or value given to a dropdown menu that can change the content of the page 
* `label` is the label text for the dropdown
* `placeholder` is the placeholder text for the dropdown 
* `options` defines the values that users can select from the dropdown. Options takes a list of values with 
  - `value` defines the value of the option, and is to used to determine what steps are shown 
  - `displayText` defines the text that is shown to the user
  - `recommendedGuided` boolean value that determines if the option is selected, to recommend guided installation over manual installation

```yaml
appInfoOptions: 
  - type: deployment
    label: 'Where is your app deployed?'
    options: 
      - value: 'applicationServer'
        displayName: 'on an application server'
        recommendGuided: true
      - value: 'maven'
        displayName: 'built with Maven'
      - value: 'docker'
        displayName: 'in a Docker Container'
  - type: framework
    label: 'What framework are you using?'
    options: 
      - value: 'tomcat'
        displayName: 'Tomcat'
      - value: 'jetty'
        displayName: 'Jetty'
```

#### `steps`

This property takes in a list of mdx file names and structures the page through each mdx snippet. This property is also where a writer can define what selected dropdown options change the content. 

This property takes a list of values values with two properties: 
* `file` specifies the mdx filepath that renders for the step.
* `overrides` which takes values to configure replacing or removing a step with inputs from the `appInfoOptions`

Overrides take values that specify the type of value (for this example, either framework or deployment) and then the configuration that changes the file based on the value. For example in the last step we see this entry: 

```yaml
- file: 'frameworkInstallation/default.mdx'
  overrides: 
    - type: 'framework'
      overrideConfig: 
        - value: 'tomcat'
          file: 'frameworkInstallation/tomcat.mdx'
```

the top level `file` is the default mdx content that will be shown for most options selected in the app info. However, if a user selects a `tomcat` as their framework, then the content of `frameworkInstallation/tomcat.mdx` will replace that step. A user can additionally skip a step or only shown a step for a selected option by using the `skip` property. 