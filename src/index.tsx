import { Detail } from "@raycast/api"

export default function Command() {
  const today = new Date()

  let markdown = `# Zmanim for ${today.toLocaleDateString()}\n`
  markdown += `### Sunrise: ${today.toLocaleTimeString()}`
    
  return <Detail markdown={markdown} isLoading={true}  />;
}
