import { useEffect, useState } from "react";

export default function useRandomWords(count: number) {
  const [allRandomWords, setAllRandomWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://makemeapassword.ligos.net/api/v1/passphrase/json?pc=${count}&wc=1&sp=n&maxCh=64`
    )
      .then(response => response.json())
      .then(json => {
        console.log("json: ", json);
        if (json.error) {
          console.error(
            new Error(
              `Failed to fetch random words (error from server): ${json.error}`
            )
          );
        } else {
          setAllRandomWords(json.pws);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(new Error(`Failed to fetch random words: ${err}`));
        setLoading(false);
      });
  }, []);

  return { loading, allRandomWords };
}
