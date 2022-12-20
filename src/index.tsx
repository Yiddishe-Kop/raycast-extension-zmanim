import { Detail, showToast, Toast, getPreferenceValues } from "@raycast/api"
import { useEffect, useState } from "react";
import got from 'got';

interface HebcalItem {
  title: string;
  date: string;
  hebrew: string;
  category: string;
  subcat?: string;
  link?: string;
  memo?: string;
}

interface Preferences {
  geonameid: string;
}

interface State {
  items?: HebcalItem[];
  markdown?: string;
}

export default function Command() {
  const today = new Date()

  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function getZmanim(date: Date) {

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Fetching Zmanim",
      });

      const preferences = getPreferenceValues<Preferences>();

      try {
        const response = await got.get("https://www.hebcal.com/hebcal", {
          searchParams: {
            geonameid: preferences.geonameid,
            cfg: 'json',
            start: date.toISOString(),
            end: date.toISOString(),
            maj: 'on',
            min: 'on',
            nx: 'on',
            mf: 'on',
            ss: 'on',
            d: 'on',
            F: 'on',
            v: 1
          },
          responseType: "json",
        });

        const body = response.body as any;

        let markdown = `# Today's Zmanim for ${body.location.title}`

        for (const item of body.items) {
          markdown += `
### ${item.title}
${item.hebrew}

${new Date(item.date).toLocaleTimeString()}

---
`
        }

        // setState({ markdown: `\`\`\`${JSON.stringify(body, null, 2)}\`\`\`` });
        setState({ markdown, items: body.items });


        toast.style = Toast.Style.Success;
        toast.title = "Fetched Zmanim";
        toast.message = '🚀🚀🚀';

      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Failed to fetch Zmanim";
        toast.message = String(error);
      }
    }

    getZmanim(today);
  }, []);

  return <Detail markdown={state.markdown} isLoading={!state.markdown} navigationTitle={`Zmanim for ${today.toLocaleDateString()}`}
    metadata={
      <Detail.Metadata>
        {state.items?.map((item, i) => (
          <>
            <Detail.Metadata.Label title={item.category} text={item.hebrew} icon="Clock" />
            <Detail.Metadata.Label title="" text={item.title} />
            {item.link && <Detail.Metadata.Link title={item.category} target={item.link} text={item.link} />}
            <Detail.Metadata.Separator />
          </>
        ))}
      </Detail.Metadata>
    } />
}


