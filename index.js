import React from 'react';
import { graphql } from 'gatsby';
import SelectConfig from './SelectConfig';

const Main = ({ data }) => {
  const { installConfig } = data;
  const {
    agentLanguage,
    title,
    description,
    deploymentOptions,
    frameworkOptions,
    mdxFiles
  } = installConfig;

  

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
      <hr />
      <p>
        {`To get started, select how your app is deployed and your framework. Use
        the instructions for your exact ${agentLanguage} setup to install the agent and
        start monitoring your app's performance.`}
      </p>
    </>
  );
};

export const query = graphql`
  fragment Install_query on Query {
      installConfig {
        agentLanguage
        agentType 
        title 
        description
        deploymentOptions
        frameworkOptions
        mdxFiles {
          body
          frontmatter {
            type
            headingText 
            descriptionText
            inputOptions {
              labelMdx
              value
              infoMdx
              lineNumber
            }
            tipMdx
            configFileName
          }
        }
      }
    }
  }

`;
