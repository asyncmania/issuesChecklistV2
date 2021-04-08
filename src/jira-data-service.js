const { getRequest } = require('./lib/http-client')

const baseUrl = "https://herocoders.atlassian.net/rest/api/3";


function getComponents() {
  const url = `${baseUrl}/project/IC/components`;
  return getRequest({ url });
}

async function getComponentIssues(component) {

  const url =`${baseUrl}/search?jql=component%20%3D%20${component.id}%20`

  return await getRequest({url});

}

async function getData(resultCallback) {

  const allComponents = await getComponents();
  
  const componentsWithoutLeads = allComponents.filter(
    (component) => component.assigneeType !== "COMPONENT_LEAD"
  );

  const componentsIssues = await Promise.all(componentsWithoutLeads.map(component => getComponentIssues(component)))

  const results = componentsWithoutLeads.map((component,i) => {
    return {...componentsWithoutLeads[i], issuesCount: componentsIssues[i].total }
  })

  resultCallback(results)
  
}






module.exports = { getData }